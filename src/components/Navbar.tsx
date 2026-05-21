import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Database, Terminal, User as UserIcon, Shield, Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const platformItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Database },
    { name: 'Harness Catalog', path: '/catalog', icon: LayoutGrid },
    { name: 'Harness Builder', path: '/builder', icon: Terminal },
  ];
  
  if (user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'workspace_admin') {
    platformItems.push({ name: 'Admin Console', path: '/admin', icon: Shield });
  }

  const workspaceItems = [
    { name: 'Team Members', path: '/settings', icon: UserIcon },
    { name: 'Workspace Settings', path: '/settings', icon: Terminal },
  ];

  return (
    <aside className="w-[260px] bg-sidebar text-white flex flex-col h-screen fixed left-0 top-0 z-50 p-6 overflow-y-auto border-r border-white/5">
      <Link to="/" className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">H</div>
        <span className="font-bold text-xl tracking-tight">HarnessOS</span>
      </Link>

      <nav className="flex flex-col gap-8 flex-1">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold mb-4 px-3">Platform</div>
          <div className="flex flex-col gap-1">
            {platformItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${location.pathname === item.path ? 'sidebar-nav-item-active' : ''}`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold mb-4 px-3">Workspace</div>
          <div className="flex flex-col gap-1">
            {workspaceItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="sidebar-nav-item"
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
        <div className="flex justify-between items-center px-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#374151] rounded-full overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url!} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand to-indigo-400" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold truncate">{user?.name || 'Guest User'}</div>
              <div className="text-[10px] text-[#6B7280] font-medium capitalize">{user?.role || 'User'}</div>
            </div>
          </div>
          {user && (
            <button onClick={logout} className="text-slate-500 hover:text-white transition-colors" title="Log out">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  const { user } = useAuth();
  
  return (
    <header className="h-[72px] bg-white border-b border-[#E5E7EB] fixed top-0 right-0 left-[260px] z-40 px-8 flex items-center justify-between">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search harnesses, deployments..." 
          className="w-full bg-[#F3F4F6] border-none rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all font-medium"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
        </button>
        <div className="w-[1px] h-6 bg-slate-200" />
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'Guest'}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-tighter capitalize">{user?.role || 'Not logged in'}</div>
          </div>
          <div className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
             {user?.avatar_url && <img src={user.avatar_url!} alt="avatar" className="w-full h-full object-cover" />}
          </div>
        </div>
      </div>
    </header>
  );
}
