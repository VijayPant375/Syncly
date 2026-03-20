import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary-600">
          Syncly
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link
            to="/jobs"
            className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
          >
            Browse Jobs
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          ) : (
            <>
              {user.role === 'seeker' && (
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  My Applications
                </Link>
              )}
              {user.role === 'employer' && (
                <Link to="/employer" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Hi, {user.name}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}