import { Task } from "@/lib/supabase/models";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface TaskDetailsDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onUpdateTask: (value: string, task: Partial<Task>) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
}

export default function TaskDetailsDialog({
  task,
  open,
  onOpenChange,
  onUpdateTask,
  onDeleteTask,
}: TaskDetailsDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [assignee, setAssignee] = useState(task.assignee ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setAssignee(task.assignee ?? "");
    setPriority(task.priority);
    setDueDate(task.due_date ?? "");
  }, [task.id]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
        <DialogHeader className="flex flex-cols justify-between pb-4">
          <DialogTitle className="text-xl font-bold text-slate-800">
            Update Task
          </DialogTitle>
          <DialogDescription>Edit task details</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onUpdateTask(task.id, {
              title,
              description,
              assignee,
              priority,
              due_date: dueDate,
              column_id: task.column_id,
            });
          }}
        >
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={!title ? "Enter task title" : undefined}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={!description ? "Enter task description" : undefined}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Assignee</Label>
            <Input
              id="assignee"
              name="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder={!assignee ? "Who should do this?" : undefined}
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setPriority(value)
              }
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      priority === "high"
                        ? "bg-red-500"
                        : priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  />
                  <span>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent position="popper">
                {[
                  { value: "low", color: "bg-green-500" },
                  { value: "medium", color: "bg-yellow-500" },
                  { value: "high", color: "bg-red-500" },
                ].map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.color}`} />
                      {p.value.charAt(0).toUpperCase() + p.value.slice(1)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDeleteTask(task.id, task.column_id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Task
            </Button>

            <Button type="submit">Update Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
