import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const TYPE_COLORS = {
  'full-time': 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300',
  'part-time': 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  'contract': 'bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  'internship': 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
};

export default function JobCard({ job, saved: initialSaved = false, onUnsave }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const initials = job.company
    ? job.company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-orange-500', 'bg-pink-500', 'bg-teal-500'
  ];
  const color = colors[job.company?.charCodeAt(0) % colors.length] || 'bg-blue-500';

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'seeker') {
      showToast('Please login as a seeker to save jobs.', 'error');
      return;
    }
    setLoading(true);
    try {
      if (saved) {
        await api.delete(`/jobs/${job.id}/save`);
        setSaved(false);
        showToast('Job removed from saved.', 'success');
        if (onUnsave) onUnsave(job.id);
      } else {
        await api.post(`/jobs/${job.id}/save`);
        setSaved(true);
        showToast('Job saved!', 'success');
      }
    } catch (err) {
      showToast('Failed to save job.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 hover:border-primary-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative">
      <button
        onClick={handleSave}
        disabled={loading}
        className="absolute top-4 right-4 text-xl hover:scale-110 transition-transform"
        aria-label="Save job"
      >
        {saved ? '🔖' : '🤍'}
      </button>

      <Link to={`/jobs/${job.id}`} className="block">
        <div className="flex items-start gap-4">
          <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
            <span className="text-white font-bold text-sm">{initials}</span>
          </div>

          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
                  {job.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  {job.company} · {job.location}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${TYPE_COLORS[job.type] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {job.type}
                </span>
                {job.salary && (
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1.5">{job.salary}</p>
                )}
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
              {job.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}