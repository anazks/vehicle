import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Bike, LogIn, PhoneCall, ShieldCheck } from 'lucide-react';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useData();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Public Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between shadow-lg">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              {settings.name || 'AutoMatrix Mobility'}
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Verified
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Premium Pre-Owned & Certified Motorcycles
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center space-x-3">
          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="hidden sm:flex items-center px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-bold transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
              <span>{settings.phone}</span>
            </a>
          )}

          <button
            onClick={() => navigate('/login')}
            className="flex items-center px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            <span>Staff Login</span>
          </button>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-950 border-t border-slate-850 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sky-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Digital Showroom Specification Sheet</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            All vehicle listings and specifications are verified by {settings.name || 'AutoMatrix Mobility'}.
            Prices and availability subject to change. Contact showroom for instant test-ride booking.
          </p>
          <div className="pt-2 text-[10px] text-slate-400">
            © {new Date().getFullYear()} {settings.name || 'AutoMatrix'}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
