import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoleGuard } from '../auth/RoleGuard';
import { UserRole } from '../../types';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../contexts/AuthContext';

const mockUseAuth = vi.mocked(useAuth);

describe('RoleGuard', () => {
  it('renders children when user has an allowed role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'admin-1',
        email: 'admin@example.com',
        name: 'Admin User',
        avatar_url: '',
        role: UserRole.ADMIN,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
        <div>Admin Panel</div>
      </RoleGuard>
    );

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('shows Access Denied for unauthorized roles', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Regular User',
        avatar_url: '',
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
        <div>Admin Panel</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Regular User',
        avatar_url: '',
        role: UserRole.GUEST,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <RoleGuard
        allowedRoles={[UserRole.ADMIN]}
        fallback={<div>Custom Fallback</div>}
      >
        <div>Protected</div>
      </RoleGuard>
    );

    expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });
});
