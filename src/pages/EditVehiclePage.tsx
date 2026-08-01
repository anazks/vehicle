import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageUploader } from '../components/vehicles/ImageUploader';
import { VehicleFuel, VehicleTransmission, VehicleOwner, VehicleStatus } from '../types';
import { ArrowLeft, Save, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

export const EditVehiclePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicles, updateVehicle, branches } = useData();
  const navigate = useNavigate();

  const targetVehicle = vehicles.find(v => v.id === id);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    variant: '',
    year: 2023,
    price: 0,
    offerPrice: 0,
    fuel: 'Petrol' as VehicleFuel,
    transmission: 'Manual' as VehicleTransmission,
    kmDriven: 0,
    color: '',
    owner: '1st Owner' as VehicleOwner,
    registrationNumber: '',
    insuranceDate: '',
    fcDate: '',
    description: '',
    features: [] as string[],
    status: 'Available' as VehicleStatus,
    coverImage: '',
    images: [] as string[],
    branchId: 'br-001'
  });

  useEffect(() => {
    if (targetVehicle) {
      setFormData({
        name: targetVehicle.name,
        brand: targetVehicle.brand,
        model: targetVehicle.model,
        variant: targetVehicle.variant,
        year: targetVehicle.year,
        price: targetVehicle.price,
        offerPrice: targetVehicle.offerPrice,
        fuel: targetVehicle.fuel,
        transmission: targetVehicle.transmission,
        kmDriven: targetVehicle.kmDriven,
        color: targetVehicle.color,
        owner: targetVehicle.owner,
        registrationNumber: targetVehicle.registrationNumber,
        insuranceDate: targetVehicle.insuranceDate,
        fcDate: targetVehicle.fcDate,
        description: targetVehicle.description,
        features: targetVehicle.features,
        status: targetVehicle.status,
        coverImage: targetVehicle.coverImage,
        images: targetVehicle.images,
        branchId: targetVehicle.branchId || branches[0]?.id || 'br-001'
      });
    }
  }, [targetVehicle, branches]);

  if (!targetVehicle) {
    return (
      <div className="p-12 text-center text-slate-500">
        Motorcycle record not found.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVehicle(targetVehicle.id, formData);
    navigate(`/vehicles/${targetVehicle.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(`/vehicles/${targetVehicle.id}`)}
        className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Bike Specs
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <Edit3 className="w-7 h-7 mr-2.5 text-amber-600 dark:text-amber-400" /> Edit Motorcycle Listing Details
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Update specifications, photos, and sale price for {targetVehicle.name}.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Photo Gallery</h4>
            <ImageUploader
              coverImage={formData.coverImage}
              images={formData.images}
              onChange={(cover, list) => setFormData({ ...formData, coverImage: cover, images: list })}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-sky-100 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Bike Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-input rounded-xl p-3 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full glass-input rounded-xl p-3 font-bold"
                />
              </div>
            </div>

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
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
                  className="w-full glass-input rounded-xl p-2.5"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-sky-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`/vehicles/${targetVehicle.id}`)}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center shadow-md shadow-amber-500/20"
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
