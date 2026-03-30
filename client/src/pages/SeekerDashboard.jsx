import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';
import ErrorMessage from '../components/ErrorMessage';
import { SkeletonDashboard } from '../components/Skeleton';

const STATUS_COLORS = {
  pending: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
  reviewed: 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  accepted: 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300',
  rejected: 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300',
};

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/mine');
        setApplications(res.data.applications);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Resume */}
        <ResumeUpload />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
            <div key={status} className="card p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter(a => a.status === status).length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">{status}</div>
            </div>
          ))}
        </div>

        {/* Applications list */}
        {loading && <SkeletonDashboard />}

        {error && (
          <ErrorMessage message={error} />
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-400 mb-4">You haven't applied to any jobs yet.</p>
            <a href="/jobs" className="btn-primary">Browse Jobs</a>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {app.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      {app.company} · {app.location}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Applied {new Date(app.created_at).toLocaleDateString()}
                    </p>
                    {app.cover_letter && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 line-clamp-2">
                        {app.cover_letter}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize shrink-0 ml-4 ${STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}