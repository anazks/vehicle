import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SearchBar } from '../components/common/SearchBar';
import { Branch } from '../types';
import { Building, Plus, Phone, Mail, MapPin, UserCheck, Edit3, Trash2, ShieldAlert } from 'lucide-react';

export const BranchesPage: React.FC = () => {
  const { branches, addBranch, updateBranch, deleteBranch, staff, allocateStaffToBranch } = useData();
  const { isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [allocatingBranch, setAllocatingBranch] = useState<Branch | null>(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    managerName: staff[0]?.name || 'Rajesh Sharma'
  });

  if (!isAdmin) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Administrator Access Required</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Branch Registration & Allocation is restricted to Administrator role.</p>
      </div>
    );
  }

  const filteredBranches = branches.filter(b => {
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData({
      name: '',
      code: `BR-${Math.floor(100 + Math.random() * 900)}`,
      city: 'Mumbai',
      address: '',
      phone: '+91 22 4900 8800',
      email: 'branch@motomatrix.com',
      managerName: staff[0]?.name || 'Rajesh Sharma'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Branch) => {
    setEditingBranch(b);
    setFormData({
      name: b.name,
      code: b.code,
      city: b.city,
      address: b.address,
      phone: b.phone,
      email: b.email,
      managerName: b.managerName
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      updateBranch(editingBranch.id, formData);
    } else {
      addBranch(formData);
    }
    setIsModalOpen(false);
  };

  const handleOpenAllocate = (b: Branch) => {
    setAllocatingBranch(b);
    setSelectedStaffIds(b.staffAllocated || []);
  };

  const handleToggleStaffSelection = (staffId: string) => {
    if (selectedStaffIds.includes(staffId)) {
      setSelectedStaffIds(selectedStaffIds.filter(id => id !== staffId));
    } else {
      setSelectedStaffIds([...selectedStaffIds, staffId]);
    }
  };

  const handleSaveAllocation = () => {
    if (allocatingBranch) {
      allocateStaffToBranch(allocatingBranch.id, selectedStaffIds);
      setAllocatingBranch(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <Building className="w-7 h-7 mr-2.5 text-sky-600 dark:text-sky-400" /> Multi-Branch Showroom Hubs ({filteredBranches.length})
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Register new showroom locations, assign branch managers, and allocate staff members.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center shadow-md shadow-sky-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Register New Branch
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-sky-100 dark:border-slate-800 shadow-xs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search branch by name, city, code..."
          className="w-full md:w-80"
        />
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBranches.map(b => {
          const allocatedStaffList = staff.filter(s => (b.staffAllocated || []).includes(s.id));

          return (
            <div key={b.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 space-y-4 shadow-sm hover:border-sky-300 dark:hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                    {b.code} • {b.city}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">{b.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {b.address}
                  </p>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                    title="Edit Branch"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(b.id)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Branch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Branch Contact Details */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">{b.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white truncate">{b.email}</span>
                </div>
              </div>

              {/* Allocated Staff Section */}
              <div className="pt-4 border-t border-sky-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Allocated Staff Team ({allocatedStaffList.length})</span>
                  <div className="flex -space-x-2 mt-1.5">
                    {allocatedStaffList.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No staff allocated yet</span>
                    ) : (
                      allocatedStaffList.map(s => (
                        <img
                          key={s.id}
                          src={s.photo}
                          alt={s.name}
                          title={`${s.name} (${s.role})`}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-xs"
                        />
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAllocate(b)}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-slate-700 font-bold text-xs flex items-center transition-colors shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5 mr-1" /> Allocate Staff
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Branch Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBranch ? 'Edit Branch' : 'Register New Branch'} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Branch Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Bandra Luxury Superbike Gallery"
              className="w-full glass-input rounded-xl p-2.5 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Branch Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Address *</label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sky-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold shadow-md shadow-sky-500/20">
              Save Branch
            </button>
          </div>
        </form>
      </Modal>

      {/* Staff Allocation Modal */}
      <Modal isOpen={!!allocatingBranch} onClose={() => setAllocatingBranch(null)} title={`Allocate Staff to ${allocatingBranch?.name}`} maxWidth="md">
        <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
          <p className="text-slate-600 dark:text-slate-400">Select staff members to assign to this showroom location:</p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {staff.map(s => {
              const isSelected = selectedStaffIds.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => handleToggleStaffSelection(s.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? 'bg-sky-50 dark:bg-slate-800 border-sky-400 dark:border-sky-500 font-bold' : 'bg-white dark:bg-slate-900 border-sky-100 dark:border-slate-800 hover:bg-sky-50/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-slate-900 dark:text-white font-bold">{s.name}</p>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">{s.role} • @{s.username}</span>
                    </div>
                  </div>
                  <input type="checkbox" checked={isSelected} onChange={() => {}} className="accent-sky-600 w-4 h-4" />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sky-100 dark:border-slate-800">
            <button onClick={() => setAllocatingBranch(null)} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button onClick={handleSaveAllocation} className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold shadow-md">
              Save Staff Allocation
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && deleteBranch(deleteTargetId)}
        title="Delete Showroom Branch"
        message="Are you sure you want to remove this branch record?"
      />
    </div>
  );
};
