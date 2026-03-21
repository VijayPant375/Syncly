import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700',
  reviewed: 'bg-blue-50 text-blue-700',
  accepted: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Resume */}
        <ResumeUpload />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
            <div key={status} className="card p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === status).length}
              </div>
              <div className="text-xs text-gray-500 capitalize mt-1">{status}</div>
            </div>
          ))}
        </div>

        {/* Applications list */}
        {loading && (
          <p className="text-gray-400 text-center py-12">Loading...</p>
        )}

        {error && (
          <p className="text-red-500 text-center py-12">{error}</p>
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
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {app.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-1">
                      {app.company} · {app.location}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Applied {new Date(app.created_at).toLocaleDateString()}
                    </p>
                    {app.cover_letter && (
                      <p className="text-gray-500 text-sm mt-3 line-clamp-2">
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