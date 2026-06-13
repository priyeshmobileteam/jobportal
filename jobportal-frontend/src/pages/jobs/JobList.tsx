import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Job } from '../../types';
import { Search, MapPin, Briefcase, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs/approved');
      setJobs(response.data);
      if (response.data.length > 0) {
        setSelectedJob(response.data[0]);
      } else {
        setSelectedJob(null);
      }
    } catch (e) {
      console.error('Failed to load jobs', e);
      setSelectedJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.get(`/jobs/search?keyword=${keyword}&location=${location}`);
      setJobs(response.data);
      if (response.data.length > 0) {
        setSelectedJob(response.data[0]);
      } else {
        setSelectedJob(null);
      }
    } catch (e) {
      console.error('Failed to search jobs', e);
      setSelectedJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.post(`/jobs/${selectedJob.id}/apply`, { coverLetter });
      setSuccessMsg(`Successfully applied for ${selectedJob.title}!`);
      setAppliedJobs([...appliedJobs, selectedJob.id]);
      setCoverLetter('');
      setTimeout(() => {
        setSelectedJob(null);
        setSuccessMsg('');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to apply. You might have already applied for this job.');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchFilteredJobs = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/jobs/search?keyword=${keyword}&location=${location}`);
          setJobs(response.data);
          if (response.data.length > 0) {
            setSelectedJob(response.data[0]);
          } else {
            setSelectedJob(null);
          }
        } catch (e) {
          console.error('Failed to search jobs', e);
          setSelectedJob(null);
        } finally {
          setLoading(false);
        }
      };

      fetchFilteredJobs();
    }, 250); // 250ms debounce to prevent database hammering

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, location]);

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const response = await api.get('/jobs/approved');
        setAllJobs(response.data);
      } catch (e) {
        console.error('Failed to load all jobs for suggestions', e);
      }
    };
    fetchAllJobs();
  }, []);

  useEffect(() => {
    const handleSelectJob = (e: Event) => {
      const customEvent = e as CustomEvent;
      const jobId = customEvent.detail?.id;
      if (jobId) {
        const foundJob = jobs.find(j => j.id === jobId) || allJobs.find(j => j.id === jobId);
        if (foundJob) {
          setSelectedJob(foundJob);
        }
      }
    };
    window.addEventListener('select-job', handleSelectJob);
    return () => window.removeEventListener('select-job', handleSelectJob);
  }, [jobs, allJobs]);

  // Dynamically extract unique cities & job titles from fetched database jobs
  const citySuggestions = Array.from(new Set(allJobs.map(j => j.location).filter(Boolean)));
  const titleSuggestions = Array.from(new Set(allJobs.map(j => j.title).filter(Boolean)));

  // Filter based on input value
  const filteredTitles = titleSuggestions.filter(t => 
    t.toLowerCase().includes(keyword.toLowerCase()) && t.toLowerCase() !== keyword.toLowerCase()
  );

  const filteredLocations = citySuggestions.filter(c => 
    c.toLowerCase().includes(location.toLowerCase()) && c.toLowerCase() !== location.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <form onSubmit={handleSearch} className="p-6 glass-panel rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white/50 dark:bg-slate-900/50 relative z-30 overflow-visible">
        <div className="relative z-50">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Job title, keywords, or company..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowTitleSuggestions(true);
            }}
            onFocus={() => setShowTitleSuggestions(true)}
            onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 200)}
            className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
          />
          {showTitleSuggestions && keyword.length >= 1 && filteredTitles.length > 0 && (
            <ul className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl max-h-60 overflow-y-auto py-2">
              {filteredTitles.map((title) => (
                <li
                  key={title}
                  onMouseDown={() => {
                    setKeyword(title);
                    setShowTitleSuggestions(false);
                  }}
                  className="px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 text-sm cursor-pointer transition duration-150"
                >
                  {title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative z-50">
          <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="City, state, or remote..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowLocationSuggestions(true);
            }}
            onFocus={() => setShowLocationSuggestions(true)}
            onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
            className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
          />
          {showLocationSuggestions && location.length >= 1 && filteredLocations.length > 0 && (
            <ul className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl max-h-60 overflow-y-auto py-2">
              {filteredLocations.map((city) => (
                <li
                  key={city}
                  onMouseDown={() => {
                    setLocation(city);
                    setShowLocationSuggestions(false);
                  }}
                  className="px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 text-sm cursor-pointer transition duration-150"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition duration-200 text-sm"
        >
          Find Jobs
        </button>
      </form>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-indigo-500 font-semibold">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Searching career opportunities...
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.length === 0 && (
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-sm font-semibold rounded-2xl border border-amber-200/25 text-center">
                  No matching jobs found. Try adjusting your filters.
                </div>
              )}

              <div className="overflow-x-auto glass-panel rounded-3xl border border-slate-200/20 bg-white/40 dark:bg-slate-900/40 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/20 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/30">
                      <th className="p-4 pl-6">Job Title & Company</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/10">
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        id={`job-row-${job.id}`}
                        onClick={() => setSelectedJob(job as any)}
                        className={`cursor-pointer transition duration-150 hover:bg-indigo-50/10 ${
                          selectedJob?.id === job.id ? 'bg-indigo-500/10 dark:bg-indigo-500/15' : ''
                        }`}
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-extrabold text-sm">
                              {job.companyName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{job.title}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{job.companyName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
                          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                            {job.jobType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
                          {job.salaryRangeMin && job.salaryRangeMax
                            ? `₹${job.salaryRangeMin.toLocaleString()} - ₹${job.salaryRangeMax.toLocaleString()}`
                            : 'Salary Undisclosed'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Job Details Sidebar Panel */}
        <div className="lg:col-span-1">
          {selectedJob ? (
            <div className="p-6 glass-panel rounded-3xl sticky top-24 bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 space-y-6">
              <div>
                <h3 className="font-black text-xl text-slate-800 dark:text-white">{selectedJob.title}</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mt-1">{selectedJob.companyName}</p>
              </div>

              <div className="border-t border-slate-200/20 pt-4 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Job Description</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 whitespace-pre-line leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Requirements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 whitespace-pre-line leading-relaxed">
                    {selectedJob.requirements}
                  </p>
                </div>
              </div>

              {appliedJobs.includes(selectedJob.id) ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm rounded-2xl text-center border border-emerald-200/20 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Applied
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4 pt-4 border-t border-slate-200/20">
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-200/20">
                      {errorMsg}
                    </div>
                  )}
                  {successMsg && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl border border-emerald-200/20">
                      {successMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      Cover Letter / Pitch
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Why are you a good fit for this role?..."
                      className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Apply for Job</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 glass-panel rounded-3xl border border-dashed border-slate-300/30">
              Select a job card to view descriptions and apply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default JobList;
