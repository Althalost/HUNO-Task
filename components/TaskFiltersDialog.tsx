"use client";

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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("TaskFiltersDialog");

  const priorities = ["low", "medium", "high"] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
        <DialogHeader className="flex flex-cols justify-between pb-4">
          <DialogTitle className="text-xl font-bold text-slate-800">
            {t("title")}
          </DialogTitle>
          <p className="text-sm text-gray-600">{t("description")}</p>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("priority")}</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {priorities.map((priority) => (
                <Button
                  key={priority}
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
                  variant={
                    localFilters.priority.includes(priority)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                >
                  {t(priority)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("due_date")}</Label>
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
              {t("clear")}
            </Button>
            <Button
              onClick={() => {
                onApply(localFilters);
                onOpenChange(false);
              }}
            >
              {t("apply")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
