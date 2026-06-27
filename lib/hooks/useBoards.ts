"use client";

import { useUser } from "@clerk/nextjs";
import {
  boardDataService,
  boardService,
  columnService,
  taskService,
} from "../services";
import {
  Board,
  ColumnWithTasks,
  Task,
  boardsWithTasksCount,
} from "../supabase/models";
import { useEffect, useState } from "react";
import { useSupabase } from "../supabase/SupabaseProvider";
import { toast } from "sonner";

export function useBoards() {
  const { user } = useUser();
  const { supabase } = useSupabase();

  const [boards, setBoards] = useState<boardsWithTasksCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && supabase) {
      loadBoards();
    }
  }, [user, supabase]);

  async function loadBoards() {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await boardDataService.getBoardsWithTasks(
        supabase!,
        user.id,
      );
      setBoards(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load the boards.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
  }) {
    if (!user) throw new Error("User not authenticated");

    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase!,
        {
          ...boardData,
          userId: user.id,
        },
      );
      const newBoardWithTasks: boardsWithTasksCount = {
        ...newBoard,
        tasks: [],
      };
      setBoards((prev) => [newBoardWithTasks, ...prev]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create board.";
      setError(message);
      toast.error(message);
    }
  }

  return { boards, loading, error, createBoard };
}

export function useBoard(boardId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (boardId && supabase) {
      loadBoard();
    }
  }, [boardId, supabase]);

  async function loadBoard() {
    if (!boardId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await boardDataService.getBoardWithColumns(
        supabase!,
        boardId,
      );
      setBoard(data.board);
      setColumns(data.columnsWithTasks);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load boards.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function updateBoard(boardId: string, updates: Partial<Board>) {
    try {
      const updatedBoard = await boardService.updateBoard(
        supabase!,
        boardId,
        updates,
      );
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update the board.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function createRealTask(
    columnId: string,
    taskData: {
      title: string;
      description?: string;
      assignee?: string;
      dueDate?: string;
      priority?: "low" | "medium" | "high";
    },
  ) {
    try {
      const newTask = await taskService.createTask(supabase!, {
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.dueDate || null,
        column_id: columnId,
        sort_order:
          columns.find((col) => col.id === columnId)?.tasks.length || 0,
        priority: taskData.priority || "medium",
      });

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col,
        ),
      );

      return newTask;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create task.";
      setError(message);
      toast.error(message);
    }
  }

  async function updateTask(taskId: string, editedTask: Partial<Task>) {
    const prevColumn = columns;
    try {
      const updatedTask = await taskService.updateTask(
        supabase!,
        taskId,
        editedTask,
      );
      setColumns((prev) =>
        prev.map((col) =>
          col.id === String(editedTask.column_id)
            ? {
                ...col,
                tasks: col.tasks.map((task) =>
                  task.id === taskId
                    ? {
                        ...updatedTask,
                        id: String(updatedTask.id),
                        column_id: String(updatedTask.column_id),
                      }
                    : task,
                ),
              }
            : col,
        ),
      );
      return updatedTask;
    } catch (err) {
      setColumns(prevColumn);
      const message =
        err instanceof Error ? err.message : "Failed to update task.";
      setError(message);
      toast.error(message);
    }
  }

  async function moveTask(
    taskId: string,
    newColumnId: string,
    optimisticColumns?: ColumnWithTasks[],
  ) {
    const previousColumns = JSON.parse(JSON.stringify(columns));

    if (optimisticColumns) {
      setColumns(optimisticColumns);
    }

    try {
      await taskService.moveTask(
        supabase!,
        taskId,
        newColumnId,
        optimisticColumns ?? columns,
      );
    } catch (err) {
      setColumns(previousColumns);
      const message =
        err instanceof Error ? err.message : "Failed to move task.";
      setError(message);
      toast.error(message);
    }
  }

  async function deleteTask(taskId: string, columnId: string) {
    try {
      await taskService.deleteTask(supabase!, taskId);
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
            : col,
        ),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete Task.";
      setError(message);
      toast.error(message);
    }
  }

  async function createColumn(title: string) {
    if (!board || !user) throw new Error("Board not loaded");

    try {
      const newColumn = await columnService.createColumn(supabase!, {
        title,
        board_id: board.id,
        sort_order: columns.length,
        user_id: user.id,
      });

      setColumns((prev) => [...prev, { ...newColumn, tasks: [] }]);
      return newColumn;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create column.";
      setError(message);
      toast.error(message);
    }
  }

  async function updateColumn(columnId: string, title: string) {
    try {
      const updatedColumn = await columnService.updateColumnTitle(
        supabase!,
        columnId,
        title,
      );

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, ...updatedColumn } : col,
        ),
      );

      return updatedColumn;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update Column.";
      setError(message);
      toast.error(message);
    }
  }

  async function deleteColumn(columnId: string) {
    try {
      await columnService.deleteColumn(supabase!, columnId);

      setColumns((prev) => prev.filter((col) => col.id !== columnId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete Column.";
      setError(message);
      toast.error(message);
    }
  }

  return {
    board,
    columns,
    loading,
    error,
    updateBoard,
    createRealTask,
    setColumns,
    moveTask,
    createColumn,
    updateColumn,
    updateTask,
    deleteTask,
    deleteColumn,
  };
}
