import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SearchBar } from '../components/common/SearchBar';
import { Pagination } from '../components/common/Pagination';
import { pdfService } from '../services/pdfService';
import { BadgeCheck, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export const SoldVehiclesPage: React.FC = () => {
  const { soldVehicles, settings } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
              <tr key={s.id} className="hover:bg-sky-50 transition-colors">
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
    </div>
  );
};
