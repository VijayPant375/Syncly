import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="text-xl font-bold text-primary-600 mb-2">Syncly</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connecting job seekers and employers on a fast, modern platform.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* For employers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/employer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  Employer Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Syncly. Built with React, Node.js and PostgreSQL.
          </p>
        </div>
      </div>
    </footer>
  );
}