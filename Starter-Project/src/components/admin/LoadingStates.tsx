export function TableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="px-6 py-4 flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, children }: { 
  title: string; 
  description: string; 
  children?: React.ReactNode 
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        {children && (
          <div className="flex items-center space-x-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ 
  title, 
  description, 
  actionText, 
  actionHref 
}: { 
  title: string; 
  description: string; 
  actionText?: string; 
  actionHref?: string 
}) {
  return (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionText && actionHref && (
        <a
          href={actionHref}
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          {actionText}
        </a>
      )}
    </div>
  );
}
