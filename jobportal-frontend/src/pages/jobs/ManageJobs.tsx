import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Job, Application } from '../../types';
import { Briefcase, Users, RefreshCw, CheckCircle, XCircle, Calendar, Link } from 'lucide-react';

export const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);

  // Interview Schedule Fields
  const [schedulingApp, setSchedulingApp] = useState<Application | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchRecruiterJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await api.get('/jobs/recruiter');
      setJobs(response.data);
    } catch (e) {
      console.error('Failed to fetch jobs', e);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchJobApplications = async (jobId: number) => {
    setLoadingApps(true);
    try {
      const response = await api.get(`/jobs/${jobId}/applications`);
      setApplications(response.data);
    } catch (e) {
      console.error('Failed to fetch applications', e);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleUpdateStatus = async (appId: number, status: string) => {
    try {
      await api.put(`/jobs/applications/${appId}/status`, { status });
      setApplications(
        applications.map((app) => (app.id === appId ? { ...app, status } : app))
      );
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingApp) return;
    setError('');
    setSuccess('');

    try {
      // Backend expects standard ISO string for scheduledAt.
      // E.g., Convert '2026-06-14T15:00' to standard ISO ZonedDateTime string.
      const isoDateTime = new Date(scheduledAt).toISOString();
      await api.post(`/jobs/applications/${schedulingApp.id}/schedule`, {
        scheduledAt: isoDateTime,
        meetingLink,
        notes,
      });

      setSuccess('Interview scheduled and status updated successfully!');
      setApplications(
        applications.map((app) =>
          app.id === schedulingApp.id ? { ...app, status: 'INTERVIEWING' } : app
        )
      );
      setMeetingLink('');
      setScheduledAt('');
      setNotes('');
      setTimeout(() => {
        setSchedulingApp(null);
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to schedule interview. Please check field formats.');
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchJobApplications(selectedJob.id);
    } else {
      setApplications([]);
    }
  }, [selectedJob]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Recruitment Hub</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track candidates, edit application statuses, and arrange meetings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruiter Job List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">Posted Jobs</h3>
          {loadingJobs ? (
            <div className="flex justify-center py-8 text-indigo-500"><RefreshCw className="w-5 h-5 animate-spin" /></div>
          ) : jobs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 glass-panel rounded-3xl">No jobs posted yet.</div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-5 glass-panel rounded-2xl cursor-pointer border transition ${
                  selectedJob?.id === job.id
                    ? 'border-indigo-500 bg-indigo-50/10'
                    : 'border-slate-200/20 hover:border-indigo-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800 dark:text-white">{job.title}</h4>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    job.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
                  <Briefcase className="w-4 h-4" /> {job.jobType}
                  <span className="mx-1">•</span>
                  <span>{job.location}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Applicants List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
            Applicants List {selectedJob ? `for ${selectedJob.title}` : ''}
          </h3>

          {!selectedJob ? (
            <div className="p-8 text-center text-slate-400 glass-panel rounded-3xl border border-dashed border-slate-300/30">
              Select a posted job on the left to review applicant details.
            </div>
          ) : loadingApps ? (
            <div className="flex justify-center py-8 text-indigo-500"><RefreshCw className="w-6 h-6 animate-spin" /></div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 glass-panel rounded-3xl">
              No candidates have applied for this position yet.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-6 glass-panel rounded-3xl bg-white/40 dark:bg-slate-900/40 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-lg">{app.candidateName}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">{app.candidateEmail}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.status === 'SCREENING' || app.status === 'INTERVIEWING'
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                        : app.status === 'OFFERED'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  {app.coverLetter && (
                    <div className="bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl text-sm text-slate-600 dark:text-slate-300 border border-slate-200/20 italic">
                      "{app.coverLetter}"
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/20">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'SCREENING')}
                        className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl hover:scale-105 transition"
                      >
                        Screen
                      </button>
                      <button
                        onClick={() => setSchedulingApp(app)}
                        className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-xl hover:scale-105 transition flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Schedule Interview
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'OFFERED')}
                        className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl hover:scale-105 transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Offer Job
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl hover:scale-105 transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>

                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        <Link className="w-3.5 h-3.5" /> View Resume
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal overlay */}
      {schedulingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-8 glass-panel rounded-3xl bg-white dark:bg-slate-900 shadow-2xl relative">
            <h3 className="font-extrabold text-xl text-slate-800 dark:text-white mb-2">Schedule Interview</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Arrange a virtual interview with {schedulingApp.candidateName}
            </p>

            {error && (
              <div className="p-3 mb-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl">
                {success}
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Meeting Link / URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Preparation instructions or topics..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setSchedulingApp(null)}
                  className="w-1/2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageJobs;
