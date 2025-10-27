import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function HeroSpline({ onGetStarted, onLoginSubmit }) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSubmit({ email });
    }, 800);
  };

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white pointer-events-none" />

      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">GenAI for Industry • Cement</span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              CemAI — Autonomous Optimization for Cement Plants
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Reduce energy, stabilize quality, and boost sustainability with a cross-process AI control layer.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={onGetStarted} className="px-5 py-3 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors">Launch Dashboard</button>
              <button onClick={() => setShowLogin(true)} className="px-5 py-3 rounded-md bg-white text-slate-900 font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Sign in</button>
            </div>
          </motion.div>
        </div>
      </div>

      {showLogin && (
        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Welcome back</h3>
              <button onClick={() => setShowLogin(false)} className="text-slate-500 hover:text-slate-900">Close</button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="you@plant.com" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Password</label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" />
              </div>
              <button disabled={loading} type="submit" className="w-full px-4 py-2 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-70">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <p className="mt-3 text-xs text-slate-500">SSO with Firebase/Google can be connected later.</p>
          </motion.div>
        </div>
      )}
    </section>
  );
}
