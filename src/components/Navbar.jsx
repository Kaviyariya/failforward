import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, PenSquare, TerminalSquare } from 'lucide-react';

const Navbar = ({ onShareClick }) => {
  const { user, logout } = useContext(AuthContext);

  const handleShareClick = () => {
    if (!user) {
      alert("Please log in or sign up to share your story!");
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }));
      return;
    }
    onShareClick();
  };

  return (
    <nav className="bg-[#090A0F]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-6 py-4 max-w-6xl flex justify-between items-center">
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.location.reload()}>
          <TerminalSquare size={28} className="text-brand-purple group-hover:text-brand-purpleLight transition-all group-hover:scale-105 duration-300" />
          <span className="text-2xl font-black text-white tracking-tight">
            Fail<span className="text-brand-purple">Forward</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <button onClick={handleShareClick} className="flex items-center gap-1.5 sm:gap-2 text-white bg-brand-purple hover:bg-brand-purpleDark hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-sm cursor-pointer">
            <PenSquare size={16} />
            <span className="hidden xs:inline sm:inline">Share Story</span>
          </button>

          {user ? (
            <>
              <div className="flex items-center gap-2 text-gray-200 font-bold text-sm bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
                <User size={16} className="text-brand-purple" />
                <span className="hidden sm:inline">{user.name}</span>
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors p-1 cursor-pointer" title="Log Out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4 border-l border-white/10 pl-3 sm:pl-5">
              <button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }))} className="text-gray-400 hover:text-white transition-colors font-bold text-sm cursor-pointer">Log In</button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))} className="bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all font-bold text-sm rounded-xl px-5 py-2 shadow-sm cursor-pointer">Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;