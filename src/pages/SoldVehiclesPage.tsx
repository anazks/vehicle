import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SearchBar } from '../components/common/SearchBar';
import { Pagination } from '../components/common/Pagination';
import { Modal } from '../components/common/Modal';
import { pdfService } from '../services/pdfService';
import { BadgeCheck, Download, User, CreditCard, Sparkles } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-sky-950 tracking-tight flex items-center">
            <BadgeCheck className="w-7 h-7 mr-2.5 text-purple-600" /> Sold Motorcycles & Sales Archive
          </h1>
          <p className="text-xs text-sky-700 mt-1">Complete record of delivered bikes, payment methods, and sales invoices.</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase text-sky-700">Total Sales Revenue</span>
            <h2 className="text-2xl font-black text-emerald-700">₹{(totalSalesRevenue / 10000000).toFixed(2)} Cr</h2>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-sky-100 shadow-xs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by bike name, customer, reg number..."
          className="w-full md:w-80"
        />
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-2xl bg-white border border-sky-100 shadow-sm transition-colors">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-sky-100/70 border-b border-sky-200 text-sky-900 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4">Sold Bike</th>
              <th className="py-3.5 px-4">Buyer Customer</th>
              <th className="py-3.5 px-4">Sale Price / Discount</th>
              <th className="py-3.5 px-4">Payment Method</th>
              <th className="py-3.5 px-4">Delivery Date</th>
              <th className="py-3.5 px-4 text-right">Invoice</th>
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

                <td className="py-3.5 px-4 text-xs">
                  <span className="font-extrabold text-emerald-700 block">₹{s.salePrice.toLocaleString('en-IN')}</span>
                  {s.discount > 0 && (
                    <span className="text-[10px] text-rose-600 font-semibold">Discount: ₹{s.discount.toLocaleString('en-IN')}</span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-xs font-semibold text-sky-700">
                  {s.paymentMethod}
                </td>

                <td className="py-3.5 px-4 text-xs font-mono text-sky-800">
                  {s.deliveryDate}
                </td>

                <td className="py-3.5 px-4 text-right">
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="Sold Motorcycle Transaction Details"
        maxWidth="lg"
      >
        {selectedRecord && (
          <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-600 block">Transaction Reference</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                  TXN-{selectedRecord.id.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Sale & Delivery Date</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {selectedRecord.soldAt}
                </span>
              </div>
            </div>

            {/* Grid 1: Buyer & Bike */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bike Details */}
              <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-slate-800/40 border border-sky-100/70 dark:border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-slate-700 text-sky-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Vehicle Details</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Bike Model Name</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRecord.vehicleName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Brand / Variant</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedRecord.brand}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Registration Number</span>
                    <span className="font-mono font-bold text-sky-700 dark:text-sky-400">{selectedRecord.registrationNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Delivery Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedRecord.deliveryDate}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-slate-800/40 border border-sky-100/70 dark:border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-slate-700 text-sky-600">
                    <User className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Customer Profile</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Customer Name</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRecord.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Contact Phone</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedRecord.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Sales Executive</span>
                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">{selectedRecord.salesExecutive}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Customer ID</span>
                    <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">{selectedRecord.customerId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Payment Details */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100/70 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-slate-700 text-sky-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Financial Settlement</h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-sky-50 dark:border-slate-800/60 pb-4">
                <div>
                  <span className="text-[10px] text-slate-500 block">Showroom Listed Price</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{selectedRecord.originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Special Discount Applied</span>
                  <span className="font-bold text-rose-600">- ₹{selectedRecord.discount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Final Settled Net Price</span>
                  <span className="font-extrabold text-emerald-700 text-sm">₹{selectedRecord.salePrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Specific payment details based on booking type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 block">Payment Method & Type</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold mt-1 border bg-sky-50 text-sky-700 border-sky-100">
                    {selectedRecord.paymentMethod} ({selectedRecord.paymentType === 'Advance' ? 'Advance Booking' : 'Full Payment'})
                  </span>
                </div>

                {selectedRecord.paymentType === 'Advance' && (
                  <div className="grid grid-cols-2 gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold block">Advance Amount Paid</span>
                      <span className="font-black text-amber-700">₹{(selectedRecord.advanceAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold block">Balance Outstanding</span>
                      <span className="font-black text-red-600">₹{(selectedRecord.balanceAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {selectedRecord.paymentMethod === 'Finance' && (
                  <div className="grid grid-cols-3 gap-2 bg-purple-50/30 dark:bg-purple-950/20 p-2.5 rounded-xl border border-purple-100/50 col-span-2">
                    <div>
                      <span className="text-[10px] text-purple-950 dark:text-purple-300 font-bold block">Finance Bank Provider</span>
                      <span className="font-black text-purple-700 dark:text-purple-400">{selectedRecord.financeProvider}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-950 dark:text-purple-300 font-bold block">Down Payment Paid</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₹{(selectedRecord.downPayment || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-950 dark:text-purple-300 font-bold block">Loan approved / EMI</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ₹{(selectedRecord.loanAmount || 0).toLocaleString('en-IN')} (EMI: ₹{(selectedRecord.emi || 0).toLocaleString('en-IN')}/{selectedRecord.tenureMonths}m)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-sky-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleDownloadInvoice(selectedRecord)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center shadow-md shadow-purple-500/20 transition-all"
              >
                <Download className="w-4 h-4 mr-1.5" /> Download PDF Invoice
              </button>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
