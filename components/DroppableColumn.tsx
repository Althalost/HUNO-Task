import { ClipboardList, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import CreateTaskDialog from "./CreateTaskDialog";
import { useDroppable } from "@dnd-kit/core";
import { ColumnWithTasks } from "@/lib/supabase/models";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface DroppableColumnProps {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (
    e: React.SyntheticEvent<HTMLFormElement>,
    columnId: string,
  ) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
  editingColumnId: string | null;
  onEditingChange: (columnId: string | null) => void;
  openDialogId: string | null;
  onOpenDialogChange: (id: string | null) => void;
  onDeleteColumn: (columnId: string) => Promise<void>;
}

export default function DroppableColumn({
  column,
  children,
  onCreateTask,
  onEditColumn,
  editingColumnId,
  onEditingChange,
  openDialogId,
  onOpenDialogChange,
  onDeleteColumn,
}: DroppableColumnProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editValue, setEditValue] = useState(column.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isEditing = editingColumnId === column.id;

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      columnId: column.id,
    },
  });

  useEffect(() => {
    if (!isEditing) setEditValue(column.title);
  }, [column.title, isEditing]);

  useEffect(() => {
    if (!isEditing) return;

    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isEditing]);

  const handleRenameSubmit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== column.title) {
      onEditColumn({ ...column, title: trimmed });
    } else {
      setEditValue(column.title);
    }
    onEditingChange(null);
  }, [editValue, column, onEditColumn, onEditingChange]);

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleRenameSubmit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, handleRenameSubmit]);

  return (
    <div
      data-column
      ref={setNodeRef}
      className={`w-full lg:shrink-0 lg:w-70 transition-colors ${isOver ? "bg-slate-100 rounded-lg" : ""}`}
    >
      <div
        className={`bg-white rounded-lg shadow-sm border transition-all ${isOver ? "ring-2 ring-slate-300" : ""}`}
      >
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between gap-2">
            <div
              ref={containerRef}
              className="flex items-center gap-2 min-w-0 flex-1"
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  spellCheck={false}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit();
                    if (e.key === "Escape") {
                      setEditValue(column.title);
                      onEditingChange(null);
                    }
                  }}
                  className="font-semibold text-slate-800 text-sm sm:text-base bg-transparent outline-none rounded px-1 ring-1 ring-blue-300 min-w-0 w-full"
                />
              ) : (
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                  {column.title}
                </h3>
              )}
            </div>

            <Badge variant="secondary" className="text-xs shrink-0">
              {column.tasks.length}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 data-[state=open]:border data-[state=open]:border-slate-200 data-[state=open]:bg-slate-50"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditingChange(column.id);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteAlert(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="p-2">
          {column.tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <ClipboardList className="w-6 h-6 text-slate-300" />
              <p className="text-xs text-slate-400">No tasks yet</p>
            </div>
          )}
          {children}
          <div className="mt-2">
            <CreateTaskDialog
              open={openDialogId === column.id}
              onOpenChange={onOpenDialogChange}
              columnId={column.id}
              onCreateTask={onCreateTask}
            />
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{column.title}"</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the column and all its tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDeleteColumn(column.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
