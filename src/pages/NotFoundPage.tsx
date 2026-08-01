import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-3xl bg-rose-500/10 text-rose-500">
        <ShieldAlert className="w-16 h-16" />
      </div>

      <h1 className="text-4xl font-black text-white">404 - Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md">
        The showroom screen or vehicle record you are looking for does not exist or has been relocated.
      </p>

      <button
        onClick={() => navigate('/dashboard')}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center shadow-lg shadow-blue-500/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
      </button>
    </div>
  );
};
