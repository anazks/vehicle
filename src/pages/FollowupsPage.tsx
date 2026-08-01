import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Pagination } from '../components/common/Pagination';
import { FollowupPriority, FollowupStatus } from '../types';
import { CalendarClock, Plus, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

export const FollowupsPage: React.FC = () => {
  const { followups, addFollowup, updateFollowupStatus, deleteFollowup, customers, vehicles, staff } = useData();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.name || 'Vikramaditya Singhania',
    vehicleId: vehicles[0]?.id || '',
    vehicleName: vehicles[0]?.name || 'Royal Enfield Continental GT 650',
    assignedStaff: staff[0]?.name || 'Rajesh Sharma',
    followupDate: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    priority: 'High' as FollowupPriority,
    status: 'Pending' as FollowupStatus,
    notes: 'Discuss bike test ride & trade-in valuation.'
  });

  const todayStr = '2026-08-01';

  const todayCount = followups.filter(f => f.followupDate === todayStr && f.status === 'Pending').length;
  const upcomingCount = followups.filter(f => f.followupDate > todayStr && f.status === 'Pending').length;
  const overdueCount = followups.filter(f => f.followupDate < todayStr && f.status === 'Pending').length;
  const completedCount = followups.filter(f => f.status === 'Completed').length;

  const filtered = followups.filter(f => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!f.customerName.toLowerCase().includes(q) && !f.vehicleName.toLowerCase().includes(q) && !f.assignedStaff.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (activeTab === 'today') return f.followupDate === todayStr && f.status === 'Pending';
    if (activeTab === 'upcoming') return f.followupDate > todayStr && f.status === 'Pending';
    if (activeTab === 'overdue') return f.followupDate < todayStr && f.status === 'Pending';
    if (activeTab === 'completed') return f.status === 'Completed';

    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedFollowups = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === formData.customerId);
    const veh = vehicles.find(v => v.id === formData.vehicleId);

    addFollowup({
      ...formData,
      customerName: cust?.name || formData.customerName,
      vehicleName: veh?.name || formData.vehicleName
    });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-sky-950 tracking-tight flex items-center">
            <CalendarClock className="w-7 h-7 mr-2.5 text-amber-600" /> Customer Follow-ups CRM
          </h1>
          <p className="text-xs text-sky-700 mt-1">Schedule and manage leads, bike test rides, and customer inquiries.</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center shadow-md shadow-sky-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Schedule New Follow-up
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('today')}
          className={`glass-card rounded-2xl p-5 border cursor-pointer transition-all bg-white ${
            activeTab === 'today' ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-sky-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-sky-700">Today's Due</span>
              <h3 className="text-3xl font-extrabold text-sky-950 mt-1">{todayCount}</h3>
            </div>
            <Clock className="w-8 h-8 text-sky-600" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('upcoming')}
          className={`glass-card rounded-2xl p-5 border cursor-pointer transition-all bg-white ${
            activeTab === 'upcoming' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-sky-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-indigo-700">Upcoming</span>
              <h3 className="text-3xl font-extrabold text-sky-950 mt-1">{upcomingCount}</h3>
            </div>
            <CalendarClock className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('overdue')}
          className={`glass-card rounded-2xl p-5 border cursor-pointer transition-all bg-white ${
            activeTab === 'overdue' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-sky-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-rose-600">Overdue</span>
              <h3 className="text-3xl font-extrabold text-sky-950 mt-1">{overdueCount}</h3>
            </div>
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('completed')}
          className={`glass-card rounded-2xl p-5 border cursor-pointer transition-all bg-white ${
            activeTab === 'completed' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-sky-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-600">Completed</span>
              <h3 className="text-3xl font-extrabold text-sky-950 mt-1">{completedCount}</h3>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-sky-100 shadow-xs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search follow-ups by customer, bike, staff..."
          className="w-full md:w-80"
        />

        <div className="flex space-x-2">
          {(['today', 'upcoming', 'overdue', 'completed', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => {
                setActiveTab(t);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === t
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-sky-700 hover:text-sky-900 hover:bg-sky-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-2xl bg-white border border-sky-100 shadow-sm transition-colors">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-sky-100/70 border-b border-sky-200 text-sky-900 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4">Customer Details</th>
              <th className="py-3.5 px-4">Interested Bike</th>
              <th className="py-3.5 px-4">Assigned Staff</th>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100 text-sky-950">
            {paginatedFollowups.map(f => (
              <tr key={f.id} className="hover:bg-sky-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-sky-950">{f.customerName}</td>
                <td className="py-3.5 px-4 font-semibold text-sky-900">{f.vehicleName}</td>
                <td className="py-3.5 px-4 text-xs font-semibold text-indigo-700">{f.assignedStaff}</td>
                <td className="py-3.5 px-4 text-xs font-mono">
                  <span className="text-sky-950 font-bold block">{f.followupDate}</span>
                  <span className="text-sky-700">{f.time}</span>
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={f.priority} type="priority" />
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={f.status} type="followup" />
                </td>
                <td className="py-3.5 px-4 text-right space-x-1">
                  {f.status !== 'Completed' && (
                    <button
                      onClick={() => updateFollowupStatus(f.id, 'Completed')}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="Mark Completed"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTargetId(f.id)}
                    className="p-1.5 rounded-lg text-sky-700 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Add Followup Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Schedule Customer Follow-up" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-sky-900">
          <div>
            <label className="block text-sky-900 font-semibold mb-1">Select Customer *</label>
            <select
              value={formData.customerId}
              onChange={e => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sky-900 font-semibold mb-1">Select Bike *</label>
            <select
              value={formData.vehicleId}
              onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
              className="w-full glass-input rounded-xl p-2.5"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.name} (₹{v.offerPrice.toLocaleString('en-IN')})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sky-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 rounded-xl text-sky-700 hover:bg-sky-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-md shadow-sky-500/20"
            >
              Schedule Follow-up
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && deleteFollowup(deleteTargetId)}
        title="Delete Followup Task"
        message="Are you sure you want to remove this scheduled follow-up?"
      />
    </div>
  );
};
