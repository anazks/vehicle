import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Car,
  Users,
  CalendarClock,
  BadgeCheck,
  Settings,
  LayoutDashboard
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { isAdmin } = useAuth();
  const { followups, vehicles } = useData();

  const pendingFollowupsCount = followups.filter(f => f.status === 'Pending').length;
  const availableVehiclesCount = vehicles.filter(v => v.status === 'Available').length;

  const tabs = [
    ...(isAdmin ? [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : []),
    { label: 'Vehicles', path: '/vehicles', icon: Car, badge: availableVehiclesCount },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Followups', path: '/followups', icon: CalendarClock, badge: pendingFollowupsCount },
    { label: 'Sold', path: '/sold-vehicles', icon: BadgeCheck },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sky-100 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <NavLink
              key={t.path}
              to={t.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                  isActive
                    ? 'text-sky-600 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {t.badge !== undefined && t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-extrabold shadow">
                    {t.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 font-semibold">{t.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
