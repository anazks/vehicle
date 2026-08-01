import { Staff } from '../types';

export const mockStaff: Staff[] = [
  {
    id: 'stf-001',
    name: 'Alexander Pierce',
    phone: '+91 99000 11100',
    email: 'admin@automatrix.com',
    username: 'admin',
    password: 'admin',
    role: 'Admin',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    branchId: 'br-001',
    branchName: 'Mumbai Central Flagship',
    joiningDate: '2022-01-15',
    salesCount: 42
  },
  {
    id: 'stf-002',
    name: 'Rajesh Sharma',
    phone: '+91 98200 44551',
    email: 'rajesh.sharma@automatrix.com',
    username: 'rajesh',
    password: 'password123',
    role: 'Manager',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    branchId: 'br-001',
    branchName: 'Mumbai Central Flagship',
    joiningDate: '2022-03-10',
    salesCount: 38
  },
  {
    id: 'stf-003',
    name: 'Priya Verma',
    phone: '+91 98111 22334',
    email: 'priya.verma@automatrix.com',
    username: 'priya',
    password: 'password123',
    role: 'Sales Executive',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    branchId: 'br-001',
    branchName: 'Mumbai Central Flagship',
    joiningDate: '2023-02-01',
    salesCount: 29
  },
  {
    id: 'stf-004',
    name: 'Amit Patel',
    phone: '+91 99222 33445',
    email: 'amit.patel@automatrix.com',
    username: 'amit',
    password: 'password123',
    role: 'Sales Executive',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    branchId: 'br-002',
    branchName: 'Bandra Luxury Gallery',
    joiningDate: '2023-05-18',
    salesCount: 24
  },
  {
    id: 'stf-005',
    name: 'Sneha Roy',
    phone: '+91 98333 44556',
    email: 'sneha.roy@automatrix.com',
    username: 'sneha',
    password: 'password123',
    role: 'Sales Executive',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    branchId: 'br-003',
    branchName: 'Bengaluru Tech Pavilion',
    joiningDate: '2023-08-11',
    salesCount: 19
  }
];

// Generate 15 more staff members to make 20 total
const staffNames = [
  'Vikram Sen', 'Anjali Rao', 'Rishabh Mehta', 'Kavita Menon', 'Siddharth Saxena',
  'Tanvi Kapoor', 'Deepak Varma', 'Manish Iyer', 'Divya Nair', 'Rohan Bhatia',
  'Shruti Das', 'Tarun Jain', 'Alok Pandey', 'Neha Thakur', 'Gaurav Kulkarni'
];

const branches = [
  { id: 'br-001', name: 'Mumbai Central Flagship' },
  { id: 'br-002', name: 'Bandra Luxury Gallery' },
  { id: 'br-003', name: 'Bengaluru Tech Pavilion' },
  { id: 'br-004', name: 'Delhi NCR Hub' }
];

for (let i = 6; i <= 20; i++) {
  const name = staffNames[i - 6];
  const uname = name.toLowerCase().split(' ')[0];
  const br = branches[(i - 1) % branches.length];
  mockStaff.push({
    id: `stf-${i.toString().padStart(3, '0')}`,
    name,
    phone: `+91 98${i.toString().padStart(3, '0')} ${5500 + i}`,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@automatrix.com`,
    username: uname,
    password: 'password123',
    role: i % 5 === 0 ? 'Manager' : 'Sales Executive',
    photo: mockStaff[i % 5].photo,
    branchId: br.id,
    branchName: br.name,
    joiningDate: `2024-0${(i % 9) + 1}-10`,
    salesCount: 8 + (i * 2)
  });
}
