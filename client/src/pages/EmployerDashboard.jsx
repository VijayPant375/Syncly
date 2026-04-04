import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import ErrorMessage from '../components/ErrorMessage';
import { useToast } from '../context/ToastContext';
import { SkeletonDashboard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const STATUS_PALETTE = {
  pending:  '#f59e0b',
  reviewed: '#3b82f6',
  accepted: '#10b981',
  rejected: '#ef4444',
};

const BAR_COLOR = '#6366f1';

// Custom label for pie slices
const renderCustomLabel = ({ name, percent }) =>
  percent > 0.04 ? `${(percent * 100).toFixed(0)}%` : '';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', company: '', location: '',
    type: 'full-time', description: '', salary: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [applicants, setApplicants] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      const myJobs = res.data.jobs.filter(j => j.employer_id === user?.id);
      setJobs(myJobs);
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all applicants across all jobs for analytics
  const fetchAllApplicants = async (jobList) => {
    try {
      const results = await Promise.all(
        jobList.map(j => api.get(`/applications/job/${j.id}`).then(r => r.data.applicants).catch(() => []))
      );
      setAllApplicants(results.flat());
    } catch (_) {}
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) fetchAllApplicants(jobs);
  }, [jobs]);

  // ── Analytics data ──────────────────────────────────────
  const pieData = useMemo(() => {
    const counts = { pending: 0, reviewed: 0, accepted: 0, rejected: 0 };
    allApplicants.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter(d => d.value > 0);
  }, [allApplicants]);

  const barData = useMemo(() =>
    jobs.map(j => ({
      name: j.title.length > 14 ? j.title.slice(0, 14) + '…' : j.title,
      Applicants: j.applicant_count || 0,
    })),
  [jobs]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/jobs', form);
      setShowForm(false);
      setForm({ title: '', company: '', location: '', type: 'full-time', description: '', salary: '' });
      fetchJobs();
      showToast('Job posted successfully!', 'success');
    } catch (err) {
      setFormError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Failed to post job.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      fetchJobs();
      if (selectedJob === jobId) {
        setSelectedJob(null);
        setApplicants([]);
      }
      showToast('Job deleted successfully.', 'success');
    } catch (err) {
      showToast('Failed to delete job.', 'error');
    }
  };

  const handleViewApplicants = async (jobId) => {
    if (selectedJob === jobId) {
      setSelectedJob(null);
      setApplicants([]);
      return;
    }
    setSelectedJob(jobId);
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplicants(res.data.applicants);
    } catch (err) {
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      setApplicants(applicants.map(a =>
        a.id === applicationId ? { ...a, status } : a
      ));
      // refresh allApplicants for chart
      setAllApplicants(prev => prev.map(a =>
        a.id === applicationId ? { ...a, status } : a
      ));
      showToast('Application status updated.', 'success');
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employer Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Post a Job'}
          </button>
        </div>

        {/* Post Job Form */}
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Post a New Job</h2>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {formError}
              </div>
            )}
            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    className="input-field" placeholder="e.g. Frontend Developer" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                  <input name="company" value={form.company} onChange={handleChange}
                    className="input-field" placeholder="e.g. Tech Corp" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input name="location" value={form.location} onChange={handleChange}
                    className="input-field" placeholder="e.g. Remote" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
                  <select name="type" value={form.type} onChange={handleChange} className="input-field">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary (optional)</label>
                  <input name="salary" value={form.salary} onChange={handleChange}
                    className="input-field" placeholder="e.g. $80,000 - $100,000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  className="input-field h-32 resize-none"
                  placeholder="Describe the role, requirements and responsibilities..." required />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Posting...' : 'Post Job'}
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatsCard label="Total Jobs Posted" value={jobs.length} />
          <StatsCard
            label="Total Applicants"
            value={jobs.reduce((acc, j) => acc + (j.applicant_count || 0), 0)}
            color="text-green-600"
          />
          <StatsCard
            label="Active Listings"
            value={jobs.length}
            color="text-blue-600"
            subtitle="All your current postings"
          />
        </div>

        {/* ── Analytics Charts ──────────────────────────────── */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* Pie — Application Status Breakdown */}
            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Application Status Breakdown
              </h2>
              {pieData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No applications yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomLabel}
                    >
                      {pieData.map(entry => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_PALETTE[entry.name] || '#94a3b8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--tooltip-bg, #fff)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.8rem',
                      }}
                      formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                      wrapperStyle={{ fontSize: '0.75rem' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bar — Jobs vs Applicants */}
            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Applicants per Job
              </h2>
              {barData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No jobs yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '0.8rem',
                      }}
                    />
                    <Bar dataKey="Applicants" fill={BAR_COLOR} radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* Jobs list */}
        {loading && <SkeletonDashboard />}
        {error && <ErrorMessage message={error} />}

        {!loading && jobs.length === 0 && (
          <EmptyState
            icon="💼"
            title="No jobs posted yet"
            message="You haven't posted any jobs yet. Create your first job listing to start receiving applications."
          />
        )}

        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Job Postings ({jobs.length})</h2>
            {jobs.map((job) => (
              <div key={job.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} · {job.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewApplicants(job.id)}
                      className="btn-secondary text-sm"
                    >
                      {selectedJob === job.id ? 'Hide Applicants' : `View Applicants (${job.applicant_count || 0})`}
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="text-sm text-red-500 hover:text-red-700 px-3 py-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Applicants */}
                {selectedJob === job.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                    {loadingApplicants && (
                      <p className="text-gray-400 text-sm">Loading applicants...</p>
                    )}
                    {!loadingApplicants && applicants.length === 0 && (
                      <p className="text-gray-400 text-sm">No applicants yet.</p>
                    )}
                    {!loadingApplicants && applicants.length > 0 && (
                      <div className="space-y-3">
                        {applicants.map((app) => (
                          <div key={app.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{app.seeker_name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{app.seeker_email}</p>
                              {app.cover_letter && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{app.cover_letter}</p>
                              )}
                            </div>
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              className="input-field text-xs w-32"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}