import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { authMode, closeModal, login, openModal } = useAuth();

  if (!authMode) return null;

  const isLogin = authMode === 'login';

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    closeModal();
  };

  const toggleMode = () => {
    openModal(isLogin ? 'signup' : 'login');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={closeModal}>
      <div className="card-dark w-full max-w-md p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
        
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          {isLogin ? 'Welcome Back' : 'Join FailForward'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1">Name</label>
              <input type="text" className="input-dark py-2.5" placeholder="John Doe" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Email</label>
            <input type="email" className="input-dark py-2.5" placeholder="john@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Password</label>
            <input type="password" className="input-dark py-2.5" placeholder="••••••••" required />
          </div>
          
          <button type="submit" className="btn-primary w-full mt-6 py-3 text-lg font-bold">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} className="text-blue-400 font-bold hover:text-blue-300 hover:underline transition-colors">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
