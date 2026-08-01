import React from 'react';
import { useData } from '../context/DataContext';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

export const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { customers, followups } = useData();
  const navigate = useNavigate();

  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
        Customer profile not found.
      </div>
    );
  }

  const customerFollowups = followups.filter(f => f.customerId === customer.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Customer CRM
      </button>

      {/* Main Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
              VIP Customer Profile
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{customer.name}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {customer.address}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Customer Budget</span>
            <h2 className="text-3xl font-black text-emerald-700 dark:text-emerald-400">₹{(customer.budget / 100000).toFixed(1)} Lakh</h2>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-sky-100 dark:border-slate-800 text-xs">
          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700">
            <Phone className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Phone / WhatsApp</span>
              <span className="font-bold text-slate-900 dark:text-white">{customer.phone}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700">
            <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Email</span>
              <span className="font-bold text-slate-900 dark:text-white">{customer.email}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">First Showroom Visit</span>
              <span className="font-bold text-slate-900 dark:text-white">{customer.visitDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Follow-Up Engagement History ({customerFollowups.length})</h3>

        {customerFollowups.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">No follow-up history logged yet.</p>
        ) : (
          <div className="space-y-3">
            {customerFollowups.map(f => (
              <div key={f.id} className="flex items-start space-x-3 p-3.5 rounded-xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700">
                <div className="p-2 rounded-xl bg-sky-100 dark:bg-slate-700 text-sky-700 dark:text-sky-300 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{f.vehicleName}</h5>
                    <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">{f.followupDate} @ {f.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{f.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
