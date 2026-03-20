import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)   params.search   = search;
      if (location) params.location = location;
      if (type)     params.type     = type;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.jobs);
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClear = () => {
    setSearch('');
    setLocation('');
    setType('');
    setTimeout(fetchJobs, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Search bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Browse Jobs</h1>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Job title or keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field max-w-xs"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field max-w-xs"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="">All types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            <button type="submit" className="btn-primary">
              Search
            </button>
            <button type="button" onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <p className="text-gray-400 text-center py-12">Loading jobs...</p>
        )}

        {error && (
          <p className="text-red-500 text-center py-12">{error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-gray-400 text-center py-12">No jobs found.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="card p-6 block hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-2">
                        {job.company} · {job.location}
                      </p>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
                        {job.type}
                      </span>
                      {job.salary && (
                        <p className="text-sm text-gray-500 mt-2">{job.salary}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}