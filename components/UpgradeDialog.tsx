"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("UpgradeDialog");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-106.25 mx-auto p-6 rounded-xl border border-slate-100 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-violet-100 text-violet-600 rounded-full w-fit">
            <Sparkles className="w-6 h-6" />
          </div>

          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
            {t("title")}
          </DialogTitle>

          <DialogDescription
            asChild
            className="text-sm text-slate-500 max-w-70"
          >
            <p className="text-sm text-slate-500 max-w-70">
              {t("description_start")}{" "}
              <span className="font-semibold text-slate-700">{t("three")}</span>
              {". "}
              {t("description_mid")}{" "}
              <span className="text-violet-600 font-bold">{t("pro")}</span>{" "}
              {t("description_end")}{" "}
              <span className="font-semibold text-slate-700">
                {t("unlimited")}
              </span>
              .
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-slate-500 hover:text-slate-800"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={onUpgrade}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-800 text-white font-medium shadow-md transition-all"
          >
            {t("view_plans")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
