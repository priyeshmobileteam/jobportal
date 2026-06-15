import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { AdminDashboard } from './pages/AdminDashboard';

type PageState = 'home' | 'detail' | 'admin';

function App() {
  const [page, setPage] = useState<PageState>('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

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
    <div className="w-full">
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
    </div>
  );
}

export default App;
