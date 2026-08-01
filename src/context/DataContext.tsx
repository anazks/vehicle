import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle, Customer, Staff, Followup, SoldVehicle, ActivityLog, ShowroomSettings, Branch } from '../types';
import { storageService } from '../services/storageService';
import toast from 'react-hot-toast';

interface DataContextType {
  branches: Branch[];
  vehicles: Vehicle[];
  customers: Customer[];
  staff: Staff[];
  followups: Followup[];
  soldVehicles: SoldVehicle[];
  activities: ActivityLog[];
  settings: ShowroomSettings;
  favorites: string[];

  // Branch Selection Filter for Dashboard & Reports
  selectedBranchId: string; // 'all' or specific branchId
  setSelectedBranchId: (branchId: string) => void;

  // Branch Actions
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => void;
  updateBranch: (id: string, updated: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;

  // Staff Allocation
  allocateStaffToBranch: (branchId: string, staffIds: string[]) => void;

  // Vehicle Actions
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  duplicateVehicle: (id: string) => void;
  markVehicleSold: (soldData: Omit<SoldVehicle, 'id' | 'soldAt'>) => void;
  bulkAddVehicles: (newVehicles: Vehicle[]) => void;
  toggleFavorite: (vehicleId: string) => void;

  // Customer Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Followup Actions
  addFollowup: (followup: Omit<Followup, 'id' | 'createdAt'>) => void;
  updateFollowupStatus: (id: string, status: Followup['status']) => void;
  deleteFollowup: (id: string) => void;

  // Staff Actions
  addStaff: (staffMember: Omit<Staff, 'id' | 'joiningDate'>) => void;
  updateStaff: (id: string, updated: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Settings & Reset
  updateSettings: (newSettings: ShowroomSettings) => void;
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>(() => storageService.getBranches());
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => storageService.getVehicles());
  const [customers, setCustomers] = useState<Customer[]>(() => storageService.getCustomers());
  const [staff, setStaff] = useState<Staff[]>(() => storageService.getStaff());
  const [followups, setFollowups] = useState<Followup[]>(() => storageService.getFollowups());
  const [soldVehicles, setSoldVehicles] = useState<SoldVehicle[]>(() => storageService.getSoldVehicles());
  const [activities, setActivities] = useState<ActivityLog[]>(() => storageService.getActivities());
  const [settings, setSettings] = useState<ShowroomSettings>(() => storageService.getSettings());
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites());

  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  // Persistence effects
  useEffect(() => { storageService.saveBranches(branches); }, [branches]);
  useEffect(() => { storageService.saveVehicles(vehicles); }, [vehicles]);
  useEffect(() => { storageService.saveCustomers(customers); }, [customers]);
  useEffect(() => { storageService.saveStaff(staff); }, [staff]);
  useEffect(() => { storageService.saveFollowups(followups); }, [followups]);
  useEffect(() => { storageService.saveSoldVehicles(soldVehicles); }, [soldVehicles]);

  // Branch Handlers
  const addBranch = (data: Omit<Branch, 'id' | 'createdAt'>) => {
    const newBranch: Branch = {
      ...data,
      id: `br-${Date.now()}`,
      staffAllocated: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBranches(prev => [newBranch, ...prev]);
    storageService.addActivity('branch_created', `Registered New Showroom Branch: ${newBranch.name}`);
    setActivities(storageService.getActivities());
    toast.success(`Showroom Branch "${newBranch.name}" registered!`);
  };

  const updateBranch = (id: string, updated: Partial<Branch>) => {
    setBranches(prev => prev.map(b => (b.id === id ? { ...b, ...updated } : b)));
    toast.success('Branch details updated.');
  };

  const deleteBranch = (id: string) => {
    const target = branches.find(b => b.id === id);
    setBranches(prev => prev.filter(b => b.id !== id));
    toast.success(`Branch "${target?.name || id}" removed.`);
  };

  // Staff Allocation Handler
  const allocateStaffToBranch = (branchId: string, staffIds: string[]) => {
    const targetBranch = branches.find(b => b.id === branchId);
    setBranches(prev =>
      prev.map(b => (b.id === branchId ? { ...b, staffAllocated: staffIds } : b))
    );
    setStaff(prev =>
      prev.map(s =>
        staffIds.includes(s.id)
          ? { ...s, branchId, branchName: targetBranch?.name || 'Assigned Branch' }
          : s
      )
    );
    storageService.addActivity('staff_assigned', `Allocated ${staffIds.length} staff member(s) to ${targetBranch?.name}`);
    setActivities(storageService.getActivities());
    toast.success(`Staff team allocated to ${targetBranch?.name || 'branch'}.`);
  };

  // Vehicle Handlers
  const addVehicle = (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVehicles(prev => [newVehicle, ...prev]);
    storageService.addActivity('vehicle_add', `Added vehicle: ${newVehicle.name}`);
    setActivities(storageService.getActivities());
    toast.success(`Vehicle "${newVehicle.name}" added successfully!`);
  };

  const updateVehicle = (id: string, updated: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...updated } : v)));
    storageService.addActivity('vehicle_edit', `Updated vehicle details (ID: ${id})`);
    setActivities(storageService.getActivities());
    toast.success('Vehicle updated successfully!');
  };

  const deleteVehicle = (id: string) => {
    const target = vehicles.find(v => v.id === id);
    setVehicles(prev => prev.filter(v => v.id !== id));
    toast.success(`Vehicle "${target?.name || id}" deleted.`);
  };

  const duplicateVehicle = (id: string) => {
    const target = vehicles.find(v => v.id === id);
    if (!target) return;
    const duplicated: Vehicle = {
      ...target,
      id: `veh-${Date.now()}`,
      name: `${target.name} (Copy)`,
      registrationNumber: `MH${Math.floor(10 + Math.random() * 89)}EX${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVehicles(prev => [duplicated, ...prev]);
    toast.success(`Duplicated vehicle "${duplicated.name}"`);
  };

  const markVehicleSold = (soldData: Omit<SoldVehicle, 'id' | 'soldAt'>) => {
    const newSold: SoldVehicle = {
      ...soldData,
      id: `sold-${Date.now()}`,
      soldAt: new Date().toISOString().split('T')[0]
    };
    setSoldVehicles(prev => [newSold, ...prev]);
    setVehicles(prev => prev.map(v => (v.id === soldData.vehicleId ? { ...v, status: 'Sold' } : v)));
    storageService.addActivity('vehicle_sold', `Vehicle Marked Sold: ${newSold.vehicleName}`);
    setActivities(storageService.getActivities());
    toast.success(`Vehicle "${newSold.vehicleName}" marked as Sold!`);
  };

  const bulkAddVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(prev => [...newVehicles, ...prev]);
    toast.success(`Successfully imported ${newVehicles.length} vehicles!`);
  };

  const toggleFavorite = (vehicleId: string) => {
    const updated = storageService.toggleFavorite(vehicleId);
    setFavorites(updated);
    toast.success(updated.includes(vehicleId) ? 'Added to Favorites ❤️' : 'Removed from Favorites');
  };

  // Customer Handlers
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCust, ...prev]);
    storageService.addActivity('customer_add', `Registered Customer: ${newCust.name}`);
    setActivities(storageService.getActivities());
    toast.success(`Customer "${newCust.name}" registered.`);
  };

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
    toast.success('Customer details updated.');
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    toast.success('Customer profile deleted.');
  };

  // Followup Handlers
  const addFollowup = (data: Omit<Followup, 'id' | 'createdAt'>) => {
    const newFlw: Followup = {
      ...data,
      id: `flw-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFollowups(prev => [newFlw, ...prev]);
    storageService.addActivity('followup_scheduled', `Scheduled Follow-up for ${newFlw.customerName}`);
    setActivities(storageService.getActivities());
    toast.success('Follow-up task scheduled.');
  };

  const updateFollowupStatus = (id: string, status: Followup['status']) => {
    setFollowups(prev => prev.map(f => (f.id === id ? { ...f, status } : f)));
    if (status === 'Completed') {
      const flw = followups.find(f => f.id === id);
      storageService.addActivity('followup_completed', `Completed Follow-up for ${flw?.customerName || 'customer'}`);
      setActivities(storageService.getActivities());
      toast.success('Follow-up marked as Completed!');
    }
  };

  const deleteFollowup = (id: string) => {
    setFollowups(prev => prev.filter(f => f.id !== id));
    toast.success('Follow-up task removed.');
  };

  // Staff Handlers
  const addStaff = (staffData: Omit<Staff, 'id' | 'joiningDate'>) => {
    const newStaff: Staff = {
      ...staffData,
      id: `stf-${Date.now()}`,
      joiningDate: new Date().toISOString().split('T')[0]
    };
    setStaff(prev => [newStaff, ...prev]);
    toast.success(`Staff member "${newStaff.name}" added.`);
  };

  const updateStaff = (id: string, updated: Partial<Staff>) => {
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
    toast.success('Staff details updated.');
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    toast.success('Staff record removed.');
  };

  // Settings Handler
  const updateSettings = (newSettings: ShowroomSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    toast.success('Showroom settings updated!');
  };

  const resetAllData = () => {
    storageService.resetToDefaults();
    setBranches(storageService.getBranches());
    setVehicles(storageService.getVehicles());
    setCustomers(storageService.getCustomers());
    setStaff(storageService.getStaff());
    setFollowups(storageService.getFollowups());
    setSoldVehicles(storageService.getSoldVehicles());
    setActivities(storageService.getActivities());
    setSettings(storageService.getSettings());
    setFavorites([]);
  };

  return (
    <DataContext.Provider
      value={{
        branches,
        vehicles,
        customers,
        staff,
        followups,
        soldVehicles,
        activities,
        settings,
        favorites,
        selectedBranchId,
        setSelectedBranchId,
        addBranch,
        updateBranch,
        deleteBranch,
        allocateStaffToBranch,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        duplicateVehicle,
        markVehicleSold,
        bulkAddVehicles,
        toggleFavorite,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addFollowup,
        updateFollowupStatus,
        deleteFollowup,
        addStaff,
        updateStaff,
        deleteStaff,
        updateSettings,
        resetAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
