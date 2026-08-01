import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Vehicle } from '../../types';

interface BrandChartProps {
  vehicles: Vehicle[];
}

const COLORS = ['#0284c7', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

export const BrandChart: React.FC<BrandChartProps> = ({ vehicles }) => {
  const brandCounts: Record<string, number> = {};
  vehicles.forEach(v => {
    brandCounts[v.brand] = (brandCounts[v.brand] || 0) + 1;
  });

  const data = Object.entries(brandCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <div className="glass-card rounded-2xl p-5 border border-sky-100 bg-white flex flex-col justify-between h-full shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Motorcycle Brands</h4>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
          {data.length} Brands
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#475569' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
