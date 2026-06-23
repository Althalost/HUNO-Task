"use client";

import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBoard } from "@/lib/hooks/useBoards";
import { ColumnWithTasks, Task } from "@/lib/supabase/models";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import {
  Calendar,
  Check,
  MoreHorizontal,
  Plus,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { SyntheticEvent, useState, useMemo } from "react";
import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  closestCorners,
  useDroppable,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function DroppableColumn({
  column,
  children,
  onCreateTask,
  onEditColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: any) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id }) as unknown as {
    setNodeRef: (element: HTMLElement | null) => void;
    isOver: boolean;
  };
  return (
    <div
      ref={setNodeRef}
      className={`w-full lg:shrink-0 lg:w-70 ${isOver ? "bg-slate-100 rounded-lg" : ""}`}
    >
      <div
        className={`bg-white rounded-lg shadow-sm border ${isOver ? "ring-2 ring-slate-300" : ""}`}
      >
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                {column.title}
              </h3>
              <Badge variant="secondary" className="text-xs shrink-0">
                {column.tasks.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => onEditColumn(column)}
            >
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        <div className="p-2">
          {children}
          <div className="mt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full text-slate-500 hover:text-slate-700"
                  variant="ghost"
                >
                  <PlusIcon />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
                <DialogHeader className="flex flex-cols justify-between pb-4">
                  <DialogTitle className="text-xl font-bold text-slate-800">
                    Create New Task
                  </DialogTitle>
                  <DialogDescription>Create New Task</DialogDescription>
                  <p className="text-sm text-gray-600">
                    Add a task to the board.
                  </p>
                </DialogHeader>
                <form className="space-y-4" onSubmit={onCreateTask}>
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Input
                      id="assignee"
                      name="assignee"
                      placeholder="Who should do this?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["low", "medium", "high"].map((priority, key) => (
                          <SelectItem key={key} value={priority}>
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" id="dueDate" name="dueDate" />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="submit">Create Task</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id }) as unknown as {
    attributes: any;
    listeners: any;
    setNodeRef: (element: HTMLElement | null) => void;
    transform: any;
    transition: any;
    isDragging: boolean;
  };

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1,
  };

  function getPriorityColor(priority: "low" | "medium" | "high"): string {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={styles}
      {...listeners}
      {...attributes}
      className="outline-none my-1 first:mt-0 last:mb-0"
    >
      {/* Replaced Card with a plain, low-radius, flat shadow HTML div */}
      <div className="cursor-grab active:cursor-grabbing border border-slate-200 bg-white rounded-[3px] shadow-[0_1px_0_rgba(9,30,66,0.25)] hover:bg-slate-50/90 transition-colors duration-100 overflow-hidden">
        {/* Trello-like slim label bar on top */}
        <div className={`h-1 w-full ${getPriorityColor(task.priority)}`} />

        {/* Replaced CardContent with a tight-padded container block */}
        <div className="p-2">
          <div className="flex flex-col gap-0.5">
            {/* Task Title */}
            <h4 className="font-normal text-slate-900 text-[13.5px] leading-4.25 wrap-break-word tracking-normal">
              {task.title}
            </h4>

            {/* Task Description */}
            {task.description && (
              <p className="text-[11.5px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                {task.description}
              </p>
            )}

            {/* Task Meta Footer */}
            {(task.assignee || task.due_date) && (
              <div className="flex items-center gap-1.5 mt-1 pt-0.5">
                {task.assignee && (
                  <div className="flex items-center gap-1 text-[10.5px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-[3px] min-w-0 max-w-27.5">
                    <UserIcon className="h-3 w-3 shrink-0 text-slate-500" />
                    <span className="truncate">{task.assignee}</span>
                  </div>
                )}

                {task.due_date && (
                  <div className="flex items-center gap-1 text-[10.5px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-[3px] min-w-0">
                    <Calendar className="h-3 w-3 shrink-0 text-slate-500" />
                    <span className="truncate">{task.due_date}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskOverlay({ task }: { task: Task }) {
  function getPriorityColor(priority: "low" | "medium" | "high"): string {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  }

  return (
    <div className="border border-slate-300 bg-white rounded-[3px] shadow-xl rotate-1 scale-[1.01] overflow-hidden">
      <div className={`h-[4px] w-full ${getPriorityColor(task.priority)}`} />

      <div className="p-2">
        <div className="flex flex-col gap-0.5">
          {/* Task Header */}
          <h4 className="font-normal text-slate-900 text-[13.5px] leading-4.25 wrap-break-word">
            {task.title}
          </h4>

          {/* Task Description */}
          {task.description && (
            <p className="text-[11.5px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
              {task.description}
            </p>
          )}

          {/* Task Meta Footer */}
          {(task.assignee || task.due_date) && (
            <div className="flex items-center gap-1.5 mt-1 pt-0.5">
              {task.assignee && (
                <div className="flex items-center gap-1 text-[10.5px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-[3px] min-w-0">
                  <UserIcon className="h-3 w-3 text-slate-500" />
                  <span className="truncate">{task.assignee}</span>
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center gap-1 text-[10.5px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-[3px] min-w-0">
                  <Calendar className="h-3 w-3 text-slate-500" />
                  <span className="truncate">{task.due_date}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(
    null,
  );

  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignee: [] as string[],
    dueDate: null as string | null,
  });

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleFilterChange(
    type: "priority" | "assignee" | "dueDate",
    value: string | string[] | null,
  ) {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  }

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

  async function createTask(taskData: {
    title: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high";
  }) {
    const targetColumn = columns[0];
    if (!targetColumn) {
      throw new Error("No column available to add task");
    }

    await createRealTask(targetColumn.id, taskData);
  }

  async function handleCreateTask(e: SyntheticEvent<HTMLFormElement>) {
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
      await createTask(taskData);

      const trigger = document.querySelector(
        '[data-state="open"]',
      ) as HTMLElement;
      if (trigger) trigger.click();
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === taskId);

    if (task) {
      setActiveTask(task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

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

      if (sourceColumn.id === targetColumn.id) return prev;

      const sourceColIndex = prev.findIndex((c) => c.id === sourceColumn.id);
      const targetColIndex = prev.findIndex((c) => c.id === targetColumn.id);

      const currentSourceCol = prev[sourceColIndex];
      const currentTargetCol = prev[targetColIndex];

      const draggedTask = currentSourceCol.tasks.find((t) => t.id === activeId);
      if (!draggedTask) return prev;

      if (currentTargetCol.tasks.some((t) => t.id === activeId)) return prev;

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

      return newColumns;
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn) {
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId),
      );

      if (sourceColumn && sourceColumn.id !== targetColumn.id) {
        await moveTask(taskId, targetColumn.id, targetColumn.tasks.length);
      }
    } else {
      // Check to see if were dropping on another task
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId),
      );

      const targetColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === overId),
      );

      if (sourceColumn && targetColumn) {
        const oldIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === taskId,
        );

        const newIndex = targetColumn.tasks.findIndex(
          (task) => task.id === overId,
        );

        if (oldIndex !== newIndex) {
          await moveTask(taskId, targetColumn.id, newIndex);
        }
      }
    }
    setActiveTask(null);
  }

  async function handleCreateColumn(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!newColumnTitle.trim()) return;

    await createColumn(newColumnTitle.trim());

    setNewColumnTitle("");
    setIsCreatingColumn(false);
  }

  async function handleUpdateColumn(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!editingColumnTitle.trim() || !editingColumn) return;

    await updateColumn(editingColumn?.id, editingColumnTitle.trim());

    setEditingColumnTitle("");
    setIsEditingColumn(false);
    setEditingColumn(null);
  }

  function handleEditColumn(column: ColumnWithTasks) {
    setIsEditingColumn(true);
    setEditingColumn(column);
    setEditingColumnTitle(column.title);
  }

  const filteredColumns = useMemo(() => {
    return columns.map((column) => {
      const filteredTasks = column.tasks.filter((task) => {
        // Filter by priority
        if (
          filters.priority.length > 0 &&
          !filters.priority.includes(task.priority)
        ) {
          return false;
        }

        // Filter by dueDate
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
      <div className="min-h-screen bg-gray-50">
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

        {/* Edit Title Dialog */}
        <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
          <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
            <DialogHeader className="flex flex-row items-center justify-between pb-4">
              <DialogTitle className="text-2xl font-bold text-slate-800">
                Edit Board
              </DialogTitle>
            </DialogHeader>

            <form className="space-y-8 pt-2" onSubmit={handleUpdateBoard}>
              <div className="space-y-3">
                <label
                  htmlFor="boardTitle"
                  className="text-base font-semibold text-slate-800"
                >
                  Board Title
                </label>
                <input
                  id="boardTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Trello App Sprin"
                  required
                  className="w-full h-12 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg text-slate-900 focus-visible:ring-slate-300 focus-visible:border-slate-300"
                />
              </div>

              <div className="space-y-4">
                <label className="text-base font-semibold text-slate-800">
                  Board Color
                </label>
                <div className="grid grid-cols-6 gap-8 pt-1">
                  {[
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-yellow-500",
                    "bg-red-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-indigo-500",
                    "bg-orange-500",
                    "bg-cyan-500",
                    "bg-emerald-500",
                    "bg-teal-500",
                  ].map((color) => {
                    const isSelected = color === newColor;
                    return (
                      <button
                        key={color}
                        type="button"
                        className={`group relative aspect-square rounded-full ${color} cursor-pointer transition-all duration-200 hover:scale-105 shadow-sm flex items-center justify-center ${
                          isSelected
                            ? "ring-4 ring-offset-2 ring-slate-950 shadow-lg scale-105"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setNewColor(color)}
                      >
                        {isSelected && (
                          <Check className="w-6 h-6 text-white animate-in fade-in zoom-in-50 duration-150" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditingTitle(false)}
                  className="rounded-lg px-6 text-lg font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-lg px-7 text-lg font-semibold bg-slate-800 text-white hover:bg-slate-800 transition"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Filter Task Dialog */}
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
            <DialogHeader className="flex flex-cols justify-between pb-4">
              <DialogTitle className="text-xl font-bold text-slate-800">
                Filter Tasks
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Filter tasks by priority, assignee, or due date.
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {["low", "medium", "high"].map((priority, key) => (
                    <Button
                      onClick={() => {
                        const newPriorities = filters.priority.includes(
                          priority,
                        )
                          ? filters.priority.filter((p) => p !== priority)
                          : [...filters.priority, priority];

                        handleFilterChange("priority", newPriorities);
                      }}
                      key={key}
                      variant={
                        filters.priority.includes(priority)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={filters.dueDate || ""}
                  onChange={(e) =>
                    handleFilterChange("dueDate", e.target.value || null)
                  }
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button type="button" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Board Content */}
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          {/* Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="text-sm text-slate-700">
                <span className="font-medium">Total Task: </span>
                {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
              </div>
            </div>

            {/* Add Task Dialog in Header*/}
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <PlusIcon />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
                <DialogHeader className="flex flex-cols justify-between pb-4">
                  <DialogTitle className="text-xl font-bold text-slate-800">
                    Create New Task
                  </DialogTitle>
                  <DialogDescription>Create New Task</DialogDescription>
                  <p className="text-sm text-gray-600">
                    Add a task to the board.
                  </p>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateTask}>
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Input
                      id="assignee"
                      name="assignee"
                      placeholder="Who should do this?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["low", "medium", "high"].map((priority, key) => (
                          <SelectItem key={key} value={priority}>
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" id="dueDate" name="dueDate" />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="submit">Create Task</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog> */}
          </div>

          {/* Board Columns */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div
              className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 lg:overflow-x-auto
    lg:pb-5 lg:px-6 lg:[&::-webkit-scrollbar]:h-2
    lg:[&::-webkit-scrollbar-track]:bg-slate-100
    lg:[&::-webkit-scrollbar-thumb]:bg-slate-300 lg:[&::-webkit-scrollbar-track]:rounded-full
    space-y-4 lg:space-y-0"
            >
              {filteredColumns.map((column) => (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  onCreateTask={handleCreateTask}
                  onEditColumn={handleEditColumn}
                >
                  <SortableContext
                    items={column.taskIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {column.tasks.map((task) => (
                        <SortableTask task={task} key={task.id} />
                      ))}
                    </div>
                  </SortableContext>
                </DroppableColumn>
              ))}

              {/* 🌟 COLUMNA FANTASMA: Reducida a lg:w-72 para igualar el ancho compacto estilo Trello */}
              <div className="w-full lg:w-70 lg:shrink-0 h-32 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/50 transition-all flex items-center justify-center cursor-pointer group">
                <button
                  className="flex items-center gap-2 text-slate-500 group-hover:text-slate-700 font-medium text-sm"
                  onClick={() => setIsCreatingColumn(true)}
                >
                  <Plus className="w-5 h-5" />
                  Add another column
                </button>
              </div>

              {/* 🌟 ESPACIADOR FANTASMA EXTRA: Asegura un margen de respiro limpio a la derecha al hacer scroll */}
              <div
                className="hidden lg:block lg:w-6 lg:h-full lg:shrink-0"
                aria-hidden="true"
              />

              <DragOverlay>
                {activeTask ? <TaskOverlay task={activeTask} /> : null}
              </DragOverlay>
            </div>
          </DndContext>
        </main>
      </div>

      <Dialog open={isCreatingColumn} onOpenChange={setIsCreatingColumn}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
          <DialogHeader className="flex flex-cols justify-between pb-4">
            <DialogTitle className="text-xl font-bold text-slate-800">
              Create New Column
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Add new column to organize your tasks.
            </p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Enter column title..."
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                onClick={() => setIsCreatingColumn(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit">Create Column</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingColumn} onOpenChange={setIsEditingColumn}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
          <DialogHeader className="flex flex-cols justify-between pb-4">
            <DialogTitle className="text-xl font-bold text-slate-800">
              Edit Column
            </DialogTitle>
            <p className="text-sm text-gray-600">
              UEdit the title of your column.
            </p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={editingColumnTitle}
                onChange={(e) => setEditingColumnTitle(e.target.value)}
                placeholder="Enter column title..."
                required
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  setIsEditingColumn(false);
                  setEditingColumnTitle("");
                  setEditingColumn(null);
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
