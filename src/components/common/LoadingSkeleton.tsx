import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'stats';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 3 }) => {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 shimmer border border-slate-200/20 dark:border-slate-800">
          {type === 'stats' ? (
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-300 dark:bg-slate-800 rounded" />
                <div className="h-8 w-16 bg-slate-300 dark:bg-slate-800 rounded" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-300 dark:bg-slate-800" />
            </div>
          ) : type === 'table' ? (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-slate-300 dark:bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-slate-300 dark:bg-slate-800 rounded" />
                <div className="h-3 w-1/4 bg-slate-300 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-6 w-20 bg-slate-300 dark:bg-slate-800 rounded" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-44 w-full bg-slate-300 dark:bg-slate-800 rounded-xl" />
              <div className="h-5 w-3/4 bg-slate-300 dark:bg-slate-800 rounded" />
              <div className="h-4 w-1/2 bg-slate-300 dark:bg-slate-800 rounded" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
