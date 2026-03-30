export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}