import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { excelService, BulkImportResult } from '../services/excelService';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const BulkUploadPage: React.FC = () => {
  const { vehicles, bulkAddVehicles } = useData();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessFile = async () => {
    if (!file) {
      toast.error('Please select an Excel or CSV file to process!');
      return;
    }

    setLoading(true);
    try {
      const res = await excelService.parseVehicleExcel(file, vehicles);
      setResult(res);

      if (res.imported.length > 0) {
        bulkAddVehicles(res.imported);
      } else {
        toast.error('No valid rows found to import.');
      }
    } catch (err: any) {
      toast.error(`Error processing file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <FileSpreadsheet className="w-7 h-7 mr-2.5 text-sky-600 dark:text-sky-400" /> Excel / CSV Bulk Inventory Upload
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Import bulk motorcycle listings with instant row validation, duplicate checking, and error logging.</p>
        </div>

        <button
          onClick={() => excelService.downloadSampleTemplate()}
          className="px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center border border-sky-200 dark:border-slate-700 transition-all shrink-0 shadow-xs"
        >
          <Download className="w-4 h-4 mr-2" /> Download Sample Template
        </button>
      </div>

      {/* Upload Drag Drop Zone */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-dashed border-sky-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400 transition-colors text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
          <UploadCloud className="w-9 h-9" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Drop your Excel file (.xlsx, .xls, .csv) here</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supports sheet parsing powered by SheetJS</p>
        </div>

        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          id="excel-file-input"
          onChange={handleFileDrop}
          className="hidden"
        />

        <div className="flex items-center justify-center space-x-3 pt-2">
          <label
            htmlFor="excel-file-input"
            className="px-5 py-2.5 rounded-xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer border border-sky-200 dark:border-slate-700 transition-colors"
          >
            {file ? file.name : 'Browse Local Files'}
          </label>

          {file && (
            <button
              onClick={handleProcessFile}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center shadow-md shadow-sky-500/20 disabled:opacity-50"
            >
              {loading ? 'Processing Sheet...' : 'Parse & Import Data'}
            </button>
          )}
        </div>
      </div>

      {/* Results Overview */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50/80 dark:bg-emerald-950/60 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Successfully Imported</span>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{result.imported.length} Rows</h3>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="bg-amber-50/80 dark:bg-amber-950/60 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">Duplicates Skipped</span>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{result.duplicates.length} Rows</h3>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="bg-rose-50/80 dark:bg-rose-950/60 rounded-2xl p-5 border border-rose-200 dark:border-rose-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase">Validation Failed</span>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{result.failed.length} Rows</h3>
              </div>
              <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
          </div>

          {/* Imported Rows Breakdown */}
          {result.imported.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-sky-100 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Imported Motorcycles ({result.imported.length})</h4>
                <button
                  onClick={() => navigate('/vehicles')}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-bold flex items-center"
                >
                  View Inventory <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-sky-50 dark:bg-slate-800 border-b border-sky-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold uppercase">
                      <th className="p-2">Name</th>
                      <th className="p-2">Brand</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Fuel</th>
                      <th className="p-2">Registration No</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                    {result.imported.slice(0, 10).map((v, i) => (
                      <tr key={i} className="hover:bg-sky-50/70 dark:hover:bg-slate-800/60">
                        <td className="p-2 font-bold text-slate-900 dark:text-white">{v.name}</td>
                        <td className="p-2">{v.brand}</td>
                        <td className="p-2 text-sky-700 dark:text-sky-400 font-bold">₹{v.offerPrice.toLocaleString('en-IN')}</td>
                        <td className="p-2">{v.fuel}</td>
                        <td className="p-2 font-mono text-slate-600 dark:text-slate-400">{v.registrationNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
