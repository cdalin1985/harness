import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SAMPLE_TEMPLATES, CATEGORIES } from '../data';
import { Star, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PremiumLock } from '../components/PremiumLock';

export default function HarnessDetail() {
  const { id } = useParams();
  const template = SAMPLE_TEMPLATES.find(t => t.id === id) || SAMPLE_TEMPLATES[0];

  if (!template) {
    return (
      <div className="card py-20 text-center flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-slate-900">Harness Template Not Found</h3>
        <p className="text-sm text-slate-500 mt-1">Adjust your filters or query parameter settings and try again.</p>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === template.categoryId);

  return (
    <div className="flex flex-col gap-10">
      <Link to="/catalog" className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors font-semibold group w-fit text-sm">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                {category ? category.name : 'General'}
               </span>
               <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star size={14} className="fill-amber-500" />
                {template.rating} <span className="text-slate-400 font-medium">(120+ validations)</span>
               </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{template.name}</h1>
            <p className="text-xl font-bold text-slate-700 tracking-tight">{template.tagline}</p>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl font-medium">
              {template.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mt-2 pt-6 border-t border-[#E5E7EB]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Target User</span>
                <span className="text-sm font-bold text-slate-900">{template.targetUser}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Business Outcome</span>
                <span className="text-sm font-bold text-slate-900">{template.businessOutcome}</span>
              </div>
            </div>
          </header>

          <section className="card">
            <h2 className="text-xl font-bold mb-6 text-slate-900">Package Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ContentItem title="System Prompt" desc="Optimized for role-specific consistency." />
              <ContentItem title="Quality Gates" desc="Semantic guards against hallucinations." />
              <ContentItem title="Memory Rules" desc="Long-term context retention strategies." />
              <ContentItem title="Workflow Charts" desc="Visual logic for multi-step agent tasks." />
              <ContentItem title="Evaluation Rubric" desc="Metrics for automated quality testing." />
              <ContentItem title="Export Modules" desc="Native JSON, Python, and SDK formats." />
            </div>
          </section>

          <section className="card p-0 overflow-hidden relative border-slate-200">
            <div className="bg-slate-50 p-8 flex flex-col gap-4">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">Blueprint Architecture Preview</h3>
              <div className="font-mono text-xs text-slate-400 opacity-60 select-none">
                {`{
  "role": "customer_support_expert",
  "style": "high_empathy",
  "memory_window": "10_turns",
  "workflow": [
    "identify_user_intent",
    "check_status_api",
    "formulate_response"
  ],
  ... [REDACTED PREVIEW]
}`}
              </div>
            </div>
            {template.isPremium && (
              <PremiumLock price={template.price} />
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card flex flex-col gap-8">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {template.price === 0 ? 'Free' : `$${template.price}`}
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">One-time purchase per workspace</p>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full btn-primary text-base">
                {template.price === 0 ? 'Install Harness' : 'Purchase License'}
              </button>
              <button className="w-full bg-slate-50 border border-slate-200 text-slate-600 py-2.5 rounded-lg font-bold hover:bg-slate-100 transition-all text-sm">
                View Version History
              </button>
            </div>

            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                <CheckCircle2 size={16} className="text-brand" />
                Verified Infrastructure
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                <CheckCircle2 size={16} className="text-brand" />
                Commercial Use License
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                <CheckCircle2 size={16} className="text-brand" />
                Lifetime Updates for v{template.currentVersionId.replace('v-', '')}
              </li>
            </ul>
          </div>

          <div className="card bg-slate-900 border-slate-800 text-white flex flex-col gap-4">
             <Shield size={24} className="text-slate-500 mb-1" />
             <h4 className="text-base font-bold">Harness Guarantee</h4>
             <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Every harness in our catalog undergoes rigorous evaluation for hallucination resistance and safety alignment before being listed.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E7EB] hover:border-brand/20 transition-all">
      <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </div>
  );
}
