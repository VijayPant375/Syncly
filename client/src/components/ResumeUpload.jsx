import { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingButton from './LoadingButton';

export default function ResumeUpload({ onUploadSuccess } = {}) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchResume = async () => {
    try {
      const res = await api.get('/resume');
      setResume(res.data.resume);
    } catch (err) {
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Resume uploaded successfully.');
      fetchResume();
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your resume?')) return;
    setDeleting(true);
    try {
      await api.delete('/resume');
      setResume(null);
      setSuccess('Resume deleted.');
    } catch (err) {
      setError('Failed to delete resume.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Resume</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
          {success}
        </div>
      )}

      {resume ? (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{resume.filename}</p>
            <p className="text-xs text-gray-400 mt-1">
              Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <label className={`btn-secondary text-sm cursor-pointer inline-flex items-center justify-center gap-2 ${uploading ? 'opacity-80 pointer-events-none' : ''}`}>
              {uploading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              )}
              Replace
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} className="hidden" />
            </label>
            <LoadingButton
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-700 px-3 py-2"
              isLoading={deleting}
              loadingText="Deleting..."
            >
              Delete
            </LoadingButton>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-sm mb-3">No resume uploaded yet</p>
          <label className={`btn-primary text-sm cursor-pointer inline-flex items-center justify-center gap-2 ${uploading ? 'opacity-80 pointer-events-none' : ''}`}>
            {uploading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {uploading ? 'Uploading...' : 'Upload Resume'}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-2">PDF, DOC or DOCX — max 5MB</p>
        </div>
      )}
    </div>
  );
}
