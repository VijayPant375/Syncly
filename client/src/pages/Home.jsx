import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    ),
    title: 'Smart Job Search',
    desc: 'Filter by role, location, salary, and remote options. Find exactly what you\'re looking for.',
    color: 'from-blue-500 to-primary-600',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: 'AI ATS Checker',
    desc: 'Upload your PDF resume and instantly check how well it matches against real job descriptions.',
    color: 'from-violet-500 to-accent-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: 'Apply in Seconds',
    desc: 'One-click applications with cover letters. Track all your applications in one place.',
    color: 'from-emerald-500 to-teal-500',
  },
];

const steps = [
  { n: '01', title: 'Create Account', desc: 'Sign up as a job seeker or employer in under a minute.' },
  { n: '02', title: 'Build Your Profile', desc: 'Upload your resume, add your skills and portfolio links.' },
  { n: '03', title: 'Discover & Apply', desc: 'Browse curated jobs and apply with a personalized cover letter.' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page-container">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient blob background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-primary-600/15 rounded-full blur-3xl" />
        </div>

        <div className="content-wrapper py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold
                             bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300
                             border border-primary-200 dark:border-primary-800 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              AI-Powered Job Platform
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find your next{' '}
            <span className="gradient-text">great opportunity</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Syncly connects talented professionals with world-class employers.
            Use AI to optimize your resume and land your dream job faster.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {(!user || user?.role === 'seeker') && (
              <Link to="/jobs" className="btn-primary text-base px-8 py-3 shadow-lg shadow-primary-500/25">
                Browse Jobs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            )}
            {user?.role === 'employer' && (
              <Link to="/employer" className="btn-primary text-base px-8 py-3 shadow-lg shadow-primary-500/25">
                Go to Dashboard
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            )}
            {!user && (
              <Link to="/register" className="btn-secondary text-base px-8 py-3">
                Create Free Account
              </Link>
            )}
          </motion.div>
        </div>
      </section>


      {/* ── Features ─────────────────────────────────── */}
      <section className="content-wrapper py-20">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
            Everything you need to succeed
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Powerful tools built for modern job seekers and employers alike.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map(({ icon, title, desc, color }) => (
            <motion.div key={title} variants={item} className="card p-8 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How it works ─────────────────────────────── */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-800 dark:from-primary-900 dark:to-gray-950">
        <div className="content-wrapper py-20">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">How Syncly works</h2>
            <p className="text-primary-200 max-w-xl mx-auto">
              Three simple steps to land your next role.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {steps.map(({ n, title, desc }) => (
              <motion.div key={n} variants={item} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur
                                flex items-center justify-center mx-auto mb-5">
                  <span className="text-white font-black text-lg">{n}</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-primary-200 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {!user && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3 rounded-xl
                           hover:bg-primary-50 active:scale-95 transition-all duration-200 shadow-xl"
              >
                Get started for free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
}