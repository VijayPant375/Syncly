import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('API Key:', import.meta.env.VITE_GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY, {
  apiVersion: 'v1'
});

export default function ATSChecker() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      showToast('Please provide both a resume and job description.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume against the job description and provide:
1. An ATS compatibility score out of 100
2. A list of matching keywords found in both
3. A list of important missing keywords
4. 3-5 specific improvement suggestions

Resume:
${resumeText}

Job Description:
${jobDescription}

Respond in this exact JSON format with no extra text:
{
  "score": <number>,
  "matching_keywords": [<list of strings>],
  "missing_keywords": [<list of strings>],
  "suggestions": [<list of strings>]
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await res.json();
      const text = data.candidates[0].content.parts[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      showToast('Failed to analyze resume. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result?.score >= 75 ? 'text-green-500' :
    result?.score >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume ATS Checker</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Check how well your resume matches a job description using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Resume Input */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Your Resume</h2>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="input-field h-64 resize-none text-sm"
            />
          </div>

          {/* Job Description Input */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="input-field h-64 resize-none text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading}
          className="btn-primary w-full mb-8"
        >
          {loading ? 'Analyzing...' : '🔍 Analyze Resume'}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-6">

            {/* Score */}
            <div className="card p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">ATS Compatibility Score</p>
              <p className={`text-6xl font-bold ${scoreColor}`}>{result.score}</p>
              <p className="text-gray-400 text-sm mt-1">out of 100</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matching Keywords */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3">✅ Matching Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matching_keywords.map((kw, i) => (
                    <span key={i} className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">❌ Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((kw, i) => (
                    <span key={i} className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">💡 Improvement Suggestions</h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                    <span className="text-primary-500 font-bold shrink-0">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}