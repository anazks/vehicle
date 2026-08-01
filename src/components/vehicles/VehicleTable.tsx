import React from 'react';
import { Vehicle } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, Trash2, Heart, Download } from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onDelete: (id: string) => void;
  onOpenMarkSold?: (vehicle: Vehicle) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onDelete,
  onOpenMarkSold
}) => {
  const navigate = useNavigate();
  const { settings, favorites, toggleFavorite } = useData();

  const handleDownloadPDF = (e: React.MouseEvent, v: Vehicle) => {
    e.stopPropagation();
    pdfService.generateVehiclePDF(v, settings);
    toast.success(`PDF specification sheet downloaded for ${v.name}`);
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-sky-100 shadow-sm transition-colors">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-sky-100/70 border-b border-sky-200 text-sky-900 font-bold uppercase text-[11px] tracking-wider">
            <th className="py-3.5 px-4">Motorcycle Details</th>
            <th className="py-3.5 px-4">Registration & Year</th>
            <th className="py-3.5 px-4">Fuel / Transmission</th>
            <th className="py-3.5 px-4">KM & Owner</th>
            <th className="py-3.5 px-4">Price (Offer / Listing)</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-100 text-sky-950">
          {vehicles.map(v => {
            const isFav = favorites.includes(v.id);
            return (
              <tr
                key={v.id}
                onClick={() => navigate(`/vehicles/${v.id}`)}
                className="hover:bg-sky-50 transition-colors cursor-pointer group"
              >
                {/* Photo & Name */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-14 h-11 rounded-xl overflow-hidden bg-sky-50 shrink-0 border border-sky-100 shadow-xs">
                      <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(v.id);
                        }}
                        className={`absolute top-1 right-1 p-1 rounded-full transition-colors ${
                          isFav ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-400 hover:text-rose-500'
                        }`}
                      >
                        <Heart className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                    <div>
                      <span className="font-extrabold text-sky-950 group-hover:text-sky-600 transition-colors block leading-snug">
                        {v.name}
                      </span>
                      <span className="text-xs font-semibold text-sky-700 block">{v.brand} • {v.variant}</span>
                    </div>
                  </div>
                </td>

                {/* Reg & Year */}
                <td className="py-3.5 px-4 text-xs">
                  <span className="font-bold text-sky-900 block font-mono">{v.registrationNumber}</span>
                  <span className="text-sky-700">{v.year} Model</span>
                </td>

                {/* Fuel & Trans */}
                <td className="py-3.5 px-4 text-xs">
                  <span className="font-semibold text-sky-900 block">{v.fuel}</span>
                  <span className="text-sky-700">{v.transmission}</span>
                </td>

                {/* KM & Owner */}
                <td className="py-3.5 px-4 text-xs">
                  <span className="font-bold text-sky-900 block">{v.kmDriven.toLocaleString('en-IN')} km</span>
                  <span className="text-sky-700">{v.owner}</span>
                </td>

                {/* Price */}
                <td className="py-3.5 px-4 text-xs">
                  <span className="font-extrabold text-sky-600 text-sm block">₹{v.offerPrice.toLocaleString('en-IN')}</span>
                  {v.price > v.offerPrice && (
                    <span className="text-sky-400 line-through text-[11px]">₹{v.price.toLocaleString('en-IN')}</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <StatusBadge status={v.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right space-x-1" onClick={e => e.stopPropagation()}>
                  {v.status === 'Available' && onOpenMarkSold && (
                    <button
                      onClick={() => onOpenMarkSold(v)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs transition-colors mr-1"
                      title="Mark as Sold"
                    >
                      Sell
                    </button>
                  )}

                  <button
                    onClick={(e) => handleDownloadPDF(e, v)}
                    className="p-1.5 rounded-lg text-sky-700 hover:text-sky-900 hover:bg-sky-100 transition-colors"
                    title="Download Spec PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate(`/vehicles/${v.id}`)}
                    className="p-1.5 rounded-lg text-sky-700 hover:text-sky-900 hover:bg-sky-100 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate(`/vehicles/edit/${v.id}`)}
                    className="p-1.5 rounded-lg text-sky-700 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                    title="Edit Specs"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(v.id)}
                    className="p-1.5 rounded-lg text-sky-700 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
