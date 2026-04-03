import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-lg
        ${isActive(to)
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
          : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-gray-800/60
                    bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 
                          flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-xl font-black gradient-text">
            Syncly
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLink('/jobs', 'Browse Jobs')}

          {user?.role === 'seeker' && (
            <>
              {navLink('/dashboard', 'My Applications')}
              {navLink('/ats-checker', 'ATS Checker')}
            </>
          )}
          {user?.role === 'employer' && navLink('/employer', 'Dashboard')}
          {user?.role === 'admin' && navLink('/admin', 'Admin')}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode
              ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/></svg>
              : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            }
          </button>

          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
              <Link to="/register" className="btn-primary text-sm">Get Started</Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl 
                           hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 
                                flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                Logout
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-1">
          {navLink('/jobs', 'Browse Jobs')}
          {user?.role === 'seeker' && (
            <>
              {navLink('/dashboard', 'My Applications')}
              {navLink('/ats-checker', 'ATS Checker')}
            </>
          )}
          {user?.role === 'employer' && navLink('/employer', 'Dashboard')}
          {user?.role === 'admin' && navLink('/admin', 'Admin')}
          {!user ? (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost flex-1 text-center text-sm">Sign in</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm">Get Started</Link>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}