import React from 'react';
import { Lock, ShoppingCart } from 'lucide-react';

interface PremiumLockProps {
  price: number;
  message?: string;
  onPurchase?: () => void;
}

export function PremiumLock({ price, message = "Purchase this harness to unlock the full system prompt, workflow logic, and evaluation test suites.", onPurchase }: PremiumLockProps) {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-10">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-brand mb-6 animate-bounce border border-slate-100">
        <Lock size={28} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">Premium Harness Locked</h3>
      <p className="text-sm font-medium text-slate-600 max-w-sm mb-8 leading-relaxed">{message}</p>
      <button 
        onClick={onPurchase}
        className="btn-primary flex items-center gap-2 px-8 py-3 shadow-lg shadow-indigo-500/20"
      >
        <ShoppingCart size={18} />
        Purchase for ${price}
      </button>
    </div>
  );
}
