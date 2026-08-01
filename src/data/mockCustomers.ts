import { Customer } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Vishnu Nambiar',
    phone: '+91 98470 12345',
    whatsApp: '+91 98470 12345',
    email: 'vishnu.nambiar@kochi-tech.in',
    address: 'Villa 4B, Skyline Imperial, Panampilly Nagar, Kochi, Kerala',
    budget: 400000,
    interestedVehicle: 'Royal Enfield Continental GT 650',
    preferredBrand: 'Royal Enfield',
    salesExecutive: 'Rajesh Sharma',
    remarks: 'Looking for GT 650 Chrome edition. Test ride requested at Kochi Showroom.',
    visitDate: '2026-07-28',
    branchId: 'br-001',
    createdAt: '2026-07-28'
  },
  {
    id: 'cust-002',
    name: 'Anjali Menon',
    phone: '+91 94471 88990',
    whatsApp: '+91 94471 88990',
    email: 'anjali.menon@kerala.gov.in',
    address: 'House No 12, Kowdiar Gardens, Thiruvananthapuram, Kerala',
    budget: 1000000,
    interestedVehicle: 'Kawasaki Z900 ABS Inline-4',
    preferredBrand: 'Kawasaki',
    salesExecutive: 'Priya Verma',
    remarks: 'Superbike enthusiast. Wants inline-4 exhaust demonstration in Trivandrum.',
    visitDate: '2026-07-29',
    branchId: 'br-001',
    createdAt: '2026-07-29'
  },
  {
    id: 'cust-003',
    name: 'Muhammed Fayis',
    phone: '+91 97455 77812',
    whatsApp: '+91 97455 77812',
    email: 'fayis.m@calicuttraders.io',
    address: 'Mavoor Road Junction, Kozhikode (Calicut), Kerala',
    budget: 2500000,
    interestedVehicle: 'BMW S 1000 RR Pro M Package',
    preferredBrand: 'BMW Motorrad',
    salesExecutive: 'Amit Patel',
    remarks: 'Track day enthusiast. Token amount paid for S 1000 RR.',
    visitDate: '2026-07-30',
    branchId: 'br-002',
    createdAt: '2026-07-30'
  },
  {
    id: 'cust-004',
    name: 'Gokul Pillai',
    phone: '+91 98460 33211',
    whatsApp: '+91 98460 33211',
    email: 'gokul.pillai@infopark.org',
    address: 'Phase 2 Tech Zone, Kakkanad, Ernakulam, Kerala',
    budget: 1200000,
    interestedVehicle: 'Triumph Street Triple 765 RS',
    preferredBrand: 'Triumph',
    salesExecutive: 'Sneha Roy',
    remarks: 'Wants 3-cylinder naked bike for Western Ghats highway tours.',
    visitDate: '2026-07-31',
    branchId: 'br-003',
    createdAt: '2026-07-31'
  },
  {
    id: 'cust-005',
    name: 'Dr. Meera Kurup',
    phone: '+91 97441 99882',
    whatsApp: '+91 97441 99882',
    email: 'dr.meera@astermedcity.com',
    address: 'Aster Medcity Enclave, Cheranalloor, Kochi, Kerala',
    budget: 150000,
    interestedVehicle: 'Ather 450X Gen-3 Pro Pack EV',
    preferredBrand: 'Ather Energy',
    salesExecutive: 'Priya Verma',
    remarks: 'Looking for daily city commute smart electric scooter in Kochi.',
    visitDate: '2026-08-01',
    branchId: 'br-001',
    createdAt: '2026-08-01'
  }
];

const keralaNames = [
  'Fidha Ashraf',
  'Abhijith Varma',
  'Sarath Chandran',
  'Jithu Joseph',
  'Deepak Nair',
  'Reshma Rajan',
  'Arjun Varghese',
  'Nikhil K.P.',
  'Sujith Sreedharan',
  'Aiswarya K.V.',
  'Siddharth Panicker',
  'Fahad Rahman',
  'Gouri Parvathy',
  'Kevin Mathew',
  'Harikrishnan Nair',
  'Shruthi Vijay',
  'Pranav Mohan',
  'Nithin Thomas',
  'Athira Krishnan',
  'Rahul K. Nair',
  'Ashwin Ramachandran',
  'Sneha Elizabeth',
  'Deepu Madhavan',
  'Vipin Das',
  'Niveditha Pillai'
];

const keralaTowns = [
  'Fort Kochi, Ernakulam, Kerala',
  'Swaraj Round, Thrissur, Kerala',
  'Boat Jetty Road, Alappuzha, Kerala',
  'Kottayam Central, Kottayam, Kerala',
  'Main Town Road, Palakkad, Kerala',
  'Calicut Beach Road, Kozhikode, Kerala',
  'Kannur City Town, Kannur, Kerala',
  'Malappuram KSRTC Junction, Kerala',
  'Wayanad Hills, Kalpetta, Kerala',
  'Kollam Beach Road, Kollam, Kerala',
  'Pathanamthitta Town, Kerala',
  'Thodupuzha, Idukki, Kerala',
  'Guruvayur Temple Road, Thrissur, Kerala',
  'Angamaly Town, Ernakulam, Kerala',
  'Tiruvalla Bypass, Pathanamthitta, Kerala',
  'Payyanur Town, Kannur, Kerala',
  'Changanassery, Kottayam, Kerala',
  'Attingal, Thiruvananthapuram, Kerala',
  'Kanhangad, Kasaragod, Kerala',
  'Manjeri, Malappuram, Kerala'
];

const bikeBrands = ['Royal Enfield', 'Kawasaki', 'BMW Motorrad', 'Triumph', 'KTM', 'Honda', 'Yamaha', 'Ather Energy'];

for (let i = 6; i <= 30; i++) {
  const name = keralaNames[(i - 6) % keralaNames.length];
  const address = keralaTowns[(i - 6) % keralaTowns.length];
  const brand = bikeBrands[i % bikeBrands.length];
  mockCustomers.push({
    id: `cust-${i.toString().padStart(3, '0')}`,
    name: `${name}`,
    phone: `+91 974${(i + 10).toString().padStart(2, '0')} ${1000 + i * 3}`,
    whatsApp: `+91 974${(i + 10).toString().padStart(2, '0')} ${1000 + i * 3}`,
    email: `${name.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`,
    address,
    budget: 200000 + (i * 45000),
    interestedVehicle: `${brand} Motorcycle`,
    preferredBrand: brand,
    salesExecutive: (i % 2 === 0 ? 'Priya Verma' : 'Rajesh Sharma'),
    remarks: 'Customer interested in pre-owned motorcycle inspection in Kerala branch.',
    visitDate: `2026-07-${(15 + (i % 15)).toString().padStart(2, '0')}`,
    branchId: `br-00${(i % 3) + 1}`,
    createdAt: `2026-07-${(15 + (i % 15)).toString().padStart(2, '0')}`
  });
}
