import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Lock, CheckCircle2, ShieldAlert, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planTitle: string;
  planPrice: string;
  billingCycle: 'monthly' | 'annual';
}

export function CheckoutModal({ isOpen, onClose, planTitle, planPrice, billingCycle }: CheckoutModalProps) {
  const { user, login } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  if (!isOpen) return null;

  // Simple clean formatting helpers for inputs
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      setExpiry(value.substring(0, 2) + '/' + value.substring(2));
    } else {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvv(value);
  };

  const applyPromo = () => {
    setPromoError('');
    if (promoCode.toUpperCase() === 'LAUNCH' || promoCode.toUpperCase() === 'SAAS') {
      setPromoApplied(true);
    } else {
      setPromoError('Invalid promo code. Try using code "LAUNCH" for 20% off!');
    }
  };

  // Safe subscription billing calculations
  const basePriceNum = parseInt(planPrice.replace('$', '')) || 0;
  const finalPrice = promoApplied ? Math.round(basePriceNum * 0.8) : basePriceNum;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setCheckoutError('Please sign in before completing your purchase.');
      return;
    }
    if (!cardNumber || !expiry || !cvv || !cardName) {
      setCheckoutError('Please fill out all payment credentials.');
      return;
    }

    setCheckoutError('');
    setIsProcessing(true);

    try {
      // Simulate Stripe/Secure Network Transaction Handshake Latency
      await new Promise((resolve) => setTimeout(resolve, 1800));

      // Successfully process the payment: Update Firestore with User's Upgraded Tier
      const userRef = doc(db, 'users', user.id);
      
      // Update role & subscription fields in Firestore
      await updateDoc(userRef, {
        role: 'workspace_owner',
        updatedAt: new Date().toISOString()
      });

      setIsSuccess(true);
      // Let success state show for 2 seconds before closing
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Redirect them or refresh to showcase paid features of dashboard
        window.location.reload(); 
      }, 2000);
    } catch (err: any) {
      console.error('Payment Error: ', err);
      setCheckoutError('Your simulated card was declined. Please inspect inputs or verify Firestore rules installation.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
        id="stripe-checkout-container"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-50 z-20 cursor-pointer"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="w-full h-[500px] flex flex-col items-center justify-center p-12 text-center bg-slate-50" id="success-screen">
            <div className="w-16 h-16 bg-emerald-100/80 text-emerald-600 rounded-full flex items-center justify-center mb-6 border border-emerald-200/50">
              <CheckCircle2 size={36} className="animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Simulated Payment Succeeded!</h2>
            <p className="text-sm text-slate-500 font-semibold max-w-md">
              Secure payment processed via Stripe Sync sandbox. Your account has been upgraded to <span className="text-brand font-bold capitalize">Workspace Owner</span>! Reloading environment...
            </p>
          </div>
        ) : (
          <>
            {/* Sidebar Summary (Blue/Indigo Gradient Accent) */}
            <div className="w-full md:w-[40%] bg-slate-900 text-white p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#6366F1] bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                  Secured Checkout
                </span>
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Plan Subscription</p>
                  <h3 className="text-xl font-extrabold text-white mt-1">{planTitle}</h3>
                </div>

                <div className="mt-6 border-b border-white/10 pb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400 font-semibold">Base Price</span>
                    <span className="text-lg font-bold text-slate-200">{planPrice}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-xs text-slate-400 font-semibold">Billing Interval</span>
                    <span className="text-xs font-bold text-slate-300 capitalize">{billingCycle} Billing</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between items-baseline mt-2 text-emerald-400">
                      <span className="text-xs font-semibold flex items-center gap-1">
                        <Sparkles size={12} /> Promo Code Applied 
                      </span>
                      <span className="text-xs font-black">-20% Off</span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-300">Total Billed Today</span>
                    <span className="text-2xl font-extrabold text-white">
                      ${finalPrice}
                      <span className="text-xs font-medium text-slate-400">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                    </span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-[10px] text-emerald-400/90 font-bold mt-2">
                      Saving equivalent of 2 months of standard service
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-start gap-3">
                  <Lock size={14} className="text-[#6366F1] mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Zero Risk sandbox</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5">
                      Enter any mock inputs to simulation. This demo sandbox triggers real Firebase User role escalations securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Fields */}
            <div className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-between bg-white">
              <form onSubmit={handlePay} className="flex-grow flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Configure Sandbox Checkout</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">To complete the checkout, sign in first and supply dummy details.</p>
                </div>

                {!user ? (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-6 text-center shadow-xs flex flex-col items-center justify-center gap-4 my-4">
                    <ShieldAlert size={28} className="text-brand" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Authentication Required</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Please sign in with Google to tie this premium license securely to your profile.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={login}
                      className="btn-primary py-2 px-5 text-xs shadow-sm bg-brand cursor-pointer hover:bg-brand-dark"
                    >
                      Authenticate with Google
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {checkoutError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-xs font-bold leading-relaxed">
                        {checkoutError}
                      </div>
                    )}

                    {/* Cardholder name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                      <input 
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-hidden focus:border-brand transition-colors text-slate-800 font-bold bg-white"
                      />
                    </div>

                    {/* Card inputs */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Credit Card Details</label>
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          required
                          className="w-full border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-hidden focus:border-brand transition-colors text-slate-800 font-medium bg-white"
                        />
                        <CreditCard size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expiry Date</label>
                        <input 
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={handleExpiryChange}
                          required
                          className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-hidden focus:border-brand transition-colors text-slate-800 font-medium text-center bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">CVV / CVC Code</label>
                        <input 
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={handleCvvChange}
                          required
                          className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-hidden focus:border-brand transition-colors text-slate-800 font-medium text-center bg-white"
                        />
                      </div>
                    </div>

                    {/* Promo Codes */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Promo Discounts</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Enter coupon (e.g. LAUNCH)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-grow border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-hidden focus:border-brand uppercase text-slate-850 font-bold bg-white"
                        />
                        <button 
                          type="button"
                          onClick={applyPromo}
                          className="bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 rounded-lg px-4 text-xs font-black transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {promoApplied && (
                        <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Coupon applied successfully! 20% discount reflected above.
                        </p>
                      )}
                      {promoError && (
                        <p className="text-xs text-rose-600 font-bold mt-1.5">
                          {promoError}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {user && (
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full mt-4 bg-brand text-white hover:bg-brand-dark py-3.5 rounded-xl font-bold transition-all text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-white" />
                        Handshaking Transaction...
                      </>
                    ) : (
                      <>
                        <Lock size={15} />
                        Complete Simulated Checkout • Pay ${finalPrice}
                      </>
                    )}
                  </button>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
