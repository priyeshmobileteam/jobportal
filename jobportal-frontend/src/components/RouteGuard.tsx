import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <div className="text-center p-8 glass-panel rounded-2xl max-w-sm w-full mx-4">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-6">Please log in to access this page.</p>
          <a
            href="/login"
            className="inline-block w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const hasRole = allowedRoles ? user.roles.some((role) => allowedRoles.includes(role)) : true;

  if (!hasRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <div className="text-center p-8 glass-panel rounded-2xl max-w-sm w-full mx-4">
          <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
          <p className="mb-6">You do not have permission to view this page.</p>
          <a
            href="/"
            className="inline-block w-full py-3 px-6 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition duration-200"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
export default RouteGuard;
