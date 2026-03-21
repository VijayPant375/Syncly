export default function StatsCard({ label, value, color = 'text-primary-600', subtitle }) {
  return (
    <div className="card p-6 text-center hover:shadow-md transition-shadow">
      <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {subtitle && (
        <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
      )}
    </div>
  );
}