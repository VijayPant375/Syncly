export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-6">{message}</p>
      {action && (
        <a href={action.href} className="btn-primary text-sm">
          {action.label}
        </a>
      )}
    </div>
  );
}