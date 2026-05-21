import React from 'react';

export function DashboardStat({ label, value, trend }: { label: string, value: string, trend?: string }) {
  return (
    <div className="card">
      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">{label}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {trend && (
        <div className={`text-[11px] font-semibold mt-2 ${trend.includes('+') ? 'text-emerald-600' : 'text-slate-400'}`}>
          {trend}
        </div>
      )}
    </div>
  );
}
