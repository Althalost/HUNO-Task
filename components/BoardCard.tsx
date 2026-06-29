"use client";

import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { boardsWithTasksCount } from "@/lib/supabase/models";
import { Button } from "./ui/button";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface BoardCardProps {
  board: boardsWithTasksCount;
  isNew: boolean;
  variant?: "grid" | "list";
  onDelete: (boardId: string) => void;
  onEdit: (board: boardsWithTasksCount) => void;
}

export default function BoardCard({
  board,
  isNew,
  variant = "grid",
  onDelete,
  onEdit,
}: BoardCardProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale ?? "en";
  const t = useTranslations("BoardCard");

  return (
    <Card
      className="hover:shadow-lg transition-shadow select-none cursor-pointer group"
      onClick={() => router.push(`/${locale}/boards/${board.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`w-4 h-4 ${board.color} rounded`} />
          <div className="flex items-center gap-2">
            {isNew && (
              <Badge className="text-xs" variant="secondary">
                {t("new")}
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-50 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem onSelect={() => onEdit(board)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onDelete(board.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
          {board.title}
        </CardTitle>
        <CardDescription className="text-sm mb-4">
          {board.description}
        </CardDescription>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-300 space-y-1 sm:space-y-0">
          <span>
            {t("created", {
              date: new Date(board.created_at).toLocaleDateString(),
            })}
          </span>
          <span>
            {t("updated", {
              date: new Date(board.updated_at).toLocaleDateString(),
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
