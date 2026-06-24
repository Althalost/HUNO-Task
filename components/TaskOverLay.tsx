import TaskCard from "./TaskCard";
import { Task } from "@/lib/supabase/models";

export default function TaskOverlay({ task }: { task: Task }) {
  return (
    <div className="border border-slate-300 bg-white rounded-[3px] shadow-xl rotate-1 scale-[1.01] overflow-hidden">
      <TaskCard task={task} />
    </div>
  );
}
