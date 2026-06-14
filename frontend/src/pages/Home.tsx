import React, { useEffect, useState } from 'react';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';
import { BookOpen, Award, FileText, CheckSquare, PlusCircle, Share2 } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  category: string;
  postDate: string;
  lastUpdateDate: string;
  totalPosts: number;
  views: number;
}

interface HomeProps {
  onSelectPost: (id: number) => void;
  onNavigateToAdmin: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.port === '5173' ? 'http://localhost:8085' : '');

export const Home: React.FC<HomeProps> = ({ onSelectPost, onNavigateToAdmin }) => {
  const [groupedPosts, setGroupedPosts] = useState<Record<string, Post[]>>({});
  const [totalViews, setTotalViews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [, setAdminClicks] = useState(0);

  // Premium & Ad-Free Checkout state
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('user_ad_free') === 'true');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBottomAdDismissed, setIsBottomAdDismissed] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = useState({ name: 'Annual Ad-Free Pass', price: 99 });

  const handleUpgradeSuccess = () => {
    localStorage.setItem('user_ad_free', 'true');
    setIsPremium(true);
    // Dispatch local event so other components immediately know about state update
    window.dispatchEvent(new Event('storage'));
    setCheckoutStep('success');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayWithRazorpay = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    const keyId = localStorage.getItem('razorpay_key_id') || 'rzp_test_default';
    if (keyId === 'rzp_test_default') {
      alert('Razorpay Key ID is not configured. Please set the RAZORPAY_KEY_ID environment variable on Render.');
    }

    const options = {
      key: keyId,
      amount: selectedPlan.price * 100, // in paise
      currency: 'INR',
      name: 'Nokri.online',
      description: `Premium Upgrade - ${selectedPlan.name}`,
      image: '/logo.png',
      handler: function (response: any) {
        if (response.razorpay_payment_id) {
          handleUpgradeSuccess();
        }
      },
      prefill: {
        name: 'Guest Subscriber',
        email: 'subscriber@nokri.online',
        contact: '9999999999'
      },
      theme: {
        color: '#1e3a8a'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // Fetch posts and increment global site views count
  useEffect(() => {
    // Record hit & get total views
    fetch(`${API_BASE_URL}/api/posts/stats/hit`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setTotalViews(data.totalViews || 0);
        if (data.adsEnabled !== undefined) {
          localStorage.setItem('global_ads_enabled', data.adsEnabled.toString());
        }
        if (data.razorpayKeyId) {
          localStorage.setItem('razorpay_key_id', data.razorpayKeyId);
        }
      })
      .catch(err => console.error('Failed to log site view', err));

    // Fetch posts
    fetch(`${API_BASE_URL}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setGroupedPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load posts', err);
        setLoading(false);
      });
  }, []);

  const results = groupedPosts['RESULT'] || [];
  const admitCards = groupedPosts['ADMIT_CARD'] || [];
  const latestJobs = groupedPosts['JOB'] || [];
  const answerKeys = groupedPosts['ANSWER_KEY'] || [];
  const syllabus = groupedPosts['SYLLABUS'] || [];
  const admissions = groupedPosts['ADMISSION'] || [];

  // Flatten posts to populate scrolling marquee
  const allPostsFlattened = [...latestJobs, ...admitCards, ...results].slice(0, 10);

  // Colors for Hot Links matching the user's screenshot
  // Colors for Hot Links matching the user's screenshot
  const hotColors = [
    'bg-red-600 hover:bg-red-700 text-white',
    'bg-orange-500 hover:bg-orange-600 text-white',
    'bg-fuchsia-600 hover:bg-fuchsia-700 text-white',
    'bg-blue-800 hover:bg-blue-900 text-white',
    'bg-lime-700 hover:bg-lime-800 text-white',
    'bg-sky-500 hover:bg-sky-600 text-white',
    'bg-amber-900 hover:bg-amber-950 text-white',
    'bg-emerald-700 hover:bg-emerald-800 text-white'
  ];

  // Dynamically select hot links from latest jobs, admit cards, and results
  const dynamicHotLinks = [
    ...latestJobs.slice(0, 4),
    ...admitCards.slice(0, 2),
    ...results.slice(0, 2)
  ].slice(0, 8);

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* 1. Header Banner */}
      <header className="bg-red-600 text-white py-6 border-b-4 border-blue-900 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left cursor-pointer flex items-center gap-3" onClick={() => window.location.reload()}>
            <img 
              src="/logo.png" 
              alt="Nokri.online Logo" 
              className="h-16 w-16 rounded-full object-cover shadow-md border-2 border-red-500 bg-black" 
            />
            <div className="hidden sm:block">
              <span className="text-2xl font-black tracking-widest text-white block drop-shadow-sm">NOKRI.ONLINE</span>
              <span className="text-[10px] tracking-widest text-red-100 font-bold uppercase block -mt-1 font-mono">Find Your Career</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => {
                setAdminClicks(prev => {
                  const next = prev + 1;
                  if (next >= 5) {
                    onNavigateToAdmin();
                    return 0;
                  }
                  return next;
                });
              }}
              className="opacity-0 w-32 h-10 cursor-default select-none bg-transparent"
              title=""
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* 2. Navigation Menu */}
      <nav className="bg-blue-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between items-center text-sm font-semibold">
          <div className="flex flex-wrap">
            <a href="#" className="px-4 py-3 hover:bg-blue-800 transition-colors border-r border-blue-800/40">Home</a>
            <a href="#latest-jobs" className="px-4 py-3 hover:bg-blue-800 transition-colors border-r border-blue-800/40">Latest Job</a>
            <a href="#admit-cards" className="px-4 py-3 hover:bg-blue-800 transition-colors border-r border-blue-800/40">Admit Card</a>
            <a href="#results" className="px-4 py-3 hover:bg-blue-800 transition-colors border-r border-blue-800/40">Result</a>
            <a href="#admission" className="px-4 py-3 hover:bg-blue-800 transition-colors border-r border-blue-800/40">Admission</a>
            <a href="#syllabus" className="px-4 py-3 hover:bg-blue-800 transition-colors border-r border-blue-800/40">Syllabus</a>
            <a href="#answer-key" className="px-4 py-3 hover:bg-blue-800 transition-colors">Answer Key</a>
          </div>
          <div className="flex items-center gap-3">
            {isPremium ? (
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full shadow border border-yellow-300 flex items-center gap-1">
                ⭐ Premium Active
              </span>
            ) : (
              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-[10px] tracking-wide uppercase px-3 py-1.5 rounded-full shadow transition-all hover:scale-105 flex items-center gap-1 cursor-pointer"
              >
                🚫 Remove Ads
              </button>
            )}
            <div className="hidden lg:flex items-center px-4 py-2 font-mono text-xs text-yellow-300">
              Realtime Job Alert Portal
            </div>
          </div>
        </div>
      </nav>

      {/* 3. Scrolling Ticker (Active Announcement Marquee) */}
      <div className="bg-yellow-100 border-b border-yellow-200 py-2 overflow-hidden flex items-center">
        <div className="bg-yellow-400 text-yellow-900 text-xs font-bold uppercase px-3 py-1 ml-4 rounded shadow-sm z-10 animate-pulse whitespace-nowrap">
          LIVE TICKER
        </div>
        <div className="w-full relative flex items-center">
          <div className="animate-marquee whitespace-nowrap text-sm font-semibold text-slate-700">
            {allPostsFlattened.length > 0 ? (
              allPostsFlattened.map((post) => (
                <span key={post.id} className="mx-6 cursor-pointer hover:text-blue-600" onClick={() => onSelectPost(post.id)}>
                  🔥 {post.title} {post.totalPosts > 0 ? `(${post.totalPosts} Posts)` : ''} &nbsp;&nbsp;|
                </span>
              ))
            ) : (
              <span>Welcome to Nokri.online. Loading real-time vacancy updates...</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Container with Sidebar Ads & Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-12 gap-6">
        
        {/* Left Gutter Ad (Desktop Only) */}
        <aside className="hidden xl:block xl:col-span-2">
          <div className="sticky top-20">
            <AdSensePlaceholder slot="left-sidebar" format="vertical" label="Left Sidebar Banner" className="min-h-[600px]" />
          </div>
        </aside>

        {/* Center Grid Content (Homepage Tables and Hot links) */}
        <main className="col-span-12 xl:col-span-8 flex flex-col">
          
          {/* Top Banner Ad */}
          <AdSensePlaceholder slot="top-banner" format="horizontal" label="Top Homepage Header Banner" />

          <div className="text-center my-4">
            <h2 className="text-base md:text-lg font-bold text-blue-900 border-y border-dashed border-slate-300 py-2 bg-blue-50/50">
              Nokri.online ™ – Get Online Form, Results, Admit Card, Answer Key, Syllabus
            </h2>
          </div>

          {/* WhatsApp / Telegram channel promotion */}
          <div className="flex justify-center my-3">
            <a 
              href="https://whatsapp.com/channel/0029Vb8NM1a5q08aX2ej0r04" 
              target="_blank" 
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <Share2 size={18} />
              <span>Join Our WhatsApp Channel</span>
            </a>
          </div>

          {/* 4. Hot Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
            {dynamicHotLinks.map((post, idx) => (
              <button
                key={post.id}
                onClick={() => onSelectPost(post.id)}
                className={`${hotColors[idx % hotColors.length]} p-4 rounded-lg font-bold text-xs md:text-sm text-center shadow-md transition-all hover:scale-102 hover:shadow-lg flex items-center justify-center min-h-[70px] leading-tight cursor-pointer`}
              >
                {post.title}
              </button>
            ))}
          </div>

          {/* Content Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="mt-4 text-slate-500 font-semibold text-sm">Syncing latest Sarkari vacancy tables...</p>
            </div>
          ) : (
            <>
              {/* 5. Main 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                
                {/* Column 1: Results */}
                <div id="results" className="bg-white border border-red-600/30 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-red-600 text-white font-bold py-2.5 px-4 text-center text-lg shadow-sm flex items-center justify-center gap-2">
                    <Award size={18} />
                    <span>Results (परिणाम)</span>
                  </div>
                  <div className="p-3 divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                    {results.length > 0 ? (
                      results.map(post => (
                        <div 
                          key={post.id}
                          onClick={() => onSelectPost(post.id)}
                          className="py-2.5 px-2 hover:bg-blue-50/50 cursor-pointer text-blue-700 hover:text-blue-900 text-sm font-semibold transition-colors flex items-start gap-1"
                        >
                          <span className="text-red-500">•</span>
                          <span>{post.title}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">No results uploaded yet.</p>
                    )}
                  </div>
                </div>

                {/* Column 2: Admit Card */}
                <div id="admit-cards" className="bg-white border border-red-600/30 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-red-600 text-white font-bold py-2.5 px-4 text-center text-lg shadow-sm flex items-center justify-center gap-2">
                    <FileText size={18} />
                    <span>Admit Card (प्रवेश पत्र)</span>
                  </div>
                  <div className="p-3 divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                    {admitCards.length > 0 ? (
                      admitCards.map(post => (
                        <div 
                          key={post.id}
                          onClick={() => onSelectPost(post.id)}
                          className="py-2.5 px-2 hover:bg-blue-50/50 cursor-pointer text-blue-700 hover:text-blue-900 text-sm font-semibold transition-colors flex items-start gap-1"
                        >
                          <span className="text-red-500">•</span>
                          <span>{post.title}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">No admit cards uploaded yet.</p>
                    )}
                  </div>
                </div>

                {/* Column 3: Latest Jobs */}
                <div id="latest-jobs" className="bg-white border border-red-600/30 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-red-600 text-white font-bold py-2.5 px-4 text-center text-lg shadow-sm flex items-center justify-center gap-2">
                    <PlusCircle size={18} />
                    <span>Latest Jobs (नौकरियां)</span>
                  </div>
                  <div className="p-3 divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                    {latestJobs.length > 0 ? (
                      latestJobs.map(post => (
                        <div 
                          key={post.id}
                          onClick={() => onSelectPost(post.id)}
                          className="py-2.5 px-2 hover:bg-blue-50/50 cursor-pointer text-blue-700 hover:text-blue-900 text-sm font-semibold transition-colors flex items-start gap-1"
                        >
                          <span className="text-red-500">•</span>
                          <span>{post.title}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">No jobs uploaded yet.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Mid-Page Ad Banner */}
              <AdSensePlaceholder slot="middle-banner" format="horizontal" label="Middle Grid Separation Banner" />

              {/* 6. Secondary 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                
                {/* Column 1: Answer Key */}
                <div id="answer-key" className="bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-slate-800 text-white font-bold py-2 px-4 text-center text-md flex items-center justify-center gap-2">
                    <CheckSquare size={16} />
                    <span>Answer Key (उत्तर कुंजी)</span>
                  </div>
                  <div className="p-3 divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                    {answerKeys.length > 0 ? (
                      answerKeys.map(post => (
                        <div 
                          key={post.id}
                          onClick={() => onSelectPost(post.id)}
                          className="py-2 px-2 hover:bg-blue-50/50 cursor-pointer text-blue-700 hover:text-blue-900 text-sm font-semibold transition-colors flex items-start gap-1"
                        >
                          <span className="text-slate-400">•</span>
                          <span>{post.title}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">No answer keys uploaded yet.</p>
                    )}
                  </div>
                </div>

                {/* Column 2: Syllabus */}
                <div id="syllabus" className="bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-slate-800 text-white font-bold py-2 px-4 text-center text-md flex items-center justify-center gap-2">
                    <BookOpen size={16} />
                    <span>Syllabus (पाठ्यक्रम)</span>
                  </div>
                  <div className="p-3 divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                    {syllabus.length > 0 ? (
                      syllabus.map(post => (
                        <div 
                          key={post.id}
                          onClick={() => onSelectPost(post.id)}
                          className="py-2 px-2 hover:bg-blue-50/50 cursor-pointer text-blue-700 hover:text-blue-900 text-sm font-semibold transition-colors flex items-start gap-1"
                        >
                          <span className="text-slate-400">•</span>
                          <span>{post.title}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">No syllabus details uploaded.</p>
                    )}
                  </div>
                </div>

                {/* Column 3: Admission */}
                <div id="admission" className="bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden">
                  <div className="bg-slate-800 text-white font-bold py-2 px-4 text-center text-md flex items-center justify-center gap-2">
                    <PlusCircle size={16} />
                    <span>Admission (प्रवेश)</span>
                  </div>
                  <div className="p-3 divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                    {admissions.length > 0 ? (
                      admissions.map(post => (
                        <div 
                          key={post.id}
                          onClick={() => onSelectPost(post.id)}
                          className="py-2 px-2 hover:bg-blue-50/50 cursor-pointer text-blue-700 hover:text-blue-900 text-sm font-semibold transition-colors flex items-start gap-1"
                        >
                          <span className="text-slate-400">•</span>
                          <span>{post.title}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">No admission records found.</p>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* 7. Analytical Views Counter Panel */}
          <div className="mt-8 bg-blue-950 text-white rounded-lg shadow-lg border border-blue-900 p-6 text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-300">Live Traffic Analytics</h3>
            <div className="text-4xl font-extrabold font-mono text-yellow-300 mt-2 tracking-widest drop-shadow">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">Total Web Page Hits Recorded Dynamically</p>
          </div>

        </main>

        {/* Right Gutter Ad (Desktop Only) */}
        <aside className="hidden xl:block xl:col-span-2">
          <div className="sticky top-20">
            <AdSensePlaceholder slot="right-sidebar" format="vertical" label="Right Sidebar Banner" className="min-h-[600px]" />
          </div>
        </aside>

      </div>

      {/* Footer Banner */}
      <footer className="bg-blue-950 text-slate-300 mt-16 py-8 border-t-2 border-red-600 text-center text-xs">
        <div className="max-w-4xl mx-auto px-4">
          <table className="w-full border-collapse border border-slate-800 text-left mb-6 text-[11px] max-w-2xl mx-auto">
            <tbody>
              <tr className="bg-blue-900 text-white font-bold">
                <td className="p-2 border border-slate-800">Top Nokri Result Pages</td>
                <td className="p-2 border border-slate-800">Useful Links</td>
              </tr>
              <tr>
                <td className="p-2 border border-slate-800 text-blue-400 hover:underline cursor-pointer">Nokri.online Home</td>
                <td className="p-2 border border-slate-800 text-blue-400 hover:underline cursor-pointer">Sarkari Naukri Hindi</td>
              </tr>
              <tr>
                <td className="p-2 border border-slate-800 text-blue-400 hover:underline cursor-pointer">Up Police Exam Form</td>
                <td className="p-2 border border-slate-800 text-blue-400 hover:underline cursor-pointer">Nokri Result NTPC</td>
              </tr>
            </tbody>
          </table>
          <p>© 2026 Nokri.online. All Rights Reserved.</p>
          <p className="text-slate-500 mt-1">Designated trademarks and brands are the property of their respective owners.</p>
        </div>
      </footer>

      {/* 8. Sticky Bottom Ad Banner */}
      {!isBottomAdDismissed && !isPremium && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-50/90 border-t border-yellow-200 shadow-md">
          <div className="max-w-4xl mx-auto relative flex justify-center items-center">
            <AdSensePlaceholder slot="sticky-bottom" format="horizontal" label="Sticky Bottom Anchor Ad" className="!my-0 border-none rounded-none !py-2 h-[75px] w-full" />
            <button 
              onClick={() => setIsBottomAdDismissed(true)} 
              className="absolute -top-3 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow-md border-2 border-white transition-all cursor-pointer z-50"
              title="Close Ad"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Premium Upgrade & Payment Gateway Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 relative text-left">
              <button 
                onClick={() => { setIsCheckoutOpen(false); setCheckoutStep('plans'); }}
                className="absolute top-4 right-4 text-slate-300 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                <span>⭐ Unlock Premium (Ad-Free)</span>
              </h3>
              <p className="text-xs text-blue-200 mt-1">Support Nokri.online and browse vacancy tables with zero ads.</p>
            </div>

            {/* Step 1: Subscription Plans */}
            {checkoutStep === 'plans' && (
              <div className="p-6 space-y-4 text-left">
                <div className="space-y-3">
                  <div 
                    onClick={() => setSelectedPlan({ name: 'Monthly Basic ad-free', price: 19 })}
                    className={`border-2 rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all hover:border-blue-900/50 ${selectedPlan.price === 19 ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200'}`}
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Monthly Plan</h4>
                      <p className="text-xs text-slate-500">Perfect for temporary exam season checks</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-blue-900">₹19</span>
                      <span className="text-xs text-slate-400 block">/ month</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setSelectedPlan({ name: 'Annual Ad-Free Pass', price: 99 })}
                    className={`border-2 rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all hover:border-blue-900/50 ${selectedPlan.price === 99 ? 'border-blue-900 bg-blue-50/50 shadow-md' : 'border-slate-200'}`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-800 text-sm">Annual Pass</h4>
                        <span className="bg-amber-100 text-amber-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase">Best Value</span>
                      </div>
                      <p className="text-xs text-slate-500">Full 12 months access to premium ad-free portal</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-blue-900">₹99</span>
                      <span className="text-xs text-slate-400 block">/ year</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                  <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Premium Perks</h5>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-center gap-2">✔ 100% Ad-Free Experience</li>
                    <li className="flex items-center gap-2">✔ Faster Vacancy Loading Speed</li>
                    <li className="flex items-center gap-2">✔ Priority Scraper Synchronization Alerts</li>
                    <li className="flex items-center gap-2">✔ Exclusive WhatsApp Channel Job Updates</li>
                  </ul>
                </div>

                <button 
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 rounded-xl shadow-lg transition-all hover:scale-102 flex justify-center items-center gap-1 cursor-pointer text-sm"
                >
                  Proceed to Checkout (₹{selectedPlan.price})
                </button>
              </div>
            )}

            {/* Step 2: Payment Gateway Integration Page */}
            {checkoutStep === 'payment' && (
              <div className="p-6 space-y-4 text-left">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Selected Plan:</span>
                    <span className="font-bold text-slate-800">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-800 mt-1">
                    <span>Total Amount due:</span>
                    <span className="text-lg text-blue-900">₹{selectedPlan.price}.00</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 space-y-2">
                    <h5 className="font-bold text-xs text-blue-900 flex items-center gap-1">
                      <span>💳 Payment Gateway: Razorpay</span>
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Click the payment button below to open the secure Razorpay Gateway. You can complete the transaction using UPI, Cards, NetBanking, or Wallet.
                    </p>
                  </div>

                  <button
                    onClick={handlePayWithRazorpay}
                    className="w-full bg-blue-900 hover:bg-blue-950 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all hover:scale-102 flex justify-center items-center gap-1.5 cursor-pointer text-sm"
                  >
                    Pay with Razorpay 💳
                  </button>

                  <div className="bg-slate-50 p-3 rounded-xl text-[10px] text-slate-500 border border-slate-100 text-center font-bold">
                    🔒 SECURE SSL ENCRYPTED GATEWAY BY RAZORPAY
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setCheckoutStep('plans')}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs"
                  >
                    Change Plan / Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success Screen */}
            {checkoutStep === 'success' && (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto border-2 border-emerald-300 animate-bounce">
                  ✔
                </div>
                <h4 className="text-xl font-black text-slate-800">Payment Successful!</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your premium role <strong>PREMIUM</strong> has been activated. Enjoy an entirely ad-free experience at Nokri.online.
                </p>
                <button 
                  onClick={() => { setIsCheckoutOpen(false); setCheckoutStep('plans'); }}
                  className="bg-blue-900 hover:bg-blue-950 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer text-xs"
                >
                  Return to Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
