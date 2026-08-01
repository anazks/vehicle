import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Search, Car, Users, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { vehicles, customers } = useData();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredVehicles = query.trim()
    ? vehicles.filter(v => v.name.toLowerCase().includes(query.toLowerCase()) || v.brand.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredCustomers = query.trim()
    ? customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query))
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl z-10 border border-sky-100 shadow-2xl overflow-hidden"
        >
          {/* Search Bar Input */}
          <div className="p-4 border-b border-sky-100 flex items-center space-x-3">
            <Search className="w-5 h-5 text-sky-600 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search bikes by title, brand, or clients by name..."
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
            />
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
            {!query.trim() ? (
              <p className="text-slate-400 py-6 text-center">Type at least 1 character to search...</p>
            ) : filteredVehicles.length === 0 && filteredCustomers.length === 0 ? (
              <p className="text-slate-500 py-6 text-center">No matching bikes or customers found.</p>
            ) : (
              <>
                {filteredVehicles.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                      <Car className="w-3.5 h-3.5 mr-1.5 text-sky-600" /> Motorcycles ({filteredVehicles.length})
                    </h4>
                    <div className="space-y-1">
                      {filteredVehicles.map(v => (
                        <div
                          key={v.id}
                          onClick={() => {
                            navigate(`/vehicles/${v.id}`);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <img src={v.coverImage} alt={v.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-slate-900">{v.name}</p>
                              <span className="text-slate-500 font-mono text-[10px]">{v.registrationNumber}</span>
                            </div>
                          </div>
                          <span className="font-bold text-sky-700">₹{v.offerPrice.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredCustomers.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Customer Profiles ({filteredCustomers.length})
                    </h4>
                    <div className="space-y-1">
                      {filteredCustomers.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            navigate(`/customers/${c.id}`);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 cursor-pointer transition-colors"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{c.name}</p>
                            <span className="text-slate-500 text-[10px]">{c.phone} • {c.email}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
