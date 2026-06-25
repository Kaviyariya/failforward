import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TerminalSquare, Mail, Lock, User as UserIcon } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 animate-fade-in pb-10">
      <div className="bg-brand-card p-10 rounded-[2rem] shadow-2xl border border-brand-border relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-purple/20 blur-[60px] rounded-full pointer-events-none"></div>
        
        <div className="text-center mb-10 relative z-10">
          <TerminalSquare size={48} className="mx-auto text-brand-purple mb-4" />
          <h2 className="text-3xl font-black text-white tracking-tight">Join DevBlog</h2>
          <p className="text-brand-textMuted mt-2 font-medium">Create your developer account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-center justify-center text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-5 relative">
            <label className="block text-brand-textMuted text-xs font-bold uppercase tracking-wider mb-2 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon size={18} className="text-brand-textMuted" />
              </div>
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 bg-[#0B0F19] text-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="mb-5 relative">
            <label className="block text-brand-textMuted text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-brand-textMuted" />
              </div>
              <input 
                type="email" 
                className="w-full pl-12 pr-4 py-3 bg-[#0B0F19] text-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                required
              />
            </div>
          </div>

          <div className="mb-8 relative">
            <label className="block text-brand-textMuted text-xs font-bold uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-brand-textMuted" />
              </div>
              <input 
                type="password" 
                className="w-full pl-12 pr-4 py-3 bg-[#0B0F19] text-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-purple text-white font-bold py-3.5 px-4 rounded-xl hover:bg-brand-purpleLight transition-colors shadow-lg shadow-brand-purple/20">
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-brand-textMuted text-sm font-medium relative z-10">
          Already have an account? <Link to="/login" className="text-brand-purpleLight hover:text-white transition-colors underline decoration-brand-purple/50 underline-offset-4">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
