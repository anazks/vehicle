import React from 'react';
import { useData } from '../context/DataContext';
import { excelService } from '../services/excelService';
import { BarChart3, Download, TrendingUp, Car, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const { vehicles, customers, followups, soldVehicles } = useData();

  const totalInventoryValue = vehicles.reduce((acc, curr) => acc + curr.offerPrice, 0);
  const totalSalesRevenue = soldVehicles.reduce((acc, curr) => acc + curr.salePrice, 0);
  const pendingFollowupsCount = followups.filter(f => f.status === 'Pending').length;

  const handleExportVehicles = () => {
    excelService.exportToExcel(vehicles, 'MotoMatrix_Motorcycle_Inventory.xlsx');
    toast.success('Motorcycle Inventory exported to Excel!');
  };

  const handleExportCustomers = () => {
    excelService.exportToExcel(customers, 'MotoMatrix_Customer_CRM.xlsx');
    toast.success('Customer CRM database exported to Excel!');
  };

  const handleExportSales = () => {
    excelService.exportToExcel(soldVehicles, 'MotoMatrix_Sold_Vehicles_Report.xlsx');
    toast.success('Sales history exported to Excel!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <BarChart3 className="w-7 h-7 mr-2.5 text-sky-600 dark:text-sky-400" /> Executive Reports & Analytics Export
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Export high-level sales data, inventory valuations, and customer records to Excel/CSV.</p>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Live Inventory Valuation</span>
            <Car className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">₹{(totalInventoryValue / 10000000).toFixed(2)} Cr</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{vehicles.length} Active Motorcycles in stock</p>
          <button
            onClick={handleExportVehicles}
            className="w-full py-2.5 rounded-xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center border border-sky-200 dark:border-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 mr-1.5" /> Export Inventory Sheet
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Gross Sales Revenue</span>
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-emerald-700 dark:text-emerald-400">₹{(totalSalesRevenue / 10000000).toFixed(2)} Cr</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{soldVehicles.length} Delivered Motorcycles</p>
          <button
            onClick={handleExportSales}
            className="w-full py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 mr-1.5" /> Export Sales History
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Customer CRM Database</span>
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{customers.length} Clients</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{pendingFollowupsCount} Follow-ups Pending</p>
          <button
            onClick={handleExportCustomers}
            className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 mr-1.5" /> Export Customer List
          </button>
        </div>
      </div>
    </div>
  );
};
