import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from '../components/vehicles/ImageUploader';
import { VehicleFuel, VehicleTransmission, VehicleOwner, VehicleStatus } from '../types';
import { ArrowLeft, Save, Car } from 'lucide-react';
import toast from 'react-hot-toast';

export const AddVehiclePage: React.FC = () => {
  const { addVehicle, branches } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Royal Enfield',
    model: 'Continental GT 650',
    variant: 'Chrome Mister Clean',
    year: 2023,
    price: 385000,
    offerPrice: 365000,
    fuel: 'Petrol' as VehicleFuel,
    transmission: 'Manual' as VehicleTransmission,
    kmDriven: 8500,
    color: 'Chrome',
    owner: '1st Owner' as VehicleOwner,
    registrationNumber: `MH${Math.floor(10 + Math.random() * 89)}EX${Math.floor(1000 + Math.random() * 9000)}`,
    insuranceDate: '2027-12-31',
    fcDate: '2037-12-31',
    description: 'Certified pre-owned motorcycle with full service record.',
    features: ['Dual-Channel ABS', 'Slipper Clutch', 'TFT Display', 'Led Headlamp'],
    status: 'Available' as VehicleStatus,
    coverImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80'],
    branchId: branches[0]?.id || 'br-001'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brand.trim()) {
      toast.error('Please fill in required bike name and brand!');
      return;
    }

    addVehicle(formData);
    navigate('/vehicles');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/vehicles')}
        className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Motorcycle Inventory
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <Car className="w-7 h-7 mr-2.5 text-sky-600 dark:text-sky-400" /> Add New Pre-Owned Motorcycle
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Fill in engine specs, registration details, pricing, and upload high-res photos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
          {/* Photo Gallery Uploader */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">1. Photo Gallery & Cover Image</h4>
            <ImageUploader
              coverImage={formData.coverImage}
              images={formData.images}
              onChange={(cover, list) => setFormData({ ...formData, coverImage: cover, images: list })}
            />
          </div>

          {/* Core Info */}
          <div className="space-y-4 pt-4 border-t border-sky-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">2. Bike Specifications & Identity</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Bike Name / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Enfield Continental GT 650 Chrome"
                  className="w-full glass-input rounded-xl p-3 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Brand / Manufacturer *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Royal Enfield, Kawasaki, BMW"
                  className="w-full glass-input rounded-xl p-3 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Variant / Trim</label>
                <input
                  type="text"
                  value={formData.variant}
                  onChange={e => setFormData({ ...formData, variant: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Manufacturing Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full glass-input rounded-xl p-2.5 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Fuel Type</label>
                <select
                  value={formData.fuel}
                  onChange={e => setFormData({ ...formData, fuel: e.target.value as VehicleFuel })}
                  className="w-full glass-input rounded-xl p-2.5"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={e => setFormData({ ...formData, transmission: e.target.value as VehicleTransmission })}
                  className="w-full glass-input rounded-xl p-2.5"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">KM Driven</label>
                <input
                  type="number"
                  value={formData.kmDriven}
                  onChange={e => setFormData({ ...formData, kmDriven: Number(e.target.value) })}
                  className="w-full glass-input rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Ownership</label>
                <select
                  value={formData.owner}
                  onChange={e => setFormData({ ...formData, owner: e.target.value as VehicleOwner })}
                  className="w-full glass-input rounded-xl p-2.5"
                >
                  <option value="1st Owner">1st Owner</option>
                  <option value="2nd Owner">2nd Owner</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 pt-4 border-t border-sky-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">3. Pricing & Showroom Location</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Listing Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full glass-input rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Offer Sale Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.offerPrice}
                  onChange={e => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                  className="w-full glass-input rounded-xl p-2.5 font-black text-sky-700 dark:text-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assign Showroom Branch</label>
                <select
                  value={formData.branchId}
                  onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-sky-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center shadow-md shadow-sky-500/20"
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Motorcycle Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
