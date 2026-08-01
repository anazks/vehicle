import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';

interface FilterState {
  brand: string;
  fuel: string;
  transmission: string;
  status: string;
  owner: string;
  minPrice: string;
  maxPrice: string;
  onlyFavorites: boolean;
}

interface VehicleFilterPanelProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  brands: string[];
}

export const VehicleFilterPanel: React.FC<VehicleFilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  brands
}) => {
  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Filter Vehicles
        </h4>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-blue-400 flex items-center font-medium transition-colors"
        >
          <RefreshCw className="w-3 h-3 mr-1" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        {/* Brand */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Brand</label>
          <select
            value={filters.brand}
            onChange={e => onFilterChange({ brand: e.target.value })}
            className="w-full glass-input rounded-xl p-2 font-medium"
          >
            <option value="">All Brands</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Fuel */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Fuel Type</label>
          <select
            value={filters.fuel}
            onChange={e => onFilterChange({ fuel: e.target.value })}
            className="w-full glass-input rounded-xl p-2 font-medium"
          >
            <option value="">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="CNG">CNG</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Transmission</label>
          <select
            value={filters.transmission}
            onChange={e => onFilterChange({ transmission: e.target.value })}
            className="w-full glass-input rounded-xl p-2 font-medium"
          >
            <option value="">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Status</label>
          <select
            value={filters.status}
            onChange={e => onFilterChange({ status: e.target.value })}
            className="w-full glass-input rounded-xl p-2 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Min Price (₹ Lakh)</label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={filters.minPrice}
            onChange={e => onFilterChange({ minPrice: e.target.value })}
            className="w-full glass-input rounded-xl p-2"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Max Price (₹ Lakh)</label>
          <input
            type="number"
            placeholder="e.g. 80"
            value={filters.maxPrice}
            onChange={e => onFilterChange({ maxPrice: e.target.value })}
            className="w-full glass-input rounded-xl p-2"
          />
        </div>
      </div>
    </div>
  );
};
