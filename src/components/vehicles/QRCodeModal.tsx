import React from 'react';
import { Modal } from '../common/Modal';
import { Vehicle } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, vehicle }) => {
  if (!vehicle) return null;

  const qrData = JSON.stringify({
    id: vehicle.id,
    name: vehicle.name,
    brand: vehicle.brand,
    price: vehicle.offerPrice,
    reg: vehicle.registrationNumber,
    fuel: vehicle.fuel
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Vehicle Pass QR Code: ${vehicle.name}`} maxWidth="sm">
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-white shadow-2xl border border-slate-200">
          <QRCodeSVG value={qrData} size={180} level="H" includeMargin />
        </div>

        <div>
          <h4 className="text-base font-bold text-slate-100">{vehicle.name}</h4>
          <p className="text-xs text-blue-400 font-mono font-semibold">{vehicle.registrationNumber}</p>
          <p className="text-xs text-slate-400 mt-1">₹{vehicle.offerPrice.toLocaleString('en-IN')} • {vehicle.year} • {vehicle.fuel}</p>
        </div>

        <p className="text-[11px] text-slate-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
          Scan with smartphone camera to view digital brochure & certified specs sheet.
        </p>

        <div className="flex items-center space-x-3 w-full pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center transition-all"
          >
            <Printer className="w-4 h-4 mr-1.5" /> Print Sticker
          </button>
        </div>
      </div>
    </Modal>
  );
};
