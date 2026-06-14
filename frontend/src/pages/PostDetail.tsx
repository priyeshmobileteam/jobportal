import React, { useEffect, useState } from 'react';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';
import { ArrowLeft, Calendar, Globe, Eye, Info, Download } from 'lucide-react';

interface PostDetailProps {
  postId: number;
  onBack: () => void;
}

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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

export const PostDetail: React.FC<PostDetailProps> = ({ postId, onBack }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/posts/stats`)
      .then(res => res.json())
      .then(data => {
        if (data.adsEnabled !== undefined) {
          localStorage.setItem('global_ads_enabled', data.adsEnabled.toString());
        }
      })
      .catch(err => console.error('Failed to fetch stats', err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/posts/${postId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [postId]);

  // Safe parsing helper for JSON strings
  const parseJsonData = (jsonStr: string): Record<string, string> => {
    try {
      if (!jsonStr) return {};
      return JSON.parse(jsonStr);
    } catch (e) {
      // In case Jsoup stored raw unstructured text
      return { "Details": jsonStr };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <p className="text-slate-500 font-bold mb-4">The requested vacancy details could not be found.</p>
        <button 
          onClick={onBack}
          className="bg-blue-900 text-white px-4 py-2 rounded flex items-center gap-2 font-semibold"
        >
          <ArrowLeft size={16} /> Back to Homepage
        </button>
      </div>
    );
  }

  const isSarkariLink = (url?: string | null): boolean => {
    if (!url) return true;
    const lowerUrl = url.toLowerCase();
    // Allow direct PDF links
    if (lowerUrl.includes('.pdf')) {
      return false;
    }
    return lowerUrl.includes('sarkariresult') || lowerUrl.startsWith('/') || lowerUrl.startsWith('.');
  };

  const sanitizeHtml = (htmlStr: string): string => {
    if (!htmlStr) return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlStr, 'text/html');
      const links = doc.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        const text = (link.textContent || '').toLowerCase();

        // 1. Redirect Telegram or WhatsApp links to their respective custom channels
        const lowerHref = href ? href.toLowerCase() : '';
        const isTelegram = text.includes('telegram') || lowerHref.includes('t.me') || lowerHref.includes('telegram');
        const isWhatsApp = text.includes('whatsapp') || lowerHref.includes('whatsapp.com') || lowerHref.includes('chat.whatsapp.com');
        const isGeneralJoin = text.includes('join') || text.includes('channel');

        if (isTelegram || isWhatsApp || isGeneralJoin) {
          const targetUrl = isTelegram ? 'https://t.me/boost/nokriin' : 'https://whatsapp.com/channel/0029Vb8NM1a5q08aX2ej0r04';
          link.setAttribute('href', targetUrl);
          link.setAttribute('target', '_blank');
          link.removeAttribute('onclick');
          link.style.pointerEvents = 'auto';
          link.style.cursor = 'pointer';
          link.style.color = '';
          link.style.textDecoration = '';
          return;
        }

        if (href) {
          const lowerHref = href.toLowerCase();

          // 2. Allow direct PDF links
          if (lowerHref.includes('.pdf')) {
            link.setAttribute('target', '_blank');
            link.removeAttribute('onclick');
            link.style.pointerEvents = 'auto';
            link.style.cursor = 'pointer';
            link.style.color = '';
            link.style.textDecoration = '';
            return;
          }

          // 3. Block standard sarkariresult page / relative redirects
          if (lowerHref.includes('sarkariresult') || lowerHref.startsWith('/') || lowerHref.startsWith('.')) {
            const isNotificationRow = link.closest('tr')?.textContent?.toLowerCase().includes('notification') || text.includes('notification') || text.includes('pdf') || text.includes('download');
            if (isNotificationRow) {
              link.setAttribute('href', '/coming_soon.pdf');
              link.setAttribute('target', '_blank');
              link.removeAttribute('onclick');
              link.style.pointerEvents = 'auto';
              link.style.cursor = 'pointer';
              link.style.color = '';
              link.style.textDecoration = '';
            } else {
              link.setAttribute('href', '#');
              link.setAttribute('onclick', 'event.preventDefault(); return false;');
              link.style.cursor = 'default';
              link.style.pointerEvents = 'none';
              link.style.color = 'inherit';
              link.style.textDecoration = 'none';
            }
          }
        }
      });
      return doc.body.innerHTML;
    } catch (e) {
      return htmlStr;
    }
  };

  const fees = parseJsonData(post.feeDetails);
  const age = parseJsonData(post.ageLimits);

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <header className="bg-red-600 text-white py-5 border-b-4 border-blue-900 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-2" onClick={onBack}>
            <img 
              src="/logo.png" 
              alt="Nokri.online Logo" 
              className="h-12 w-12 rounded-full object-cover bg-black" 
            />
            <span className="text-xl font-black text-white tracking-widest hidden sm:inline">NOKRI.ONLINE</span>
          </div>
          <button 
            onClick={onBack}
            className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Homepage
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-12 gap-6">
        
        {/* Left Ad Placeholder (Sidebar) */}
        <aside className="hidden lg:block lg:col-span-2">
          <AdSensePlaceholder slot="detail-left" format="vertical" label="Sidebar Left" className="min-h-[500px]" />
        </aside>

        {/* Center Detail Panel */}
        <main className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-lg shadow-md p-4 md:p-6">
          
          <AdSensePlaceholder slot="detail-top" format="horizontal" label="Detail Header Banner" />

          {/* Post Header */}
          <div className="border-b border-slate-200 pb-4 mb-4">
            <span className="bg-red-100 text-red-700 text-xs font-bold uppercase px-2.5 py-1 rounded">
              {post.category.replace('_', ' ')}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-blue-900 mt-2">{post.title}</h2>
            
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500 font-semibold items-center">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Post Date: {post.postDate ? post.postDate.split('T')[0] : 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <Globe size={14} /> Category: {post.category}
              </span>
              <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                <Eye size={14} /> Views Count: {post.views} hits
              </span>
            </div>
          </div>

          {/* Short Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Info size={14} /> Short Information
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-sans">{post.shortInfo}</p>
          </div>

          {/* 3. Dates & Fees Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            
            {/* Dates Panel */}
            <div className="border border-red-600/30 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-red-600 text-white font-bold py-2 px-3 text-sm text-center">
                Important Dates (महत्वपूर्ण तिथियां)
              </div>
              <div className="p-3 bg-white divide-y divide-slate-100">
                <div className="py-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Application Start:</span>
                  <span className="font-bold text-blue-900">{post.applicationStartDate || 'Refer to Notification'}</span>
                </div>
                <div className="py-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600">Last Date to Apply:</span>
                  <span className="font-bold text-red-600">{post.applicationEndDate || 'Refer to Notification'}</span>
                </div>
              </div>
            </div>

            {/* Fees Panel */}
            <div className="border border-red-600/30 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-red-600 text-white font-bold py-2 px-3 text-sm text-center">
                Application Fee (आवेदन शुल्क)
              </div>
              <div className="p-3 bg-white divide-y divide-slate-100">
                {Object.entries(fees).map(([key, val]) => (
                  <div key={key} className="py-2 flex justify-between text-sm">
                    <span className="font-semibold text-slate-600">{key}:</span>
                    <span className="font-bold text-blue-900">₹ {val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Age Limits Panel */}
          {Object.keys(age).length > 0 && (
            <div className="border border-blue-900/20 rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="bg-blue-900 text-white font-bold py-2 px-3 text-sm text-center">
                Age Limit Parameters (आयु सीमा)
              </div>
              <div className="p-3 bg-white divide-y divide-slate-100 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                {Object.entries(age).map(([key, val]) => (
                  <div key={key} className="py-2 flex justify-between text-sm border-b border-slate-100">
                    <span className="font-semibold text-slate-600">{key}:</span>
                    <span className="font-bold text-blue-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Posts Badge */}
          {post.totalPosts > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-center rounded-lg py-3.5 px-4 mb-6 shadow-sm">
              <span className="text-xs uppercase font-bold tracking-wider block">Total Available Vacancies</span>
              <strong className="text-3xl font-extrabold mt-1 block">{post.totalPosts} Posts</strong>
            </div>
          )}

          {/* Scraped Vacancy HTML table */}
          {post.vacancyDetails && (
            <div className="mb-6 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-800 text-white font-bold py-2.5 px-4 text-sm text-center">
                Vacancy Details Table (पद का विवरण)
              </div>
              <div 
                className="overflow-x-auto p-4 bg-white sarkari-scraped-table"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.vacancyDetails) }}
              />
            </div>
          )}

          <AdSensePlaceholder slot="detail-middle" format="horizontal" label="Detail Mid Banner" />

          {/* 4. Direct Links Table */}
          <div className="border border-red-600/30 rounded-lg overflow-hidden shadow-md mt-6">
            <div className="bg-red-600 text-white font-bold py-2.5 px-4 text-md text-center">
              Direct Links to Apply Online / Notification
            </div>
            <table className="w-full text-sm border-collapse text-left bg-white">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <th className="p-3">Resource Link Title</th>
                  <th className="p-3 text-center">Action Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-700">Apply Online Form</td>
                  <td className="p-3 text-center">
                    {isSarkariLink(post.applyOnlineUrl) ? (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-400 font-bold py-1.5 px-4 rounded text-xs border border-slate-200 cursor-default">
                        Link Active Soon
                      </span>
                    ) : (
                      <a
                        href={post.applyOnlineUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded text-xs transition-colors shadow-sm"
                      >
                        <Globe size={13} /> Click Here
                      </a>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700">Download Official Notification File</td>
                  <td className="p-3 text-center">
                    <a
                      href={isSarkariLink(post.officialNotificationUrl) ? '/coming_soon.pdf' : (post.officialNotificationUrl || '/coming_soon.pdf')}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded text-xs transition-colors shadow-sm"
                    >
                      <Download size={13} /> Download PDF
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700">Visit Official Government Website</td>
                  <td className="p-3 text-center">
                    {isSarkariLink(post.officialWebsiteUrl) ? (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-400 font-bold py-1.5 px-4 rounded text-xs border border-slate-200 cursor-default">
                        Link Active Soon
                      </span>
                    ) : (
                      <a
                        href={post.officialWebsiteUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold py-1.5 px-4 rounded text-xs transition-colors shadow-sm"
                      >
                        <Globe size={13} /> Visit Site
                      </a>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <AdSensePlaceholder slot="detail-bottom" format="horizontal" label="Detail Footer Banner" />

        </main>

        {/* Right Ad Placeholder (Sidebar) */}
        <aside className="hidden lg:block lg:col-span-2">
          <AdSensePlaceholder slot="detail-right" format="vertical" label="Sidebar Right" className="min-h-[500px]" />
        </aside>

      </div>
    </div>
  );
};
