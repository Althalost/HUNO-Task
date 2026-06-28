import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import React from "react";

interface ColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  value: string;
  onChange: (value: string) => void;
}

export default function ColumnDialog({
  open,
  onOpenChange,
  onSubmit,
  value,
  onChange,
}: ColumnDialogProps) {
  const t = useTranslations("ColumnDialog");
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
          <DialogHeader className="flex flex-cols justify-between pb-4">
            <DialogTitle className="text-xl font-bold text-slate-800">
              {t("dialog_title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {t("dialog_description")}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>{t("input_label")}</Label>
              <Input
                id="columnTitle"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("input_placeholder")}
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                variant="outline"
              >
                {t("cancel_btn")}
              </Button>
              <Button type="submit">{t("submit_btn")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
