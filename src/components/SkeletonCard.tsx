export function SkeletonCard() {
  return (
    <div className="card">
      <div className="flex">
        <div className="w-32 h-32 flex-shrink-0 animate-shimmer" />
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 animate-shimmer rounded-lg w-3/4" />
            <div className="h-6 animate-shimmer rounded-full w-20 flex-shrink-0" />
          </div>
          <div className="h-4 animate-shimmer rounded-lg w-1/3" />
          <div className="h-4 animate-shimmer rounded-lg w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonFilterBar() {
  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-9 animate-shimmer rounded-full w-20 flex-shrink-0" />
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 h-10 animate-shimmer rounded-xl" />
        ))}
      </div>
    </div>
  );
}
