import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingCard } from '../components/PricingCard';
import { CheckoutModal } from '../components/CheckoutModal';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<{ title: string; price: string } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [salesContacted, setSalesContacted] = useState(false);
  const navigate = useNavigate();

  const handleSelectPlan = (title: string, price: string) => {
    if (title === 'Free Preview') {
      navigate('/dashboard');
      return;
    }
    if (title === 'Enterprise') {
      setSalesContacted(true);
      setTimeout(() => setSalesContacted(false), 3000);
      return;
    }
    
    // Open premium Checkout Modal
    setSelectedPlan({ title, price });
    setIsCheckoutOpen(true);
  };

  return (
    <div className="flex flex-col gap-12 pb-20 relative">
      <header className="text-center max-w-2xl mx-auto pt-10 px-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Pricing Plans</h1>
        <p className="text-base text-slate-600 font-medium max-w-lg mx-auto mb-8">
          Deploy reliable AI agents with HarnessOS at scale. Choose a plan that aligns with your volume.
        </p>

        {/* Sales contacted banner */}
        {salesContacted && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-sm font-bold animate-pulse max-w-md mx-auto">
            🚀 Enterprise Request Recorded! Our sales directors have been dispatched to contact your email.
          </div>
        )}

        {/* Toggle Billing Cycle */}
        <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Annual Billing
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider scale-95 origin-right">
              Save up to 35%
            </span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full px-4 items-stretch">
        <PricingCard 
          title="Free Preview" 
          price="$0" 
          buttonText="Start Running"
          onSelect={() => handleSelectPlan('Free Preview', '$0')}
          features={[
            'Pay-per-instance access',
            '3 Active Harnesses', 
            'Access Community Catalog', 
            'Standard Quality Gates'
          ]}
        />
        <PricingCard 
          title="Professional" 
          price={billingCycle === 'annual' ? '$19' : '$29'} 
          trialText="7-Day Trial"
          buttonText="Start Free Trial"
          onSelect={() => handleSelectPlan('Professional', billingCycle === 'annual' ? '$19' : '$29')}
          features={[
            'Unlimited Harness Instances', 
            'Full Premium Library Access', 
            'Custom Evaluation Rubrics', 
            'Advanced Memory Rules'
          ]}
        />
        <PricingCard 
          title="Team / Agency" 
          price={billingCycle === 'annual' ? '$149' : '$199'} 
          featured
          trialText="7-Day Trial"
          buttonText="Start Free Trial"
          onSelect={() => handleSelectPlan('Team / Agency', billingCycle === 'annual' ? '$149' : '$199')}
          features={[
            '5 Workspace Seats included', 
            'Team Collaboration History',
            'Publish Internal Templates',
            'Priority Support'
          ]}
        />
        <PricingCard 
          title="Enterprise" 
          price="Custom" 
          buttonText="Contact Sales"
          onSelect={() => handleSelectPlan('Enterprise', 'Custom')}
          features={[
            'Private Workspaces', 
            'Full Admin Audit Logs', 
            'Custom Quality Gates',
            'Custom Harness Creation'
          ]}
        />
      </section>

      <section className="max-w-3xl mx-auto w-full pt-16 border-t border-slate-200 px-4">
        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h3>
        <div className="flex flex-col gap-6">
          <div>
            <h4 className="font-bold text-slate-900">How does the 7-Day Free Trial work?</h4>
            <p className="text-sm text-slate-600 mt-1 font-medium">You get unrestricted access to active builder features and premium catalog items for exactly 7 days. You can cancel anytime before your trial concludes with a single click in your Workspace Settings without paying a cent.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900">What is a Harness Instance?</h4>
            <p className="text-sm text-slate-600 mt-1 font-medium">A deployed copy of a Harness Template. You can customize variables, API keys, and test inputs per instance.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Can I export my harnesses to my own infrastructure?</h4>
            <p className="text-sm text-slate-600 mt-1 font-medium">Yes! All plans include export capabilities. Professional and Enterprise plans allow exporting to specialized formats like native Python SDKs or LangChain modules.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900">How do Premium Catalog purchases work?</h4>
            <p className="text-sm text-slate-600 mt-1 font-medium">Premium templates are a one-time purchase per workspace, providing lifetime updates for newer versions of that specific template.</p>
          </div>
        </div>
      </section>

      {/* Renders checkout modal on demand */}
      {selectedPlan && (
        <CheckoutModal 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          planTitle={selectedPlan.title}
          planPrice={selectedPlan.price}
          billingCycle={billingCycle}
        />
      )}
    </div>
  );
}
