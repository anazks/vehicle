import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';

import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { BranchesPage } from '../pages/BranchesPage';
import { VehicleListPage } from '../pages/VehicleListPage';
import { AddVehiclePage } from '../pages/AddVehiclePage';
import { EditVehiclePage } from '../pages/EditVehiclePage';
import { VehicleDetailsPage } from '../pages/VehicleDetailsPage';
import { BulkUploadPage } from '../pages/BulkUploadPage';
import { CustomersPage } from '../pages/CustomersPage';
import { CustomerDetailsPage } from '../pages/CustomerDetailsPage';
import { FollowupsPage } from '../pages/FollowupsPage';
import { SoldVehiclesPage } from '../pages/SoldVehiclesPage';
import { StaffPage } from '../pages/StaffPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const RootRedirect: React.FC = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <Navigate to="/dashboard" replace /> : <Navigate to="/vehicles" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<RootRedirect />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/vehicles" element={<VehicleListPage />} />
        <Route path="/add-vehicle" element={<AddVehiclePage />} />
        <Route path="/vehicles/add" element={<AddVehiclePage />} />
        <Route path="/vehicles/edit/:id" element={<EditVehiclePage />} />
        <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
        <Route path="/bulk-upload" element={<BulkUploadPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailsPage />} />
        <Route path="/followups" element={<FollowupsPage />} />
        <Route path="/sold-vehicles" element={<SoldVehiclesPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
