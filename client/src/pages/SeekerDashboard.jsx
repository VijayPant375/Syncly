import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';
import ErrorMessage from '../components/ErrorMessage';
import { SkeletonDashboard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import JobCard from '../components/JobCard';

const STATUS_COLORS = {
  pending:  'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  reviewed: 'bg-blue-50   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300',
  accepted: 'bg-green-50  dark:bg-green-900/30  text-green-700  dark:text-green-300',
  rejected: 'bg-red-50    dark:bg-red-900/30    text-red-700    dark:text-red-300',
};

// ── Profile Completion Widget ────────────────────────────────────
function ProfileCompletion({ user, applications, hasResume, profile }) {
  const checks = useMemo(() => [
    { label: 'Account created',      done: true },
    { label: 'Resume uploaded',       done: hasResume },
    { label: 'Profile details filled', done: !!(profile?.bio || profile?.skills) },
    { label: 'First application sent', done: applications.length > 0 },
  ], [hasResume, profile, applications]);

  const completed = checks.filter(c => c.done).length;
  const pct = Math.round((completed / checks.length) * 100);

  const barColor =
    pct === 100 ? 'bg-emerald-500' :
    pct >= 50   ? 'bg-primary-500' :
                  'bg-amber-500';

  const motivational =
    pct === 100 ? '🎉 Your profile is complete!' :
    pct >= 75   ? 'Almost there — one more step!' :
    pct >= 50   ? 'Good progress! Keep going.' :
                  'Let\'s complete your profile.';

  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Profile Completion</h2>
          <p className="text-xs text-gray-400 mt-0.5">{motivational}</p>
        </div>
        <span className={`text-lg font-black ${pct === 100 ? 'text-emerald-500' : 'text-primary-600'}`}>
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Checklist */}
      <ul className="space-y-1.5">
        {checks.map(({ label, done }) => (
          <li key={label} className="flex items-center gap-2 text-xs">
            {done ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 shrink-0" />
            )}
            <span className={done ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
              {label}
            </span>
            {!done && label === 'Profile details filled' && (
              <Link to="/profile" className="ml-auto text-primary-600 hover:underline text-xs font-medium">
                Fill in →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [hasResume, setHasResume] = useState(false);
  const [profile, setProfile] = useState(null);

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
      }

      try {
        const resumeRes = await api.get('/resume');
        setHasResume(!!(resumeRes.data.resume?.filename));
      } catch (_) {
        setHasResume(false);
      }

      try {
        const profileRes = await api.get('/profile');
        setProfile(profileRes.data.profile);
      } catch (_) {}

      setLoading(false);
    };
    fetchData();
  }, []);

  const statuses = ['pending', 'reviewed', 'accepted', 'rejected'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Profile Completion */}
        {!loading && (
          <ProfileCompletion
            user={user}
            applications={applications}
            hasResume={hasResume}
            profile={profile}
          />
        )}

        {/* Resume Upload */}
        <ResumeUpload onUploadSuccess={() => setHasResume(true)} />

        {/* Application Status Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-6">
          {statuses.map((status) => {
            const count = applications.filter(a => a.status === status).length;
            const colors = {
              pending:  'from-amber-400  to-amber-500',
              reviewed: 'from-blue-400   to-blue-500',
              accepted: 'from-emerald-400 to-emerald-500',
              rejected: 'from-red-400    to-red-500',
            };
            return (
              <div key={status} className="card p-4 text-center group hover:shadow-md transition-shadow">
                <div className={`text-2xl font-bold bg-gradient-to-br ${colors[status]} bg-clip-text text-transparent mb-1`}>
                  {count}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{status}</div>
              </div>
            );
          })}
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