"use client";

import DashboardSkeleton from "@/components/DashboardSkeleton";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import BoardCard from "@/components/BoardCard";
import BoardFiltersDialog from "@/components/BoardFiltersDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlan } from "@/lib/contexts/PlanContext";
import { useBoards } from "@/lib/hooks/useBoards";
import { Board, boardsWithTasksCount } from "@/lib/supabase/models";
import { useUser } from "@clerk/nextjs";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Filter,
  Grid3x3,
  LayoutDashboard,
  List,
  Loader2,
  Plus,
  PlusIcon,
  RefreshCw,
  Rocket,
  SearchIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateBoardPlaceholder } from "@/components/CreateBoardPlaceholder";
import UpgradeDialog from "@/components/UpgradeDialog";

export default function DashboardPage() {
  const { user } = useUser();
  const { createBoard, boards, loading, error } = useBoards();
  const router = useRouter();
  const { isFreeUser } = usePlan();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    search: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    },
    taskCount: {
      min: null as number | null,
      max: null as number | null,
    },
  });

  const filteredBoards = boards.filter((board: boardsWithTasksCount) => {
    const matchesSearch = board.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesDateRange =
      (!filters.dateRange.start ||
        new Date(board.created_at) >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end ||
        new Date(board.created_at) <= new Date(filters.dateRange.end));

    const totalTasks = board.tasks?.length || 0;
    const matchesTaskCount =
      (filters.taskCount.min === null || totalTasks >= filters.taskCount.min) &&
      (filters.taskCount.max === null || totalTasks <= filters.taskCount.max);

    return matchesSearch && matchesDateRange && matchesTaskCount;
  });

  function clearFilters() {
    setFilters({
      search: "",
      dateRange: {
        start: null as string | null,
        end: null as string | null,
      },
      taskCount: {
        min: null as number | null,
        max: null as number | null,
      },
    });
  }

  function isNewBoard(createdAt: string): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(createdAt) > sevenDaysAgo;
  }

  const canCreateBoard = !isFreeUser || boards.length < 3;

  const handleCreateBoard = async () => {
    if (!canCreateBoard) {
      setShowUpgradeDialog(true);
      return;
    }
    await createBoard({ title: "New Board" });
  };

  const totalTasks = boards.reduce((acc, b) => acc + (b.tasks?.length || 0), 0);
  const avgTasks = boards.length > 0 ? totalTasks / boards.length : 0;
  const avgTasksDisplay = Number.isInteger(avgTasks)
    ? avgTasks
    : avgTasks.toFixed(1);
  const activeThisWeek = boards.filter((board) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(board.updated_at) > oneWeekAgo;
  }).length;

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-xl mx-auto my-8">
        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Failed to load boards
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          There was a problem connecting to Supabase. This can happen if the
          database is waking up or if your local session has expired.
        </p>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            className="h-10 px-4 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium rounded-lg"
            onClick={() => router.refresh()}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry connection</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-10 px-4 text-slate-600 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
            onClick={() => router.push("/dashboard")}
          >
            Reload page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Welcome back,{" "}
            {user?.firstName ||
              user?.emailAddresses[0]?.emailAddress.split("@")[0]}
            ! ✨
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's an overview of your boards and tasks for today.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            label="Total Boards"
            value={boards.length}
            icon={LayoutDashboard}
            colorClass="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Total Tasks"
            value={totalTasks}
            icon={Rocket}
            colorClass="bg-green-100 text-green-600"
          />
          <StatCard
            label="Active This Week"
            value={activeThisWeek}
            icon={Activity}
            colorClass="bg-amber-100 text-amber-600"
          />
          <StatCard
            label="Avg. Tasks/Board"
            value={avgTasksDisplay}
            icon={BarChart3}
            colorClass="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Boards */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div className="w-fit sm:w-80">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Your Boards
              </h2>
              <p className="text-gray-600">Manage your projects and tasks</p>
              {isFreeUser && (
                <p className=" text-sm mt-1 text-gray-600">
                  Free plan: {boards.length}/3 boards used.
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-3 native-scroll">
                <div className="inline-flex items-center rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className={`h-8 w-8 rounded-md p-0 transition-all ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm dark:bg-slate-950 text-slate-900 dark:text-slate-50"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className={`h-8 w-8 rounded-md p-0 transition-all ${
                      viewMode === "list"
                        ? "bg-white shadow-sm dark:bg-slate-950 text-slate-900 dark:text-slate-50"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-3 gap-2 text-slate-600 hover:text-slate-900 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-sm"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">Filter</span>
                </Button>
              </div>

              <Button
                size="sm"
                className="h-10 px-4 gap-2 bg-indigo-600 hover:bg-indigo-800 text-white shadow-sm font-medium rounded-lg sm:w-auto w-full transition-colors"
                onClick={handleCreateBoard}
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Board</span>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4 sm:sm-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              placeholder="Search boards..."
              className="pl-10"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>

          {/* Boards Grid/List */}
          {filteredBoards.length === 0 ? (
            <div>No boards yet</div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  isNew={isNewBoard(board.created_at)}
                />
              ))}
              <CreateBoardPlaceholder onClick={handleCreateBoard} />
            </div>
          ) : (
            <div>
              {filteredBoards.map((board, index) => (
                <div key={board.id} className={index > 0 ? "mt-4" : ""}>
                  <BoardCard
                    board={board}
                    isNew={isNewBoard(board.created_at)}
                    variant="list"
                  />
                </div>
              ))}
              <CreateBoardPlaceholder onClick={handleCreateBoard} />
            </div>
          )}
        </div>
      </main>

      <BoardFiltersDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApply={setFilters}
        onClear={clearFilters}
      />

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        onUpgrade={() => router.push("/pricing")}
      />
    </div>
  );
}
