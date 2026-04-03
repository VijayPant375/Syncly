import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function ATSChecker() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  
  const [resumeType, setResumeType] = useState('profile');
  const [resumeFile, setResumeFile] = useState(null);
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data.jobs);
        if (res.data.jobs.length > 0) {
          setSelectedJobId(res.data.jobs[0].id);
        }
      } catch (err) {
        showToast('Failed to load jobs for selection.', 'error');
      }
    };
    fetchJobs();
  }, [showToast]);

  const handleCheck = async () => {
    if (!selectedJobId) {
      showToast('Please select a job from the list.', 'error');
      return;
    }

    if (resumeType === 'upload' && !resumeFile) {
      showToast('Please upload a resume PDF to check against.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('jobId', selectedJobId);
      if (resumeType === 'upload' && resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await api.post('/resume/analyze-ats', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(res.data);
      showToast('Analysis complete!', 'success');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        showToast(err.response?.data?.error || 'Missing file or job.', 'error');
      } else if (err.response?.status === 400) {
        showToast(err.response?.data?.error || 'Invalid file type.', 'error');
      } else {
        showToast(err.response?.data?.error || 'Failed to analyze resume. Server error.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result?.score >= 75 ? 'text-green-500' :
    result?.score >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Native PDF ATS Checker</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Check how well your PDF resume matches real job descriptions using Google Gemini AI. No text copying required!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Job Selection Input */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Target Job</h2>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="input-field w-full h-11"
            >
              <option value="" disabled>Select a job...</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} at {job.company}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Select a real job opening from the database to evaluate your compatibility.
            </p>
          </div>

          {/* Resume Input Mode Selection */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Your Resume</h2>
            
            <div className="flex gap-4 mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="resumeType" 
                  value="profile" 
                  checked={resumeType === 'profile'} 
                  onChange={() => setResumeType('profile')}
                  className="text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                />
                Use Profile Resume
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="resumeType" 
                  value="upload" 
                  checked={resumeType === 'upload'} 
                  onChange={() => setResumeType('upload')}
                  className="text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                />
                Upload New (PDF)
              </label>
            </div>

            {resumeType === 'upload' && (
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-800 dark:file:text-gray-300 cursor-pointer"
              />
            )}
            {resumeType === 'profile' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                We will natively scan the existing resume file uploaded in your Seeker Profile.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || !selectedJobId}
          className="btn-primary w-full mb-8 py-3 font-semibold"
        >
          {loading ? 'Analyzing directly from PDF...' : '🔍 Analyze Resume vs Job'}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-6">

            {/* Score */}
            <div className="card p-6 text-center shadow-md">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ATS Compatibility Score</p>
              <p className={`text-7xl font-extrabold tracking-tight ${scoreColor}`}>{result.score}</p>
              <p className="text-gray-400 text-sm mt-2 font-medium">out of 100</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matching Keywords */}
              <div className="card p-6 shadow-sm">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                  <span>✅</span> Matching Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matching_keywords.map((kw, i) => (
                    <span key={i} className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                  {result.matching_keywords.length === 0 && (
                    <span className="text-sm text-gray-400 italic">No matching keywords found.</span>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="card p-6 shadow-sm">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                  <span>❌</span> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((kw, i) => (
                    <span key={i} className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium px-2.5 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                  {result.missing_keywords.length === 0 && (
                    <span className="text-sm text-gray-400 italic">No missing keywords!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="card p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>💡</span> Improvement Suggestions
              </h3>
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <span className="text-primary-500 font-extrabold shrink-0">{i + 1}.</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}