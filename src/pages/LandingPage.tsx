import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Layers, Sparkles, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PricingCard } from '../components/PricingCard';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [queueNumber, setQueueNumber] = useState(0);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // Store to waitlist collection (document ID is the sanitized email)
      const sanitizedEmail = email.trim().toLowerCase().replace(/[^a-zA-Z0-9@._-]/g, '');
      const waitlistRef = doc(db, 'waitlist', sanitizedEmail);
      
      await setDoc(waitlistRef, {
        email: sanitizedEmail,
        createdAt: serverTimestamp()
      });

      // Generate seed visual queue size
      const randomSeed = Math.floor(Math.random() * 240) + 1240;
      setQueueNumber(randomSeed);
      setStatus('completed');
      setEmail('');
    } catch (err: unknown) {
      console.error('Waitlist registration failed:', err);
      setErrorMessage('Something went wrong. Please try again in a moment.');
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col gap-32">
      {/* Hero Section */}
      <section className="pt-20 text-center flex flex-col items-center gap-8 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-brand rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100"
        >
          <Zap size={14} className="fill-brand" />
          <span>v2.4.1 Live: Enterprise Memory Rules</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
          Deploy AI Employees with <span className="text-brand">Perfect Reliability.</span>
        </h1>
        
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
          HarnessOS is the infrastructure layer for professional AI agents. Package prompts, workflows, and evaluation rubrics into a single, versioned operating unit.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link to="/catalog" className="btn-primary px-8 py-4 text-base flex items-center gap-2 group">
            Explore Harness Catalog
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/builder" className="bg-white text-[#1E293B] border border-slate-200 px-8 py-4 rounded-lg font-bold text-base hover:bg-slate-50 transition-all">
            Build Custom Harness
          </Link>
        </div>
      </section>

      {/* Interactive Waitlist/Launch Section */}
      <section className="max-w-3xl mx-auto w-full px-4 -mt-16 -mb-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 md:p-10 rounded-2xl border border-slate-800 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -z-10" />

          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-[#6366F1] bg-indigo-500/10 px-3 py-1 rounded-sm mb-4 border border-indigo-500/20">
            <Sparkles size={11} className="fill-[#6366F1]" /> Early Beta Allocation
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
            Priority Infrastructure Pass
          </h2>
          <p className="text-sm text-slate-400 font-medium max-w-lg mx-auto mb-6 leading-relaxed">
            Register your interest to claim priority beta queue indexes. Get immediate early-buyer email newsletters and exclusive discounts upon global launch.
          </p>

          {status === 'completed' ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6 text-center max-w-md mx-auto"
            >
              <h4 className="text-emerald-400 font-black text-lg mb-1 flex items-center justify-center gap-1.5">
                🎉 Pre-Registration Complete!
              </h4>
              <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                Your sandbox developer ticket has been minted. You are currently **#{queueNumber}** in queue access for HarnessOS priority servers. Look out for launch emails!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter workspace developer email"
                disabled={status === 'submitting'}
                required
                className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-[#6366F1] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    Checking...
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <Send size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-xs text-rose-400 font-bold mt-3 animate-pulse">
              ⚠️ {errorMessage}
            </p>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<ShieldCheck className="text-emerald-600" />}
          title="Quality Gates"
          description="Enforce strict semantic validation and safety checks before any output is delivered to end users."
        />
        <FeatureCard 
          icon={<Layers className="text-brand" />}
          title="Version Control"
          description="Roll back instantly. Track every iteration of your system prompts and tool definitions across teams."
        />
        <FeatureCard 
          icon={<Zap className="text-amber-600" />}
          title="Export Anywhere"
          description="Download your harness as JSON, Python SDK, or direct LangChain/LlamaIndex modules."
        />
      </section>

      {/* Social Proof / Stats */}
      <section className="card bg-slate-900 text-white flex flex-col md:flex-row justify-around items-center gap-12 border-slate-800">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">1,200+</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Harnesses Shipped</p>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">99.9%</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Output Accuracy</p>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">15ms</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Validation Latency</p>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-12 text-slate-900 tracking-tight">Simple, Scaling Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          <PricingCard 
            title="Free Preview" 
            price="$0" 
            onSelect={() => window.scrollTo(0, 0)} // This works or link to pricing
            buttonText="Configure Free Pass"
            features={['3 Active Harnesses', 'Community Catalog', 'Basic Export']}
          />
          <PricingCard 
            title="Professional" 
            price="$19" 
            featured
            trialText="7-Day Trial"
            buttonText="Start Free Trial"
            onSelect={() => window.location.href = '/pricing'}
            features={['Unlimited Instances', 'Premium Catalog', 'Custom Evaluation Rubrics', 'API Access']}
          />
          <PricingCard 
            title="Enterprise" 
            price="Custom" 
            buttonText="Contact Sales"
            onSelect={() => window.location.href = '/pricing'}
            features={['Private Harbor', 'Audit Logs', 'Custom Quality Gates', 'SLA Support']}
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
}

