import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@teddy-monorepo/web/shared';
import { AuthProvider, ProtectedRoute, LoginPage } from '@teddy-monorepo/web/feature-auth';
import { DashboardPage } from '@teddy-monorepo/web/feature-dashboard';
import { ClientsPage, ClientsSelectedPage } from '@teddy-monorepo/web/feature-clients';
import './app.css';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/selected"
          element={
            <ProtectedRoute>
              <ClientsSelectedPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 - Página não encontrada</div>} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
