import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        setError('Job not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);
  
  const [hasResume, setHasResume] = useState(false);

useEffect(() => {
  if (user?.role === 'seeker') {
    api.get('/resume')
      .then(res => setHasResume(!!res.data))
      .catch(() => setHasResume(false));
  }
}, [user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');

    try {
      await api.post('/applications', {
        job_id: parseInt(id),
        cover_letter: coverLetter,
      });
      setApplySuccess(true);
      setShowModal(false);
    } catch (err) {
      setApplyError(err.response?.data?.error || 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={() => navigate('/jobs')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 mb-6 flex items-center gap-1"
        >
          ← Back to jobs
        </button>

        {/* Job card */}
        <div className="card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{job.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{job.company} · {job.location}</p>
            </div>
            <span className="bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
              {job.type}
            </span>
          </div>

          {job.salary && (
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Salary: </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{job.salary}</span>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Job Description</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
              >
                Login to Apply
              </button>
            )}

            {user?.role === 'seeker' && !applySuccess && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (!hasResume) {
                      showToast('Please upload a resume before applying.', 'error');
                      return;
                    }
                    setShowModal(true);
                  }}
                  className="btn-primary"
                >
                  Apply Now
                </button>
                {!hasResume && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    You need to upload a resume before applying.{' '}
                    <a href="/dashboard" className="underline">Go to dashboard</a>
                  </p>
                )}
              </div>
            )}

            {applySuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                ✓ Application submitted successfully!
              </div>
            )}

            {user?.role === 'employer' && (
              <p className="text-sm text-gray-400">Employers cannot apply to jobs.</p>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="card p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Apply for {job.title}
            </h2>

            {applyError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {applyError}
              </div>
            )}

            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cover Letter <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="input-field h-36 resize-none"
                  placeholder="Tell the employer why you're a great fit..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={applying}
                  className="btn-primary flex-1"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}