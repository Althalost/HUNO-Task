import { ClipboardList, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import CreateTaskDialog from "./CreateTaskDialog";
import { useDroppable } from "@dnd-kit/core";
import { ColumnWithTasks } from "@/lib/supabase/models";

interface DroppableColumnProps {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (
    e: React.SyntheticEvent<HTMLFormElement>,
    columnId: string,
  ) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
  openDialogId: string | null;
  onOpenDialogChange: (id: string | null) => void;
}

export default function DroppableColumn({
  column,
  children,
  onCreateTask,
  onEditColumn,
  openDialogId,
  onOpenDialogChange,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div
      ref={(node) => setNodeRef(node)}
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
    </div>
  );
}
