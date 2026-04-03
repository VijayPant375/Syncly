import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user, logout } = useAuth();
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800/60 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-xl font-black gradient-text">Syncly</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Your next great opportunity is one click away. Syncly bridges talented professionals with world-class companies.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="badge badge-primary">🚀 AI Powered</span>
              <span className="badge badge-green">✅ Free to Use</span>
              <span className="badge badge-purple">🔒 Secure</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/jobs" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                  Browse Jobs
                </Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link to="/register" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                      Create Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                      Sign In
                    </Link>
                  </li>
                </>
              )}
              {user?.role === 'seeker' && (
                <>
                  <li>
                    <Link to="/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                      My Applications
                    </Link>
                  </li>
                  <li>
                    <Link to="/ats-checker" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                      ATS Checker
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Employers</h3>
            <ul className="space-y-3">
              {!user || user?.role === 'employer' ? (
                <>
                  <li>
                    <Link to={user ? "/employer" : "/register"} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                      Post a Job
                    </Link>
                  </li>
                  <li>
                    <Link to={user ? "/employer" : "/login"} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                      Employer Dashboard
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button onClick={() => { logout(); window.location.href='/register'; }} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-left">
                    Create Employer Account
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Syncly. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Built with React, Node.js, PostgreSQL &amp; Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}