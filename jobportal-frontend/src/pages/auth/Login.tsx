import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';
import api from '../../services/api';
import { Mail, Lock, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  setView: (view: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dispatch = useDispatch();

  // Create a simple CAPTCHA on mount/reset
  const [captchaNum1] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaNum2] = useState(Math.floor(Math.random() * 9) + 1);
  const expectedAnswer = (captchaNum1 + captchaNum2).toString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (captchaInput !== expectedAnswer) {
      setError('Incorrect CAPTCHA answer. Please try again.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(response.data));
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        setView('dashboard');
      }, 1000);
    } catch (err: any) {
      if (!err.response) {
        setError("Backend server is not reachable. Please make sure your Spring Boot application is running on port 8080.");
      } else {
        setError(err.response?.data?.error || 'Failed to authenticate. Please check your credentials.');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 p-8 glass-panel rounded-3xl bg-white/60 dark:bg-slate-900/60 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white text-center mb-1">
        Welcome Back
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
        Access your account and explore career opportunities
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

      <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Lock className="w-5 h-5" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Captcha */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Security Question
            </label>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> Human verification
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-extrabold text-lg px-6 rounded-2xl border border-indigo-200/20 w-1/3 select-none">
              {captchaNum1} + {captchaNum2} =
            </div>
            <input
              type="number"
              required
              placeholder="Answer"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-2/3 px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400 cursor-pointer">
            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setView('forgot-password')}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transform hover:-translate-y-0.5 transition duration-200"
        >
          Sign In
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/20" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Or continue with</span></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => alert('Social Login Integrations: Configured in production via GCP Google Client Client ID.')}
          className="flex items-center justify-center gap-2 py-3 border border-slate-200/20 dark:border-slate-800/40 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold transition text-sm"
        >
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => alert('Social Login Integrations: Configured in production via LinkedIn Dev Apps.')}
          className="flex items-center justify-center gap-2 py-3 border border-slate-200/20 dark:border-slate-800/40 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sky-600 font-bold transition text-sm"
        >
          <span>LinkedIn</span>
        </button>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
        New to CareerSphere?{' '}
        <button
          onClick={() => setView('signup')}
          className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
        >
          Create an account
        </button>
      </p>
    </div>
  );
};
export default Login;
