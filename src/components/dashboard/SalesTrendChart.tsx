import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 0.8, count: 8 },
  { month: 'Feb', sales: 1.2, count: 12 },
  { month: 'Mar', sales: 1.6, count: 15 },
  { month: 'Apr', sales: 1.4, count: 14 },
  { month: 'May', sales: 2.1, count: 18 },
  { month: 'Jun', sales: 2.8, count: 22 },
  { month: 'Jul', sales: 3.4, count: 28 }
];

export const SalesTrendChart: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-sky-100 bg-white shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Monthly Sales Revenue</h4>
          <p className="text-xs text-slate-500">Gross revenue generated in ₹ Cr</p>
        </div>
        <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
          +28.4% Growth
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" Cr" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e0f2fe',
                borderRadius: '12px',
                color: '#0f172a',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(val: any) => [`₹ ${val} Cr`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#0284c7"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#salesGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
