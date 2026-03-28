import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', company: '', location: '',
    type: 'full-time', description: '', salary: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [applicants, setApplicants] = useState([]);
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

  useEffect(() => {
    fetchJobs();
  }, []);

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
    } catch (err) {
      alert('Failed to delete job.');
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
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Post a New Job</h2>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {formError}
              </div>
            )}
            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    className="input-field" placeholder="e.g. Frontend Developer" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input name="company" value={form.company} onChange={handleChange}
                    className="input-field" placeholder="e.g. Tech Corp" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input name="location" value={form.location} onChange={handleChange}
                    className="input-field" placeholder="e.g. Remote" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select name="type" value={form.type} onChange={handleChange} className="input-field">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary (optional)</label>
                  <input name="salary" value={form.salary} onChange={handleChange}
                    className="input-field" placeholder="e.g. $80,000 - $100,000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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

        {/* Jobs list */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        )}
        {error && <p className="text-red-500 text-center py-12">{error}</p>}

        {!loading && jobs.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-400 mb-4">You haven't posted any jobs yet.</p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Job Postings ({jobs.length})</h2>
            {jobs.map((job) => (
              <div key={job.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.location} · {job.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewApplicants(job.id)}
                      className="btn-secondary text-sm"
                    >
                      {selectedJob === job.id ? 'Hide Applicants' : 'View Applicants'}
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
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    {loadingApplicants && (
                      <p className="text-gray-400 text-sm">Loading applicants...</p>
                    )}
                    {!loadingApplicants && applicants.length === 0 && (
                      <p className="text-gray-400 text-sm">No applicants yet.</p>
                    )}
                    {!loadingApplicants && applicants.length > 0 && (
                      <div className="space-y-3">
                        {applicants.map((app) => (
                          <div key={app.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{app.seeker_name}</p>
                              <p className="text-xs text-gray-500">{app.seeker_email}</p>
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