"use client";

import DashboardSkeleton from "@/components/DashboardSkeleton";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoards } from "@/lib/hooks/useBoards";
import { Board, boardsWithTasksCount } from "@/lib/supabase/models";
import { useUser } from "@clerk/nextjs";
import {
  AlertCircle,
  BarChart3,
  Filter,
  Grid3x3,
  List,
  Loader2,
  Plus,
  PlusIcon,
  RefreshCw,
  Rocket,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const { createBoard, boards, loading, error } = useBoards();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

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

  const handleCreateBoard = async () => {
    await createBoard({ title: "New Board" });
  };

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
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry connection</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-10 px-4 text-slate-600 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
            onClick={() => (window.location.href = "/dashboard")}
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

        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Card 1: Total Boards */}
          <Card>
            <CardContent className="p-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Boards
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boards.length}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-lg sm:text-xl font-semibold text-blue-600">
                    HT
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Total Tasks */}
          <Card>
            <CardContent className="p-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Tasks
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boards.reduce(
                      (acc, board) => acc + (board.tasks?.length || 0),
                      0,
                    )}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-100 flex items-center justify-center pointer-events-none select-none">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Recent Activity */}
          <Card>
            <CardContent className="p-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Recent Activity
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {
                      boards.filter((board) => {
                        const updatedAt = new Date(board.updated_at);
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return updatedAt > oneWeekAgo;
                      }).length
                    }
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-amber-100 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-xl sm:text-2xl">⚡</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Avg. Tasks per Board */}
          <Card>
            <CardContent className="p-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Avg. Tasks / Board
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boards.length > 0
                      ? (
                          boards.reduce(
                            (acc, board) => acc + (board.tasks?.length || 0),
                            0,
                          ) / boards.length
                        ).toFixed(1)
                      : 0}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-purple-100 flex items-center justify-center pointer-events-none select-none">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boards */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Your Boards
              </h2>
              <p className="text-gray-600">Manage your projects and tasks</p>
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
                className="h-10 px-4 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium rounded-lg sm:w-auto w-full transition-colors"
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
              {filteredBoards.map((board, key) => (
                <Link href={`/boards/${board.id}`} key={key}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-4 h-4 ${board.color} rounded `} />
                        <Badge className="text-xs" variant="secondary">
                          New
                        </Badge>
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
                          Created{" "}
                          {new Date(board.created_at).toLocaleDateString()}
                        </span>
                        <span>
                          Updated{" "}
                          {new Date(board.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-600 transition-colors cursor-pointer group">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center  justify-center h-full min-h-50">
                  <PlusIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                    Create new board
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div>
              {filteredBoards.map((board, key) => (
                <div key={key} className={key > 0 ? "mt-4" : ""}>
                  <Link href={`/boards/${board.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-4 h-4 ${board.color} rounded `} />
                          <Badge className="text-xs" variant="secondary">
                            New
                          </Badge>
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
                            Created{" "}
                            {new Date(board.created_at).toLocaleDateString()}
                          </span>
                          <span>
                            Updated{" "}
                            {new Date(board.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}

              <Card className="mt-4 border-2 border-dashed border-gray-300 hover:border-blue-600 transition-colors cursor-pointer group">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center  justify-center h-full min-h-50">
                  <PlusIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                    Create new board
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Filter Boards</DialogTitle>
            <p className="text-sm text-gray-600">
              Filter boards by title, date, or task count.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                id="search"
                placeholder="Search board title..."
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Start Date</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: e.target.value || null,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">End Date</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          end: e.target.value || null,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Task Count</Label>
              <div>
                <div>
                  <Label className="text-xs">Minimum</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Min tasks"
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        taskCount: {
                          ...prev.taskCount,
                          min: e.target.value ? Number(e.target.value) : null,
                        },
                      }));
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">Maximum</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Max tasks"
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        taskCount: {
                          ...prev.taskCount,
                          max: e.target.value ? Number(e.target.value) : null,
                        },
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between pt-4 space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
