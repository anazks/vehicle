import React from 'react';
import { useData } from '../context/DataContext';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, CheckCircle, Download } from 'lucide-react';
import { pdfService } from '../services/pdfService';
import toast from 'react-hot-toast';

export const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { customers, followups, soldVehicles, settings } = useData();
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
  const purchasedVehicles = soldVehicles.filter(s => s.customerId === customer.id);

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

      {/* Purchased Vehicles Section */}
      {purchasedVehicles.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
            <CheckCircle className="w-4.5 h-4.5 mr-2 text-emerald-600" /> Purchased Vehicles & Invoice Records ({purchasedVehicles.length})
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {purchasedVehicles.map(sv => (
              <div key={sv.id} className="p-5 rounded-2xl bg-emerald-50/20 dark:bg-slate-850/40 border border-emerald-100/40 dark:border-slate-800 space-y-4 text-xs">
                {/* Vehicle & Price Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100/30 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{sv.vehicleName}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{sv.brand} • Reg: <span className="font-bold font-mono text-slate-800 dark:text-slate-350">{sv.registrationNumber}</span></p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Settled Sale Price</span>
                    <span className="text-base font-black text-emerald-700 dark:text-emerald-450">₹{sv.salePrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Settle Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Payment Method</span>
                    <span className="font-bold text-slate-950 dark:text-white">{sv.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Structure</span>
                    <span className="font-bold text-slate-950 dark:text-white">
                      {sv.paymentType === 'Advance' ? 'Advance Payment' : 'Full Payment'}
                    </span>
                  </div>
                  {sv.paymentType === 'Advance' ? (
                    <>
                      <div>
                        <span className="text-slate-500 block uppercase text-[10px] text-amber-700 font-bold">Advance Paid</span>
                        <span className="font-extrabold text-amber-700">₹{sv.advanceAmount?.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[10px] text-rose-600 font-bold">Balance Due</span>
                        <span className="font-extrabold text-rose-600">₹{sv.balanceAmount?.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-slate-500 block uppercase text-[10px]">Original Price</span>
                        <span className="font-bold text-slate-550 dark:text-slate-450 line-through">₹{sv.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[10px] text-emerald-600">Discount Given</span>
                        <span className="font-bold text-emerald-600">₹{sv.discount.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Finance Details if applicable */}
                {sv.paymentMethod === 'Finance' && (
                  <div className="p-3.5 bg-purple-55/20 dark:bg-purple-950/20 rounded-xl border border-purple-100/30 dark:border-purple-800/40 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-purple-700 dark:text-purple-400 block uppercase text-[9px] font-bold">Finance Provider</span>
                      <span className="font-bold text-slate-900 dark:text-white">{sv.financeProvider || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-purple-700 dark:text-purple-400 block uppercase text-[9px] font-bold">Down Payment</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{sv.downPayment?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-purple-700 dark:text-purple-400 block uppercase text-[9px] font-bold">Loan Amount</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{sv.loanAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-purple-700 dark:text-purple-400 block uppercase text-[9px] font-bold">EMI / Tenure</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{sv.emi?.toLocaleString('en-IN')} / {sv.tenureMonths} mos</span>
                    </div>
                  </div>
                )}

                {/* Logistics */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-100/20 dark:border-slate-800 text-[11px] text-slate-500">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span>Delivered On: <strong className="text-slate-700 dark:text-slate-350">{sv.deliveryDate}</strong></span>
                    <span>Executive: <strong className="text-slate-700 dark:text-slate-350">{sv.salesExecutive}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      pdfService.generateInvoicePDF(sv, settings);
                      toast.success(`Invoice PDF downloaded for ${sv.customerName}`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center self-start sm:self-center shadow-md shadow-purple-500/10 active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download Sales Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
