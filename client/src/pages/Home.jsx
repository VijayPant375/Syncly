import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Find your next <span className="text-primary-600">opportunity</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Syncly connects talented job seekers with great employers.
            Search thousands of jobs and apply in seconds.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/jobs" className="btn-primary text-base px-6 py-3">
              Browse Jobs
            </Link>
            {!user && (
              <Link to="/register" className="btn-secondary text-base px-6 py-3">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="card p-8">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-500 dark:text-gray-400">Jobs Available</div>
          </div>
          <div className="card p-8">
            <div className="text-4xl font-bold text-primary-600 mb-2">200+</div>
            <div className="text-gray-500 dark:text-gray-400">Companies Hiring</div>
          </div>
          <div className="card p-8">
            <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
            <div className="text-gray-500 dark:text-gray-400">Job Seekers</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create an account</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sign up as a job seeker or employer in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Search jobs</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Filter by title, location, and job type to find the perfect match.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Apply instantly</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Apply with a cover letter and track your application status.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}