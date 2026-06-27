import {
  Board,
  boardsWithTasksCount,
  Column,
  ColumnWithTasks,
  Task,
} from "./supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";

export const boardService = {
  async getBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();

    if (error) throw error;

    return data;
  },

  async getBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async createBoard(
    supabase: SupabaseClient,
    board: Omit<Board, "id" | "created_at" | "updated_at">,
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateBoard(
    supabase: SupabaseClient,
    boardId: string,
    updates: Partial<Board>,
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", boardId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};

export const columnService = {
  async getColums(
    supabase: SupabaseClient,
    boardId: string,
  ): Promise<Column[]> {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return (data || []).map((col) => ({
      ...col,
      id: String(col.id),
      board_id: String(col.board_id),
    }));
  },

  async createColumn(
    supabase: SupabaseClient,
    column: Omit<Column, "id" | "created_at">,
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .insert(column)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateColumnTitle(
    supabase: SupabaseClient,
    columnId: string,
    title: string,
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .update({ title })
      .eq("id", columnId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async deleteColumn(
    supabase: SupabaseClient,
    columnId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("columns")
      .delete()
      .eq("id", Number(columnId));
    if (error) throw error;
  },
};

export const taskService = {
  async getTasksByBoard(
    supabase: SupabaseClient,
    boardId: string,
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        columns!inner(board_id)
        `,
      )
      .eq("columns.board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return (data || []).map((task) => ({
      ...task,
      id: String(task.id),
      column_id: String(task.column_id),
    }));
  },

  async createTask(
    supabase: SupabaseClient,
    task: Omit<Task, "id" | "created_at" | "updated_at">,
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async moveTask(
    supabase: SupabaseClient,
    taskId: string,
    newColumnId: string,
    allColumns: ColumnWithTasks[],
  ) {
    const affectedColumns = allColumns;
    const results = await Promise.all(
      affectedColumns.map((col) =>
        supabase.rpc("update_tasks_order", {
          p_tasks: col.tasks.map((task, index) => ({
            id: Number(task.id),
            column_id: Number(col.id),
            sort_order: index,
          })),
        }),
      ),
    );

    const failed = results.filter((r) => r.error);
    if (failed.length > 0) throw failed[0].error;
  },

  async deleteTask(supabase: SupabaseClient, taskId: string): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", Number(taskId));

    if (error) throw error;
  },
};

export const boardDataService = {
  async getBoardWithColumns(supabase: SupabaseClient, boardId: string) {
    const [board, columns] = await Promise.all([
      boardService.getBoard(supabase, boardId),
      columnService.getColums(supabase, boardId),
    ]);

    if (!board) throw new Error("Board not found");

    const tasks = await taskService.getTasksByBoard(supabase, boardId);

    const columnsWithTasks = columns.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.column_id === column.id),
    }));

    return {
      board,
      columnsWithTasks,
    };
  },

  async getBoardsWithTasks(
    supabase: SupabaseClient,
    userId: string,
  ): Promise<boardsWithTasksCount[]> {
    const { data, error } = await supabase
      .from("boards")
      .select(
        `
        *,
        columns (
          tasks (
            *
          )
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((board: any) => {
      const allTasks =
        board.columns?.flatMap((col: any) => col.tasks || []) || [];
      const { columns, ...boardProps } = board;

      return {
        ...boardProps,
        tasks: allTasks,
      };
    });
  },
  async createBoardWithDefaultColumns(
    supabase: SupabaseClient,
    boardData: {
      title: string;
      description?: string;
      color?: string;
      userId: string;
    },
  ) {
    const board = await boardService.createBoard(supabase, {
      title: boardData.title,
      description: boardData.description || null,
      color: boardData.color || "bg-slate-500",
      user_id: boardData.userId,
    });

    const defaultColumns = [
      { title: "To Do", sort_order: 0 },
      { title: "In Progress", sort_order: 1 },
      { title: "Review", sort_order: 2 },
      { title: "Done", sort_order: 3 },
    ];

    await Promise.all(
      defaultColumns.map((column) =>
        columnService.createColumn(supabase, {
          ...column,
          board_id: board.id,
          user_id: boardData.userId,
        }),
      ),
    );

    return board;
  },
};
