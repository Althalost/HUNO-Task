import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  KanbanSquare,
  Zap,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 select-none via-white to-purple-50 text-slate-900">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <header className="container mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-20 text-center max-w-4xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 mb-4 animate-bounce">
          🚀 HUNOTASK 1.0 • LIVE WORKSPACE
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent leading-tight">
          Manage your projects and tasks <br />
          <span className="bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            without the chaos.
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A high-performance Kanban workspace built to bridge the gap between
          task management and interactive analytics. Track metrics, organize
          priorities, and deploy ideas faster.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignUpButton mode="redirect">
            <button className="h-12 px-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all font-medium rounded-xl group cursor-pointer">
              Get Started Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignUpButton>
          <a
            href="#features"
            className="h-12 px-6 w-full sm:w-auto inline-flex items-center justify-center border border-slate-200 bg-white/80 backdrop-blur-xs hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium rounded-xl transition-colors shadow-xs"
          >
            Learn More
          </a>
        </div>
      </header>

      {/* --- PREVIEW MOCKUP --- */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24 max-w-5xl select-none">
        <div className="relative rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl overflow-hidden group">
          <div className="h-8 w-full bg-slate-50/80 border-b border-slate-100/80 px-4 flex items-center gap-1.5 rounded-t-xl">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
          </div>

          <div className="relative w-full overflow-hidden rounded-b-xl bg-slate-50">
            <Image
              src="/dashboard-preview.jpeg"
              alt="Hunotask High-Performance Kanban Dashboard Preview"
              width={1920}
              height={1080}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.008]"
              priority
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white via-white/5 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section
        id="features"
        className="container mx-auto px-4 py-16 sm:py-24 border-t border-slate-100 max-w-6xl"
      >
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to stay on track
          </h2>
          <p className="text-slate-600 mt-3">
            Built with modern technologies to deliver a robust, snappy, and
            real-time experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <div className="bg-white/60 backdrop-blur-xs border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
              <KanbanSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Kanban Workspace
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Organize your tasks visually. Drag, drop, and structure your
              pipeline effortlessly across multiple customized states.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/60 backdrop-blur-xs border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-5">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Real-time Metrics
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Get an instant overview. Track total boards, active tasks, and
              historical engagement directly from your dynamic stats panels.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/60 backdrop-blur-xs border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-5">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Advanced Filtering
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Find what matters instantly. Deep-dive into your projects via
              title searches, date ranges, and custom criteria.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-100 bg-white/40 py-8 text-center text-xs text-slate-400">
        <p>
          © 2026 HUNOTASK. Built for professional portfolios using Next.js,
          TailwindCSS & Supabase.
        </p>
      </footer>
    </div>
  );
}
