import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Vehicle, Customer, Staff } from '../../types';

interface MarkSoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  customers: Customer[];
  staff: Staff[];
  onConfirm: (soldData: any) => void;
}

export const MarkSoldModal: React.FC<MarkSoldModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  customers,
  staff,
  onConfirm
}) => {
  if (!vehicle) return null;

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [salePrice, setSalePrice] = useState(vehicle.offerPrice);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Finance' | 'Cheque'>('Bank Transfer');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesExec, setSalesExec] = useState(staff[0]?.name || 'Rajesh Sharma');
  const [remarks, setRemarks] = useState('');

  const handlePriceChange = (val: number) => {
    setSalePrice(val);
    setDiscount(Math.max(0, vehicle.price - val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId);
    onConfirm({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      brand: vehicle.brand,
      registrationNumber: vehicle.registrationNumber,
      customerId,
      customerName: cust?.name || 'Walk-in Customer',
      customerPhone: cust?.phone || '+91 99000 00000',
      salePrice: Number(salePrice),
      originalPrice: vehicle.price,
      discount: Number(discount),
      paymentMethod,
      deliveryDate,
      salesExecutive: salesExec,
      remarks
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Mark Sold: ${vehicle.name}`} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Customer Select */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Select Buyer / Customer *</label>
          <select
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            className="w-full glass-input rounded-xl p-2.5"
            required
          >
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Sale Price */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Final Sale Price (₹) *</label>
            <input
              type="number"
              value={salePrice}
              onChange={e => handlePriceChange(Number(e.target.value))}
              className="w-full glass-input rounded-xl p-2.5 font-bold text-blue-400"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Discount Given (₹)</label>
            <input
              type="number"
              value={discount}
              onChange={e => {
                setDiscount(Number(e.target.value));
                setSalePrice(vehicle.price - Number(e.target.value));
              }}
              className="w-full glass-input rounded-xl p-2.5 text-rose-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Payment Method */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Payment Method *</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as any)}
              className="w-full glass-input rounded-xl p-2.5"
            >
              <option value="Bank Transfer">Bank Transfer (RTGS/NEFT)</option>
              <option value="Finance">Car Finance / Loan</option>
              <option value="Cash">Cash Payment</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Delivery Date *</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
              className="w-full glass-input rounded-xl p-2.5"
              required
            />
          </div>
        </div>

        {/* Sales Executive */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Assigned Sales Executive</label>
          <select
            value={salesExec}
            onChange={e => setSalesExec(e.target.value)}
            className="w-full glass-input rounded-xl p-2.5"
          >
            {staff.map(s => (
              <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
            ))}
          </select>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Remarks / Warranty Package</label>
          <textarea
            rows={2}
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="e.g. Delivered with ceramic coating, RC transfer initiated."
            className="w-full glass-input rounded-xl p-2.5"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            Confirm & Move to Sold List
          </button>
        </div>
      </form>
    </Modal>
  );
};
