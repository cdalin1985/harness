import React from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

const DefaultDenied = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <Shield size={40} className="text-slate-300" />
    <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
    <p className="text-sm text-slate-500 max-w-sm text-center">
      You do not have permission to view this page. Contact your workspace administrator.
    </p>
  </div>
);

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback ?? <DefaultDenied />}</>;
  }

  return <>{children}</>;
}
