import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SignIn" });

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex">
      <div className="hidden lg:flex lg:w-1/2 select-none bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 flex-col justify-between p-12">
        <Link href={`/${locale}/`}>
          <h1 className="text-white text-2xl font-extrabold tracking-tight hover:opacity-80 transition-opacity">
            HUNO<span className="text-indigo-400">TASK</span>
          </h1>
        </Link>

        <div className="select-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300 mb-6">
            {t("badge")}
          </span>
          <p className="text-white text-3xl font-extrabold leading-snug tracking-tight">
            {t("title")}
            <br />
            <span className="bg-linear-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t("title_highlight")}
            </span>
          </p>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <p className="text-slate-600 text-xs">© 2026 HunoTask</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link href={`/${locale}/`}>
          <h1 className="lg:hidden text-2xl font-extrabold select-none tracking-tight text-slate-900 mb-8 hover:opacity-80 transition-opacity">
            HUNO<span className="text-indigo-600">TASK</span>
          </h1>
        </Link>

        <div className="w-full max-w-md mb-6">
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <span className="text-xl">👀</span>
            <div>
              <p className="font-semibold text-amber-900 text-sm">
                {t("demo_title")}
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                {t("demo_credentials")}
              </p>
            </div>
          </div>
        </div>

        <SignIn path={`/${locale}/sign-in`} signUpUrl={`/${locale}/sign-up`} />
      </div>
    </div>
  );
}
