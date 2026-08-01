import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { VehicleTable } from '../components/vehicles/VehicleTable';
import { SearchBar } from '../components/common/SearchBar';
import { Pagination } from '../components/common/Pagination';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import { CompareDrawer } from '../components/vehicles/CompareDrawer';
import { Vehicle } from '../types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Grid,
  List,
  Car,
  Download,
  GitCompare
} from 'lucide-react';
import { excelService } from '../services/excelService';
import toast from 'react-hot-toast';

export const VehicleListPage: React.FC = () => {
  const { vehicles, deleteVehicle, markVehicleSold, favorites, branches } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isFavoriteOnly = searchParams.get('favorite') === 'true';

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-desc' | 'km-asc'>('year-desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Dialog & Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [sellingVehicle, setSellingVehicle] = useState<Vehicle | null>(null);
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Sale Modal Form State
  const [saleData, setSaleData] = useState({
    customerName: 'Aarav Mehta',
    customerPhone: '+91 98200 45678',
    salePrice: 0,
    paymentMethod: 'Bank Transfer' as any,
    salesExecutive: 'Rajesh Sharma',
    discount: 5000,
    remarks: 'Sold with 1 year extended warranty & ceramic coating.'
  });

  const brandsList = useMemo(() => {
    const set = new Set(vehicles.map(v => v.brand));
    return ['All', ...Array.from(set)];
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (isFavoriteOnly && !favorites.includes(v.id)) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesBrand = v.brand.toLowerCase().includes(q);
        const matchesReg = v.registrationNumber.toLowerCase().includes(q);
        const matchesModel = v.model.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesReg && !matchesModel) return false;
      }

      if (selectedBrand !== 'All' && v.brand !== selectedBrand) return false;
      if (selectedFuel !== 'All' && v.fuel !== selectedFuel) return false;
      if (selectedStatus !== 'All' && v.status !== selectedStatus) return false;
      if (selectedBranch !== 'All' && v.branchId !== selectedBranch) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.offerPrice - b.offerPrice;
      if (sortBy === 'price-desc') return b.offerPrice - a.offerPrice;
      if (sortBy === 'km-asc') return a.kmDriven - b.kmDriven;
      return b.year - a.year;
    });
  }, [vehicles, searchQuery, selectedBrand, selectedFuel, selectedStatus, selectedBranch, sortBy, isFavoriteOnly, favorites]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = useMemo(() => {
    return filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const handleOpenMarkSold = (v: Vehicle) => {
    setSellingVehicle(v);
    setSaleData({
      ...saleData,
      salePrice: v.offerPrice
    });
  };

  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellingVehicle) return;

    markVehicleSold({
      vehicleId: sellingVehicle.id,
      vehicleName: sellingVehicle.name,
      brand: sellingVehicle.brand,
      registrationNumber: sellingVehicle.registrationNumber,
      customerId: `cust-${Date.now()}`,
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      salePrice: Number(saleData.salePrice),
      originalPrice: sellingVehicle.price,
      discount: Number(saleData.discount),
      paymentMethod: saleData.paymentMethod,
      deliveryDate: new Date().toISOString().split('T')[0],
      salesExecutive: saleData.salesExecutive,
      remarks: saleData.remarks
    });

    setSellingVehicle(null);
  };

  const handleExportExcel = () => {
    excelService.exportToExcel(filteredVehicles, 'MotoMatrix_Inventory.xlsx');
    toast.success('Inventory exported to Excel sheet!');
  };

  const toggleCompare = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter(i => i !== id));
    } else {
      if (comparedIds.length >= 3) {
        toast.error('You can compare up to 3 bikes simultaneously!');
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <Car className="w-7 h-7 mr-2.5 text-sky-600" /> Pre-Owned Motorcycle Inventory ({filteredVehicles.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">Manage certified bikes, superbike stock, specs, and status.</p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center border border-sky-200 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 mr-1.5" /> Export Excel
          </button>

          <button
            onClick={() => navigate('/add-vehicle')}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center shadow-md shadow-sky-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add New Bike
          </button>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-sky-100 shadow-xs">
        <SearchBar
          value={searchQuery}
          onChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          placeholder="Search by title, brand, reg number..."
          className="w-full lg:w-72"
        />

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={e => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
            className="glass-input rounded-xl px-3 py-2 text-slate-700 font-medium cursor-pointer"
          >
            {brandsList.map(b => (
              <option key={b} value={b}>Brand: {b}</option>
            ))}
          </select>

          {/* Fuel Filter */}
          <select
            value={selectedFuel}
            onChange={e => { setSelectedFuel(e.target.value); setCurrentPage(1); }}
            className="glass-input rounded-xl px-3 py-2 text-slate-700 font-medium cursor-pointer"
          >
            <option value="All">Fuel: All</option>
            <option value="Petrol">Petrol</option>
            <option value="Electric">Electric EV</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="glass-input rounded-xl px-3 py-2 text-slate-700 font-medium cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Sold">Sold</option>
          </select>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={e => { setSelectedBranch(e.target.value); setCurrentPage(1); }}
            className="glass-input rounded-xl px-3 py-2 text-slate-700 font-medium cursor-pointer"
          >
            <option value="All">Branch: All</option>
            {branches.map(br => (
              <option key={br.id} value={br.id}>{br.name}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="glass-input rounded-xl px-3 py-2 text-slate-700 font-medium cursor-pointer"
          >
            <option value="year-desc">Sort: Newest Year</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
            <option value="km-asc">Sort: Lowest KM Driven</option>
          </select>

          {/* Toggle View Mode */}
          <div className="flex bg-sky-50 rounded-xl p-1 border border-sky-100 ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white text-sky-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-sky-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {paginatedVehicles.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-sky-100">
          No motorcycle listings match your filter criteria.
        </div>
      ) : viewMode === 'table' ? (
        <VehicleTable
          vehicles={paginatedVehicles}
          onDelete={id => setDeleteTargetId(id)}
          onOpenMarkSold={handleOpenMarkSold}
        />
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedVehicles.map(v => (
            <div
              key={v.id}
              className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleCompare(v.id)}
                  className={`absolute top-2 left-2 p-1.5 rounded-xl text-xs font-bold flex items-center ${
                    comparedIds.includes(v.id) ? 'bg-sky-600 text-white' : 'bg-white/90 text-slate-700'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5 mr-1" /> Compare
                </button>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1">{v.name}</h3>
                <p className="text-xs text-slate-500">{v.brand} • {v.year} • {v.fuel}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-black text-sky-700">₹{v.offerPrice.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => navigate(`/vehicles/${v.id}`)}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs hover:bg-sky-100"
                  >
                    View Specs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredVehicles.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Side-by-side Compare Drawer */}
      <CompareDrawer
        comparedVehicles={vehicles.filter(v => comparedIds.includes(v.id))}
        onRemove={id => setComparedIds(comparedIds.filter(i => i !== id))}
        onClear={() => setComparedIds([])}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && deleteVehicle(deleteTargetId)}
        title="Delete Motorcycle Listing"
        message="Are you sure you want to remove this motorcycle record from the inventory?"
      />

      {/* Mark Sold Modal */}
      <Modal
        isOpen={!!sellingVehicle}
        onClose={() => setSellingVehicle(null)}
        title={`Complete Sale: ${sellingVehicle?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmSale} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Customer Full Name *</label>
            <input
              type="text"
              required
              value={saleData.customerName}
              onChange={e => setSaleData({ ...saleData, customerName: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={saleData.customerPhone}
                onChange={e => setSaleData({ ...saleData, customerPhone: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Final Sale Price (₹) *</label>
              <input
                type="number"
                required
                value={saleData.salePrice}
                onChange={e => setSaleData({ ...saleData, salePrice: Number(e.target.value) })}
                className="w-full glass-input rounded-xl p-2.5 font-black text-emerald-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sky-100">
            <button
              type="button"
              onClick={() => setSellingVehicle(null)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-sky-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20"
            >
              Confirm Sale & Generate Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
