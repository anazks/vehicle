import React from 'react';
import { ActivityLog } from '../../types';
import { PlusCircle, BadgeCheck, UserPlus, CalendarCheck, Clock, Building, UserCheck } from 'lucide-react';

interface RecentActivityFeedProps {
  activities: ActivityLog[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'vehicle_add':
        return <PlusCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'vehicle_sold':
        return <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'customer_add':
        return <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'followup_scheduled':
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'followup_completed':
        return <CalendarCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'branch_created':
        return <Building className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'staff_assigned':
        return <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Latest Showroom Activities</h4>
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No activity logged yet.</p>
        ) : (
          activities.slice(0, 8).map(act => (
            <div key={act.id} className="flex items-start space-x-3 p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="p-2 rounded-xl bg-sky-100/60 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 shrink-0 mt-0.5">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{act.title}</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{act.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
