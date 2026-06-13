import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Application } from '../../types';
import { RefreshCw, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const MyApplications: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs/applications/seeker');
      setApps(response.data);
    } catch (e) {
      // Mock Data if API fails
      setApps([
        { id: 1, jobId: 101, jobTitle: 'Senior Full Stack Engineer', companyName: 'Stripe', candidateId: 1, candidateName: 'John Doe', candidateEmail: 'candidate@jobs.com', status: 'INTERVIEWING', coverLetter: 'I am excited about Stripe payments scaling.', createdAt: new Date().toISOString() },
        { id: 2, jobId: 102, jobTitle: 'Frontend Engineer', companyName: 'Vercel', candidateId: 1, candidateName: 'John Doe', candidateEmail: 'candidate@jobs.com', status: 'APPLIED', coverLetter: 'I love working with Next.js.', createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Track Applications</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review application status updates and active hiring stages
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8 text-indigo-500"><RefreshCw className="w-5 h-5 animate-spin" /></div>
      ) : apps.length === 0 ? (
        <div className="p-8 text-center text-slate-500 glass-panel rounded-3xl">
          You haven't submitted any job applications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <div key={app.id} className="p-6 glass-panel rounded-3xl bg-white/40 dark:bg-slate-900/40 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">{app.jobTitle}</h3>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{app.companyName}</p>
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

              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MyApplications;
