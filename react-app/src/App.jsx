import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import MainLayout from './pages/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { PERMISSIONS } from './utils/permissions';

import HomePage from './pages/HomePage';
import StockPage from './pages/StockPage';
import DashboardPage from './pages/DashboardPage';
import RegistersPage from './pages/RegistersPage';
import MovementsPage from './pages/MovementsPage';
import CountingPage from './pages/CountingPage';
import NewCountPage from './pages/NewCountPage';
import CountReportPage from './pages/CountReportPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AuditPage from './pages/AuditPage';

function App() {
    return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#28a745',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#dc3545',
              color: 'white',
            },
          },
        }}
      />
      <Router basename="/Controle1">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            {/* Rotas aninhadas com proteção por permissões */}
            <Route index element={<HomePage />} />
            
            <Route 
              path="/stock" 
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_STOCK]}>
                  <StockPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/dashboard" element={<DashboardPage />} />
            
            <Route 
              path="/registers" 
              element={
                <ProtectedRoute requiredPermissions={[
                  PERMISSIONS.VIEW_PRODUCTS, 
                  PERMISSIONS.VIEW_CATEGORIES, 
                  PERMISSIONS.VIEW_SUPPLIERS
                ]}>
                  <RegistersPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/movements" 
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_MOVEMENTS]}>
                  <MovementsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/counting" 
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_COUNTING]}>
                  <CountingPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/counting/new" 
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.CREATE_COUNTING]}>
                  <NewCountPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/counting/:id" 
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_COUNTING]}>
                  <CountReportPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_REPORTS]}>
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_SETTINGS]}>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/audit" 
              element={
                <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_AUDIT]}>
                  <AuditPage />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
