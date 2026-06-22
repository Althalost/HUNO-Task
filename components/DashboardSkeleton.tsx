import Navbar from "./Navbar";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header: Welcome Text */}
        <div className="mb-6 sm:mb-8 space-y-2">
          <div className="h-8 bg-slate-200 rounded-lg w-64 sm:w-80 tracking-tight" />
          <div className="h-4 bg-slate-200 rounded-md w-48 sm:w-60 mt-1" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/60 bg-white p-4 sm:py-6 shadow-sm flex items-center justify-between h-23.5 sm:h-27.5"
            >
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-200 rounded w-16 sm:w-20" />
                <div className="h-6 sm:h-7 bg-slate-300 rounded w-8 sm:w-12" />
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-slate-100 shrink-0" />
            </div>
          ))}
        </div>

        {/* Boards Section Header & Controls */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            {/* Títulos izquierdos */}
            <div className="space-y-2">
              <div className="h-6 sm:h-7 bg-slate-300 rounded w-28 sm:w-36" />
              <div className="h-4 bg-slate-200 rounded w-48 sm:w-56" />
            </div>

            {/* Buttons and filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-3">
                {/* View Mode (Grid/List toggle) */}
                <div className="inline-flex h-9 items-center rounded-lg bg-slate-100 p-1 w-19" />
                {/* Filter button */}
                <div className="h-10 bg-slate-200 rounded-lg w-20" />
              </div>

              {/* Create Board button */}
              <div className="h-10 bg-slate-300 rounded-lg sm:w-32 w-full" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <div className="h-10 bg-slate-200 rounded-lg w-full" />
          </div>

          {/* Boards Grid/List MOCK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/60 bg-white p-4 sm:p-6 shadow-sm h-41.5 sm:h-45.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <div className="w-4 h-4 bg-slate-200 rounded" />
                    <div className="w-10 h-5 bg-slate-100 rounded" />
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="h-5 bg-slate-300 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0 pt-2">
                  <div className="h-3 bg-slate-100 rounded w-20" />
                  <div className="h-3 bg-slate-100 rounded w-20" />
                </div>
              </div>
            ))}

            <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 sm:p-6 flex flex-col items-center justify-center h-41.5 sm:h-45.5">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-slate-200 rounded-full mb-2" />
              <div className="h-4 bg-slate-200 rounded w-28 sm:w-32" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
