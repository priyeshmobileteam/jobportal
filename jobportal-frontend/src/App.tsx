import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { Sun, Moon } from 'lucide-react';

type PageState = 'home' | 'detail' | 'admin';

function App() {
  const [page, setPage] = useState<PageState>('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
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

  return (
    <div className="w-full relative min-h-screen">
      {page === 'home' && (
        <Home 
          onSelectPost={handleSelectPost} 
          onNavigateToAdmin={handleNavigateToAdmin} 
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

      {/* Floating Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 bg-blue-900 dark:bg-yellow-500 hover:scale-105 transition-all text-white dark:text-slate-950 p-3.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border border-blue-800 dark:border-yellow-400"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </div>
  );
}

export default App;
