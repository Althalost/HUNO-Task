import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";

interface TaskFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: {
    priority: string[];
    assignee: string[];
    dueDate: string | null;
  }) => void;
  onClear: () => void;
}

export default function TaskFiltersDialog({
  open,
  onOpenChange,
  onApply,
  onClear,
}: TaskFiltersDialogProps) {
  const [localFilters, setLocalFilters] = useState({
    priority: [] as string[],
    assignee: [] as string[],
    dueDate: null as string | null,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                    const newPriorities = localFilters.priority.includes(
                      priority,
                    )
                      ? localFilters.priority.filter((p) => p !== priority)
                      : [...localFilters.priority, priority];

                    setLocalFilters((prev) => ({
                      ...prev,
                      priority: newPriorities,
                    }));
                  }}
                  key={priority}
                  variant={
                    localFilters.priority.includes(priority)
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
              value={localFilters.dueDate || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  dueDate: e.target.value || null,
                }))
              }
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLocalFilters({ priority: [], assignee: [], dueDate: null });
                onClear();
                onOpenChange(false);
              }}
            >
              Clear Filters
            </Button>
            <Button
              onClick={() => {
                onApply(localFilters);
                onOpenChange(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
