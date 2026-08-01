import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Car,
  Users,
  CalendarClock,
  BadgeCheck,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user, isAdmin } = useAuth();
  const { settings, followups, vehicles } = useData();
  const navigate = useNavigate();

  const pendingFollowupsCount = followups.filter(f => f.status === 'Pending').length;
  const availableVehiclesCount = vehicles.filter(v => v.status === 'Available').length;

  const menuItems = [
    ...(isAdmin ? [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : []),
    ...(isAdmin ? [{ label: 'Branches', path: '/branches', icon: Building }] : []),
    { label: 'Vehicles', path: '/vehicles', icon: Car, badge: availableVehiclesCount },
    { label: 'Bulk Upload', path: '/bulk-upload', icon: UploadCloud },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Follow Ups', path: '/followups', icon: CalendarClock, badge: pendingFollowupsCount, badgeColor: 'bg-sky-500 text-white' },
    { label: 'Sold Vehicles', path: '/sold-vehicles', icon: BadgeCheck },
    { label: 'Staff Directory', path: '/staff', icon: UserCheck },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden md:flex relative flex-col justify-between h-screen bg-white border-r border-sky-100 text-slate-700 z-30 select-none shadow-sm shrink-0"
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 p-1 rounded-full bg-sky-600 text-white border border-sky-200 shadow-md hover:bg-sky-500 transition-colors z-40"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Top Header Logo */}
      <div>
        <div className="flex items-center px-4 py-5 border-b border-sky-100 overflow-hidden bg-gradient-to-r from-sky-50 to-blue-50/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 overflow-hidden">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none truncate">
                {settings.name.split(' ')[0] || 'MotoMatrix'}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-600">
                {user?.branchName || 'Superbike Showroom'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 mt-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20 font-semibold'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="ml-3 truncate flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold ${item.badgeColor || 'bg-sky-100 text-sky-700 border border-sky-200'}`}>
                    {item.badge}
                  </span>
                )}
                {collapsed && (
                  <div className="absolute left-16 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info & Logout */}
      <div className="p-3 border-t border-sky-100 bg-sky-50/40">
        {!collapsed && user && (
          <div className="flex items-center p-2 mb-2 rounded-xl bg-white border border-sky-100 shadow-xs">
            <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-400" />
            <div className="ml-2.5 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-sky-600 font-medium">{user.role} • {user.branchName?.split(' ')[0] || 'HQ'}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className={`flex items-center w-full px-3 py-2.5 rounded-xl font-medium text-sm text-rose-600 hover:bg-rose-50 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="ml-3 font-semibold">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};
