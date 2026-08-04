import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SearchBar } from '../components/common/SearchBar';
import { Pagination } from '../components/common/Pagination';
import { Modal } from '../components/common/Modal';
import { pdfService } from '../services/pdfService';
import { BadgeCheck, Download, User, CreditCard, Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const SoldVehiclesPage: React.FC = () => {
  const { soldVehicles, settings } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<typeof soldVehicles[0] | null>(null);
  const itemsPerPage = 10;

  const totalSalesRevenue = soldVehicles.reduce((acc, curr) => acc + curr.salePrice, 0);

  const filtered = soldVehicles.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.vehicleName.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      s.registrationNumber.toLowerCase().includes(q) ||
      s.salesExecutive.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadInvoice = (record: typeof soldVehicles[0]) => {
    pdfService.generateInvoicePDF(record, settings);
    toast.success(`Sales invoice generated for ${record.customerName}`);
  };

  if (selectedRecord) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
        {/* Navigation Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
          <button
            onClick={() => setSelectedRecord(null)}
            className="flex items-center text-xs font-bold text-slate-600 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Sold Archive
          </button>

          <span className="text-xs font-mono font-bold text-slate-500">
            TXN ID: TXN-{selectedRecord.id.toUpperCase()}
          </span>
        </div>

        {/* Top Banner (Mini Details Card) */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-50 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-600 block">Sold Motorcycle Listing</span>
              <h2 className="text-xl font-black text-slate-900">{selectedRecord.vehicleName}</h2>
              <span className="text-xs font-mono font-bold text-sky-700 mt-1 block">{selectedRecord.registrationNumber}</span>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Sale & Delivery Date</span>
              <span className="text-sm font-black text-slate-800">{selectedRecord.soldAt}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Bike Specifications */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-sky-50">
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Vehicle Specifications</h4>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Manufacturer / Brand</span>
                  <span className="font-bold text-slate-700">{selectedRecord.brand}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Registration Number</span>
                  <span className="font-mono font-bold text-slate-700">{selectedRecord.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Delivery Dispatch Date</span>
                  <span className="font-semibold text-slate-700">{selectedRecord.deliveryDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Original List Price</span>
                  <span className="font-semibold text-slate-700">₹{selectedRecord.originalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-sky-50">
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                  <User className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Buyer CRM Profile</h4>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Customer Name</span>
                  <span className="font-bold text-slate-700">{selectedRecord.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Contact Phone Number</span>
                  <span className="font-semibold text-slate-700">{selectedRecord.customerPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">CRM Customer ID</span>
                  <span className="font-mono font-semibold text-slate-700">{selectedRecord.customerId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Sales Executive Representative</span>
                  <span className="font-semibold text-indigo-700">{selectedRecord.salesExecutive}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Financial Settlement Section */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-sky-50">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Financial Settlement & Payments</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-sky-50">
            <div>
              <span className="text-[10px] text-slate-500 block">Showroom Listed Price</span>
              <span className="text-sm font-bold text-slate-800">₹{selectedRecord.originalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Special Discount Applied</span>
              <span className="text-sm font-bold text-rose-600">- ₹{selectedRecord.discount.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Agreed Net Sale Price</span>
              <span className="text-lg font-black text-emerald-700">₹{selectedRecord.salePrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[10px] text-slate-500 block">Payment Method & Booking Structure</span>
              <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold mt-2 border bg-sky-50 text-sky-700 border-sky-100">
                {selectedRecord.paymentMethod} ({selectedRecord.paymentType === 'Advance' ? 'Booking' : 'Full Payment'})
              </span>
            </div>

            {selectedRecord.paymentType === 'Advance' && (
              <div className="grid grid-cols-2 gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">Advance Booking Paid</span>
                  <span className="text-base font-black text-amber-700">₹{(selectedRecord.advanceAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">Balance Outstanding</span>
                  <span className="text-base font-black text-red-600">₹{(selectedRecord.balanceAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            {selectedRecord.paymentMethod === 'Finance' && (
              <div className="grid grid-cols-3 gap-3 bg-purple-50/30 p-4 rounded-2xl border border-purple-100/50 col-span-1 sm:col-span-2">
                <div>
                  <span className="text-[10px] text-purple-950 font-bold block">Financier Bank Provider</span>
                  <span className="font-black text-purple-700">{selectedRecord.financeProvider}</span>
                </div>
                <div>
                  <span className="text-[10px] text-purple-950 font-bold block">Down Payment Paid</span>
                  <span className="font-bold text-slate-800">₹{(selectedRecord.downPayment || 0).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-purple-950 font-bold block">Loan / Monthly EMI</span>
                  <span className="font-bold text-slate-800">
                    ₹{(selectedRecord.loanAmount || 0).toLocaleString('en-IN')} (EMI: ₹{(selectedRecord.emi || 0).toLocaleString('en-IN')}/{selectedRecord.tenureMonths}m)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-end space-x-3 bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
          <button
            type="button"
            onClick={() => handleDownloadInvoice(selectedRecord)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center shadow-md shadow-purple-500/20 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 mr-1.5" /> Download Invoice PDF
          </button>

          <button
            type="button"
            onClick={() => setSelectedRecord(null)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-sky-100 shadow-sm animate-fade-in">
        <div>
          <h1 className="text-base font-extrabold text-sky-950 tracking-tight flex items-center">
            <BadgeCheck className="w-5 h-5 mr-2 text-purple-600" /> Archive ({filtered.length})
          </h1>
          <p className="hidden sm:block text-xs text-sky-700 mt-1">Complete record of delivered bikes & invoices.</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-sky-700 block">Total Revenue</span>
            <h2 className="text-base sm:text-lg font-black text-emerald-700">₹{(totalSalesRevenue / 10000000).toFixed(2)} Cr</h2>
          </div>
        </div>
      </div>

      {/* Merged Control Bar & Table Card */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden transition-colors animate-fade-in">
        <div className="p-3 bg-sky-50/15 border-b border-sky-100">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search sold records..."
            className="w-full md:w-80"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-sky-100/70 border-b border-sky-200 text-sky-900 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4">Sold Bike</th>
              <th className="py-3.5 px-4">Buyer Customer</th>
              <th className="hidden md:table-cell py-3.5 px-4">Sale Price / Discount</th>
              <th className="hidden md:table-cell py-3.5 px-4">Payment Method</th>
              <th className="hidden md:table-cell py-3.5 px-4">Delivery Date</th>
              <th className="hidden md:table-cell py-3.5 px-4 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100 text-sky-950">
            {paginated.map(s => (
              <tr
                key={s.id}
                onClick={() => setSelectedRecord(s)}
                className="hover:bg-sky-50 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-4">
                  <span className="font-bold text-sky-950 block">{s.vehicleName}</span>
                  <span className="text-xs font-mono font-semibold text-sky-700">{s.registrationNumber}</span>
                </td>

                <td className="py-3.5 px-4 text-xs font-medium">
                  <span className="font-bold text-sky-950 block">{s.customerName}</span>
                  <span className="text-sky-700">{s.customerPhone}</span>
                </td>

                <td className="hidden md:table-cell py-3.5 px-4 text-xs">
                  <span className="font-extrabold text-emerald-700 block">₹{s.salePrice.toLocaleString('en-IN')}</span>
                  {s.discount > 0 && (
                    <span className="text-[10px] text-rose-600 font-semibold">Discount: ₹{s.discount.toLocaleString('en-IN')}</span>
                  )}
                </td>

                <td className="hidden md:table-cell py-3.5 px-4 text-xs font-semibold text-sky-700">
                  {s.paymentMethod}
                </td>

                <td className="hidden md:table-cell py-3.5 px-4 text-xs font-mono text-sky-800">
                  {s.deliveryDate}
                </td>

                <td className="hidden md:table-cell py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleDownloadInvoice(s)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs inline-flex items-center border border-purple-200 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> Invoice PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
      />

    </div>
  );
};
