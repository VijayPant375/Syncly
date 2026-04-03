import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-5xl mb-5 animate-float">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed mb-6">{message}</p>
      {action && (
        action.href
          ? <Link to={action.href} className="btn-primary text-sm">{action.label}</Link>
          : <button onClick={action.onClick} className="btn-primary text-sm">{action.label}</button>
      )}
    </div>
  );
}