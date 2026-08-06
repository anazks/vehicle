import React from 'react';
import { Modal } from '../common/Modal';
import { Vehicle } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Copy, ExternalLink, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, vehicle }) => {
  const [copied, setCopied] = React.useState(false);

  if (!vehicle) return null;

  // Full public URL that opens when user scans the QR code on smartphone camera
  const publicUrl = `${window.location.origin}/vehicles/${vehicle.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success('Public QR Code Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`QR Vehicle Pass: ${vehicle.name}`} maxWidth="sm">
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
        {/* QR Code SVG encoding the exact URL */}
        <div className="p-4 rounded-2xl bg-white shadow-2xl border border-slate-200">
          <QRCodeSVG value={publicUrl} size={190} level="H" includeMargin />
        </div>

        <div>
          <h4 className="text-base font-bold text-slate-100">{vehicle.name}</h4>
          <p className="text-xs text-sky-400 font-mono font-semibold">{vehicle.registrationNumber}</p>
          <p className="text-xs text-slate-400 mt-1">₹{vehicle.offerPrice.toLocaleString('en-IN')} • {vehicle.year} • {vehicle.fuel}</p>
        </div>

        {/* Public URL Display */}
        <div className="w-full bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-[11px] text-left space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Smartphone Scan Target URL</span>
          <div className="flex items-center justify-between font-mono text-sky-300 truncate space-x-2">
            <span className="truncate">{publicUrl}</span>
            <button
              onClick={handleCopyLink}
              className="p-1 text-slate-400 hover:text-white transition-colors shrink-0"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
          Scan with smartphone camera to view digital brochure & vehicle spec sheet. Guests without login see vehicle specs only; staff tools are hidden.
        </p>

        <div className="grid grid-cols-2 gap-2 w-full pt-1">
          <button
            onClick={handlePrint}
            className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center transition-all"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Sticker
          </button>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center transition-all shadow-md shadow-sky-500/20"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Test Link
          </a>
        </div>
      </div>
    </Modal>
  );
};
