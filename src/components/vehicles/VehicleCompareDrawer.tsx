import React from 'react';
import { Drawer } from '../common/Drawer';
import { Vehicle } from '../../types';
import { X, Check, ArrowRight } from 'lucide-react';

interface VehicleCompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedVehicles: Vehicle[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const VehicleCompareDrawer: React.FC<VehicleCompareDrawerProps> = ({
  isOpen,
  onClose,
  comparedVehicles,
  onRemove,
  onClear
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Vehicle Comparison (${comparedVehicles.length}/3)`} width="max-w-4xl">
      <div className="space-y-4">
        {comparedVehicles.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No vehicles selected for comparison. Click "Compare" on up to 3 vehicles.
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-3">
              <button onClick={onClear} className="text-xs text-rose-400 hover:underline">
                Clear Comparison
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto">
              {comparedVehicles.map(v => (
                <div key={v.id} className="glass-card rounded-xl p-4 border border-slate-800 relative space-y-3">
                  <button
                    onClick={() => onRemove(v.id)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-400 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <img src={v.coverImage} alt={v.name} className="w-full h-32 rounded-lg object-cover" />
                  <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{v.name}</h4>
                  <p className="text-base font-extrabold text-blue-400">₹{v.offerPrice.toLocaleString('en-IN')}</p>

                  <div className="divide-y divide-slate-800 text-xs space-y-1.5 pt-2">
                    <div className="flex justify-between py-1"><span className="text-slate-400">Brand:</span><span className="font-semibold">{v.brand}</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-400">Year:</span><span className="font-semibold">{v.year}</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-400">Fuel:</span><span className="font-semibold">{v.fuel}</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-400">Transmission:</span><span className="font-semibold">{v.transmission}</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-400">KM Driven:</span><span className="font-semibold">{v.kmDriven.toLocaleString('en-IN')} km</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-400">Ownership:</span><span className="font-semibold">{v.owner}</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-400">Registration:</span><span className="font-mono text-slate-300">{v.registrationNumber}</span></div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Top Features</span>
                    <div className="flex flex-wrap gap-1">
                      {v.features.map(f => (
                        <span key={f} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
