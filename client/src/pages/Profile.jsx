import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bio: '',
    skills: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.profile) {
          setForm({
            bio: res.data.profile.bio || '',
            skills: res.data.profile.skills || '',
            linkedin: res.data.profile.linkedin || '',
            github: res.data.profile.github || '',
            portfolio: res.data.profile.portfolio || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profile', form);
      showToast('Profile saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="card p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xl font-bold">{initials}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Details</h2>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell employers about yourself..."
              className="input-field h-28 resize-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills</label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, PostgreSQL, Figma"
              className="input-field"
            />
            <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourname"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub</label>
            <input
              type="text"
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/yourname"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portfolio</label>
            <input
              type="text"
              name="portfolio"
              value={form.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              className="input-field"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Skills Preview */}
        {form.skills && (
          <div className="card p-6 mt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {form.skills.split(',').map((skill, i) => (
                <span key={i} className="bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-3 py-1 rounded-full">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}