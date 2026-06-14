import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LayoutDashboard, FileSearch, FileText, Calendar, PlusCircle, CheckSquare, Shield, Users, Database } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentView: string;
  setView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, currentView, setView }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  const role = user.roles[0];

  const handleNav = (view: string) => {
    setView(view);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 pt-20 glass-panel border-r border-slate-200/20 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-[calc(100vh-80px)] ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-1 p-4">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            Dashboard
          </div>

          {/* Unified Home/Dashboard */}
          <button
            onClick={() => handleNav('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              currentView === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard Home</span>
          </button>

          {/* Candidate specific links */}
          {role === 'ROLE_JOBSEEKER' && (
            <>
              <button
                onClick={() => handleNav('jobs')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'jobs'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileSearch className="w-5 h-5" />
                <span>Search Jobs</span>
              </button>
              <button
                onClick={() => handleNav('applications')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'applications'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>My Applications</span>
              </button>
              <button
                onClick={() => handleNav('interviews')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'interviews'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Interviews</span>
              </button>
              <button
                onClick={() => handleNav('premium-subscription')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'premium-subscription'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Get Premium ⭐</span>
              </button>
            </>
          )}

          {/* Recruiter specific links */}
          {role === 'ROLE_RECRUITER' && (
            <>
              <button
                onClick={() => handleNav('post-job')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'post-job'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Post a Job</span>
              </button>
              <button
                onClick={() => handleNav('manage-jobs')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'manage-jobs'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                <span>Manage Jobs</span>
              </button>
              <button
                onClick={() => handleNav('interviews')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'interviews'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Interviews</span>
              </button>
            </>
          )}

          {/* Admin specific links */}
          {role === 'ROLE_ADMIN' && (
            <>
              <button
                onClick={() => handleNav('admin-jobs')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'admin-jobs'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>Approve Jobs</span>
              </button>
              <button
                onClick={() => handleNav('admin-users')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'admin-users'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>User Management</span>
              </button>
              <button
                onClick={() => handleNav('admin-payments')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'admin-payments'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Database className="w-5 h-5" />
                <span>Transactions</span>
              </button>
              <button
                onClick={() => handleNav('admin-logs')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  currentView === 'admin-logs'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Database className="w-5 h-5" />
                <span>Audit Logs</span>
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
