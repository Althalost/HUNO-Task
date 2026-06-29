import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import React from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface EditBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  newTitle: string;
  onTitleChange: (value: string) => void;
  newColor: string;
  onColorChange: (value: string) => void;
}

export default function EditBoardDialog({
  open,
  onOpenChange,
  onSubmit,
  newTitle,
  onTitleChange,
  newColor,
  onColorChange,
}: EditBoardDialogProps) {
  const t = useTranslations("EditBoardDialog");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container w-[95vw] mx-auto px-4 py-6 rounded-3xl bg-white shadow-2xl overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-8 pt-2" onSubmit={onSubmit}>
          <div className="space-y-3">
            <label
              htmlFor="boardTitle"
              className="text-base font-semibold text-slate-800"
            >
              {t("board_title")}
            </label>
            <input
              id="boardTitle"
              value={newTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={t("board_title_placeholder")}
              required
              className="w-full h-12 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg text-slate-900 focus-visible:ring-slate-300 focus-visible:border-slate-300"
            />
          </div>

          <div className="space-y-4">
            <label className="text-base font-semibold text-slate-800">
              {t("board_color")}
            </label>
            <div className="grid grid-cols-6 gap-2 pt-1 w-full">
              {[
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-red-500",
                "bg-purple-500",
                "bg-pink-500",
                "bg-indigo-500",
                "bg-orange-500",
                "bg-cyan-500",
                "bg-emerald-500",
                "bg-teal-500",
                "bg-rose-500",
              ].map((color) => {
                const isSelected = color === newColor;
                return (
                  <button
                    key={color}
                    type="button"
                    className={`w-7 h-7 rounded-full ${color} cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? "ring-2 ring-offset-1 ring-slate-950 shadow-lg"
                        : "hover:opacity-80"
                    }`}
                    onClick={() => onColorChange(color)}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-6 text-lg font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="rounded-lg px-7 text-lg font-semibold bg-slate-800 text-white hover:bg-slate-800 transition"
            >
              {t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
