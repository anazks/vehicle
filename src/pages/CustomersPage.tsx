import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Pagination } from '../components/common/Pagination';
import { Customer } from '../types';
import { Users, UserPlus, Phone, MessageSquare, Mail, Eye, Edit3, Trash2 } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, staff, vehicles } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsApp: '',
    email: '',
    address: '',
    budget: 300000,
    interestedVehicle: vehicles[0]?.name || 'Royal Enfield Continental GT 650',
    preferredBrand: 'Royal Enfield',
    salesExecutive: staff[0]?.name || 'Rajesh Sharma',
    remarks: '',
    visitDate: new Date().toISOString().split('T')[0]
  });

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.preferredBrand.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      whatsApp: '',
      email: '',
      address: '',
      budget: 300000,
      interestedVehicle: vehicles[0]?.name || 'Royal Enfield Continental GT 650',
      preferredBrand: 'Royal Enfield',
      salesExecutive: staff[0]?.name || 'Rajesh Sharma',
      remarks: '',
      visitDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      phone: c.phone,
      whatsApp: c.whatsApp,
      email: c.email,
      address: c.address,
      budget: c.budget,
      interestedVehicle: c.interestedVehicle,
      preferredBrand: c.preferredBrand,
      salesExecutive: c.salesExecutive,
      remarks: c.remarks,
      visitDate: c.visitDate
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-sky-950 tracking-tight flex items-center">
            <Users className="w-7 h-7 mr-2.5 text-sky-600" /> Customer CRM ({filteredCustomers.length})
          </h1>
          <p className="text-xs text-sky-700 mt-1">Manage VIP clients, budget preferences, sales exec assignments, and visit history.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center shadow-md shadow-sky-500/20 shrink-0"
        >
          <UserPlus className="w-4 h-4 mr-1.5" /> Register New Customer
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-sky-100 shadow-xs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by customer name, phone, email, brand..."
          className="w-full md:w-80"
        />
      </div>

      {/* Customers Data Table */}
      <div className="overflow-x-auto rounded-2xl bg-white border border-sky-100 shadow-sm transition-colors">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-sky-100/70 border-b border-sky-200 text-sky-900 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3.5 px-4">Customer Name</th>
              <th className="py-3.5 px-4">Contact Details</th>
              <th className="py-3.5 px-4">Budget & Interest</th>
              <th className="py-3.5 px-4">Sales Executive</th>
              <th className="py-3.5 px-4">Visit Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100 text-sky-950">
            {paginatedCustomers.map(c => (
              <tr key={c.id} className="hover:bg-sky-50 transition-colors group">
                <td className="py-3.5 px-4">
                  <span
                    onClick={() => navigate(`/customers/${c.id}`)}
                    className="font-bold text-sky-950 hover:text-sky-600 cursor-pointer transition-colors block"
                  >
                    {c.name}
                  </span>
                  <span className="text-xs text-sky-700 line-clamp-1">{c.address}</span>
                </td>

                <td className="py-3.5 px-4 text-xs font-medium space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-sky-900 font-semibold">
                    <Phone className="w-3 h-3 text-sky-600" /> <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-sky-700">
                    <Mail className="w-3 h-3 text-indigo-600" /> <span>{c.email}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-xs">
                  <span className="font-extrabold text-emerald-700">₹{(c.budget / 100000).toFixed(1)} Lakh</span>
                  <span className="block text-sky-700 line-clamp-1">{c.interestedVehicle}</span>
                </td>

                <td className="py-3.5 px-4 text-xs font-semibold text-sky-900">
                  {c.salesExecutive}
                </td>

                <td className="py-3.5 px-4 text-xs font-mono text-sky-800">
                  {c.visitDate}
                </td>

                <td className="py-3.5 px-4 text-right space-x-1">
                  <a
                    href={`https://wa.me/${c.whatsApp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => navigate(`/customers/${c.id}`)}
                    className="p-1.5 rounded-lg text-sky-700 hover:text-sky-900 hover:bg-sky-100 transition-colors"
                    title="View Timeline"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg text-sky-700 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteTargetId(c.id)}
                    className="p-1.5 rounded-lg text-sky-700 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Delete Profile"
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
        totalItems={filteredCustomers.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer Details' : 'Register New Customer'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-sky-900">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sky-900 font-semibold mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikramaditya Singhania"
                className="w-full glass-input rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block text-sky-900 font-semibold mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value, whatsApp: e.target.value })}
                placeholder="+91 98200 12345"
                className="w-full glass-input rounded-xl p-2.5 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sky-900 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block text-sky-900 font-semibold mb-1">Budget Range (₹)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full glass-input rounded-xl p-2.5 font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sky-900 font-semibold mb-1">Interested Vehicle</label>
              <input
                type="text"
                value={formData.interestedVehicle}
                onChange={e => setFormData({ ...formData, interestedVehicle: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block text-sky-900 font-semibold mb-1">Preferred Brand</label>
              <input
                type="text"
                value={formData.preferredBrand}
                onChange={e => setFormData({ ...formData, preferredBrand: e.target.value })}
                className="w-full glass-input rounded-xl p-2.5"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sky-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sky-700 hover:bg-sky-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-md shadow-sky-500/20"
            >
              Save Customer Profile
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && deleteCustomer(deleteTargetId)}
        title="Delete Customer Profile"
        message="Are you sure you want to delete this customer record?"
      />
    </div>
  );
};
