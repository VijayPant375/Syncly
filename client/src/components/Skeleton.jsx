export function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="ml-4 shrink-0">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        ))}
      </div>
      <div className="card p-6 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonJobDetail() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        {/* Back button */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-6"></div>
        
        {/* Job card */}
        <div className="card p-8">
          {/* Title and type */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24 ml-4"></div>
          </div>

          {/* Salary */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>

          {/* Description section */}
          <div className="mb-8">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>

          {/* Apply button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        {/* Header card */}
        <div className="card p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
          </div>
        </div>

        {/* Form card */}
        <div className="card p-6 space-y-5">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
          
          {/* Form fields */}
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
            </div>
          ))}

          {/* Save button */}
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonATS() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>

        {/* Input cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
            <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
          </div>
          <div className="card p-6">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
            <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
          </div>
        </div>

        {/* Analyze button */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full mb-8"></div>

        {/* Results placeholder */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-2"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}