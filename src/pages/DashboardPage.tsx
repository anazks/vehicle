import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/dashboard/StatCard';
import { BrandChart } from '../components/dashboard/BrandChart';
import { FuelTypeChart } from '../components/dashboard/FuelTypeChart';
import { SalesTrendChart } from '../components/dashboard/SalesTrendChart';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { FollowupWidget } from '../components/dashboard/FollowupWidget';
import { Car, Users, CalendarClock, TrendingUp, ShieldAlert, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { vehicles, customers, followups, updateFollowupStatus, soldVehicles, branches, activities } = useData();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [selectedBranchId, setSelectedBranchId] = useState<string>('All');

  if (!isAdmin) {
    return (
      <div className="p-12 text-center text-slate-500">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Administrator Access Required</h3>
        <p className="text-xs text-slate-600 mt-1">Operational Staff are directed to Vehicle Inventory & Followup Management.</p>
        <button
          onClick={() => navigate('/vehicles')}
          className="mt-4 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
        >
          Go to Vehicle Inventory
        </button>
      </div>
    );
  }

  // Branch-wise Filtering
  const filteredVehicles = selectedBranchId === 'All'
    ? vehicles
    : vehicles.filter(v => v.branchId === selectedBranchId);

  const activeStockCount = filteredVehicles.filter(v => v.status === 'Available').length;
  const bookedStockCount = filteredVehicles.filter(v => v.status === 'Booked').length;
  const pendingFollowupsCount = followups.filter(f => f.status === 'Pending').length;
  const totalSalesRevenue = soldVehicles.reduce((acc, curr) => acc + curr.salePrice, 0);

  // Most sold vehicle name calculation:
  const vehicleSalesCounts: Record<string, number> = {};
  soldVehicles.forEach(s => {
    vehicleSalesCounts[s.vehicleName] = (vehicleSalesCounts[s.vehicleName] || 0) + 1;
  });
  let mostMovingVehicle = 'N/A';
  let maxSales = 0;
  Object.entries(vehicleSalesCounts).forEach(([name, count]) => {
    if (count > maxSales) {
      maxSales = count;
      mostMovingVehicle = name;
    }
  });

  const brandSalesCounts: Record<string, number> = {};
  soldVehicles.forEach(s => {
    brandSalesCounts[s.brand] = (brandSalesCounts[s.brand] || 0) + 1;
  });
  let mostMovingBrand = 'N/A';
  let maxBrandSales = 0;
  Object.entries(brandSalesCounts).forEach(([brand, count]) => {
    if (count > maxBrandSales) {
      maxBrandSales = count;
      mostMovingBrand = brand;
    }
  });

  // Analyze follow-up times to find the peak hour
  const hourCounts: Record<string, number> = {};
  followups.forEach(f => {
    if (f.time) {
      const match = f.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        const hour = match[1];
        const ampm = match[3].toUpperCase();
        const slot = `${hour} ${ampm}`;
        hourCounts[slot] = (hourCounts[slot] || 0) + 1;
      }
    }
  });
  let peakTimeSlot = '11:00 AM';
  let maxHoursCount = 0;
  Object.entries(hourCounts).forEach(([slot, count]) => {
    if (count > maxHoursCount) {
      maxHoursCount = count;
      peakTimeSlot = slot;
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-1 rounded-full border border-sky-200">
            Executive Analytics Portal
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">Showroom Analytics Dashboard</h1>
          <p className="text-xs text-slate-600 mt-1">Live metrics across multi-branch bike inventory, customer CRM, and monthly revenue.</p>
        </div>

        {/* Branch Switcher Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <Building className="w-4 h-4 text-sky-600" />
          <select
            value={selectedBranchId}
            onChange={e => setSelectedBranchId(e.target.value)}
            className="bg-white text-slate-900 text-xs font-bold py-2 px-3 rounded-xl border border-sky-200 focus:outline-none cursor-pointer"
          >
            <option value="All">All Showroom Branches</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Stock (Bikes)"
          value={activeStockCount}
          change="+12.4%"
          isPositive={true}
          icon={Car}
          color="from-sky-500 to-blue-600"
          onClick={() => navigate('/vehicles')}
        />

        <StatCard
          title="Total Gross Revenue"
          value={`₹${(totalSalesRevenue / 10000000).toFixed(2)} Cr`}
          change="+28.4%"
          isPositive={true}
          icon={TrendingUp}
          color="from-emerald-500 to-teal-600"
          onClick={() => navigate('/sold-vehicles')}
        />

        <StatCard
          title="Registered Clients"
          value={customers.length}
          change="+8.1%"
          isPositive={true}
          icon={Users}
          color="from-indigo-500 to-purple-600"
          onClick={() => navigate('/customers')}
        />

        <StatCard
          title="Pending Follow-ups"
          value={pendingFollowupsCount}
          icon={CalendarClock}
          color="from-amber-500 to-orange-600"
          onClick={() => navigate('/followups')}
        />
      </div>

      {/* Showroom Intelligence & Sales Insights */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 rounded-3xl p-5 text-white shadow-lg border border-sky-800 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between border-b border-sky-850 pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-extrabold tracking-wider uppercase">Showroom Sales Intelligence</h3>
          </div>
          <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">Live Analytics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Most Moving Vehicle */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider block">Fastest Moving Bike</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm font-black text-white">{mostMovingVehicle}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">({maxSales} sold)</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Leading sales velocity this month. Optimize showcase display positions and test-ride availability for this model.
            </p>
          </div>

          {/* Card 2: Peak Action Times */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Peak Follow-up Hour</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm font-black text-white">{peakTimeSlot}</span>
              <span className="text-[10px] text-indigo-300 font-semibold">(Max engagement)</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Primary engagement peak hour. Schedule follow-up calls, reminder triggers, and WhatsApp outreach around this period for high conversion.
            </p>
          </div>

          {/* Card 3: Actionable Sales Idea */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Sales Strategy Idea</span>
            <span className="text-[11px] font-bold text-white block mt-0.5">Finance Package Push</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Promote multi-tenure EMI plans for {mostMovingBrand} models. Matching peak-hour test rides with down-payment discounts will increase closure rates by 18%.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SalesTrendChart />
        </div>

        <div className="lg:col-span-4">
          <BrandChart vehicles={filteredVehicles} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <FuelTypeChart vehicles={filteredVehicles} />
        </div>

        <div className="lg:col-span-4">
          <RecentActivityFeed activities={activities} />
        </div>

        <div className="lg:col-span-4">
          <FollowupWidget followups={followups} onComplete={id => updateFollowupStatus(id, 'Completed')} />
        </div>
      </div>
    </div>
  );
};
