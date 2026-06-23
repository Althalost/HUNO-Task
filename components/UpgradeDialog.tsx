import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import Router from "next/router";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export default function UpgradeDialog({
  open,
  onOpenChange,
  onUpgrade,
}: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-106.25 mx-auto p-6 rounded-xl border border-slate-100 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-violet-100 text-violet-600 rounded-full w-fit">
            <Sparkles className="w-6 h-6" />{" "}
          </div>

          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
            Upgrade to Create More Boards
          </DialogTitle>

          <DialogDescription className="text-sm text-slate-500 max-w-70">
            Free users can only create{" "}
            <span className="font-semibold text-slate-700">three boards</span>.
            Upgrade to <span className="text-violet-600 font-bold">Pro</span> to
            create{" "}
            <span className="font-semibold text-slate-700">
              unlimited boards
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-slate-500 hover:text-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={onUpgrade}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-800 text-white font-medium shadow-md transition-all"
          >
            View Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
