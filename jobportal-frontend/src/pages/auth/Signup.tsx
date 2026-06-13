import React, { useState } from 'react';
import api from '../../services/api';
import { UserPlus, Mail, Lock, Phone, User, CheckCircle2, Building } from 'lucide-react';

interface SignupProps {
  setView: (view: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ setView }) => {
  const [role, setRole] = useState('ROLE_JOBSEEKER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role,
        companyName: role === 'ROLE_RECRUITER' ? companyName : undefined,
        industry: role === 'ROLE_RECRUITER' ? industry : undefined,
      };

      const response = await api.post('/auth/signup', payload);
      setSuccess(response.data.message || 'Registration successful! You can now log in.');
      setTimeout(() => {
        setView('login');
      }, 2000);
    } catch (err: any) {
      if (!err.response) {
        setError("Backend server is not reachable. Please make sure your Spring Boot application is running on port 8080.");
      } else {
        setError(err.response?.data?.error || 'Registration failed. Please check details and try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-12 p-8 glass-panel rounded-3xl bg-white/60 dark:bg-slate-900/60 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white text-center mb-1">
        Create an Account
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
        Choose your role and register to begin
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

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => setRole('ROLE_JOBSEEKER')}
          className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
            role === 'ROLE_JOBSEEKER'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Job Seeker
        </button>
        <button
          type="button"
          onClick={() => setRole('ROLE_RECRUITER')}
          className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
            role === 'ROLE_RECRUITER'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Recruiter / Employer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              First Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                placeholder="John"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Last Name
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              placeholder="Doe"
            />
          </div>
        </div>

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

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Phone className="w-5 h-5" />
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>

        {role === 'ROLE_RECRUITER' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Company Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Building className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                  placeholder="Acme Corp"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Industry
              </label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                placeholder="Software, Finance"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Lock className="w-5 h-5" />
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Register Account</span>
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
        Already have an account?{' '}
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
export default Signup;
