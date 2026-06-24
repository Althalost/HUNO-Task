import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import { Task } from "@/lib/supabase/models";

export default function SortableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <div
      ref={(node) => setNodeRef(node)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
      }}
      {...listeners}
      {...attributes}
      className="outline-none my-1 first:mt-0 last:mb-0"
    >
      <TaskCard task={task} />
    </div>
  );
}
