import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { logout } = useAuth();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="text-2xl font-bold text-primary-600 mb-3">Syncly</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Your next opportunity is one click away. Syncly bridges the gap between talented professionals and the companies that need them.
            </p>
            <div className="flex gap-3 mt-4">
              <span className="text-xs bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">🚀 11+ Jobs</span>
              <span className="text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">✅ Free to Use</span>
              <span className="text-xs bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">🤖 AI Powered</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/jobs" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-2">
                  🔍 Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={logout} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-2">
                  ✨ Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={logout} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-2">
                  🔐 Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Employers</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/register" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-2">
                  📝 Post a Job
                </Link>
              </li>
              <li>
                <Link to="/employer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-2">
                  📊 Employer Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Syncly. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Built with ❤️ using React, Node.js, PostgreSQL & Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}