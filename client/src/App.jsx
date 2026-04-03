import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import ATSChecker from './pages/ATSChecker';
import Profile from './pages/Profile';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white font-black">S</span>
          </div>
          <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        <Route path="/dashboard" element={
          <ProtectedRoute roles={['seeker']}>
            <SeekerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/ats-checker" element={
          <ProtectedRoute roles={['seeker']}>
            <ATSChecker />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute roles={['seeker', 'employer']}>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/employer" element={
          <ProtectedRoute roles={['employer']}>
            <EmployerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}