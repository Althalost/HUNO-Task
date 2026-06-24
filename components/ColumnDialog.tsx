import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import React from "react";

interface ColumnDialogProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  value: string;
  onChange: (value: string) => void;
}

export default function ColumnDialog({
  mode,
  open,
  onOpenChange,
  onSubmit,
  value,
  onChange,
}: ColumnDialogProps) {
  const isCreate = mode === "create";
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
          <DialogHeader className="flex flex-cols justify-between pb-4">
            <DialogTitle className="text-xl font-bold text-slate-800">
              {isCreate ? "Create New Column" : "Edit Column"}
            </DialogTitle>
            <p className="text-sm text-gray-600">
              {isCreate
                ? "Add new column to organize your tasks."
                : "Edit the title of your column."}
            </p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter column title..."
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit">
                {isCreate ? "Create Column" : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
