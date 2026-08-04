import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Sparkles, PhoneCall, BadgeCheck } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      
      {/* Left Branding Side Panel (Desktop only) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center space-x-2.5 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">MotoMatrix</span>
        </div>

        {/* Welcome Messages & Feature highlights */}
        <div className="space-y-8 relative z-10 my-auto">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight animate-fade-in">
              Manage motorcycle inventory & bookings in one place.
            </h1>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Secure enterprise dashboard for tracking live multi-branch showroom inventory, sales reports, and customer follow-up actions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-xs">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-sky-400 mt-0.5 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Real-Time Stock Control</h4>
                <p className="text-slate-400 mt-0.5">Live listings, vehicle data sheets, specs, and status banners.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-emerald-400 mt-0.5 shrink-0">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Mark as Sold & Invoicing</h4>
                <p className="text-slate-400 mt-0.5">Advance down-payments, financier configurations, and print-ready PDF invoices.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400 mt-0.5 shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">CRM Leads Followups</h4>
                <p className="text-slate-400 mt-0.5">Organize customer inquiries, test rides, and callback targets.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Brand Credit */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          <span>A Product of </span>
          <span className="text-slate-300 font-extrabold tracking-wider">SUNSERK</span>
        </div>
      </div>

      {/* Right Login Card Side */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-sky-50/50 via-white to-blue-50/30 relative">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 border border-sky-100/80 shadow-xl relative z-10 space-y-6"
        >
          {/* Mobile Brand Header */}
          <div className="text-center md:text-left">
            <div className="md:hidden w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/25 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Showroom Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Authenticate to access Multi-Branch Showroom Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Username / Staff ID
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-sky-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Quick Demo Credential Selectors */}
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 block">Quick Session Launch:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDemoCreds('admin', 'admin')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-100/50 text-sky-700 border border-sky-100 font-bold text-[10px] text-left transition-all shadow-xs"
                >
                  👑 Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCreds('priya', 'password123')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-100/50 text-indigo-700 border border-sky-100 font-bold text-[10px] text-left transition-all shadow-xs"
                >
                  💼 Priya (Sales Exec)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCreds('rajesh', 'password123')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-100/50 text-purple-700 border border-sky-100 font-bold text-[10px] text-left transition-all shadow-xs"
                >
                  👔 Rajesh (Manager)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCreds('sneha', 'password123')}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-100/50 text-emerald-700 border border-sky-100 font-bold text-[10px] text-left transition-all shadow-xs"
                >
                  💼 Sneha (Sales Exec)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-sky-500/20 active:scale-98"
            >
              <span>Sign In to Showroom</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mobile Footer Credit */}
          <div className="md:hidden text-center text-[10px] text-slate-400 font-medium">
            <span>A Product of </span>
            <span className="text-slate-600 font-extrabold tracking-wider">SUNSERK</span>
          </div>
        </motion.div>
      </div>

    </div>
  );
};
