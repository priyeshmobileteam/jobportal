import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Interview } from '../../types';
import { RefreshCw, Calendar, Link, Video } from 'lucide-react';

export const Interviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs/interviews');
      setInterviews(response.data);
    } catch (e) {
      // Mock data if API fails
      setInterviews([
        {
          id: 1,
          applicationId: 1,
          scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          durationMinutes: 45,
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          notes: 'Prepare to discuss system designs, scalability, and database optimization.',
          status: 'SCHEDULED',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Scheduled Interviews</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track meeting times and join virtual interview rooms
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8 text-indigo-500"><RefreshCw className="w-5 h-5 animate-spin" /></div>
      ) : interviews.length === 0 ? (
        <div className="p-8 text-center text-slate-500 glass-panel rounded-3xl">
          No upcoming interviews scheduled.
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((meet) => (
            <div key={meet.id} className="p-6 glass-panel rounded-3xl bg-white/40 dark:bg-slate-900/40 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-500" /> Virtual Interview Panel
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Scheduled for: {new Date(meet.scheduledAt).toLocaleString()} ({meet.durationMinutes} minutes)
                  </p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  {meet.status}
                </span>
              </div>

              {meet.notes && (
                <div className="bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl text-sm text-slate-600 dark:text-slate-300 border border-slate-200/20">
                  <span className="font-bold block text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Notes:</span>
                  {meet.notes}
                </div>
              )}

              {meet.meetingLink && (
                <div className="pt-2">
                  <a
                    href={meet.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5"
                  >
                    <Link className="w-4 h-4" /> Join Interview Room
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Interviews;
