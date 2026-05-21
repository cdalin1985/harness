import React from 'react';
import { Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/Badge';
import { HarnessTemplate } from '../types';
import { CATEGORIES } from '../data';

export function AdminTable({ templates }: { templates: HarnessTemplate[] }) {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-5 flex items-center justify-between border-b border-[#E5E7EB]">
         <h2 className="text-lg font-bold text-slate-900">Global Harness Templates</h2>
         <Link to="/admin/editor" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
           <Plus size={14} />
           Create Template
         </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F9FAFB] text-[10px] font-bold uppercase tracking-widest text-[#6B7280] border-b border-[#E5E7EB]">
              <th className="px-5 py-3">Template Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">License</th>
              <th className="px-5 py-3">Version</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id} className="border-b border-[#E5E7EB] hover:bg-slate-50 transition-colors last:border-0">
                <td className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <Shield size={14} />
                  </div>
                  <span className="font-bold text-sm text-slate-900">{t.name}</span>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-600 font-medium">
                  {CATEGORIES.find(c => c.id === t.categoryId)?.name || t.categoryId}
                </td>
                <td className="px-5 py-3.5">
                  <Badge type={t.isPremium ? 'premium' : 'default'}>
                    {t.isPremium ? `$${t.price}` : 'Free'}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-xs font-mono text-slate-500 font-bold">{t.currentVersionId}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex justify-end gap-1">
                    <Link to={`/admin/editor/${t.id}`} className="p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-400 hover:text-brand transition-all flex items-center">
                      <Edit2 size={14} />
                    </Link>
                    <button className="p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-400 hover:text-rose-600 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
