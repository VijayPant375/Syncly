import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ROLES = [
  {
    value: 'seeker',
    label: 'Job Seeker',
    desc: 'Browse jobs, apply and track your applications.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
  },
  {
    value: 'employer',
    label: 'Employer',
    desc: 'Post jobs and manage applications from candidates.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    ),
  },
];

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'employer') navigate('/employer');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await register(form.name, form.email, form.password, form.role);
      if (u.role === 'employer') navigate('/employer');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-container flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-black">S</span>
            </div>
            <span className="text-2xl font-black gradient-text">Syncly</span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Join thousands of professionals on Syncly</p>
        </div>

        <div className="card p-8 shadow-xl shadow-gray-200/50 dark:shadow-black/20">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(({ value, label, desc, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, role: value })}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200
                      ${form.role === value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                  >
                    <div className={`mb-1.5 ${form.role === value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                      {icon}
                    </div>
                    <div className={`text-sm font-semibold ${form.role === value ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>{label}</div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                className="input-field" placeholder="John Doe" required autoComplete="name" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="you@example.com" required autoComplete="email" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} className="input-field pr-10" placeholder="Min 6 characters"
                  minLength={6} required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1 shadow-lg shadow-primary-500/25">
              {loading
                ? <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account...</span>
                : 'Create account'
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}