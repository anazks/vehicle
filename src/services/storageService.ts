import { Vehicle, Customer, Staff, Followup, SoldVehicle, ActivityLog, ShowroomSettings, Branch } from '../types';
import { mockVehicles } from '../data/mockVehicles';
import { mockCustomers } from '../data/mockCustomers';
import { mockStaff } from '../data/mockStaff';
import { mockFollowups } from '../data/mockFollowups';
import { mockSoldVehicles } from '../data/mockSoldVehicles';
import { mockBranches } from '../data/mockBranches';

const STORAGE_KEYS = {
  VEHICLES: 'automatrix_vehicles',
  CUSTOMERS: 'automatrix_customers',
  STAFF: 'automatrix_staff',
  BRANCHES: 'automatrix_branches',
  FOLLOWUPS: 'automatrix_followups',
  SOLD_VEHICLES: 'automatrix_sold_vehicles',
  ACTIVITIES: 'automatrix_activities',
  SETTINGS: 'automatrix_settings',
  AUTH: 'automatrix_auth_session',
  THEME: 'automatrix_theme',
  FAVORITES: 'automatrix_favorites'
};

const defaultSettings: ShowroomSettings = {
  name: 'MotoMatrix Superbike & Pre-Owned Bike Showroom',
  logo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=200&q=80',
  phone: '+91 22 4900 8800',
  email: 'concierge@motomatrix.com',
  address: 'MotoMatrix Plaza, Worli Sea Face, Mumbai - 400018',
  currency: '₹'
};

const defaultActivities: ActivityLog[] = [
  { id: 'act-1', type: 'vehicle_add', title: 'New Bike Listed: Royal Enfield Continental GT 650 Chrome', timestamp: '2026-07-31 10:30 AM' },
  { id: 'act-2', type: 'vehicle_sold', title: 'Superbike Marked Sold: Kawasaki Ninja 400 KRT', timestamp: '2026-07-30 04:15 PM' },
  { id: 'act-3', type: 'customer_add', title: 'New VIP Bike Buyer Registered: Vikramaditya Singhania', timestamp: '2026-07-28 11:00 AM' },
  { id: 'act-4', type: 'followup_completed', title: 'Test Ride Completed with Rohan Malhotra for BMW S1000RR', timestamp: '2026-07-30 02:45 PM' }
];

export const storageService = {
  initializeData(): void {
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(mockVehicles));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(mockCustomers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(mockStaff));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BRANCHES)) {
      localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(mockBranches));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FOLLOWUPS)) {
      localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(mockFollowups));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SOLD_VEHICLES)) {
      localStorage.setItem(STORAGE_KEYS.SOLD_VEHICLES, JSON.stringify(mockSoldVehicles));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(defaultActivities));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
    }
  },

  resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(mockVehicles));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(mockCustomers));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(mockStaff));
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(mockBranches));
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(mockFollowups));
    localStorage.setItem(STORAGE_KEYS.SOLD_VEHICLES, JSON.stringify(mockSoldVehicles));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(defaultActivities));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
  },

  // Branches
  getBranches(): Branch[] {
    this.initializeData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BRANCHES) || '[]');
    } catch {
      return mockBranches;
    }
  },
  saveBranches(branches: Branch[]): void {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
  },

  // Vehicles
  getVehicles(): Vehicle[] {
    this.initializeData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || '[]');
    } catch {
      return mockVehicles;
    }
  },
  saveVehicles(vehicles: Vehicle[]): void {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  },

  // Customers
  getCustomers(): Customer[] {
    this.initializeData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
    } catch {
      return mockCustomers;
    }
  },
  saveCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  // Staff
  getStaff(): Staff[] {
    this.initializeData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF) || '[]');
    } catch {
      return mockStaff;
    }
  },
  saveStaff(staff: Staff[]): void {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  },

  // Followups
  getFollowups(): Followup[] {
    this.initializeData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FOLLOWUPS) || '[]');
    } catch {
      return mockFollowups;
    }
  },
  saveFollowups(followups: Followup[]): void {
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(followups));
  },

  // Sold Vehicles
  getSoldVehicles(): SoldVehicle[] {
    this.initializeData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SOLD_VEHICLES) || '[]');
    } catch {
      return mockSoldVehicles;
    }
  },
  saveSoldVehicles(sold: SoldVehicle[]): void {
    localStorage.setItem(STORAGE_KEYS.SOLD_VEHICLES, JSON.stringify(sold));
  },

  // Activities
  getActivities(): ActivityLog[] {
    this.initializeData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
    } catch {
      return defaultActivities;
    }
  },
  addActivity(type: ActivityLog['type'], title: string, branchId?: string): void {
    const list = this.getActivities();
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      type,
      title,
      timestamp: new Date().toLocaleString(),
      branchId
    };
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([newLog, ...list.slice(0, 49)]));
  },

  // Settings
  getSettings(): ShowroomSettings {
    this.initializeData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(defaultSettings));
    } catch {
      return defaultSettings;
    }
  },
  saveSettings(settings: ShowroomSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Favorites
  getFavorites(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    } catch {
      return [];
    }
  },
  toggleFavorite(vehicleId: string): string[] {
    const favs = this.getFavorites();
    const exists = favs.includes(vehicleId);
    const updated = exists ? favs.filter(id => id !== vehicleId) : [...favs, vehicleId];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return updated;
  }
};
