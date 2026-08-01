import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      if (username.toLowerCase() === 'admin') {
        toast.success('Welcome back, Administrator!');
        navigate('/dashboard');
      } else {
        toast.success(`Welcome back, ${username}! (Staff Portal Access)`);
        navigate('/vehicles');
      }
    } else {
      toast.error('Invalid Credentials! Check your Staff Username and Password.');
    }
  };

  const setDemoCreds = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Light Blue Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-sky-100 shadow-xl relative z-10 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-sky-500/25 mb-4">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">MotoMatrix Showroom Portal</h2>
          <p className="text-xs text-slate-500 mt-1">Multi-Branch Bike & Superbike Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Username / Staff ID
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-sky-500" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username (e.g. admin, priya, rajesh)"
                className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-sky-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Demo Credential Selectors */}
          <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">Click Quick Demo Credentials:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoCreds('admin', 'admin')}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-[11px] text-left transition-colors shadow-xs"
              >
                👑 Admin (`admin`/`admin`)
              </button>
              <button
                type="button"
                onClick={() => setDemoCreds('priya', 'password123')}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-100 text-indigo-700 border border-sky-200 font-bold text-[11px] text-left transition-colors shadow-xs"
              >
                💼 Priya (Sales Exec)
              </button>
              <button
                type="button"
                onClick={() => setDemoCreds('rajesh', 'password123')}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-100 text-purple-700 border border-sky-200 font-bold text-[11px] text-left transition-colors shadow-xs"
              >
                👔 Rajesh (Manager)
              </button>
              <button
                type="button"
                onClick={() => setDemoCreds('sneha', 'password123')}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-100 text-emerald-700 border border-sky-200 font-bold text-[11px] text-left transition-colors shadow-xs"
              >
                💼 Sneha (Sales Exec)
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-sky-500/20 active:scale-98"
          >
            <span>Sign In to Showroom</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
