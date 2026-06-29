"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Filter, MoreHorizontal } from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Badge } from "./ui/badge";
import LocaleSwitcher from "./LocaleSwitcher";

interface NavbarProps {
  boardTitle?: string;
  onEditBoard?: () => void;
  onFilterClick?: () => void;
  filterCount?: number;
}

function BrandLogo() {
  return (
    <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 select-none">
      HUNO<span className="text-indigo-600">TASK</span>
    </span>
  );
}

function NavUserControls() {
  return (
    <UserButton
      appearance={{
        elements: {
          userButtonTrigger: { width: "36px", height: "36px", flexShrink: 0 },
          userButtonAvatarBox: { width: "36px", height: "36px" },
        },
      }}
    />
  );
}

function DashboardNav() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <BrandLogo />
        <div className="flex items-center space-x-4 select-none">
          <LocaleSwitcher />
          <NavUserControls />
        </div>
      </div>
    </header>
  );
}

interface BoardNavProps {
  locale: string;
  boardTitle?: string;
  onEditBoard?: () => void;
  onFilterClick?: () => void;
  filterCount: number;
}

function BoardNav({
  locale,
  boardTitle,
  onEditBoard,
  onFilterClick,
  filterCount,
}: BoardNavProps) {
  const t = useTranslations("Navbar");

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 sm:py-4">
        <div className="flex sm:hidden items-center justify-between">
          <Link
            href={`/${locale}/dashboard`}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
            <span className="text-base font-semibold text-slate-800 truncate max-w-45">
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

          <NavUserControls />
        </div>

        <div className="hidden sm:flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">{t("dashboard")}</span>
            </Link>

            <div className="h-6 w-px bg-gray-300 shrink-0" />

            <BrandLogo />

            <div className="flex items-center gap-1 min-w-0">
              <span className="text-slate-300">·</span>
              <span className="text-xl font-semibold text-slate-700 truncate">
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

          <div className="flex items-center gap-4 shrink-0">
            <LocaleSwitcher />
            {onFilterClick && (
              <Button
                variant="outline"
                size="sm"
                className={`text-sm ${filterCount > 0 ? "bg-slate-100 border-slate-200" : ""}`}
                onClick={onFilterClick}
              >
                <Filter className="h-5 w-5 mr-2" />
                {t("filter")}
                {filterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-xs ml-2 bg-slate-100 border-slate-200"
                  >
                    {filterCount}
                  </Badge>
                )}
              </Button>
            )}
            <NavUserControls />
          </div>
        </div>
      </div>
    </header>
  );
}

function PublicNav({ locale }: { locale: string }) {
  const { isSignedIn, user } = useUser();
  const t = useTranslations("Navbar");

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <BrandLogo />

        {isSignedIn ? (
          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <LocaleSwitcher />
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              {t("welcome")},{" "}
              {user.firstName ?? user.emailAddresses[0].emailAddress}
            </span>
            <Link href={`/${locale}/dashboard`}>
              <Button size="sm" className="text-xs sm:text-sm">
                {t("go_to_dashboard")} <ArrowRight />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <SignInButton mode="redirect">
              <Button
                variant="ghost"
                className="h-9 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer select-none rounded-xl"
              >
                {t("sign_in")}
              </Button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <Button className="h-9 px-3 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-sm transition-all cursor-pointer select-none rounded-xl">
                {t("sign_up")}
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </header>
  );
}

export default function Navbar({
  boardTitle,
  onEditBoard,
  onFilterClick,
  filterCount = 0,
}: NavbarProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale ?? "en") as string;

  const isDashboard = pathname === `/${locale}/dashboard`;
  const isBoard = pathname.startsWith(`/${locale}/boards/`);

  if (isDashboard) return <DashboardNav />;

  if (isBoard)
    return (
      <BoardNav
        locale={locale}
        boardTitle={boardTitle}
        onEditBoard={onEditBoard}
        onFilterClick={onFilterClick}
        filterCount={filterCount}
      />
    );

  return <PublicNav locale={locale} />;
}
