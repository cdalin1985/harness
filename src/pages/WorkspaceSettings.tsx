import { useState } from 'react';
import { Save, Users, CreditCard, Settings, Shield } from 'lucide-react';

export default function WorkspaceSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General Settings', icon: Settings },
    { id: 'members', name: 'Team Members', icon: Users },
    { id: 'billing', name: 'Plan & Billing', icon: CreditCard },
    { id: 'permissions', name: 'Permissions', icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-10 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workspace Settings</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage your team, billing, and system preferences.</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Navigation */}
        <div className="w-64 flex flex-col gap-1 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon size={16} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl">
          {activeTab === 'general' && (
            <div className="card p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Workspace Details</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Workspace Name</label>
                    <input type="text" defaultValue="Acme Corp" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Workspace ID</label>
                    <input type="text" disabled defaultValue="ws_01H9Y8..." className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 font-mono text-xs text-slate-500 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end">
                <button className="btn-primary flex items-center gap-2">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="card flex flex-col p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">Team Members</h3>
                <button className="btn-primary py-1.5 px-3 text-xs">Invite Member</button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gradient-to-br from-brand to-indigo-400 rounded-full" />
                     <div>
                       <div className="font-bold text-sm text-slate-900">Alex Rivers</div>
                       <div className="text-xs text-slate-500">Owner</div>
                     </div>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">workspace_owner</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="card p-8 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Team/Agency Plan</h3>
                  <p className="text-sm text-slate-500 font-medium">Billed annually at $149/mo</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest rounded-full">Active</span>
              </div>
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-900">Premium Harness Library Access</span>
                  <span className="text-xs font-bold text-brand">Included</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900">Custom Export Formats</span>
                  <span className="text-xs font-bold text-brand">Included</span>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-200">
                <button className="border border-slate-200 text-slate-600 font-bold text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-all">Manage Subscription</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
