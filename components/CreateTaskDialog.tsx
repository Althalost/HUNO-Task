import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("CreateTaskDialog");
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
          {t("add_task_btn")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto p-6 rounded-3xl bg-white shadow-2xl">
        <DialogHeader className="flex flex-cols justify-between pb-4">
          <DialogTitle className="text-xl font-bold text-slate-800">
            {t("dialog_title")}
          </DialogTitle>
          <DialogDescription>{t("dialog_description")}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => onCreateTask(e, columnId)}>
          <div className="space-y-2">
            <Label>{t("title_label")}</Label>
            <Input
              id="title"
              name="title"
              placeholder={t("title_placeholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("desc_label")}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="desc_placeholder"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>"assignee_label"</Label>
            <Input
              id="assignee"
              name="assignee"
              placeholder={t("assignee_placeholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("priority_label")}</Label>
            <Select name="priority" defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
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
                      {t(`priority_options.${p.value}` as any)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("due_date_label")}</Label>
            <Input type="date" id="dueDate" name="dueDate" />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit">{t("submit_btn")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
