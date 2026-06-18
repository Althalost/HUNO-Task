"use client";

import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ColumnWithTasks } from "@/lib/supabase/models";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Check, MoreHorizontal, PlusIcon, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { SyntheticEvent, useState } from "react";

function Column({
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
  return (
    <div className="w-full lg:shrink-0 lg:w-80">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Column Header */}
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
            <Button variant="ghost" size="sm" className="shrink-0">
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        {/* Column Content */}
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { board, updateBoard, columns } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
  }) {}

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
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        boardTitle={board?.title}
        onEditBoard={() => {
          setNewTitle(board?.title ?? "");
          setNewColor(board?.color ?? "");
          setIsEditingTitle(true);
        }}
        onFilterClick={() => setIsFilterOpen(true)}
        filterCount={2}
      />

      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
          <DialogHeader className="flex flex-row items-center justify-between pb-4">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Edit Board
            </DialogTitle>
            <button
              onClick={() => setIsEditingTitle(false)}
              className="p-1 text-slate-500 hover:text-slate-800 transition rounded-full hover:bg-slate-100"
            ></button>
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
                  <Button key={key} variant="outline" size="sm">
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label>Assignee</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {["item1", "item2", "item3"].map((assignee, key) => (
                  <Button key={key} variant="outline" size="sm">
                    {assignee.charAt(0).toUpperCase() + assignee.slice(1)}
                  </Button>
                ))}
              </div>
            </div> */}

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline">
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

          {/* Add task dialog */}
          <Dialog>
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
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
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

        {/* Board Columns */}
        <div>
          {columns.map((column, key) => (
            <Column
              key={key}
              column={column}
              onCreateTask={() => {}}
              onEditColumn={() => {}}
            >
              <div>
                {column.tasks.map((task, key) => (
                  <div>{task.title}</div>
                ))}
              </div>
            </Column>
          ))}
        </div>
      </main>
    </div>
  );
}
