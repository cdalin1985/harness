import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import Catalog from './pages/Catalog';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import HarnessDetail from './pages/HarnessDetail';
import AdminCMS from './pages/AdminCMS';
import AdminTemplateEditor from './pages/AdminTemplateEditor';
import WorkspaceSettings from './pages/WorkspaceSettings';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/auth/RoleGuard';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';
import { UserRole } from './types';

const ADMIN_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
  UserRole.CONTENT_EDITOR,
];

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
              <Route path="/pricing" element={<PageWrapper><PricingPage /></PageWrapper>} />
              <Route path="/catalog" element={<PageWrapper><Catalog /></PageWrapper>} />
              <Route path="/harness/:id" element={<PageWrapper><HarnessDetail /></PageWrapper>} />

              {/* Authenticated routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PageWrapper><Dashboard /></PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <PageWrapper><WorkspaceSettings /></PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/builder/:id?"
                element={
                  <ProtectedRoute>
                    <PageWrapper><Builder /></PageWrapper>
                  </ProtectedRoute>
                }
              />

              {/* Admin-only routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={ADMIN_ROLES}>
                      <PageWrapper><AdminCMS /></PageWrapper>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/editor/:id?"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={ADMIN_ROLES}>
                      <PageWrapper><AdminTemplateEditor /></PageWrapper>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
