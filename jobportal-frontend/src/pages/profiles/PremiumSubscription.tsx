import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { upgradeToPremium } from '../../redux/authSlice';
import api from '../../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PremiumSubscription() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isPremium = user?.isPremium || false;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Failed to load Razorpay SDK. Please check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on backend
      const orderRes = await api.post('/payments/create-order');
      const { orderId, amount, currency, keyId } = orderRes.data;

      // 2. Open Razorpay modal
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Nokri.online Premium',
        description: 'Ad-Free Premium Subscription (1 Year)',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment signature on backend
            const verifyRes = await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              dispatch(upgradeToPremium());
              setSuccess('Congratulations! You are now a Premium user. All ads have been removed.');
            } else {
              setError('Payment verification failed.');
            }
          } catch (err: any) {
            setError(err.response?.data?.error || 'Verification error occurred.');
          }
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
        },
        theme: {
          color: '#3B82F6', // Blue theme matching our premium setup
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 transition-all">
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Nokri.online Premium</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Get the best job seeking experience with zero interruptions.</p>
      </div>

      <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8">
        {isPremium ? (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-xl p-6 text-center">
            <span className="text-4xl">🎉</span>
            <h3 className="mt-2 text-lg font-bold text-green-800 dark:text-green-400">You are a Premium Member</h3>
            <p className="mt-1 text-sm text-green-600 dark:text-green-500">Enjoy your ad-free browsing across the entire website!</p>
          </div>
        ) : (
          <div>
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-6 mb-8">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Premium Membership Benefits:</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> <strong>100% Ad-Free Experience</strong> - No banners, tiles, or popups.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> <strong>Priority Application Processing</strong> - Highlighted resume to employers.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> <strong>Instant Mobile Notifications</strong> - Get job alerts faster.
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="mb-6 text-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">₹199</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-sm"> / year</span>
              </div>

              {error && (
                <div className="mb-4 w-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl border border-red-200 dark:border-red-800/30">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="mb-4 w-full bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-sm p-4 rounded-xl border border-green-200 dark:border-green-800/30">
                  ⭐ {success}
                </div>
              )}

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 text-center"
              >
                {loading ? 'Processing Transaction...' : 'Upgrade Now via Razorpay'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
