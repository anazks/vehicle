import { SoldVehicle } from '../types';
import { mockCustomers } from './mockCustomers';

export const mockSoldVehicles: SoldVehicle[] = [
  {
    id: 'sold-001',
    vehicleId: 'veh-043',
    vehicleName: 'Kawasaki Ninja 400 KRT Edition',
    brand: 'Kawasaki',
    registrationNumber: 'KL07EK1122',
    customerId: mockCustomers[0].id,
    customerName: mockCustomers[0].name,
    customerPhone: mockCustomers[0].phone,
    salePrice: 460000,
    originalPrice: 485000,
    discount: 25000,
    paymentMethod: 'Bank Transfer',
    deliveryDate: '2026-07-25',
    salesExecutive: 'Rajesh Sharma',
    remarks: 'Full payment received via RTGS in Ernakulam. Bike delivered with ceramic coating and paddock stand.',
    branchId: 'br-001',
    soldAt: '2026-07-25'
  },
  {
    id: 'sold-002',
    vehicleId: 'veh-044',
    vehicleName: 'Royal Enfield Interceptor 650 Sunset Strip',
    brand: 'Royal Enfield',
    registrationNumber: 'KL01CB9988',
    customerId: mockCustomers[1].id,
    customerName: mockCustomers[1].name,
    customerPhone: mockCustomers[1].phone,
    salePrice: 310000,
    originalPrice: 325000,
    discount: 15000,
    paymentMethod: 'Finance',
    deliveryDate: '2026-07-26',
    salesExecutive: 'Priya Verma',
    remarks: 'Kowdiar Showroom sale. HDFC Two-Wheeler Loan approved. Delivered with touring seat.',
    branchId: 'br-001',
    soldAt: '2026-07-26'
  },
  {
    id: 'sold-003',
    vehicleId: 'veh-045',
    vehicleName: 'BMW G 310 RR Style Passion',
    brand: 'BMW Motorrad',
    registrationNumber: 'KL11MQ3344',
    customerId: mockCustomers[2].id,
    customerName: mockCustomers[2].name,
    customerPhone: mockCustomers[2].phone,
    salePrice: 285000,
    originalPrice: 300000,
    discount: 15000,
    paymentMethod: 'Bank Transfer',
    deliveryDate: '2026-07-27',
    salesExecutive: 'Amit Patel',
    remarks: 'Kozhikode showroom delivery. Kerala RTO registration transfer completed.',
    branchId: 'br-002',
    soldAt: '2026-07-27'
  }
];

const bikeNames = [
  'KTM Duke 390 Gen-3 Dark Galvina',
  'Triumph Speed 400 Carnival Red',
  'Ather 450X Gen-3 Cosmic Black',
  'Harley-Davidson X440 Denim Mustard',
  'Yamaha YZF R15 V4 Intensity White',
  'Royal Enfield Hunter 350 Dapper Grey',
  'Honda CB350 H\'ness Matte Black'
];

for (let i = 4; i <= 20; i++) {
  const custObj = mockCustomers[(i + 2) % mockCustomers.length];
  const bName = bikeNames[(i - 4) % bikeNames.length];
  mockSoldVehicles.push({
    id: `sold-${i.toString().padStart(3, '0')}`,
    vehicleId: `veh-${(i + 30).toString().padStart(3, '0')}`,
    vehicleName: bName,
    brand: bName.split(' ')[0],
    registrationNumber: `KL${(i % 14 + 1).toString().padStart(2, '0')}AX${1000 + i * 5}`,
    customerId: custObj.id,
    customerName: custObj.name,
    customerPhone: custObj.phone,
    salePrice: 210000 + (i * 15000),
    originalPrice: 225000 + (i * 15000),
    discount: 15000,
    paymentMethod: i % 2 === 0 ? 'Bank Transfer' : 'Finance',
    deliveryDate: `2026-07-${(10 + (i % 18)).toString().padStart(2, '0')}`,
    salesExecutive: (i % 2 === 0 ? 'Priya Verma' : 'Rajesh Sharma'),
    remarks: 'Delivered to customer in Kerala with full RTO registration transfer.',
    branchId: `br-00${(i % 3) + 1}`,
    soldAt: `2026-07-${(10 + (i % 18)).toString().padStart(2, '0')}`
  });
}
