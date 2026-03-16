import { BrowserRouter, Routes, Route } from 'react-router-dom';

function ComingSoon({ page }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl font-bold text-primary-600 mb-2">Syncly</div>
        <p className="text-gray-500 mt-2">{page} — coming soon</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<ComingSoon page="Home" />} />
        <Route path="*"  element={<ComingSoon page="404"  />} />
      </Routes>
    </BrowserRouter>
  );
}