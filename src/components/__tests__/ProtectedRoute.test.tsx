import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { UserRole } from '../../types';

// Mock the AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../contexts/AuthContext';

const mockUseAuth = vi.mocked(useAuth);

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('ProtectedRoute', () => {
  it('shows spinner while loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      firebaseUser: null,
      loading: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <Wrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Wrapper>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    // Spinner should be present
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to / when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
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
      <Wrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Wrapper>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
