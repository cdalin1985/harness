import React from 'react';
import Sidebar, { Header } from './Navbar';
import LandingNavbar from './LandingNavbar';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/pricing';

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-surface">
        <LandingNavbar />
        <main className="min-h-screen max-w-7xl mx-auto px-8 py-12">
          {children}
        </main>
        <footer className="border-t border-[#E5E7EB] py-12 px-8 mt-20 text-center">
          <p className="text-xs font-medium text-slate-400">© 2026 Harness Infrastructure Group. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-text-main">
      <Sidebar />
      <div className="pl-[260px] flex flex-col min-h-screen">
        <Header />
        <main className="pt-[72px] flex-grow">
          <div className="p-8 max-w-[1400px] mx-auto h-full">
            {children}
          </div>
        </main>
        <footer className="border-t border-[#E5E7EB] py-8 px-8 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
            <p>© 2026 Harness Infrastructure Group. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-brand transition-colors">Documentation</a>
              <a href="#" className="hover:text-brand transition-colors">Security</a>
              <a href="#" className="hover:text-brand transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
