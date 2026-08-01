import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useParams, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../components/common/StatusBadge';
import { QRCodeModal } from '../components/vehicles/QRCodeModal';
import { pdfService } from '../services/pdfService';
import {
  ArrowLeft,
  Download,
  QrCode,
  Heart,
  Share2,
  Calendar,
  Gauge,
  Fuel,
  CheckCircle,
  PhoneCall,
  UserCheck,
  Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';

export const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicles, settings, favorites, toggleFavorite } = useData();
  const navigate = useNavigate();

  const vehicle = vehicles.find(v => v.id === id);

  const [activeImage, setActiveImage] = useState(vehicle?.coverImage || '');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  if (!vehicle) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
        Motorcycle not found.
      </div>
    );
  }

  const isFav = favorites.includes(vehicle.id);

  const handleDownloadPDF = () => {
    pdfService.generateVehiclePDF(vehicle, settings);
    toast.success('Specification PDF Brochure downloaded!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Bike details link copied to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/vehicles')}
          className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Motorcycle Inventory
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleFavorite(vehicle.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isFav ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' : 'glass-input text-slate-600 dark:text-slate-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
          <button onClick={handleShare} className="p-2 rounded-xl glass-input text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400">
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 rounded-xl glass-input hover:border-sky-300 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center"
          >
            <Download className="w-4 h-4 mr-1.5" /> Download PDF Spec Sheet
          </button>
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center shadow-md shadow-purple-500/20"
          >
            <QrCode className="w-4 h-4 mr-1.5" /> QR Pass
          </button>
          <button
            onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center"
          >
            <Edit3 className="w-4 h-4 mr-1.5" /> Edit
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Highlight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-md">
            <img src={activeImage || vehicle.coverImage} alt={vehicle.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <StatusBadge status={vehicle.status} />
            </div>
          </div>

          {/* Thumbnails list */}
          {vehicle.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border transition-all shrink-0 ${
                    (activeImage || vehicle.coverImage) === img ? 'border-sky-500 ring-2 ring-sky-300 dark:ring-sky-500' : 'border-sky-100 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Box (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">{vehicle.brand} • {vehicle.variant}</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 leading-tight">{vehicle.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Reg: <span className="text-slate-900 dark:text-white font-bold">{vehicle.registrationNumber}</span></p>

            <div className="mt-4 p-4 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Offer Sale Price</span>
                <h3 className="text-3xl font-black text-sky-700 dark:text-sky-400">₹{vehicle.offerPrice.toLocaleString('en-IN')}</h3>
              </div>
              {vehicle.price > vehicle.offerPrice && (
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase block">Listing Price</span>
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 line-through">₹{vehicle.price.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Year</span>
                  <span className="font-bold text-slate-900 dark:text-white">{vehicle.year}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 flex items-center space-x-2.5">
                <Gauge className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">KM Driven</span>
                  <span className="font-bold text-slate-900 dark:text-white">{vehicle.kmDriven.toLocaleString('en-IN')} km</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 flex items-center space-x-2.5">
                <Fuel className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Fuel / Transmission</span>
                  <span className="font-bold text-slate-900 dark:text-white">{vehicle.fuel} • {vehicle.transmission}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 flex items-center space-x-2.5">
                <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Ownership</span>
                  <span className="font-bold text-slate-900 dark:text-white">{vehicle.owner}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-sky-100 dark:border-slate-800">
            <button
              onClick={() => navigate('/followups')}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Schedule Customer Test Ride / Follow-Up</span>
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Complete Technical Specifications</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs divide-y divide-sky-100 dark:divide-slate-800">
            <div className="py-2"><span className="text-slate-500 dark:text-slate-400 block">Brand</span><span className="font-bold text-slate-900 dark:text-white">{vehicle.brand}</span></div>
            <div className="py-2"><span className="text-slate-500 dark:text-slate-400 block">Model</span><span className="font-bold text-slate-900 dark:text-white">{vehicle.model}</span></div>
            <div className="py-2"><span className="text-slate-500 dark:text-slate-400 block">Variant</span><span className="font-bold text-slate-900 dark:text-white">{vehicle.variant}</span></div>
            <div className="py-2"><span className="text-slate-500 dark:text-slate-400 block">Color</span><span className="font-bold text-slate-900 dark:text-white">{vehicle.color}</span></div>
            <div className="py-2"><span className="text-slate-500 dark:text-slate-400 block">Insurance Valid Till</span><span className="font-bold text-slate-900 dark:text-white">{vehicle.insuranceDate}</span></div>
            <div className="py-2"><span className="text-slate-500 dark:text-slate-400 block">FC Valid Till</span><span className="font-bold text-slate-900 dark:text-white">{vehicle.fcDate}</span></div>
          </div>

          <div className="pt-4 border-t border-sky-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Overview Description</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{vehicle.description}</p>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Features & Equipment</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {vehicle.features.map(f => (
              <div key={f} className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-sky-50/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-sky-100 dark:border-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} vehicle={vehicle} />
    </div>
  );
};
