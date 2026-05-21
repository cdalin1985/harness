import React from 'react';

type BadgeType = 'default' | 'active' | 'draft' | 'premium' | 'info' | 'warn' | 'success';

export function Badge({ children, type = 'default' }: { children: React.ReactNode, type?: BadgeType }) {
  const styles: Record<BadgeType, string> = {
    default: "bg-[#F3F4F6] text-[#6B7280]",
    active: "bg-[#ECFDF5] text-[#059669]",
    draft: "bg-[#F3F4F6] text-[#6B7280]",
    premium: "bg-indigo-50 text-brand",
    info: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    warn: "bg-amber-50 text-amber-700 border border-amber-100",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  };
  
  return (
    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${styles[type]}`}>
      {children}
    </span>
  );
}
