import { useState, useEffect } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import ErrorMessage from '../components/ErrorMessage';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

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
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user, debouncedSearch, debouncedLocation, type, minSalary, maxSalary, remote]);

  const handleClear = () => {
    setSearch('');
    setLocation('');
    setType('');
    setMinSalary('');
    setMaxSalary('');
    setRemote(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Search bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Browse Jobs</h1>
          <form className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <input
                type="text"
                placeholder="Job title or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field flex-1 min-w-[200px]"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field flex-1 min-w-[200px]"
                disabled={remote}
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <input 
                  type="number"
                  placeholder="Min Salary"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="input-field w-32"
                />
                <span className="text-gray-400 hidden sm:inline">-</span>
                <input 
                  type="number"
                  placeholder="Max Salary"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="input-field w-32"
                />
                
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 text-sm sm:ml-4">
                  <input 
                    type="checkbox"
                    checked={remote}
                    onChange={(e) => setRemote(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
                  />
                  Remote Only
                </label>
              </div>
              
              <button type="button" onClick={handleClear} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition cursor-pointer font-medium">
                Clear Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && <ErrorMessage message={error} onRetry={fetchJobs} />}

        {!loading && !error && jobs.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No jobs found"
            message="Try adjusting your search filters or check back later for new opportunities."
            action={{ href: '/jobs', label: 'Clear Search' }}
          />
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
            </p>
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} saved={savedJobIds.includes(job.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}