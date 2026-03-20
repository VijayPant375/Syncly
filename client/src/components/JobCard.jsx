import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="card p-6 block hover:border-primary-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {job.title}
          </h2>
          <p className="text-gray-600 text-sm mb-2">
            {job.company} · {job.location}
          </p>
          <p className="text-gray-500 text-sm line-clamp-2">
            {job.description}
          </p>
        </div>
        <div className="text-right ml-4 shrink-0">
          <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
            {job.type}
          </span>
          {job.salary && (
            <p className="text-sm text-gray-500 mt-2">{job.salary}</p>
          )}
        </div>
      </div>
    </Link>
  );
}