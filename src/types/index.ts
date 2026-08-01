export type VehicleFuel = 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';
export type VehicleTransmission = 'Manual' | 'Automatic';
export type VehicleOwner = '1st Owner' | '2nd Owner' | '3rd Owner' | '4th+ Owner';
export type VehicleStatus = 'Available' | 'Booked' | 'Sold';

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  managerName: string;
  staffAllocated?: string[];
  createdAt: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  offerPrice: number;
  fuel: VehicleFuel;
  transmission: VehicleTransmission;
  kmDriven: number;
  color: string;
  owner: VehicleOwner;
  registrationNumber: string;
  insuranceDate: string;
  fcDate: string;
  description: string;
  features: string[];
  status: VehicleStatus;
  coverImage: string;
  images: string[];
  branchId?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsApp: string;
  email: string;
  address: string;
  budget: number;
  interestedVehicle: string;
  preferredBrand: string;
  salesExecutive: string;
  remarks: string;
  visitDate: string;
  branchId?: string;
  createdAt: string;
}

export type FollowupPriority = 'Low' | 'Medium' | 'High';
export type FollowupStatus = 'Pending' | 'Completed' | 'Missed' | 'Cancelled';

export interface Followup {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleName: string;
  assignedStaff: string;
  followupDate: string;
  time: string;
  priority: FollowupPriority;
  status: FollowupStatus;
  notes: string;
  branchId?: string;
  createdAt: string;
}

export interface SoldVehicle {
  id: string;
  vehicleId: string;
  vehicleName: string;
  brand: string;
  registrationNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Finance' | 'Cheque';
  deliveryDate: string;
  salesExecutive: string;
  remarks: string;
  branchId?: string;
  soldAt: string;
}

export type StaffRole = 'Admin' | 'Manager' | 'Sales Executive';

export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  username: string;
  password?: string;
  role: StaffRole;
  photo: string;
  branchId?: string;
  branchName?: string;
  joiningDate: string;
  salesCount?: number;
}

export interface ActivityLog {
  id: string;
  type: 'vehicle_add' | 'vehicle_edit' | 'vehicle_sold' | 'customer_add' | 'followup_scheduled' | 'followup_completed' | 'branch_created' | 'staff_assigned';
  title: string;
  timestamp: string;
  branchId?: string;
}

export interface ShowroomSettings {
  name: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
}
