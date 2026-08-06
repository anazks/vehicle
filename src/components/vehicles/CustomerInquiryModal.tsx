import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Vehicle } from '../../types';
import { useData } from '../../context/DataContext';
import { Phone, Calendar, MessageSquare, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const CustomerInquiryModal: React.FC<CustomerInquiryModalProps> = ({ isOpen, onClose, vehicle }) => {
  const { addCustomer, addFollowup, branches, settings } = useData();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [email, setEmail] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Interested in booking a test ride for this motorcycle.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const vehicleBranch = branches.find(b => b.id === vehicle.branchId);
  const contactPhone = vehicleBranch?.phone || settings.phone || '+91 99000 11100';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Please provide your name and phone number');
      return;
    }

    // 1. Create Customer record
    const createdCust = addCustomer({
      name: name.trim(),
      phone: phone.trim(),
      whatsApp: whatsApp.trim() || phone.trim(),
      email: email.trim(),
      address: 'Web Inquiry / QR Pass Scan',
      budget: vehicle.offerPrice,
      interestedVehicle: vehicle.name,
      preferredBrand: vehicle.brand,
      salesExecutive: vehicleBranch?.managerName || 'Web Inquiry Desk',
      remarks: `Scanned QR Pass for ${vehicle.name} (${vehicle.registrationNumber}). Notes: ${notes}`,
      visitDate: visitDate,
      branchId: vehicle.branchId
    });

    // 2. Schedule Followup for showroom team
    addFollowup({
      customerId: createdCust.id,
      customerName: createdCust.name,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      assignedStaff: vehicleBranch?.managerName || 'Unassigned Staff',
      followupDate: visitDate,
      time: '10:00 AM',
      priority: 'High',
      status: 'Pending',
      notes: `QR Code Inquiry: ${notes}`,
      branchId: vehicle.branchId
    });

    setIsSubmitted(true);
    toast.success('Test ride request submitted successfully!');
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setWhatsApp('');
    setEmail('');
    onClose();
  };

  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={isSubmitted ? 'Inquiry Confirmed!' : `Book Test Ride: ${vehicle.name}`}
      maxWidth="md"
    >
      {isSubmitted ? (
        <div className="text-center py-6 px-2 space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-100">Thank You, {name}!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your test ride request for <span className="text-sky-400 font-semibold">{vehicle.name}</span> has been received. Our sales executive will call you shortly on <span className="text-slate-200 font-mono font-bold">{phone}</span>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-sm mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Showroom Branch:</span>
              <span className="font-bold text-slate-200">{vehicleBranch?.name || settings.name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Preferred Date:</span>
              <span className="font-bold text-sky-400">{visitDate}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Vehicle Offer Price:</span>
              <span className="font-bold text-emerald-400">₹{vehicle.offerPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <a
              href={`tel:${contactPhone}`}
              className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-sky-500/20"
            >
              <Phone className="w-4 h-4" />
              <span>Call Showroom Now</span>
            </a>
            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone}?text=Hi,%20I%20scanned%20the%20QR%20code%20for%20${encodeURIComponent(vehicle.name)}%20(${vehicle.registrationNumber}).%20I%20would%20like%20more%20details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
            )}
          </div>

          <button
            onClick={handleResetAndClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors pt-2 block mx-auto"
          >
            Close Window
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-800/40 flex items-center space-x-3">
            <img src={vehicle.coverImage} alt={vehicle.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div>
              <h4 className="font-extrabold text-slate-100 text-sm">{vehicle.name}</h4>
              <p className="text-sky-400 font-mono text-[11px] font-semibold">{vehicle.registrationNumber}</p>
              <p className="text-slate-400 text-[10px]">Offer Price: <span className="text-emerald-400 font-bold">₹{vehicle.offerPrice.toLocaleString('en-IN')}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-300">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 font-bold text-white bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-300">Mobile Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 font-bold font-mono text-white bg-slate-900 border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-300">WhatsApp Number (Optional)</label>
              <input
                type="tel"
                placeholder="Same as phone or alternate"
                value={whatsApp}
                onChange={e => setWhatsApp(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 font-mono text-white bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-300">Preferred Visit Date</label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 font-semibold text-white bg-slate-900 border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-300">Message / Special Requirements</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Looking for finance options or exchange offer"
              className="w-full glass-input rounded-xl p-2.5 text-white bg-slate-900 border-slate-700"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center space-x-1.5 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
