import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ResumeUpload() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your resume?')) return;
    try {
      await api.delete('/resume');
      setResume(null);
      setSuccess('Resume deleted.');
    } catch (err) {
      setError('Failed to delete resume.');
    }
  };

  if (loading) return null;

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">My Resume</h2>

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
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{resume.filename}</p>
            <p className="text-xs text-gray-400 mt-1">
              Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <label className="btn-secondary text-sm cursor-pointer">
              Replace
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="hidden" />
            </label>
            <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700 px-3 py-2">
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-sm mb-3">No resume uploaded yet</p>
          <label className="btn-primary text-sm cursor-pointer">
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