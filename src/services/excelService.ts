import * as XLSX from 'xlsx';
import { Vehicle } from '../types';

export interface BulkImportResult {
  totalRows: number;
  imported: Vehicle[];
  duplicates: { row: number; data: any; reason: string }[];
  failed: { row: number; data: any; reason: string }[];
}

export const excelService = {
  async parseVehicleExcel(file: File, existingVehicles: Vehicle[]): Promise<BulkImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const buffer = e.target?.result;
          const workbook = XLSX.read(buffer, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

          const existingRegs = new Set(existingVehicles.map(v => v.registrationNumber.toUpperCase()));

          const imported: Vehicle[] = [];
          const duplicates: { row: number; data: any; reason: string }[] = [];
          const failed: { row: number; data: any; reason: string }[] = [];

          rows.forEach((row, index) => {
            const rowIndex = index + 2;

            const name = String(row['Vehicle Name'] || row['name'] || row['Name'] || '').trim();
            const brand = String(row['Brand'] || row['brand'] || '').trim();
            const price = Number(row['Price'] || row['price'] || 0);
            const regNo = String(row['Registration Number'] || row['registrationNumber'] || row['Reg No'] || '').trim().toUpperCase();

            if (!name || !brand || !price || price <= 0) {
              failed.push({
                row: rowIndex,
                data: row,
                reason: 'Missing or invalid required fields (Bike Name, Brand, or Price)'
              });
              return;
            }

            if (regNo && existingRegs.has(regNo)) {
              duplicates.push({
                row: rowIndex,
                data: row,
                reason: `Duplicate Registration Number: ${regNo}`
              });
              return;
            }

            const id = `veh-imp-${Date.now()}-${index}`;
            const fuel = (row['Fuel'] || row['fuel'] || 'Petrol') as Vehicle['fuel'];
            const transmission = (row['Transmission'] || row['transmission'] || 'Manual') as Vehicle['transmission'];
            const year = Number(row['Year'] || row['year'] || 2022);
            const kmDriven = Number(row['KM Driven'] || row['kmDriven'] || 10000);

            const vehicleItem: Vehicle = {
              id,
              name,
              brand,
              model: String(row['Model'] || row['model'] || name),
              variant: String(row['Variant'] || row['variant'] || 'Standard'),
              year,
              price,
              offerPrice: Number(row['Offer Price'] || row['offerPrice'] || price),
              fuel,
              transmission,
              kmDriven,
              color: String(row['Color'] || row['color'] || 'Black'),
              owner: (row['Owner'] || row['owner'] || '1st Owner') as Vehicle['owner'],
              registrationNumber: regNo || `MH${Math.floor(10 + Math.random() * 89)}EX${Math.floor(1000 + Math.random() * 9000)}`,
              insuranceDate: String(row['Insurance Date'] || row['insuranceDate'] || '2027-12-31'),
              fcDate: String(row['FC Date'] || row['fcDate'] || '2037-12-31'),
              description: String(row['Description'] || row['description'] || 'Imported via Bulk Excel Upload'),
              features: ['Dual-Channel ABS', 'LED Headlamps', 'Digital Instrument Cluster', 'Alloy Wheels'],
              status: 'Available',
              coverImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
              images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80'],
              createdAt: new Date().toISOString().split('T')[0]
            };

            imported.push(vehicleItem);
            if (regNo) existingRegs.add(regNo);
          });

          resolve({
            totalRows: rows.length,
            imported,
            duplicates,
            failed
          });
        } catch (error: any) {
          reject(new Error(`Failed to process file: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error('File reading failed.'));
      reader.readAsBinaryString(file);
    });
  },

  exportToExcel(data: any[], fileName: string = 'export.xlsx'): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
  },

  downloadSampleTemplate(): void {
    const templateData = [
      {
        'Vehicle Name': 'Royal Enfield Interceptor 650',
        Brand: 'Royal Enfield',
        Model: 'Interceptor 650',
        Variant: 'Canyon Red',
        Year: 2023,
        Price: 350000,
        'Offer Price': 330000,
        Fuel: 'Petrol',
        Transmission: 'Manual',
        'KM Driven': 8200,
        Color: 'Canyon Red',
        Owner: '1st Owner',
        'Registration Number': 'MH02AB1234',
        'Insurance Date': '2027-06-30',
        'FC Date': '2038-06-29',
        Description: 'Single owner Cafe Racer in mint condition.'
      },
      {
        'Vehicle Name': 'Kawasaki Ninja Z900 ABS',
        Brand: 'Kawasaki',
        Model: 'Z900',
        Variant: 'Inline-4 Superbike',
        Year: 2022,
        Price: 920000,
        'Offer Price': 875000,
        Fuel: 'Petrol',
        Transmission: 'Manual',
        'KM Driven': 11000,
        Color: 'Metallic Spark Black',
        Owner: '1st Owner',
        'Registration Number': 'DL01CD5678',
        'Insurance Date': '2026-11-15',
        'FC Date': '2037-11-14',
        Description: 'Akrapovič exhaust fitted superbike.'
      }
    ];

    this.exportToExcel(templateData, 'Bike_Import_Sample_Template.xlsx');
  }
};
