export default function BoardSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 lg:overflow-x-auto lg:pb-5 lg:px-6 space-y-4 lg:space-y-0">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="w-full lg:shrink-0 lg:w-70">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-6 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-6 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="p-2 space-y-2">
              {[1, 2, 3, 4].map((task) => (
                <div
                  key={task}
                  className="bg-white h-10 border border-slate-200 rounded-[3px] shadow-[0_1px_0_rgba(9,30,66,0.25)] overflow-hidden"
                >
                  <div className="h-1 w-full bg-slate-200 animate-pulse" />
                  <div className="p-2 space-y-2">
                    <div className="h-2 w-2/4 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 space-y-2">
              <div className="h-6 w-full bg-slate-50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
