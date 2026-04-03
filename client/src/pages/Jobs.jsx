import { useState, useEffect } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import ErrorMessage from '../components/ErrorMessage';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [location, setLocation] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [type, setType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [remote, setRemote] = useState(false);

  const [savedJobIds, setSavedJobIds] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedLocation(location);
    }, 400);
    return () => clearTimeout(handler);
  }, [search, location]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (debouncedLocation) params.location = debouncedLocation;
      if (type) params.type = type;
      if (minSalary) params.min_salary = minSalary;
      if (maxSalary) params.max_salary = maxSalary;
      if (remote) params.remote = 'true';

      const [jobsRes, savedRes] = await Promise.all([
        api.get('/jobs', { params }),
        user?.role === 'seeker' ? api.get('/jobs/saved/list') : Promise.resolve({ data: { jobs: [] } })
      ]);

      setJobs(jobsRes.data.jobs);
      setSavedJobIds(savedRes.data.jobs.map(j => j.id));
    } catch {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [user, debouncedSearch, debouncedLocation, type, minSalary, maxSalary, remote]);

  const handleClear = () => {
    setSearch(''); setLocation(''); setType('');
    setMinSalary(''); setMaxSalary(''); setRemote(false);
  };

  const hasFilters = search || location || type || minSalary || maxSalary || remote;

  return (
    <div className="page-container">

      {/* ── Search/Filter header ── */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800/60 sticky top-16 z-40">
        <div className="content-wrapper py-5">
          <div className="flex flex-col gap-4">
            {/* Search row */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  placeholder="Job title or keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-field pl-9"
                />
              </div>

              <div className="relative flex-1 min-w-[180px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <input
                  type="text"
                  placeholder="Location..."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="input-field pl-9"
                  disabled={remote}
                />
              </div>

              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="input-field w-auto min-w-[140px]"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Second row */}
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    placeholder="Min salary"
                    value={minSalary}
                    onChange={e => setMinSalary(e.target.value)}
                    className="input-field pl-6 w-32"
                  />
                </div>
                <span className="text-gray-300 dark:text-gray-600 font-medium">—</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    placeholder="Max salary"
                    value={maxSalary}
                    onChange={e => setMaxSalary(e.target.value)}
                    className="input-field pl-6 w-32"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer group ml-1">
                  <div
                    onClick={() => setRemote(!remote)}
                    className={`w-9 h-5 rounded-full transition-all duration-200 relative cursor-pointer
                      ${remote ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                      ${remote ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Remote only</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                {!loading && !error && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
                  </span>
                )}
                {hasFilters && (
                  <button
                    onClick={handleClear}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="content-wrapper py-8">
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && <ErrorMessage message={error} onRetry={fetchJobs} />}

        {!loading && !error && jobs.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No jobs found"
            message="Try adjusting your search filters or check back later for new opportunities."
            action={{ onClick: handleClear, label: 'Clear Filters' }}
          />
        )}

        {!loading && !error && jobs.length > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.div className="space-y-4">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} saved={savedJobIds.includes(job.id)} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}