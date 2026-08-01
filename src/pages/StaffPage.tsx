import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Staff } from '../types';
import { UserCheck, Plus, Phone, Mail, Building, Trash2, Edit3 } from 'lucide-react';

export const StaffPage: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff, branches } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: 'password123',
    role: 'Sales Executive' as any,
    phone: '',
    email: '',
    branchId: branches[0]?.id || 'br-001',
    branchName: branches[0]?.name || 'Bandra Superbike Hub',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  });

  const filteredStaff = staff.filter(s => {
    const q = searchQuery.toLowerCase();
    const branchNameStr = s.branchName || '';
    return (
      s.name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      branchNameStr.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      username: '',
      password: 'password123',
      role: 'Sales Executive',
      phone: '+91 98200 11223',
      email: 'staff@motomatrix.com',
      branchId: branches[0]?.id || 'br-001',
      branchName: branches[0]?.name || 'Bandra Superbike Hub',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({
      name: s.name,
      username: s.username,
      password: s.password || 'password123',
      role: s.role,
      phone: s.phone,
      email: s.email,
      branchId: s.branchId || branches[0]?.id || 'br-001',
      branchName: s.branchName || branches[0]?.name || 'Bandra Superbike Hub',
      photo: s.photo
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branches.find(b => b.id === formData.branchId);

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        ...formData,
        branchName: branch?.name || formData.branchName
      });
    } else {
      addStaff({
        ...formData,
        branchName: branch?.name || formData.branchName
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <UserCheck className="w-7 h-7 mr-2.5 text-sky-600" /> Staff Directory & Credentials ({filteredStaff.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">Manage staff user credentials, branch assignments, and access permissions.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center shadow-md shadow-sky-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Register New Staff Member
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-sky-100 shadow-xs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search staff by name, role, branch..."
          className="w-full md:w-80"
        />
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map(s => (
          <div key={s.id} className="bg-white rounded-3xl p-6 border border-sky-100 space-y-4 shadow-sm hover:border-sky-300 transition-all flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <img src={s.photo} alt={s.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-300 shadow-xs" />
              <div className="flex-1 overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
                  {s.role}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1 truncate">{s.name}</h3>
                <span className="text-xs text-slate-500 font-mono">@{s.username}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-sky-100 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <Building className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="font-semibold truncate">{s.branchName}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{s.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{s.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-sky-100">
              <button
                onClick={() => handleOpenEdit(s)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title="Edit Staff Member"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTargetId(s.id)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Staff Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStaff ? 'Edit Staff Member' : 'Register New Staff Member'} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Login Username *</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Login Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Role</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full glass-input rounded-xl p-2.5"
              >
                <option value="Sales Executive">Sales Executive</option>
                <option value="Showroom Manager">Showroom Manager</option>
                <option value="Inventory Specialist">Inventory Specialist</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Assign Showroom Branch</label>
              <select
                value={formData.branchId}
                onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sky-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-sky-50">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold shadow-md shadow-sky-500/20">
              Save Staff Member
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && deleteStaff(deleteTargetId)}
        title="Remove Staff Member"
        message="Are you sure you want to remove this staff account?"
      />
    </div>
  );
};
