import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';
import ErrorMessage from '../components/ErrorMessage';
import { SkeletonDashboard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import JobCard from '../components/JobCard';

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
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appsRes = await api.get('/applications/mine');
        setApplications(appsRes.data.applications);
      } catch (err) {
        setError('Failed to load applications.');
      }

      try {
        const savedRes = await api.get('/jobs/saved/list');
        setSavedJobs(savedRes.data.jobs);
      } catch (err) {
        console.error('Failed to load saved jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

        {/* Loading */}
        {loading && <SkeletonDashboard />}

        {/* Error */}
        {error && <ErrorMessage message={error} />}

        {/* Applications */}
        {!loading && !error && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Applications</h2>
            {applications.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No applications yet"
                message="You haven't applied to any jobs yet. Start browsing and apply to your dream job!"
                action={{ href: '/jobs', label: 'Browse Jobs' }}
              />
            ) : (
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

            {/* Saved Jobs */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Jobs</h2>
              {savedJobs.length === 0 ? (
                <EmptyState
                  icon="🔖"
                  title="No saved jobs"
                  message="Browse jobs and click the bookmark icon to save them for later."
                  action={{ href: '/jobs', label: 'Browse Jobs' }}
                />
              ) : (
                <div className="space-y-4">
                  {savedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      saved={true}
                      onUnsave={(id) => setSavedJobs(savedJobs.filter(j => j.id !== id))}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}