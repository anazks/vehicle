import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Save, RotateCcw, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useData();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    name: settings.name,
    logo: settings.logo,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    currency: settings.currency
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to restore factory sample bike data? This will reset your LocalStorage modifications.')) {
      resetAllData();
      toast.success('Factory motorcycle dataset restored!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <Settings className="w-7 h-7 mr-2.5 text-sky-600 dark:text-sky-400" /> Showroom System Settings
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Configure showroom branding, contact details, currency, and LocalStorage data reset.</p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Showroom Title / Brand Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full glass-input rounded-xl p-3 font-bold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Showroom Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-sky-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleResetData}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center border border-rose-200 dark:border-rose-800 transition-colors shadow-xs"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" /> Restore Factory Sample Data
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-sky-500/20"
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Showroom Settings
            </button>
          </div>
        </form>
      </div>

      {/* Logout Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-sky-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Active Session</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Logout from current showroom representative account safely.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            toast.success('Successfully logged out!');
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center border border-rose-200 dark:border-rose-800 transition-colors shadow-xs"
        >
          <LogOut className="w-4 h-4 mr-1.5" /> Log Out
        </button>
      </div>
    </div>
  );
};
