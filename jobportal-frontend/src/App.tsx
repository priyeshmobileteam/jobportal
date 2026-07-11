import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { StaticPage } from './pages/StaticPage';
import { Settings, X, Volume2, VolumeX } from 'lucide-react';

type PageState = 'home' | 'detail' | 'admin' | 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';
type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';
type TextSize = 'small' | 'normal' | 'large';

function App() {
  const [page, setPage] = useState<PageState>('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Settings States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('colorTheme') as ColorTheme) || 'blue';
  });
  const [textSize, setTextSize] = useState<TextSize>(() => {
    return (localStorage.getItem('textSize') as TextSize) || 'normal';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('soundEnabled') !== 'false';
  });

  // Global Fetch Interceptor for Generic Premium Progress Bar
  useEffect(() => {
    const originalFetch = window.fetch;
    let progressInterval: any = null;
    let activeReqCount = 0;

    window.fetch = async (...args) => {
      activeReqCount++;
      if (activeReqCount === 1) {
        setProgress(15);
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(() => {
          setProgress(p => {
            if (p < 85) return p + Math.random() * 6;
            return p + Math.random() * 0.4;
          });
        }, 150);
      }

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        activeReqCount--;
        if (activeReqCount <= 0) {
          activeReqCount = 0;
          if (progressInterval) clearInterval(progressInterval);
          setProgress(100);
          setTimeout(() => {
            setProgress(0);
          }, 300);
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
      if (progressInterval) clearInterval(progressInterval);
    };
  }, []);

  // Dark Mode effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Color Theme effect
  useEffect(() => {
    const classes = ['theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-red'];
    classes.forEach(c => document.documentElement.classList.remove(c));
    document.documentElement.classList.add(`theme-${colorTheme}`);
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  // Text Size effect
  useEffect(() => {
    const classes = ['size-small', 'size-normal', 'size-large'];
    classes.forEach(c => document.body.classList.remove(c));
    document.body.classList.add(`size-${textSize}`);
    localStorage.setItem('textSize', textSize);
  }, [textSize]);

  // Sound Alerts configuration save
  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  // Soft sound trigger on action
  const playSoftClick = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio Context is blocked or unsupported in current browser session", e);
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    playSoftClick();
  };

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page === 'detail') {
        setPage('detail');
        setSelectedPostId(event.state.postId);
      } else if (event.state && event.state.page === 'admin') {
        setPage('admin');
        setSelectedPostId(null);
      } else if (event.state && ['about', 'contact', 'privacy', 'terms', 'disclaimer'].includes(event.state.page)) {
        setPage(event.state.page);
        setSelectedPostId(null);
      } else {
        setPage('home');
        setSelectedPostId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectPost = (id: number) => {
    setSelectedPostId(id);
    setPage('detail');
    window.history.pushState({ page: 'detail', postId: id }, '');
  };

  const handleBackToHome = () => {
    if (window.history.state && window.history.state.page) {
      window.history.back();
    } else {
      setSelectedPostId(null);
      setPage('home');
    }
  };

  const handleNavigateToAdmin = () => {
    setPage('admin');
    window.history.pushState({ page: 'admin' }, '');
  };

  const handleNavigateToStatic = (staticPage: PageState) => {
    setPage(staticPage);
    window.history.pushState({ page: staticPage }, '');
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* Generic Premium Progress Bar */}
      {progress > 0 && (
        <div 
          className="fixed top-0 left-0 h-[4px] z-[999999] bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-yellow-400 dark:via-amber-500 dark:to-orange-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] dark:shadow-[0_0_12px_rgba(245,158,11,0.9)] transition-all duration-300 ease-out premium-loading-bar"
          style={{ width: `${progress}%` }}
        />
      )}
      {page === 'home' && (
        <Home 
          onSelectPost={handleSelectPost} 
          onNavigateToAdmin={handleNavigateToAdmin} 
          onNavigateToStatic={handleNavigateToStatic}
        />
      )}
      {page === 'detail' && selectedPostId !== null && (
        <PostDetail 
          postId={selectedPostId} 
          onBack={handleBackToHome} 
        />
      )}
      {page === 'admin' && (
        <AdminDashboard 
          onBack={handleBackToHome} 
        />
      )}
      {['about', 'contact', 'privacy', 'terms', 'disclaimer'].includes(page) && (
        <StaticPage 
          type={page as any} 
          onBack={handleBackToHome} 
        />
      )}

      {/* Floating Settings Button */}
      <button
        onClick={() => {
          setIsSettingsOpen(true);
          playSoftClick();
        }}
        className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-yellow-500 hover:scale-110 transition-all text-white dark:text-slate-950 p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-2 border-white dark:border-slate-900"
        title="Open Settings & Customizations"
      >
        <Settings size={22} className="animate-spin-slow" />
      </button>

      {/* Settings Modal Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden p-6 relative">
            <button
              onClick={() => {
                setIsSettingsOpen(false);
                playSoftClick();
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-black text-slate-850 dark:text-white border-b pb-2.5 mb-4 flex items-center gap-2">
              <Settings size={18} className="text-blue-900 dark:text-yellow-500" />
              <span>Portal Preferences</span>
            </h3>

            {/* Light / Dark Mode Section */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Mode</label>
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </span>
                <button
                  onClick={handleToggleTheme}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    theme === 'dark' ? 'bg-yellow-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="bg-white w-4 h-4 rounded-full shadow block"></span>
                </button>
              </div>
            </div>

            {/* Accent Theme Colors Section */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Accent Theme Palette</label>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { key: 'blue', color: 'bg-blue-900 border-blue-500', name: 'Classic Blue' },
                  { key: 'green', color: 'bg-emerald-750 border-emerald-500', name: 'Emerald Green' },
                  { key: 'purple', color: 'bg-purple-750 border-purple-500', name: 'Royal Purple' },
                  { key: 'orange', color: 'bg-amber-750 border-amber-500', name: 'Vibrant Amber' },
                  { key: 'red', color: 'bg-red-750 border-red-500', name: 'Crimson Red' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setColorTheme(item.key as ColorTheme);
                      playSoftClick();
                    }}
                    className={`h-9 w-9 rounded-full cursor-pointer transition-all hover:scale-110 border-2 ${
                      item.color
                    } ${colorTheme === item.key ? 'ring-4 ring-offset-2 ring-blue-900 dark:ring-yellow-500 scale-105' : 'border-transparent'}`}
                    title={item.name}
                  />
                ))}
              </div>
            </div>

            {/* Font Size Settings */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Text Readability</label>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
                {(['small', 'normal', 'large'] as TextSize[]).map(sz => (
                  <button
                    key={sz}
                    onClick={() => {
                      setTextSize(sz);
                      playSoftClick();
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded cursor-pointer capitalize transition-all ${
                      textSize === sz
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Alerts Settings */}
            <div className="mb-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sound Alerts</label>
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>Alert Sound Effects</span>
                </span>
                <button
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) {
                      // Trigger audio feedback test
                      setTimeout(() => {
                        try {
                          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                          const osc = audioCtx.createOscillator();
                          const gain = audioCtx.createGain();
                          osc.connect(gain);
                          gain.connect(audioCtx.destination);
                          osc.frequency.value = 523.25; // C5
                          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
                          osc.start();
                          osc.stop(audioCtx.currentTime + 0.1);
                        } catch(e){}
                      }, 100);
                    }
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    soundEnabled ? 'bg-green-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="bg-white w-4 h-4 rounded-full shadow block"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
