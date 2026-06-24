import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (value: string | null) => void;
  columnId: string;
  onCreateTask: (
    e: React.SyntheticEvent<HTMLFormElement>,
    columnId: string,
  ) => Promise<void>;
}

export default function CreateTaskDialog({
  open,
  onOpenChange,
  columnId,
  onCreateTask,
}: CreateTaskDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => onOpenChange(open ? columnId : null)}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full text-slate-500 hover:text-slate-700"
          variant="ghost"
          onClick={() => onOpenChange(columnId)}
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
          <p className="text-sm text-gray-600">Add a task to the board.</p>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => onCreateTask(e, columnId)}>
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input id="title" name="title" placeholder="Enter task title" />
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
                {["low", "medium", "high"].map((priority) => (
                  <SelectItem key={priority} value={priority}>
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
  );
}
