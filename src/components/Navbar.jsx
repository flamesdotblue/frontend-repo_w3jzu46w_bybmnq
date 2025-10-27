import React from 'react';
import { Factory, LayoutDashboard, Shield, FileText, LogIn, LogOut } from 'lucide-react';

export default function Navbar({ isAuthed, currentPage, onNavigate, onLoginClick, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-900 font-semibold leading-tight">CemAI</div>
            <div className="text-[11px] text-slate-500 leading-tight">Optimizing Cement Operations</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
              currentPage === 'dashboard' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
              currentPage === 'admin' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
              currentPage === 'reports' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Reports
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthed ? (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
