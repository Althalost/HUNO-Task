"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Filter, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";

interface Props {
  boardTitle?: string;
  onEditBoard?: () => void;

  onFilterClick?: () => void;
  filterCount?: number;
}

export default function Navbar({
  boardTitle,
  onEditBoard,
  onFilterClick,
  filterCount = 0,
}: Props) {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const isDashboardPage = pathname === "/dashboard";
  const isBoardPage = pathname.startsWith("/boards/");

  if (isDashboardPage) {
    return (
      <div>
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                HUNO<span className="text-indigo-600">TASK</span>
              </h1>
            </div>
            <UserButton
              appearance={{
                elements: {
                  userButtonTrigger: {
                    width: "36px",
                    height: "36px",
                    flexShrink: 0,
                  },
                  userButtonAvatarBox: {
                    width: "36px",
                    height: "36px",
                  },
                },
              }}
            />
          </div>
        </header>
      </div>
    );
  }

  if (isBoardPage) {
    return (
      <header className="bg-white border-b pt-1 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Dashboard</span>
              </Link>

              <div className="h-4 sm:h-6 w-px bg-gray-300 hidden sm:block shrink-0" />

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900">
                  <span className="sm:hidden">HT</span>
                  <span className="hidden sm:inline">
                    HUNO<span className="text-indigo-600">TASK</span>
                  </span>
                </span>

                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-slate-300">·</span>
                  <span className="text-base font-semibold text-slate-700 truncate">
                    {boardTitle}
                  </span>

                  {onEditBoard && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 shrink-0 p-0"
                      onClick={onEditBoard}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              {onFilterClick && (
                <Button
                  variant="outline"
                  size="sm"
                  className={`text-xs sm:text-sm ${filterCount > 0 ? "bg-slate-100 border-slate-200" : ""}`}
                  onClick={onFilterClick}
                >
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                  {filterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ml-1 sm:ml-2 ${filterCount > 0 ? "bg-slate-100 border-slate-200" : ""}`}
                    >
                      {filterCount}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            HUNO<span className="text-indigo-600">TASK</span>
          </h1>
        </div>
        {isSignedIn ? (
          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              Welcome, {user.firstName ?? user.emailAddresses[0].emailAddress}
            </span>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs sm:text-sm">
                Go to Dashboard <ArrowRight />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <SignInButton mode="redirect">
              <Button
                variant="ghost"
                className="h-10 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer select-none rounded-xl"
              >
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton mode="redirect">
              <Button className="h-10 px-5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-sm transition-all cursor-pointer select-pointer select-none rounded-xl">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </header>
  );
}
