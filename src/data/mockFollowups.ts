import { Followup } from '../types';
import { mockCustomers } from './mockCustomers';

export const mockFollowups: Followup[] = [];

const todayStr = '2026-08-01';
const priorities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
const staffList = ['Rajesh Sharma', 'Priya Verma', 'Amit Patel', 'Sneha Roy', 'Alexander Pierce'];
const bikeList = [
  'Royal Enfield Continental GT 650',
  'Kawasaki Z900 ABS',
  'BMW S 1000 RR M Package',
  'Ducati Panigale V4 S',
  'Triumph Street Triple 765',
  'KTM Duke 390 Gen-3',
  'Harley-Davidson Iron 883',
  'BMW R 1250 GS Adventure',
  'Ather 450X EV Scooter',
  'Royal Enfield Himalayan 452'
];
const branches = ['br-001', 'br-002', 'br-003', 'br-004'];

for (let i = 1; i <= 100; i++) {
  let followupDate = todayStr;
  let status: 'Pending' | 'Completed' | 'Missed' | 'Cancelled' = 'Pending';

  if (i <= 25) {
    followupDate = todayStr;
    status = i % 3 === 0 ? 'Completed' : 'Pending';
  } else if (i <= 60) {
    const dayOffset = (i % 7) + 1;
    followupDate = `2026-08-0${Math.min(dayOffset + 1, 9)}`;
    status = 'Pending';
  } else if (i <= 80) {
    followupDate = '2026-07-28';
    status = i % 2 === 0 ? 'Missed' : 'Pending';
  } else {
    followupDate = '2026-07-20';
    status = 'Completed';
  }

  const customerObj = mockCustomers[(i - 1) % mockCustomers.length];
  const vehId = `veh-${(i % 50 + 1).toString().padStart(3, '0')}`;
  const priority = priorities[i % priorities.length];
  const staff = staffList[i % staffList.length];
  const vehicleName = bikeList[i % bikeList.length];

  mockFollowups.push({
    id: `flw-${i.toString().padStart(3, '0')}`,
    customerId: customerObj.id,
    customerName: customerObj.name,
    vehicleId: vehId,
    vehicleName,
    assignedStaff: staff,
    followupDate,
    time: `${(9 + (i % 8)).toString().padStart(2, '0')}:30 AM`,
    priority,
    status,
    notes: `Followup #${i}: Discussed Kerala showroom test ride, trade-in exchange valuation, and riding gear package.`,
    branchId: branches[i % branches.length],
    createdAt: '2026-07-25'
  });
}
