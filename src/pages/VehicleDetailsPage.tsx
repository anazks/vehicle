import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useParams, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../components/common/StatusBadge';
import { QRCodeModal } from '../components/vehicles/QRCodeModal';
import { pdfService } from '../services/pdfService';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/common/Modal';
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
  Edit3,
  Trash2,
  BadgeCheck,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

export const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    vehicles,
    settings,
    favorites,
    toggleFavorite,
    deleteVehicle,
    customers,
    addCustomer,
    markVehicleSold
  } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const vehicle = vehicles.find(v => v.id === id);

  const [activeImage, setActiveImage] = useState(vehicle?.coverImage || '');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Mark as Sold Form States
  const [isMarkSoldOpen, setIsMarkSoldOpen] = useState(false);
  const [customerType, setCustomerType] = useState<'existing' | 'new'>('existing');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [salePrice, setSalePrice] = useState(vehicle?.offerPrice || 0);
  const [discount, setDiscount] = useState((vehicle?.price || 0) - (vehicle?.offerPrice || 0));
  
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Bank Transfer' | 'Finance' | 'Cheque'>('Bank Transfer');
  const [paymentType, setPaymentType] = useState<'Full' | 'Advance'>('Full');
  const [advanceAmount, setAdvanceAmount] = useState(0);
  
  // Finance details
  const [financeProvider, setFinanceProvider] = useState('');
  const [downPayment, setDownPayment] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [tenureMonths, setTenureMonths] = useState(36);
  const [emi, setEmi] = useState(0);
  
  const [salesExecutive, setSalesExecutive] = useState(user?.name || '');
  const [remarks, setRemarks] = useState('Sold with certified checklist and warranty.');

  // Set default selected customer
  useEffect(() => {
    if (customers && customers.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  // Set default sales executive when user loads
  useEffect(() => {
    if (user?.name) {
      setSalesExecutive(user.name);
    }
  }, [user]);

  // Reset form calculations when vehicle changes or modal opens
  useEffect(() => {
    if (vehicle) {
      setSalePrice(vehicle.offerPrice);
      setDiscount(vehicle.price - vehicle.offerPrice);
      const dp = Math.round(vehicle.offerPrice * 0.2);
      setDownPayment(dp);
      setLoanAmount(vehicle.offerPrice - dp);
      setAdvanceAmount(Math.round(vehicle.offerPrice * 0.1));
      setEmi(Math.round((vehicle.offerPrice - dp) * 1.1 / 36));
    }
  }, [vehicle, isMarkSoldOpen]);

  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    let finalCustomerId = selectedCustomerId;
    let finalCustomerName = '';
    let finalCustomerPhone = '';

    if (customerType === 'new') {
      if (!newCustomer.name || !newCustomer.phone) {
        toast.error('Please enter name and phone for new customer');
        return;
      }
      const createdCustomer = addCustomer({
        name: newCustomer.name,
        phone: newCustomer.phone,
        whatsApp: newCustomer.phone,
        email: newCustomer.email,
        address: newCustomer.address,
        budget: salePrice,
        interestedVehicle: vehicle.name,
        preferredBrand: vehicle.brand,
        salesExecutive: salesExecutive,
        remarks: 'Registered during sale.',
        visitDate: new Date().toISOString().split('T')[0],
        branchId: vehicle.branchId
      });
      finalCustomerId = createdCustomer.id;
      finalCustomerName = createdCustomer.name;
      finalCustomerPhone = createdCustomer.phone;
    } else {
      const cust = customers.find(c => c.id === selectedCustomerId);
      if (!cust) {
        toast.error('Please select an existing customer');
        return;
      }
      finalCustomerName = cust.name;
      finalCustomerPhone = cust.phone;
    }

    markVehicleSold({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      brand: vehicle.brand,
      registrationNumber: vehicle.registrationNumber,
      customerId: finalCustomerId,
      customerName: finalCustomerName,
      customerPhone: finalCustomerPhone,
      salePrice: Number(salePrice),
      originalPrice: vehicle.price,
      discount: Number(discount),
      paymentMethod: paymentMode,
      deliveryDate: new Date().toISOString().split('T')[0],
      salesExecutive: salesExecutive,
      remarks: remarks,
      branchId: vehicle.branchId,
      // Extended fields
      paymentType,
      advanceAmount: paymentType === 'Advance' ? Number(advanceAmount) : 0,
      balanceAmount: paymentType === 'Advance' ? (Number(salePrice) - Number(advanceAmount)) : 0,
      financeProvider: paymentMode === 'Finance' ? financeProvider : '',
      loanAmount: paymentMode === 'Finance' ? Number(loanAmount) : 0,
      downPayment: paymentMode === 'Finance' ? Number(downPayment) : 0,
      tenureMonths: paymentMode === 'Finance' ? Number(tenureMonths) : 0,
      emi: paymentMode === 'Finance' ? Number(emi) : 0
    });

    toast.success('Invoice details updated and PDF generated.');
    setIsMarkSoldOpen(false);
  };

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
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center shadow-md shadow-sky-500/20"
          >
            <Edit3 className="w-4 h-4 mr-1.5" /> Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this vehicle?")) {
                deleteVehicle(vehicle.id);
                navigate('/vehicles');
                toast.success('Motorcycle record deleted.');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center shadow-md shadow-rose-500/20"
          >
            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
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

          <div className="pt-2 border-t border-sky-100 dark:border-slate-800 space-y-2">
            {vehicle.status !== 'Sold' ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsMarkSoldOpen(true)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
                >
                  <BadgeCheck className="w-4.5 h-4.5" />
                  <span>Mark Motorcycle as Sold</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/followups')}
                  className="w-full py-3 rounded-xl bg-sky-50 dark:bg-slate-850 hover:bg-sky-100 dark:hover:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Schedule Test Ride / Follow-Up</span>
                </button>
              </>
            ) : (
              <div className="w-full py-4 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-bold text-xs text-center border border-emerald-200 dark:border-emerald-900/30 flex flex-col items-center justify-center space-y-1">
                <span className="flex items-center"><BadgeCheck className="w-4.5 h-4.5 mr-1 text-emerald-600" /> Motorcycle Sold & Delivered!</span>
                <span className="text-[10px] text-emerald-600 font-medium">This record is locked in inventory archive.</span>
              </div>
            )}
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

      {/* Mark Sold Modal */}
      <Modal
        isOpen={isMarkSoldOpen}
        onClose={() => setIsMarkSoldOpen(false)}
        title={`Complete Sale: ${vehicle.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmSale} className="space-y-4 text-xs">
          {/* Customer Type Toggle */}
          <div>
            <label className="block font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Customer Details Type *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCustomerType('existing')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  customerType === 'existing'
                    ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-sky-100 dark:border-slate-800 hover:bg-sky-50 dark:hover:bg-slate-800'
                }`}
              >
                Existing Customer
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('new')}
                className={`py-2 rounded-xl font-bold transition-all border ${
                  customerType === 'new'
                    ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-sky-100 dark:border-slate-800 hover:bg-sky-50 dark:hover:bg-slate-800'
                }`}
              >
                Register New Customer
              </button>
            </div>
          </div>

          {/* Existing Customer Form */}
          {customerType === 'existing' && (
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Select Customer *</label>
              <select
                required
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 font-bold bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="">-- Choose Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* New Customer Form */}
          {customerType === 'new' && (
            <div className="space-y-3 p-3 bg-sky-50/50 dark:bg-slate-800/40 rounded-2xl border border-sky-100/50 dark:border-slate-800">
              <h4 className="font-bold text-sky-900 dark:text-sky-400 text-xs">Customer Registration</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required={customerType === 'new'}
                    placeholder="e.g. Rahul Verma"
                    value={newCustomer.name}
                    onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full glass-input rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required={customerType === 'new'}
                    placeholder="e.g. +91 99000 88000"
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full glass-input rounded-xl p-2.5 font-semibold font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={newCustomer.email}
                    onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full glass-input rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Bandra West, Mumbai"
                    value={newCustomer.address}
                    onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    className="w-full glass-input rounded-xl p-2.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Sale details */}
          <div className="grid grid-cols-2 gap-3 border-t border-sky-100/50 dark:border-slate-800 pt-3">
            <div>
              <label className="block font-semibold mb-1">Final Sale Price (₹) *</label>
              <input
                type="number"
                required
                value={salePrice}
                onChange={e => {
                  const val = Number(e.target.value);
                  setSalePrice(val);
                  setDiscount(vehicle.price - val);
                  setLoanAmount(val - downPayment);
                }}
                className="w-full glass-input rounded-xl p-2.5 font-black text-sky-700 dark:text-sky-400"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Discount Offered (₹)</label>
              <input
                type="number"
                value={discount}
                onChange={e => {
                  const val = Number(e.target.value);
                  setDiscount(val);
                  const sPrice = vehicle.price - val;
                  setSalePrice(sPrice);
                  setLoanAmount(sPrice - downPayment);
                }}
                className="w-full glass-input rounded-xl p-2.5 font-bold text-rose-600 dark:text-rose-400"
              />
            </div>
          </div>

          {/* Payment Method & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Payment Method *</label>
              <select
                value={paymentMode}
                onChange={e => {
                  const mode = e.target.value as any;
                  setPaymentMode(mode);
                  if (mode === 'Finance') {
                    setDownPayment(Math.round(salePrice * 0.2));
                    setLoanAmount(salePrice - Math.round(salePrice * 0.2));
                  }
                }}
                className="w-full glass-input rounded-xl p-2.5 font-bold bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Finance">Finance / Loan</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Payment Structure *</label>
              <select
                value={paymentType}
                onChange={e => {
                  const pType = e.target.value as any;
                  setPaymentType(pType);
                  if (pType === 'Advance') {
                    setAdvanceAmount(Math.round(salePrice * 0.1));
                  }
                }}
                className="w-full glass-input rounded-xl p-2.5 font-bold bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="Full">Full Payment</option>
                <option value="Advance">Advance Booking Amount</option>
              </select>
            </div>
          </div>

          {/* Advance details if selected */}
          {paymentType === 'Advance' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              <div>
                <label className="block font-semibold mb-1 text-amber-900 dark:text-amber-400">Advance Amount Paid *</label>
                <input
                  type="number"
                  required={paymentType === 'Advance'}
                  value={advanceAmount}
                  onChange={e => setAdvanceAmount(Number(e.target.value))}
                  className="w-full glass-input rounded-xl p-2.5 font-extrabold text-amber-700 dark:text-amber-400"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">Balance Pending Due</label>
                <input
                  type="text"
                  disabled
                  value={`₹${(salePrice - advanceAmount).toLocaleString('en-IN')}`}
                  className="w-full glass-input rounded-xl p-2.5 font-bold text-slate-500 bg-slate-100 dark:bg-slate-900 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Finance details if selected */}
          {paymentMode === 'Finance' && (
            <div className="space-y-3 p-3 bg-purple-50/40 dark:bg-purple-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/30">
              <h4 className="font-bold text-purple-900 dark:text-purple-400 text-xs">Finance / Loan Configuration</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Finance Provider *</label>
                  <input
                    type="text"
                    required={paymentMode === 'Finance'}
                    placeholder="e.g. HDFC Bank, IDFC First"
                    value={financeProvider}
                    onChange={e => setFinanceProvider(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 font-bold text-purple-700 dark:text-purple-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Down Payment (₹) *</label>
                  <input
                    type="number"
                    required={paymentMode === 'Finance'}
                    value={downPayment}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setDownPayment(val);
                      setLoanAmount(salePrice - val);
                    }}
                    className="w-full glass-input rounded-xl p-2.5 font-bold text-purple-700 dark:text-purple-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Loan Amount</label>
                  <input
                    type="number"
                    required={paymentMode === 'Finance'}
                    value={loanAmount}
                    onChange={e => setLoanAmount(Number(e.target.value))}
                    className="w-full glass-input rounded-xl p-2.5 font-extrabold text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tenure (Months) *</label>
                  <input
                    type="number"
                    required={paymentMode === 'Finance'}
                    value={tenureMonths}
                    onChange={e => {
                      const tenure = Number(e.target.value);
                      setTenureMonths(tenure);
                      if (tenure > 0) {
                        setEmi(Math.round((loanAmount * 1.1) / tenure));
                      }
                    }}
                    className="w-full glass-input rounded-xl p-2.5 font-semibold text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Monthly EMI (₹) *</label>
                  <input
                    type="number"
                    required={paymentMode === 'Finance'}
                    value={emi}
                    onChange={e => setEmi(Number(e.target.value))}
                    className="w-full glass-input rounded-xl p-2.5 font-black text-purple-700 dark:text-purple-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sales executive & remarks */}
          <div className="grid grid-cols-2 gap-3 border-t border-sky-100/50 dark:border-slate-800 pt-3">
            <div>
              <label className="block font-semibold mb-1">Sales Executive *</label>
              <input
                type="text"
                required
                value={salesExecutive}
                onChange={e => setSalesExecutive(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Remarks</label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={2}
                className="w-full glass-input rounded-xl p-2.5 text-slate-700 dark:text-slate-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sky-100/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsMarkSoldOpen(false)}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Confirm Sale & Generate Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
