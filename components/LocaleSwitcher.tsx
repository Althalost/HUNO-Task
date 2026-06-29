"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium">
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`px-1 py-0.5 sm:px-2 sm:py-1 rounded-md transition-colors ${
          locale === "en"
            ? "text-slate-900 font-semibold"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        EN
      </button>
      <span className="text-slate-300">|</span>
      <button
        onClick={() => switchLocale("pt")}
        disabled={isPending}
        className={`px-1 py-0.5 sm:px-2 sm:py-1 rounded-md transition-colors ${
          locale === "pt"
            ? "text-slate-900 font-semibold"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        PT
      </button>
    </div>
  );
}
