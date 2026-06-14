import { useEffect, useState } from 'react';
import { LogOut, Plus, Trash2, Edit, RefreshCw, Key, ShieldCheck, BarChart3, ArrowLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

interface Post {
  id: number;
  title: string;
  category: string;
  postDate: string;
  lastUpdateDate: string;
  shortInfo: string;
  totalPosts: number;
  applicationStartDate: string;
  applicationEndDate: string;
  feeDetails: string;
  ageLimits: string;
  vacancyDetails: string;
  officialNotificationUrl: string;
  applyOnlineUrl: string;
  officialWebsiteUrl: string;
  views: number;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [token, setToken] = useState<string>(localStorage.getItem('admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form states for creating/editing posts
  const [isEditing, setIsEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('JOB');
  const [shortInfo, setShortInfo] = useState('');
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [feeDetails, setFeeDetails] = useState('{"General / OBC / EWS": "100", "SC / ST / PH": "0"}');
  const [ageLimits, setAgeLimits] = useState('{"Minimum Age": "18 Years", "Maximum Age": "30 Years"}');
  const [vacancyDetails, setVacancyDetails] = useState('<p>Standard government job vacancy details.</p>');
  const [notifUrl, setNotifUrl] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [webUrl, setWebUrl] = useState('');

  const [adsEnabled, setAdsEnabled] = useState(true);

  useEffect(() => {
    if (token) {
      fetchPosts();
      // Fetch stats to get current ads enabled status
      fetch(`${API_BASE_URL}/api/posts/stats`)
        .then(res => res.json())
        .then(data => {
          if (data.adsEnabled !== undefined) {
            setAdsEnabled(data.adsEnabled);
          }
        })
        .catch(err => console.error('Failed to fetch stats', err));
    }
  }, [token]);

  const toggleAdsEnabled = () => {
    const nextStatus = !adsEnabled;
    fetch(`${API_BASE_URL}/api/admin/posts/ads/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ enabled: nextStatus })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to toggle ads');
        return res.json();
      })
      .then(data => {
        setAdsEnabled(data.adsEnabled);
        localStorage.setItem('global_ads_enabled', data.adsEnabled.toString());
      })
      .catch(err => alert(err.message));
  };

  const fetchPosts = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/posts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid username or password');
        return res.json();
      })
      .then(data => {
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
      })
      .catch(err => {
        setAuthError(err.message);
      });
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('admin_token');
  };

  const triggerSync = () => {
    setSyncMessage('Initiating scrape...');
    fetch(`${API_BASE_URL}/api/admin/posts/sync`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSyncMessage(data.message);
        setTimeout(() => {
          setSyncMessage('');
          fetchPosts();
        }, 5000);
      })
      .catch(err => {
        console.error(err);
        setSyncMessage('Failed to trigger background scrape');
      });
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const postPayload = {
      title,
      category,
      shortInfo,
      totalPosts: Number(totalPosts),
      applicationStartDate: startDate || null,
      applicationEndDate: endDate || null,
      feeDetails,
      ageLimits,
      vacancyDetails,
      officialNotificationUrl: notifUrl,
      applyOnlineUrl: applyUrl,
      officialWebsiteUrl: webUrl
    };

    const url = isEditing && currentPostId 
      ? `${API_BASE_URL}/api/admin/posts/${currentPostId}` 
      : `${API_BASE_URL}/api/admin/posts`;

    const method = isEditing && currentPostId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postPayload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save post');
        return res.json();
      })
      .then(() => {
        resetForm();
        fetchPosts();
      })
      .catch(err => alert(err.message));
  };

  const startEdit = (post: Post) => {
    setIsEditing(true);
    setCurrentPostId(post.id);
    setTitle(post.title);
    setCategory(post.category);
    setShortInfo(post.shortInfo);
    setTotalPosts(post.totalPosts);
    setStartDate(post.applicationStartDate || '');
    setEndDate(post.applicationEndDate || '');
    setFeeDetails(post.feeDetails);
    setAgeLimits(post.ageLimits);
    setVacancyDetails(post.vacancyDetails);
    setNotifUrl(post.officialNotificationUrl);
    setApplyUrl(post.applyOnlineUrl);
    setWebUrl(post.officialWebsiteUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    fetch(`${API_BASE_URL}/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete post');
        fetchPosts();
      })
      .catch(err => alert(err.message));
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentPostId(null);
    setTitle('');
    setCategory('JOB');
    setShortInfo('');
    setTotalPosts(0);
    setStartDate('');
    setEndDate('');
    setFeeDetails('{"General / OBC / EWS": "100", "SC / ST / PH": "0"}');
    setAgeLimits('{"Minimum Age": "18 Years", "Maximum Age": "30 Years"}');
    setVacancyDetails('<p>Standard government job vacancy details.</p>');
    setNotifUrl('');
    setApplyUrl('');
    setWebUrl('');
  };

  // Login view if unauthenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-3">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-extrabold text-blue-950">Portal Administration</h2>
            <p className="text-xs text-slate-500 mt-1">Authenticate to manage vacancy tables & traffic statistics</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900 text-sm"
                placeholder="e.g. admin"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900 text-sm"
                placeholder="••••••••"
              />
            </div>

            {authError && <p className="text-xs text-red-600 font-semibold text-center">{authError}</p>}

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-2.5 rounded text-sm transition-colors shadow flex justify-center items-center gap-2"
            >
              <Key size={16} /> Login to Dashboard
            </button>
          </form>

          <button 
            onClick={onBack}
            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <ArrowLeft size={14} /> Back to Public Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white py-4 shadow border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">ADMIN PANEL</span>
            <h1 className="text-xl font-bold tracking-tight">Nokri.online Control Center</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onBack}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> View Site
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1.5"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Panels */}
      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-12 gap-6">
        
        {/* Form Column */}
        <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-lg shadow p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
              <Plus size={18} />
              <span>{isEditing ? 'Modify Vacancy Post' : 'Add New Vacancy Post'}</span>
            </h2>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Job Post Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-900 text-xs"
                  placeholder="e.g. UPSC CSE Main Form 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-900 text-xs"
                  >
                    <option value="JOB">LATEST JOB</option>
                    <option value="ADMIT_CARD">ADMIT CARD</option>
                    <option value="RESULT">RESULT</option>
                    <option value="SYLLABUS">SYLLABUS</option>
                    <option value="ANSWER_KEY">ANSWER KEY</option>
                    <option value="ADMISSION">ADMISSION</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Total Posts</label>
                  <input
                    type="number"
                    value={totalPosts}
                    onChange={(e) => setTotalPosts(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Short Description Info</label>
                <textarea
                  value={shortInfo}
                  onChange={(e) => setShortInfo(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-900 text-xs"
                  placeholder="Summarize the vacancy info..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded focus:ring-1 focus:ring-blue-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded focus:ring-1 focus:ring-blue-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Application Fees (JSON Format)</label>
                <textarea
                  value={feeDetails}
                  onChange={(e) => setFeeDetails(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded font-mono text-[11px] focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Age Limits (JSON Format)</label>
                <textarea
                  value={ageLimits}
                  onChange={(e) => setAgeLimits(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded font-mono text-[11px] focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Vacancy Split details (HTML format)</label>
                <textarea
                  value={vacancyDetails}
                  onChange={(e) => setVacancyDetails(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded font-mono text-[11px] focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-600">Action URLs</label>
                <input
                  type="text"
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-xs"
                  placeholder="Apply Online URL"
                />
                <input
                  type="text"
                  value={notifUrl}
                  onChange={(e) => setNotifUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-xs"
                  placeholder="Notification Download URL"
                />
                <input
                  type="text"
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-xs"
                  placeholder="Official Gov Website URL"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-950 text-white font-bold py-2 rounded text-xs transition-colors shadow"
                >
                  {isEditing ? 'Apply Changes' : 'Publish Post'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded text-xs transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Data List & Scraper Column */}
        <section className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          
          {/* Global Configurations Tool */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <span>⚙ Global Portal Configuration</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure live ad placements and future payment options.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-dashed border-slate-100">
              <div>
                <span className="font-bold text-xs text-slate-700 block">Google AdSense Delivery</span>
                <span className="text-[10px] text-slate-400 block">Turn off to completely hide all ads across the portal for all visitors.</span>
              </div>
              <button
                onClick={toggleAdsEnabled}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${adsEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'}`}
              >
                <span className="bg-white w-4 h-4 rounded-full shadow-md transition-all block"></span>
              </button>
            </div>
          </div>

          {/* Web Scraper Tool */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
            <div>
              <h3 className="font-extrabold text-blue-900 text-sm flex items-center gap-2">
                <RefreshCw size={16} className="animate-spin-slow" />
                <span>Nokri.online Automatic Parser Tool</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Trigger Jsoup scraper execution to scan and fetch new notifications.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={triggerSync}
                className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold py-2 px-4 rounded shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap hover:scale-102"
              >
                <RefreshCw size={14} /> Run Scrape Sync
              </button>
              {syncMessage && <p className="text-[10px] text-emerald-700 font-bold mt-2 animate-pulse">{syncMessage}</p>}
            </div>
          </div>

          {/* Traffic Reports / Post Hits Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow overflow-hidden">
            <div className="bg-slate-800 text-white font-bold py-3 px-4 text-sm flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span>Active Listings & Post Traffic Statistics</span>
              </div>
              <span className="bg-slate-700 text-[10px] py-0.5 px-2 rounded">{posts.length} Total</span>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-slate-500 text-xs">Reloading post lists...</div>
              ) : (
                <>
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="p-3">Title / Vacancy Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 text-center">Hits (Views)</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {posts.length > 0 ? (
                        (() => {
                          const totalItems = posts.length;
                          const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
                          const activePage = Math.min(currentPage, totalPages);
                          const startIndex = (activePage - 1) * itemsPerPage;
                          const paginatedPosts = posts.slice(startIndex, startIndex + itemsPerPage);

                          return paginatedPosts.map(post => (
                            <tr key={post.id} className="hover:bg-slate-50">
                              <td className="p-3 font-semibold text-slate-800 max-w-[200px] truncate" title={post.title}>
                                {post.title}
                              </td>
                              <td className="p-3">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                                  {post.category}
                                </span>
                              </td>
                              <td className="p-3 text-center font-bold font-mono text-blue-900">
                                {post.views.toLocaleString()}
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => startEdit(post)}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-1.5 rounded transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(post.id)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ));
                        })()
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400">No vacancies saved in database. Run scraper above to populate.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  {posts.length > 0 && (() => {
                    const totalItems = posts.length;
                    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
                    const activePage = Math.min(currentPage, totalPages);
                    const startIndex = (activePage - 1) * itemsPerPage;

                    return (
                      <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <span>Show</span>
                          <select 
                            value={itemsPerPage} 
                            onChange={(e) => {
                              setItemsPerPage(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                            className="border border-slate-300 rounded px-1.5 py-1 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-900"
                          >
                            <option value={10}>10 rows</option>
                            <option value={25}>25 rows</option>
                            <option value={50}>50 rows</option>
                            <option value={100}>100 rows</option>
                          </select>
                          <span>
                            Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of <strong>{totalItems}</strong> entries
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            disabled={activePage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="px-2.5 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors cursor-pointer"
                          >
                            Prev
                          </button>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum = 1;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (activePage <= 3) {
                              pageNum = i + 1;
                            } else if (activePage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = activePage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-1.5 rounded font-semibold cursor-pointer border transition-colors ${
                                  activePage === pageNum 
                                    ? 'bg-blue-900 border-blue-900 text-white' 
                                    : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          <button
                            disabled={activePage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="px-2.5 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
