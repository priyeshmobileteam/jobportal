import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { AuditLog } from '../../types';
import { RefreshCw, Database, Terminal } from 'lucide-react';

export const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/audit-logs');
      setLogs(response.data);
    } catch (e) {
      // Mock Logs
      setLogs([
        { id: 1, action: 'USER_LOGIN', details: 'User candidate@jobs.com authenticated successfully', ipAddress: '127.0.0.1', createdAt: new Date().toISOString() },
        { id: 2, action: 'JOB_POSTED', details: 'Recruiter Stripe posted a new Job: Staff Software Architect', ipAddress: '127.0.0.1', createdAt: new Date().toISOString() },
        { id: 3, action: 'USER_LOCK', details: 'Admin locked user account recruiter@hack.com', ipAddress: '127.0.0.1', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">System Audit Trail</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Chronological record of platform operations and actions
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8 text-indigo-500"><RefreshCw className="w-5 h-5 animate-spin" /></div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden bg-white/40 dark:bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/20 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Action</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/10 text-xs font-mono text-slate-700 dark:text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition">
                    <td className="py-4 px-6 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-4 px-6"><span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md font-bold uppercase tracking-wide">{log.action}</span></td>
                    <td className="py-4 px-6 font-semibold">{log.details}</td>
                    <td className="py-4 px-6 text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminLogs;
