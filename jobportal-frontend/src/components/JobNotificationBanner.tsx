import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import api from '../services/api';

interface Job {
  id: number;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
}

interface Props {
  setView: (view: string) => void;
}

const TILE_COLORS = [
  'bg-red-600',
  'bg-orange-500',
  'bg-purple-700',
  'bg-blue-700',
  'bg-green-700',
  'bg-pink-600',
  'bg-indigo-700',
  'bg-teal-600',
  'bg-yellow-600',
  'bg-rose-700',
];

export function JobNotificationBanner({ setView }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [visible, setVisible] = useState(true);

  const isPremium = user?.isPremium || false;

  useEffect(() => {
    api.get('/jobs/search?page=0&size=10')
      .then(res => {
        const data = res.data?.content || res.data || [];
        setJobs(Array.isArray(data) ? data.slice(0, 10) : []);
      })
      .catch(() => setJobs([]));
  }, []);

  if (isPremium || !visible || jobs.length === 0) return null;

  return (
    <div className="relative w-full bg-gray-900 border-b border-gray-700 py-2 px-3">
      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-2 text-gray-400 hover:text-white text-xs z-10"
        title="Close"
      >
        ✕
      </button>

      {/* Scrolling label */}
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="shrink-0 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">
          🔴 LIVE
        </span>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-wrap gap-2 pb-1">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                onClick={() => {
                  setView('jobs');
                  // Dispatch custom event to select job in the JobList component
                  window.dispatchEvent(new CustomEvent('select-job', { detail: { id: job.id } }));
                  // small delay to let jobs page render, then highlight
                  setTimeout(() => {
                    const el = document.getElementById(`job-row-${job.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el.classList.add('ring-2', 'ring-yellow-400', 'bg-yellow-50', 'dark:bg-yellow-900/20');
                      setTimeout(() => el.classList.remove('ring-2', 'ring-yellow-400', 'bg-yellow-50', 'dark:bg-yellow-900/20'), 3000);
                    }
                  }, 400);
                }}
                title={`${job.title} - ${job.companyName} | ${job.location}`}
                className={`${TILE_COLORS[index % TILE_COLORS.length]} text-white text-xs font-semibold px-3 py-1.5 rounded cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-150 whitespace-nowrap flex items-center gap-1 shadow select-none`}
              >
                <span>📢</span>
                <span>{job.title}</span>
                {job.companyName && (
                  <span className="opacity-80 font-normal">| {job.companyName}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
