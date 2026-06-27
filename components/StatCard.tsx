import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  colorClass: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:py-6 select-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              {label}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {value}
            </p>
          </div>
          <div
            className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg ${colorClass} flex items-center justify-center pointer-events-none select-none`}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
