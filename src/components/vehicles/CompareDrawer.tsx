import React from 'react';
import { Vehicle } from '../../types';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompareDrawerProps {
  comparedVehicles: Vehicle[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  comparedVehicles,
  onRemove,
  onClear
}) => {
  const [showModal, setShowModal] = React.useState(false);

  if (comparedVehicles.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Compare Bar */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 shadow-2xl rounded-2xl p-3 flex items-center space-x-4 max-w-2xl w-full mx-auto"
      >
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-white px-2 border-r border-sky-100 dark:border-slate-800">
          <GitCompare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Compare ({comparedVehicles.length}/3)</span>
        </div>

        <div className="flex-1 flex items-center space-x-2 overflow-x-auto">
          {comparedVehicles.map(v => (
            <div key={v.id} className="flex items-center space-x-2 bg-sky-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-sky-100 dark:border-slate-700 text-xs shrink-0">
              <img src={v.coverImage} alt={v.name} className="w-6 h-6 rounded-md object-cover" />
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">{v.name}</span>
              <button onClick={() => onRemove(v.id)} className="text-slate-400 hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowModal(true)}
            disabled={comparedVehicles.length < 2}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs disabled:opacity-40 transition-all shadow-md shadow-sky-500/20"
          >
            Compare Now
          </button>
          <button onClick={onClear} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs">
            Clear
          </button>
        </div>
      </motion.div>

      {/* Full Compare Matrix Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 z-10 border border-sky-100 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-slate-800">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center">
                  <GitCompare className="w-5 h-5 mr-2 text-sky-600" /> Side-by-Side Motorcycle Comparison
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-sky-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold uppercase">
                      <th className="p-3">Specification</th>
                      {comparedVehicles.map(v => (
                        <th key={v.id} className="p-3 min-w-[200px]">
                          <div className="space-y-1">
                            <img src={v.coverImage} alt={v.name} className="w-full h-24 rounded-xl object-cover" />
                            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{v.name}</p>
                            <p className="text-sky-700 dark:text-sky-400 font-black text-sm">₹{v.offerPrice.toLocaleString('en-IN')}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Brand / Variant</td>
                      {comparedVehicles.map(v => <td key={v.id} className="p-3">{v.brand} ({v.variant})</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Year / KM Driven</td>
                      {comparedVehicles.map(v => <td key={v.id} className="p-3">{v.year} • {v.kmDriven.toLocaleString()} km</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Fuel & Transmission</td>
                      {comparedVehicles.map(v => <td key={v.id} className="p-3">{v.fuel} • {v.transmission}</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Ownership & Reg</td>
                      {comparedVehicles.map(v => <td key={v.id} className="p-3">{v.owner} • {v.registrationNumber}</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-500">Key Features</td>
                      {comparedVehicles.map(v => (
                        <td key={v.id} className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {v.features.map(f => (
                              <span key={f} className="px-2 py-0.5 rounded bg-sky-100 dark:bg-slate-800 text-sky-800 dark:text-sky-300 font-bold text-[10px]">
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
