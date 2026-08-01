import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Heart,
  Bell,
  Clock
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { favorites, followups } = useData();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingFollowups = followups.filter(f => f.status === 'Pending').slice(0, 5);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-sky-100 px-4 md:px-6 py-3 flex items-center justify-between shadow-xs">
        {/* Left Global Search Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm glass-input text-slate-500 hover:text-sky-700 hover:border-sky-300 transition-all w-48 sm:w-64 md:w-80 group"
          >
            <Search className="w-4 h-4 mr-2 text-sky-500 group-hover:text-sky-600 transition-colors shrink-0" />
            <span className="truncate">Search bikes, clients...</span>
            <kbd className="ml-auto hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-sky-700 bg-sky-100 rounded border border-sky-200">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Add Bike Button */}
          <button
            onClick={() => navigate('/add-vehicle')}
            className="flex items-center px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-md shadow-sky-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Add Bike</span>
          </button>

          {/* Favorites Bookmark */}
          <button
            onClick={() => navigate('/vehicles?favorite=true')}
            className="relative p-2.5 rounded-xl glass-input text-slate-600 hover:text-rose-500 transition-colors"
            title="Favorite Motorcycles"
          >
            <Heart className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl glass-input text-slate-600 hover:text-sky-600 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingFollowups.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow">
                  {pendingFollowups.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl p-4 z-50 border border-sky-100 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Followups</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                    {pendingFollowups.length} Due
                  </span>
                </div>
                <div className="divide-y divide-sky-100 max-h-64 overflow-y-auto">
                  {pendingFollowups.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No pending followups!</p>
                  ) : (
                    pendingFollowups.map(f => (
                      <div
                        key={f.id}
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/followups');
                        }}
                        className="py-2.5 cursor-pointer hover:bg-sky-50 px-1 rounded-lg transition-colors flex items-start space-x-2.5"
                      >
                        <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{f.customerName}</p>
                          <p className="text-[11px] text-slate-600">{f.vehicleName}</p>
                          <span className="text-[10px] text-sky-600 font-semibold">{f.followupDate} @ {f.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          {user && (
            <div className="flex items-center pl-1">
              <img
                src={user.photo}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-sky-400 shadow-xs"
              />
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
