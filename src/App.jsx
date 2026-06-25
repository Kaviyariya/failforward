import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import MainFeed from './components/MainFeed';
import StoryPanel from './components/StoryPanel';
import ShareStoryModal from './components/ShareModal';

function App() {
  const [selectedStory, setSelectedStory] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(0);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text overflow-hidden h-screen">
        <Navbar onShareClick={() => setIsShareModalOpen(true)} />
        
        <main className="flex-1 flex overflow-hidden">
          {/* Left Side: Main Feed */}
          <div className={`flex-1 transition-all duration-300 ${selectedStory ? 'mr-0 md:mr-0' : ''}`}>
            <MainFeed onSelectStory={setSelectedStory} refreshTrigger={refreshFeed} />
          </div>

          {/* Right Side: Story Panel Overlay / Slide-out */}
          <div 
            className={`fixed inset-y-0 right-0 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${
              selectedStory ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <StoryPanel story={selectedStory} onClose={() => setSelectedStory(null)} />
          </div>

          {/* Optional backdrop for mobile when panel is open */}
          {selectedStory && (
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
              onClick={() => setSelectedStory(null)}
            ></div>
          )}
        </main>

        <AuthModal />
        <ShareStoryModal 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
          onSuccess={() => setRefreshFeed(prev => prev + 1)}
        />
      </div>
    </AuthProvider>
  );
}

export default App;