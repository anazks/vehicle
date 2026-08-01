import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color = 'from-sky-500 to-blue-600',
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden group shadow-xs ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Background Subtle Ambient Glow */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-tr ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">{value}</h3>

          {change && (
            <div className="flex items-center mt-2 text-xs font-medium">
              {isPositive ? (
                <span className="flex items-center text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> {change}
                </span>
              ) : (
                <span className="flex items-center text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                  <TrendingDown className="w-3.5 h-3.5 mr-1" /> {change}
                </span>
              )}
              <span className="text-slate-500 dark:text-slate-400 ml-2 text-[11px]">vs last month</span>
            </div>
          )}
        </div>

        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${color} flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
