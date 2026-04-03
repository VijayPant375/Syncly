import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

const TYPE_BADGES = {
  'full-time':  'badge-green',
  'part-time':  'badge-primary',
  'contract':   'badge-orange',
  'internship': 'badge-purple',
};

const COMPANY_GRADIENTS = [
  'from-blue-500 to-primary-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-orange-500 to-amber-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-sky-600',
];

export default function JobCard({ job, saved: initialSaved = false, onUnsave }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const initials = job.company
    ? job.company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const gradient = COMPANY_GRADIENTS[job.company?.charCodeAt(0) % COMPANY_GRADIENTS.length] || COMPANY_GRADIENTS[0];

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
    } catch {
      showToast('Failed to save job.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="card group relative hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250"
    >
      {/* Bookmark button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className={`absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center
                    transition-all duration-200 hover:scale-110 active:scale-95
                    ${saved
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary-500'
                    }`}
        aria-label={saved ? 'Unsave job' : 'Save job'}
      >
        <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
      </button>

      <Link to={`/jobs/${job.id}`} className="block p-6">
        <div className="flex items-start gap-4 pr-8">
          {/* Company avatar */}
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md`}>
            <span className="text-white font-black text-sm">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-1">
              <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {job.title}
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {job.company}
              <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
              {job.location}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className={TYPE_BADGES[job.type] || 'badge-gray'}>
                {job.type}
              </span>
              {job.salary && (
                <span className="badge bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                  {job.salary}
                </span>
              )}
            </div>

            {job.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                {job.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}