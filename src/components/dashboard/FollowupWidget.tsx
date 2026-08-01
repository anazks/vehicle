import React, { useState } from 'react';
import { Followup } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, CheckCircle, ArrowRight } from 'lucide-react';

interface FollowupWidgetProps {
  followups: Followup[];
  onComplete: (id: string) => void;
}

export const FollowupWidget: React.FC<FollowupWidgetProps> = ({ followups, onComplete }) => {
  const [tab, setTab] = useState<'today' | 'upcoming' | 'overdue'>('today');
  const navigate = useNavigate();

  const todayStr = '2026-08-01';

  const todayFollowups = followups.filter(f => f.followupDate === todayStr && f.status === 'Pending');
  const upcomingFollowups = followups.filter(f => f.followupDate > todayStr && f.status === 'Pending').slice(0, 5);
  const overdueFollowups = followups.filter(f => f.followupDate < todayStr && f.status === 'Pending').slice(0, 5);

  const activeList = tab === 'today' ? todayFollowups : tab === 'upcoming' ? upcomingFollowups : overdueFollowups;

  return (
    <div className="glass-card rounded-2xl p-5 border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header Tabs */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-slate-800">
          <div className="flex space-x-2">
            <button
              onClick={() => setTab('today')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                tab === 'today' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-white'
              }`}
            >
              Today ({todayFollowups.length})
            </button>
            <button
              onClick={() => setTab('upcoming')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                tab === 'upcoming' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-white'
              }`}
            >
              Upcoming ({upcomingFollowups.length})
            </button>
            <button
              onClick={() => setTab('overdue')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                tab === 'overdue' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400'
              }`}
            >
              Overdue ({overdueFollowups.length})
            </button>
          </div>

          <button
            onClick={() => navigate('/followups')}
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center font-semibold"
          >
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* List Body */}
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
          {activeList.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">No {tab} follow-ups pending.</p>
          ) : (
            activeList.map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 hover:border-sky-300 dark:hover:border-slate-600 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-sky-100 dark:bg-slate-700 text-sky-600 dark:text-sky-400">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{f.customerName}</h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{f.vehicleName} • <span className="text-sky-700 dark:text-sky-400 font-semibold">{f.time}</span></p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <StatusBadge status={f.priority} type="priority" />
                  <button
                    onClick={() => onComplete(f.id)}
                    className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
                    title="Mark Completed"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
