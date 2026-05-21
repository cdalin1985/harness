import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  featured?: boolean;
  period?: string;
  trialText?: string;
  buttonText?: string;
  onSelect?: () => void;
}

export function PricingCard({ 
  title, 
  price, 
  features, 
  featured = false,
  period = '/mo',
  trialText,
  buttonText,
  onSelect
}: PricingCardProps) {
  return (
    <div className={`card overflow-hidden relative flex flex-col h-full bg-white border border-slate-200 p-6 ${featured ? 'border-brand ring-2 ring-brand/10 shadow-lg md:scale-105 z-10' : ''}`}>
      {featured && (
        <div className="absolute top-0 right-0 bg-brand text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
          Most Popular
        </div>
      )}
      
      {trialText && (
        <span className="absolute top-3 left-6 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-brand border border-indigo-100 uppercase tracking-wider">
          {trialText}
        </span>
      )}

      <h3 className={`text-xs font-bold uppercase tracking-widest text-slate-500 ${trialText ? 'mt-6' : ''} mb-4`}>{title}</h3>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-black text-slate-900">{price}</span>
        {price !== 'Custom' && price !== '$0' && (
          <span className="text-sm font-semibold text-slate-400">{period}</span>
        )}
      </div>

      <div className="h-5 mb-6">
        {trialText && price !== 'Custom' && (
          <p className="text-xs text-brand font-semibold">Includes 7 days of full uninhibited access</p>
        )}
      </div>

      <ul className="flex flex-col gap-4 mb-8 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
            <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      <button 
        onClick={onSelect}
        className={`w-full py-2.5 rounded-lg font-bold transition-all text-sm shadow-sm hover:shadow-md cursor-pointer ${featured ? 'bg-brand text-white hover:bg-brand-dark' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
      >
        {buttonText || (trialText ? 'Start Free Trial' : `Get ${title}`)}
      </button>
    </div>
  );
}
