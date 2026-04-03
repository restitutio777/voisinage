export function SkeletonListingDetail() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 z-10">
        <div className="h-6 animate-shimmer rounded-lg w-20" />
      </div>
      <div className="aspect-video animate-shimmer" />
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="h-7 animate-shimmer rounded-lg w-2/3" />
          <div className="h-8 animate-shimmer rounded-full w-24 flex-shrink-0" />
        </div>
        <div className="flex gap-4">
          <div className="h-5 animate-shimmer rounded-lg w-24" />
          <div className="h-5 animate-shimmer rounded-lg w-32" />
        </div>
        <div className="space-y-2">
          <div className="h-4 animate-shimmer rounded-lg w-full" />
          <div className="h-4 animate-shimmer rounded-lg w-5/6" />
          <div className="h-4 animate-shimmer rounded-lg w-4/6" />
        </div>
        <div className="border-t border-stone-200 pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full animate-shimmer" />
            <div className="space-y-2 flex-1">
              <div className="h-5 animate-shimmer rounded-lg w-32" />
              <div className="h-4 animate-shimmer rounded-lg w-20" />
            </div>
          </div>
        </div>
        <div className="h-14 animate-shimmer rounded-xl w-full" />
      </div>
    </div>
  );
}

export function SkeletonConversationList() {
  return (
    <div className="divide-y divide-stone-100">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <div className="w-14 h-14 rounded-full animate-shimmer flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-5 animate-shimmer rounded-lg w-28" />
              <div className="h-4 animate-shimmer rounded-lg w-12" />
            </div>
            <div className="h-4 animate-shimmer rounded-lg w-40" />
            <div className="h-4 animate-shimmer rounded-lg w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonConversation() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 z-10">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 animate-shimmer rounded" />
          <div className="w-10 h-10 rounded-full animate-shimmer" />
          <div className="space-y-1.5">
            <div className="h-4 animate-shimmer rounded-lg w-24" />
            <div className="h-3 animate-shimmer rounded-lg w-16" />
          </div>
        </div>
      </div>
      <div className="flex-1 px-4 py-4 space-y-4">
        <div className="flex justify-start">
          <div className="h-16 animate-shimmer rounded-2xl w-3/4" />
        </div>
        <div className="flex justify-end">
          <div className="h-12 animate-shimmer rounded-2xl w-2/3" />
        </div>
        <div className="flex justify-start">
          <div className="h-20 animate-shimmer rounded-2xl w-4/5" />
        </div>
      </div>
    </div>
  );
}
