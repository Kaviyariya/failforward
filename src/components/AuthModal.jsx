import { X } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AuthModal = () => {
  const { login, register } = useContext(AuthContext);
  const [authMode, setAuthMode] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleOpen = (e) => {
      setAuthMode(e.detail || 'login');
      setError('');
      setSubmitting(false);
    };
    window.addEventListener('openAuthModal', handleOpen);
    return () => window.removeEventListener('openAuthModal', handleOpen);
  }, []);

  if (!authMode) return null;

  const isLogin = authMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setSubmitting(false);
      setAuthMode(null);
      setPassword('');
    } catch (err) {
      setSubmitting(false);
      if (isLogin) {
        setPassword('');
        setError(err.response?.data?.message || 'Invalid login account or password. If you are new, click "Sign Up" below!');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    }
  };

  const toggleMode = () => {
    setAuthMode(isLogin ? 'register' : 'login');
    setError('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setAuthMode(null)}>
      <div className="bg-[#0B0D14] border border-white/10 rounded-2xl w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all" onClick={e => e.stopPropagation()}>
        <button onClick={() => setAuthMode(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full cursor-pointer">
          <X size={18} />
        </button>
        
        <h2 className="text-2xl font-black text-center text-white mb-6 tracking-tight">
          {isLogin ? 'Welcome Back' : 'Join FailForward'}
        </h2>

        {error && <div className="bg-red-500/10 text-red-400 text-xs p-3.5 rounded-xl border border-red-500/20 mb-5 font-semibold leading-relaxed animate-in fade-in">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-sm font-medium transition-all placeholder-gray-600" placeholder="John Doe" required />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-sm font-medium transition-all placeholder-gray-600" placeholder="john@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-sm font-medium transition-all placeholder-gray-600" placeholder="••••••••" required />
          </div>
          
          <button 
            type="submit" 
            disabled={submitting}
            className={`w-full mt-6 py-3.5 text-sm font-bold bg-brand-purple text-white rounded-xl hover:bg-brand-purpleDark hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 cursor-pointer ${submitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {submitting ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-medium text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} className="text-brand-purple font-bold hover:text-brand-purpleLight hover:underline transition-colors cursor-pointer">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
