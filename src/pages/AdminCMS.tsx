import React, { useState } from 'react';
import { CATEGORIES, SAMPLE_TEMPLATES } from '../data';
import { Settings, Plus, Edit2, Users, BarChart3, Database, FileText } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { DashboardStat } from '../components/DashboardStat';

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState('templates');

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Console</h1>
        <p className="text-sm text-slate-500 font-medium">Global system management for HarnessOS categories, templates, and users.</p>
      </header>

      <div className="flex gap-2 bg-[#F3F4F6] p-1.5 rounded-xl w-fit">
        <TabButton active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} icon={<Database size={14} />} label="Harness Templates" />
        <TabButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Settings size={14} />} label="Categories" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={14} />} label="Users & RBAC" />
        <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 size={14} />} label="System Metrics" />
        <TabButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<FileText size={14} />} label="Audit Logs" />
      </div>

      <div className="flex-grow">
        {activeTab === 'templates' && (
          <AdminTable templates={SAMPLE_TEMPLATES} />
        )}

        {activeTab === 'categories' && (
           <div className="card">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-slate-900">Marketplace Categories</h2>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                <Plus size={14} />
                Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="p-4 rounded-xl bg-slate-50 border border-[#E5E7EB] flex items-start justify-between group">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-sm">{cat.name}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">{cat.description}</p>
                  </div>
                  <button className="text-slate-400 hover:text-brand transition-all opacity-0 group-hover:opacity-100">
                    <Edit2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card py-20 text-center flex flex-col items-center gap-3">
            <Users size={32} className="text-slate-300" />
            <h3 className="text-base font-bold text-slate-900">User Management</h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm">Detailed user management, role assignment, and workspace oversight available in v2.1.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-5">
               <DashboardStat label="Total Volume" value="$12.4k" trend="+8%" />
               <DashboardStat label="Active Subscriptions" value="420" trend="+12%" />
               <DashboardStat label="New Users" value="89" trend="+5%" />
               <DashboardStat label="Total API Calls" value="1.2M" trend="+22%" />
            </div>
            <div className="card h-64 bg-slate-50 flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-[#E5E7EB] shadow-none">
               Revenue Graph Component Preview
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="card py-20 text-center flex flex-col items-center gap-3">
             <FileText size={32} className="text-slate-300" />
             <h3 className="text-base font-bold text-slate-900">Admin Audit Logs</h3>
             <p className="text-xs text-slate-500 font-medium max-w-sm">Secure, immutable audit logging for all global template modifications and variable schema changes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 bg-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
