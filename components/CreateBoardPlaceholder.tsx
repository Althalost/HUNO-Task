import { PlusIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CreateBoardPlaceholder({ onClick }: { onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="h-full border-2 border-dashed select-none border-gray-300 hover:border-blue-600 transition-colors cursor-pointer group flex flex-col"
    >
      <CardContent className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center min-h-35">
        <PlusIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
        <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
          Create new board
        </p>
      </CardContent>
    </Card>
  );
}
