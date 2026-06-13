import React, { useState } from 'react';
import api from '../../services/api';
import { Mail, CheckCircle2, KeyRound, Lock } from 'lucide-react';

interface ForgotPasswordProps {
  setView: (view: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Verify OTP & Reset Password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data.message || 'OTP sent successfully!');
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please check email address.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccess(response.data.message || 'Password reset successful!');
      setTimeout(() => {
        setView('login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Password reset failed. Please check OTP and try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 p-8 glass-panel rounded-3xl bg-white/60 dark:bg-slate-900/60 shadow-2xl relative overflow-hidden">
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white text-center mb-1">
        Reset Password
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
        Retrieve access to your account via verification OTP
      </p>

      {error && (
        <div className="p-4 mb-6 text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 rounded-2xl border border-rose-200/20">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 mb-6 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl border border-emerald-200/20 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {success}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition duration-200"
          >
            Send Verification Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Verification Code (OTP)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                placeholder="Enter 6-digit OTP"
              />
            </div>
            <p className="text-xs text-indigo-500 font-medium mt-1.5">
              Check terminal console/backend logger for mocked OTP!
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition duration-200"
          >
            Reset Password
          </button>
        </form>
      )}

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
        Back to{' '}
        <button
          onClick={() => setView('login')}
          className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};
export default ForgotPassword;
