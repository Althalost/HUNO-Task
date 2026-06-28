"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import LandingPage from "@/components/LandingPage";
import DashboardSkeleton from "@/components/DashboardSkeleton";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale ?? "en";

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(`/${locale}/dashboard`);
    }
  }, [isLoaded, isSignedIn, router, locale]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (isSignedIn) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <LandingPage />
    </div>
  );
}
