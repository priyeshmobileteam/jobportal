import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logOut } from '../redux/authSlice';
import { LogOut, Briefcase, User as UserIcon, Settings, Menu, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  setView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, darkMode, onToggleDarkMode, setView }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      dispatch(logOut());
      alert("Logged out successfully!");
      window.location.reload();
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/20 px-6 py-4 flex items-center justify-between transition-colors duration-200 bg-white/70 dark:bg-slate-900/70">
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        )}
        <div onClick={() => setView('jobs')} className="flex items-center gap-2 cursor-pointer">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
            Career<span className="text-indigo-600 dark:text-indigo-400">Sphere</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDarkMode}
          className="p-2.5 rounded-xl border border-slate-200/30 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider">
                {user.roles[0]?.replace('ROLE_', '')}
              </span>
            </div>
            <button
              onClick={() => setView('profile')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Profile"
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('login')}
              className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl transition"
            >
              Login
            </button>
            <button
              onClick={() => setView('signup')}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
