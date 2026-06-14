import { useState } from 'react';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { AdminDashboard } from './pages/AdminDashboard';

type PageState = 'home' | 'detail' | 'admin';

function App() {
  const [page, setPage] = useState<PageState>('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleSelectPost = (id: number) => {
    setSelectedPostId(id);
    setPage('detail');
  };

  const handleBackToHome = () => {
    setSelectedPostId(null);
    setPage('home');
  };

  const handleNavigateToAdmin = () => {
    setPage('admin');
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
