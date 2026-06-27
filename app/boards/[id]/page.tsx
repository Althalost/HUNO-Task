"use client";

import Navbar from "@/components/Navbar";
import { useBoard } from "@/lib/hooks/useBoards";
import { ColumnWithTasks, Task } from "@/lib/supabase/models";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import React, { SyntheticEvent, useState, useMemo, useEffect } from "react";
import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  closestCorners,
  pointerWithin,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import EditBoardDialog from "@/components/EditBoardDialog";
import TaskFiltersDialog from "@/components/TaskFiltersDialog";
import ColumnDialog from "@/components/ColumnDialog";
import DroppableColumn from "@/components/DroppableColumn";
import SortableTask from "@/components/SortableTask";
import TaskOverlay from "@/components/TaskOverLay";
import BoardSkeleton from "@/components/BoardSkeleton";
import TaskDetailsDialog from "@/components/TaskDetailsDialog";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const {
    board,
    updateBoard,
    columns,
    createRealTask,
    setColumns,
    moveTask,
    createColumn,
    updateColumn,
    deleteTask,
    updateTask,
    deleteColumn,
    loading,
  } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);

  const [openTaskDialogId, setOpenTaskDialogId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignee: [] as string[],
    dueDate: null as string | null,
  });

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const pendingColumnsRef = React.useRef<typeof columns | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 10,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  function clearFilters() {
    setFilters({
      priority: [] as string[],
      assignee: [] as string[],
      dueDate: null as string | null,
    });
  }

  async function handleUpdateBoard(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingTitle(false);
    } catch (error) {}
  }

  async function handleCreateTask(
    e: SyntheticEvent<HTMLFormElement>,
    columnId: string,
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium",
      dueDate: (formData.get("dueDate") as string) || undefined,
    };

    if (taskData.title.trim()) {
      await createRealTask(columnId, taskData);
      setOpenTaskDialogId(null);
    }
  }

  async function handleUpdateTask(taskId: string, updates: Partial<Task>) {
    await updateTask(taskId, updates);
    setSelectedTask(null);
  }

  async function handleDeleteTask(taskId: string, columnId: string) {
    setSelectedTask(null);
    await deleteTask(taskId, columnId);
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === taskId);

    if (task) {
      setActiveTask(task);
    }
    pendingColumnsRef.current = null;
  }

  const customCollisionDetection = React.useCallback((args: any) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;

    return closestCorners(args);
  }, []);

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    setColumns((prev) => {
      const sourceColumn = prev.find((col) =>
        col.tasks.some((t) => t.id === activeId),
      );

      const targetColumn =
        prev.find((col) => col.id === overId) ||
        prev.find((col) => col.tasks.some((t) => t.id === overId));

      if (!sourceColumn || !targetColumn) return prev;

      if (sourceColumn.id === targetColumn.id) {
        const colIndex = prev.findIndex((c) => c.id === sourceColumn.id);
        const currentCol = prev[colIndex];

        const oldIndex = currentCol.tasks.findIndex((t) => t.id === activeId);
        const newIndex = currentCol.tasks.findIndex((t) => t.id === overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newTasks = [...currentCol.tasks];
          const [movedTask] = newTasks.splice(oldIndex, 1);
          newTasks.splice(newIndex, 0, movedTask);

          const newColumns = [...prev];
          newColumns[colIndex] = {
            ...currentCol,
            tasks: newTasks,
          };
          pendingColumnsRef.current = newColumns;
          return newColumns;
        }
        return prev;
      }

      const sourceColIndex = prev.findIndex((c) => c.id === sourceColumn.id);
      const targetColIndex = prev.findIndex((c) => c.id === targetColumn.id);

      const currentSourceCol = prev[sourceColIndex];
      const currentTargetCol = prev[targetColIndex];

      const draggedTask = currentSourceCol.tasks.find((t) => t.id === activeId);
      if (!draggedTask) return prev;

      const newSourceTasks = currentSourceCol.tasks.filter(
        (t) => t.id !== activeId,
      );

      const isOverATask = currentTargetCol.tasks.some((t) => t.id === overId);
      let newIndex = currentTargetCol.tasks.length;

      if (isOverATask) {
        newIndex = currentTargetCol.tasks.findIndex((t) => t.id === overId);
      }

      const newTargetTasks = [...currentTargetCol.tasks];
      newTargetTasks.splice(newIndex, 0, draggedTask);

      const newColumns = [...prev];
      newColumns[sourceColIndex] = {
        ...currentSourceCol,
        tasks: newSourceTasks,
      };
      newColumns[targetColIndex] = {
        ...currentTargetCol,
        tasks: newTargetTasks,
      };

      pendingColumnsRef.current = newColumns;
      return newColumns;
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      pendingColumnsRef.current = null;
      return;
    }

    const taskId = active.id as string;
    const currentColumns = pendingColumnsRef.current ?? columns;
    pendingColumnsRef.current = null;

    const targetColumn = currentColumns.find((col) =>
      col.tasks.some((t) => t.id === taskId),
    );

    if (!targetColumn) return;

    await moveTask(taskId, targetColumn.id, currentColumns);
  }

  async function handleCreateColumn(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!newColumnTitle.trim()) return;

    await createColumn(newColumnTitle.trim());

    setNewColumnTitle("");
    setIsCreatingColumn(false);
  }

  async function handleEditColumn(column: ColumnWithTasks) {
    const previousColumns = columns;

    setColumns((prev) =>
      prev.map((col) =>
        col.id === column.id ? { ...col, title: column.title } : col,
      ),
    );
    try {
      await updateColumn(column.id, column.title);
    } catch (error) {
      setColumns(previousColumns);
    }
  }

  const filteredColumns = useMemo(() => {
    return columns.map((column) => {
      const filteredTasks = column.tasks.filter((task) => {
        if (
          filters.priority.length > 0 &&
          !filters.priority.includes(task.priority)
        ) {
          return false;
        }

        if (filters.dueDate && task.due_date) {
          const taskDate = new Date(task.due_date).toDateString();
          const filterDate = new Date(filters.dueDate).toDateString();

          if (taskDate !== filterDate) return false;
        }

        return true;
      });

      return {
        ...column,
        tasks: filteredTasks,
        taskIds: filteredTasks.map((task) => task.id),
      };
    });
  }, [columns, filters]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar
          boardTitle={board?.title}
          onEditBoard={() => {
            setNewTitle(board?.title ?? "");
            setNewColor(board?.color ?? "");
            setIsEditingTitle(true);
          }}
          onFilterClick={() => setIsFilterOpen(true)}
          filterCount={Object.values(filters).reduce(
            (count, v) =>
              count + (Array.isArray(v) ? v.length : v !== null ? 1 : 0),
            0,
          )}
        />

        <EditBoardDialog
          open={isEditingTitle}
          onOpenChange={setIsEditingTitle}
          onSubmit={handleUpdateBoard}
          newTitle={newTitle}
          onTitleChange={setNewTitle}
          newColor={newColor}
          onColorChange={setNewColor}
        />

        <TaskFiltersDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={setFilters}
          onClear={clearFilters}
        />

        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div
                className="flex items-center gap-2 text-sm text-slate-500"
                translate="no"
              >
                <span className="font-medium">Total Tasks: </span>
                <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full text-xs">
                  {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <BoardSkeleton />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={customCollisionDetection}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div
                className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 lg:overflow-x-auto
  lg:pb-5 lg:px-6 lg:[&::-webkit-scrollbar]:h-2
  lg:[&::-webkit-scrollbar-track]:bg-slate-100
  lg:[&::-webkit-scrollbar-thumb]:bg-slate-300 lg:[&::-webkit-scrollbar-track]:rounded-full
  space-y-4 lg:space-y-0 flex-1"
              >
                {filteredColumns.map((column) => (
                  <DroppableColumn
                    key={column.id}
                    column={column}
                    onCreateTask={handleCreateTask}
                    onEditColumn={handleEditColumn}
                    editingColumnId={editingColumnId}
                    onEditingChange={(id) => setEditingColumnId(id)}
                    openDialogId={openTaskDialogId}
                    onOpenDialogChange={(id) => setOpenTaskDialogId(id)}
                    onDeleteColumn={deleteColumn}
                  >
                    <SortableContext
                      items={column.taskIds}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3 touch-none">
                        {column.tasks.map((task) => (
                          <SortableTask
                            task={task}
                            key={task.id}
                            onTaskClick={setSelectedTask}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DroppableColumn>
                ))}

                <button
                  className="lg:shrink-0 flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium px-4 whitespace-nowrap"
                  onClick={() => setIsCreatingColumn(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add column
                </button>

                <div
                  className="hidden lg:block lg:w-6 lg:h-full lg:shrink-0"
                  aria-hidden="true"
                />

                <DragOverlay
                  dropAnimation={null}
                  style={{ pointerEvents: "none" }}
                >
                  {activeTask ? <TaskOverlay task={activeTask} /> : null}
                </DragOverlay>
              </div>
            </DndContext>
          )}
        </main>
      </div>

      <ColumnDialog
        open={isCreatingColumn}
        onOpenChange={setIsCreatingColumn}
        onSubmit={handleCreateColumn}
        value={newColumnTitle}
        onChange={setNewColumnTitle}
      />
      {selectedTask && (
        <TaskDetailsDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </>
  );
}
