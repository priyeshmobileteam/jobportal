import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { DashboardStats } from './pages/dashboard/DashboardStats';
import { JobList } from './pages/jobs/JobList';
import { PostJob } from './pages/jobs/PostJob';
import { ManageJobs } from './pages/jobs/ManageJobs';
import { ProfileView } from './pages/profiles/ProfileView';
import { MyApplications } from './pages/jobs/MyApplications';
import { Interviews } from './pages/jobs/Interviews';
import { AdminJobs } from './pages/admin/AdminJobs';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminLogs } from './pages/admin/AdminLogs';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [view, setView] = useState('jobs'); // default landing page
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Auto route to dashboard if logged in and accessing landing views
  useEffect(() => {
    if (isAuthenticated && (view === 'login' || view === 'signup' || view === 'forgot-password')) {
      setView('dashboard');
    }
  }, [isAuthenticated, view]);

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <Login setView={setView} />;
      case 'signup':
        return <Signup setView={setView} />;
      case 'forgot-password':
        return <ForgotPassword setView={setView} />;
      case 'dashboard':
        return <DashboardStats />;
      case 'jobs':
        return <JobList />;
      case 'post-job':
        return <PostJob />;
      case 'manage-jobs':
        return <ManageJobs />;
      case 'profile':
        return <ProfileView />;
      case 'applications':
        return <MyApplications />;
      case 'interviews':
        return <Interviews />;
      case 'admin-jobs':
        return <AdminJobs />;
      case 'admin-users':
        return <AdminUsers />;
      case 'admin-logs':
        return <AdminLogs />;
      default:
        return <JobList />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        setView={setView}
      />
      <div className="flex">
        {isAuthenticated && (
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentView={view}
            setView={setView}
          />
        )}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto min-h-[calc(100vh-80px)] overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
