import React from 'react';
import { Vehicle } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, Trash2, Heart, Download, Check, X } from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
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
  const { isStaff } = useAuth();

  const handleDownloadPDF = (e: React.MouseEvent, v: Vehicle) => {
    e.stopPropagation();
    pdfService.generateVehiclePDF(v, settings);
    toast.success(`PDF specification sheet downloaded for ${v.name}`);
  };

  return (
    <div className="overflow-x-auto transition-colors">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-sky-100/70 border-b border-sky-200 text-sky-900 font-bold uppercase text-[11px] tracking-wider">
            <th className="py-3.5 px-3 md:px-4">Motorcycle</th>
            <th className="py-3.5 px-3 md:px-4">Year & Status</th>
            <th className="hidden md:table-cell py-3.5 px-4">Registration</th>
            <th className="hidden md:table-cell py-3.5 px-4">Fuel & Trans</th>
            <th className="hidden md:table-cell py-3.5 px-4">KM & Owner</th>
            <th className="hidden md:table-cell py-3.5 px-4">Offer Price</th>
            <th className="hidden md:table-cell py-3.5 px-4 text-right">Action</th>
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
                {/* Photo & Name (Visible on Mobile & Desktop) */}
                <td className="py-3.5 px-3 md:px-4">
                  <div className="flex items-center space-x-2.5 sm:space-x-3">
                    <div className={`relative w-12 h-10 sm:w-14 sm:h-11 rounded-xl overflow-hidden bg-sky-50 shrink-0 border border-sky-100 shadow-xs ${
                      isStaff ? 'hidden md:block' : ''
                    }`}>
                      <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(v.id);
                        }}
                        className={`absolute top-0.5 right-0.5 p-1 rounded-full transition-colors ${
                          isFav ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-400 hover:text-rose-500'
                        }`}
                      >
                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                      </button>
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-sky-950 group-hover:text-sky-600 transition-colors block leading-tight text-xs sm:text-sm truncate max-w-[140px] sm:max-w-none">
                        {v.name}
                      </span>
                      <span className="text-[11px] font-semibold text-sky-700 block truncate">{v.brand}</span>
                      <span className="md:hidden text-[11px] font-black text-sky-600">₹{v.offerPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </td>

                {/* Year & Status Badge (Visible on Mobile & Desktop) */}
                <td className="py-3.5 px-3 md:px-4 text-xs">
                  <span className="font-bold text-sky-900 block">{v.year}</span>
                  <div className="mt-0.5 md:block hidden">
                    <StatusBadge status={v.status} />
                  </div>
                  <div className="mt-1 md:hidden block">
                    {v.status === 'Available' ? (
                      <span className="inline-flex items-center justify-center p-0.5 rounded-full bg-emerald-100 text-emerald-800" title="Available">
                        <Check className="w-3 h-3 stroke-[3.5]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center p-0.5 rounded-full bg-rose-100 text-rose-800" title={v.status}>
                        <X className="w-3 h-3 stroke-[3.5]" />
                      </span>
                    )}
                  </div>
                </td>

                {/* Desktop-Only Columns */}
                <td className="hidden md:table-cell py-3.5 px-4 text-xs font-mono font-bold text-sky-900">
                  {v.registrationNumber}
                </td>

                <td className="hidden md:table-cell py-3.5 px-4 text-xs">
                  <span className="font-semibold text-sky-900 block">{v.fuel}</span>
                  <span className="text-sky-700">{v.transmission}</span>
                </td>

                <td className="hidden md:table-cell py-3.5 px-4 text-xs">
                  <span className="font-bold text-sky-900 block">{v.kmDriven.toLocaleString('en-IN')} km</span>
                  <span className="text-sky-700">{v.owner}</span>
                </td>

                <td className="hidden md:table-cell py-3.5 px-4 text-xs font-extrabold text-sky-600 text-sm">
                  ₹{v.offerPrice.toLocaleString('en-IN')}
                </td>

                {/* Prominent Desktop-Only View Button */}
                <td className="hidden md:table-cell py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => navigate(`/vehicles/${v.id}`)}
                      className="px-2.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs inline-flex items-center shadow-xs transition-all active:scale-95 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>View</span>
                    </button>

                    {!isStaff && (
                      <>
                        <button
                          onClick={(e) => handleDownloadPDF(e, v)}
                          className="hidden sm:inline-flex p-1.5 rounded-lg text-sky-700 hover:text-sky-900 hover:bg-sky-100 transition-colors"
                          title="Download Spec PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/vehicles/edit/${v.id}`)}
                          className="hidden sm:inline-flex p-1.5 rounded-lg text-sky-700 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                          title="Edit Specs"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDelete(v.id)}
                          className="hidden sm:inline-flex p-1.5 rounded-lg text-sky-700 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
