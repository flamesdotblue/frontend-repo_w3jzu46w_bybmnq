import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSpline from './components/HeroSpline';
import Dashboard from './components/Dashboard';
import ChatAssistant from './components/ChatAssistant';

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    // This is a client-side mock. Hook up Firebase Auth later.
    setIsAuthed(true);
  };

  const handleLogout = () => {
    setIsAuthed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 text-slate-900">
      <Navbar
        isAuthed={isAuthed}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLoginClick={handleLogin}
        onLogout={handleLogout}
      />

      {!isAuthed ? (
        <HeroSpline onGetStarted={handleLogin} onLoginSubmit={handleLogin} />
      ) : (
        <>
          <div className="px-4 sm:px-6 lg:px-8 pt-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-bold tracking-tight">{currentPage === 'dashboard' ? 'Main Dashboard' : currentPage === 'admin' ? 'Admin Dashboard' : 'Reports'}</h2>
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <span className={`px-3 py-1 rounded-full border ${currentPage==='dashboard' ? 'bg-white' : 'bg-transparent'} cursor-pointer`} onClick={()=>setCurrentPage('dashboard')}>Dashboard</span>
                  <span className={`px-3 py-1 rounded-full border ${currentPage==='admin' ? 'bg-white' : 'bg-transparent'} cursor-pointer`} onClick={()=>setCurrentPage('admin')}>Admin</span>
                  <span className={`px-3 py-1 rounded-full border ${currentPage==='reports' ? 'bg-white' : 'bg-transparent'} cursor-pointer`} onClick={()=>setCurrentPage('reports')}>Reports</span>
                </div>
              </div>
            </div>
          </div>
          <Dashboard currentPage={currentPage} />
          <ChatAssistant />
        </>
      )}

      <footer className="py-8 text-center text-sm text-slate-500">
        Built with a clean tech-inspired design. Connect Google Cloud, Firebase, BigQuery, and Gemini in the backend next.
      </footer>
    </div>
  );
}

export default App;
