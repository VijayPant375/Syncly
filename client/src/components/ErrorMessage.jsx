export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-sm">
        <div className="text-3xl mb-3">⚠️</div>
        <p className="text-red-700 font-medium mb-1">Something went wrong</p>
        <p className="text-red-500 text-sm mb-4">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary text-sm">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}