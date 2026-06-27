import { Task } from "@/lib/supabase/models";
import { Calendar, UserIcon } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

function getPriorityColor(priority: "low" | "medium" | "high"): string {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
  }
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="cursor-grab active:cursor-grabbing border border-slate-200 bg-white rounded-[3px] shadow-[0_1px_0_rgba(9,30,66,0.25)] hover:bg-slate-50/90 transition-colors duration-100 overflow-hidden">
      <div
        className={`h-1 w-full ${getPriorityColor(task.priority)}`}
        aria-label={`Priority: ${task.priority}`}
        role="img"
      />
      <div className="p-2">
        <div className="flex flex-col gap-0.5">
          <h4 className="font-normal text-slate-900 text-[13.5px] leading-4.25 wrap-break-word tracking-normal">
            {task.title}
          </h4>
          {(task.assignee || task.due_date) && (
            <div className="flex items-center gap-1.5 mt-1 pt-0.5">
              {task.assignee && (
                <div className="flex items-center gap-1 text-[10.5px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-[3px] min-w-0 max-w-27.5">
                  <UserIcon className="h-3 w-3 shrink-0 text-slate-500" />
                  <span className="truncate">{task.assignee}</span>
                </div>
              )}

              {task.due_date && (
                <div className="flex items-center gap-1 text-[10.5px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-[3px] min-w-0">
                  <Calendar className="h-3 w-3 shrink-0 text-slate-500" />
                  <span className="truncate">
                    {new Date(task.due_date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
