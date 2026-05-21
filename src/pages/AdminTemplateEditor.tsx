import { useState } from 'react';
import { Save, ArrowLeft, Terminal, Shield, BookOpen, AlertCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminTemplateEditor() {
  const [activeTab, setActiveTab] = useState('metadata');

  const tabs = [
    { id: 'metadata', name: 'Metadata & Pricing', icon: BookOpen },
    { id: 'system_prompt', name: 'System Prompt', icon: Terminal },
    { id: 'rules', name: 'Operating Rules', icon: Shield },
    { id: 'quality', name: 'Quality Rubric', icon: AlertCircle },
    { id: 'tests', name: 'Harness Test Suite', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center bg-white border-b border-[#E5E7EB] px-6 py-4 -mt-8 -mx-8 mb-4">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">Published</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">v2.0.4</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">LeadScout Ultra</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E5E7EB] text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            Save Draft
          </button>
          <button className="btn-primary flex items-center gap-2 py-2 text-sm shadow-sm">
            <Save size={16} />
            Publish Version
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[#E5E7EB] pb-2 hide-scrollbar overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-brand text-brand bg-indigo-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white border border-[#E5E7EB] rounded-lg shadow-sm w-full max-w-4xl">
        {activeTab === 'metadata' && (
          <div className="p-8 flex flex-col gap-6">
             <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Harness Name</label>
                  <input type="text" defaultValue="LeadScout Ultra" className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Category Slug</label>
                  <input type="text" defaultValue="sales" className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tagline</label>
                <input type="text" defaultValue="Inbound lead qualification and handoff." className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Business Outcome</label>
                <textarea defaultValue="Increase qualified pipeline velocity and eliminate time wasted on weak leads." className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none min-h-[80px]" />
             </div>

             <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#E5E7EB]">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Price Type</label>
                  <select className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all">
                    <option value="subscription">Subscription</option>
                    <option value="one_time">One-Time</option>
                    <option value="free">Free</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Price Amount ($)</label>
                  <input type="number" defaultValue="79" className="w-full bg-slate-50 border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'system_prompt' && (
          <div className="h-full flex flex-col p-0 overflow-hidden">
             <div className="bg-slate-50 border-b border-[#E5E7EB] px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Edit core system prompt rules. Do not expose this block directly in public previews.</span>
             </div>
             <textarea 
               className="w-full h-full flex-grow p-6 text-sm font-mono leading-relaxed bg-white text-slate-800 resize-none focus:outline-none placeholder:text-slate-300"
               defaultValue="YOU ARE LEADSCOUT ULTRA.\n\nYOUR PRIMARY MISSION IS TO EVALUATE BANT CRITERIA ON ALL INBOUND OPPORTUNITIES..."
             />
          </div>
        )}

        {(activeTab === 'rules' || activeTab === 'quality' || activeTab === 'tests') && (
           <div className="p-8 flex flex-col items-center justify-center text-center h-full text-slate-400">
             <Shield size={32} className="mb-4 text-slate-300" />
             <h3 className="text-base font-bold text-slate-900">Standardized Schema Loading</h3>
             <p className="text-sm font-medium text-slate-500 max-w-sm">This editor section restricts input based on the globally configured JSON schema for this content block. Coming in v2.1.</p>
           </div>
        )}
      </div>
    </div>
  );
}
