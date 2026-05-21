import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LandingNavbar() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const _handleAction = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      await login();
      // Optional: Wait for login and then route to dashboard? It will auto-update state
    }
  };

  return (
    <nav className="h-[72px] bg-white border-b border-[#E5E7EB] px-8 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">H</div>
        <span className="font-bold text-xl tracking-tight text-slate-900">HarnessOS</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/catalog" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Catalog</Link>
        <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Pricing</Link>
        {user && (
          <>
            <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Dashboard</Link>
            {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'workspace_admin') && (
              <Link to="/admin" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Admin</Link>
            )}
          </>
        )}
        <div className="w-[1px] h-4 bg-slate-200" />
        {user ? (
          <Link to="/dashboard" className="btn-primary py-2 px-4 shadow-sm text-sm">
            Go to App
          </Link>
        ) : (
          <button onClick={login} className="btn-primary py-2 px-4 shadow-sm text-sm">
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
