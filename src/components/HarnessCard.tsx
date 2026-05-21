import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Lock, ChevronRight } from 'lucide-react';
import { HarnessTemplate } from '../types';

export function HarnessCard({ template }: { template: HarnessTemplate }) {
  return (
    <div className="card group cursor-pointer border-[#E5E7EB] hover:border-brand/30 relative flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-brand">
          <Database size={20} />
        </div>
        {template.isPremium && (
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-brand px-2 py-1 rounded-full flex items-center gap-1">
            <Lock size={10} />
            Premium
          </span>
        )}
      </div>
      
      <Link to={`/harness/${template.id}`}>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand transition-colors mb-1">{template.name}</h3>
      </Link>
      <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 leading-relaxed flex-grow">
        {template.description}
      </p>
      
      <div className="flex gap-6 pt-5 border-t border-[#F3F4F6]">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900">{template.rating}</span>
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Rating</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900">{template.price === 0 ? 'FREE' : `$${template.price}`}</span>
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">License Cost</span>
        </div>
        <Link to={`/harness/${template.id}`} className="ml-auto text-brand p-2 bg-indigo-50 rounded-lg bg-opacity-0 group-hover:bg-opacity-100 transition-all">
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
