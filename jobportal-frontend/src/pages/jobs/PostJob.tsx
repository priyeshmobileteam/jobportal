import React, { useState } from 'react';
import api from '../../services/api';
import { Briefcase, MapPin, Landmark, DollarSign, CheckCircle2 } from 'lucide-react';

export const PostJob: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        title,
        description,
        requirements,
        benefits,
        location,
        jobType,
        salaryRangeMin: salaryMin ? parseFloat(salaryMin) : undefined,
        salaryRangeMax: salaryMax ? parseFloat(salaryMax) : undefined,
      };

      await api.post('/jobs', payload);
      setSuccess('Job post submitted successfully! Pending administrator approval.');
      setTitle('');
      setDescription('');
      setRequirements('');
      setBenefits('');
      setLocation('');
      setSalaryMin('');
      setSalaryMax('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit job listing. Please check input values.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 glass-panel rounded-3xl bg-white/60 dark:bg-slate-900/60 shadow-xl relative overflow-hidden">
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-1">Post a New Job</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
        Specify details and requirements to find qualified candidates
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
            Job Title
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Briefcase className="w-5 h-5" />
            </span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              placeholder="Senior Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Job Location
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <MapPin className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                placeholder="New York, NY or Remote"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Job Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Minimum Salary ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <DollarSign className="w-5 h-5" />
              </span>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                placeholder="80000"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Maximum Salary ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <DollarSign className="w-5 h-5" />
              </span>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                placeholder="120000"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Job Description
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
            placeholder="Outline main responsibilities, day-to-day requirements, scope..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Qualifications & Requirements
          </label>
          <textarea
            required
            rows={4}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
            placeholder="Experience levels, technology stack skillsets, degrees..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Benefits & Perks
          </label>
          <textarea
            rows={3}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
            placeholder="Equity options, medical covers, hybrid setups..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition"
        >
          Submit Job Listing
        </button>
      </form>
    </div>
  );
};
export default PostJob;
