import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Filters {
  search: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  taskCount: {
    min: number | null;
    max: number | null;
  };
}

const defaultFilters: Filters = {
  search: "",
  dateRange: { start: null, end: null },
  taskCount: { min: null, max: null },
};

interface BoardFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: Filters) => void;
  onClear: () => void;
}

export default function BoardFiltersDialog({
  open,
  onOpenChange,
  onApply,
  onClear,
}: BoardFiltersDialogProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(defaultFilters);

  function handleClear() {
    setLocalFilters(defaultFilters);
    onClear();
  }

  function handleApply() {
    onApply(localFilters);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle>Filter Boards</DialogTitle>
          <p className="text-sm text-gray-600">
            Filter boards by title, date, or task count.
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Search board title..."
              value={localFilters.search}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input
                  type="date"
                  value={localFilters.dateRange.start || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        start: e.target.value || null,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input
                  type="date"
                  value={localFilters.dateRange.end || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        end: e.target.value || null,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Task Count</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Minimum</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Min tasks"
                  value={localFilters.taskCount.min ?? ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      taskCount: {
                        ...prev.taskCount,
                        min: e.target.value ? Number(e.target.value) : null,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Maximum</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Max tasks"
                  value={localFilters.taskCount.max ?? ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      taskCount: {
                        ...prev.taskCount,
                        max: e.target.value ? Number(e.target.value) : null,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between pt-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <Button variant="outline" onClick={handleClear}>
              Clear Filters
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
