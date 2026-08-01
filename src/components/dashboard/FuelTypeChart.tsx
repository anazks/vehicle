import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Vehicle } from '../../types';

interface FuelTypeChartProps {
  vehicles: Vehicle[];
}

const FUEL_COLORS: Record<string, string> = {
  Petrol: '#0284c7',
  Electric: '#10b981',
  Hybrid: '#8b5cf6',
  Diesel: '#3b82f6',
  CNG: '#f59e0b'
};

export const FuelTypeChart: React.FC<FuelTypeChartProps> = ({ vehicles }) => {
  const counts: Record<string, number> = { Petrol: 0, Electric: 0, Hybrid: 0 };
  vehicles.forEach(v => {
    if (counts[v.fuel] !== undefined) counts[v.fuel]++;
    else counts[v.fuel] = 1;
  });

  const data = Object.entries(counts).map(([name, count]) => ({ name, count }));

  return (
    <div className="glass-card rounded-2xl p-5 border border-sky-100 bg-white flex flex-col justify-between h-full shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Engine & Fuel Systems</h4>
        <span className="text-xs font-semibold text-slate-500">Total {vehicles.length}</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e0f2fe',
                borderRadius: '12px',
                color: '#0f172a',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`fuel-cell-${index}`} fill={FUEL_COLORS[entry.name] || '#0284c7'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
