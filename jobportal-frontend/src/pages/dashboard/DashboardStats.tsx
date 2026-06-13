import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import api from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Briefcase, FileCheck2, UserCheck2, Landmark, RefreshCw, Star, Users, Calendar } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const role = user?.roles[0];

  const fetchStats = async () => {
    setLoading(true);
    try {
      if (role === 'ROLE_ADMIN') {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } else {
        // Mock data for Candidate & Recruiter Dashboards
        setStats({
          candidate: {
            applicationsApplied: 12,
            interviewsScheduled: 3,
            profileCompleteness: 85,
            jobOffers: 1,
            applicationTrend: [
              { month: 'Jan', applications: 2 },
              { month: 'Feb', applications: 5 },
              { month: 'Mar', applications: 8 },
              { month: 'Apr', applications: 6 },
              { month: 'May', applications: 10 },
              { month: 'Jun', applications: 12 },
            ]
          },
          recruiter: {
            jobsPosted: 8,
            totalApplicants: 42,
            interviewsScheduled: 9,
            activeJobs: 5,
            recruitmentTrend: [
              { month: 'Jan', candidates: 10 },
              { month: 'Feb', candidates: 18 },
              { month: 'Mar', candidates: 25 },
              { month: 'Apr', candidates: 20 },
              { month: 'May', candidates: 35 },
              { month: 'Jun', candidates: 42 },
            ]
          }
        });
      }
    } catch (e) {
      console.error('Failed to load dashboard metrics', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-500 font-semibold">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading dashboard metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-float">
      {/* Welcome Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
            Hello, {user?.firstName}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's what is happening with your account today.
          </p>
        </div>
      </div>

      {/* ADMIN Stats */}
      {role === 'ROLE_ADMIN' && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 glass-panel rounded-3xl bg-indigo-500/10 border-indigo-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Users</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="p-3 bg-indigo-500 text-white rounded-2xl"><Users className="w-6 h-6" /></div>
            </div>

            <div className="p-6 glass-panel rounded-3xl bg-purple-500/10 border-purple-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Jobs</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stats.totalJobs}</h3>
              </div>
              <div className="p-3 bg-purple-500 text-white rounded-2xl"><Briefcase className="w-6 h-6" /></div>
            </div>

            <div className="p-6 glass-panel rounded-3xl bg-emerald-500/10 border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Applications</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stats.totalApplications}</h3>
              </div>
              <div className="p-3 bg-emerald-500 text-white rounded-2xl"><FileCheck2 className="w-6 h-6" /></div>
            </div>

            <div className="p-6 glass-panel rounded-3xl bg-amber-500/10 border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pending Job Approvals</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stats.pendingJobs}</h3>
              </div>
              <div className="p-3 bg-amber-500 text-white rounded-2xl"><Landmark className="w-6 h-6" /></div>
            </div>
          </div>

          <div className="p-6 glass-panel rounded-3xl bg-white/40 dark:bg-slate-900/40">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Platform Activity Metrics</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Users', count: stats.totalUsers },
                    { name: 'Jobs', count: stats.totalJobs },
                    { name: 'Applications', count: stats.totalApplications },
                    { name: 'Pending Appr.', count: stats.pendingJobs },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* JOBSEEKER Stats */}
      {role === 'ROLE_JOBSEEKER' && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 glass-panel rounded-3xl bg-indigo-500/10 border-indigo-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Applications Sent</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {stats.candidate.applicationsApplied}
                </h3>
              </div>
              <div className="p-3 bg-indigo-500 text-white rounded-2xl"><FileCheck2 className="w-6 h-6" /></div>
            </div>

            <div className="p-6 glass-panel rounded-3xl bg-amber-500/10 border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Interviews Scheduled</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {stats.candidate.interviewsScheduled}
                </h3>
              </div>
              <div className="p-3 bg-amber-500 text-white rounded-2xl"><Calendar className="w-6 h-6" /></div>
            </div>

            <div className="p-6 glass-panel rounded-3xl bg-emerald-500/10 border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Profile Score</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {stats.candidate.profileCompleteness}%
                </h3>
              </div>
              <div className="p-3 bg-emerald-500 text-white rounded-2xl"><UserCheck2 className="w-6 h-6" /></div>
            </div>

            <div className="p-6 glass-panel rounded-3xl bg-rose-500/10 border-rose-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Job Offers</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {stats.candidate.jobOffers}
                </h3>
              </div>
              <div className="p-3 bg-rose-500 text-white rounded-2xl"><Star className="w-6 h-6" /></div>
            </div>
          </div>

          <div className="p-6 glass-panel rounded-3xl bg-white/40 dark:bg-slate-900/40">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Application Submission Speed</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.candidate.applicationTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="dark:hidden" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="applications" stroke="#6366f1" fillOpacity={1} fill="url(#colorApplications)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* RECRUITER Stats */}
      {role === 'ROLE_RECRUITER' && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 glass-panel rounded-3xl bg-indigo-500/10 border-indigo-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Jobs Posted</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {stats.recruiter.jobsPosted}
                </h3>
              </div>
              <div className="p-3 bg-indigo-500 text-white rounded-2xl"><Briefcase className="w-6 h-6" /></div>
            </div>

            <div className="p-6 glass-panel rounded-3xl bg-purple-500/10 border-purple-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Applicants</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {stats.recruiter.totalApplicants}
                </h3>
              </div>
              <div className="p-3 bg-purple-500 text-white rounded-2xl"><Users className="w-6 h-6" /></div>
            </div>

            <div className="p-6 glass-panel rounded-3xl bg-amber-500/10 border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Interviews Planned</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {stats.recruiter.interviewsScheduled}
                </h3>
              </div>
              <div className="p-3 bg-amber-500 text-white rounded-2xl"><Calendar className="w-6 h-6" /></div>
            </div>

            <div className="p-6 glass-panel rounded-3xl bg-emerald-500/10 border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Active Jobs</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {stats.recruiter.activeJobs}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500 text-white rounded-2xl"><FileCheck2 className="w-6 h-6" /></div>
            </div>
          </div>

          <div className="p-6 glass-panel rounded-3xl bg-white/40 dark:bg-slate-900/40">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recruitment Flow</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.recruiter.recruitmentTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="dark:hidden" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="candidates" stroke="#a855f7" fillOpacity={1} fill="url(#colorCandidates)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default DashboardStats;
