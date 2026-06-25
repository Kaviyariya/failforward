import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, PenSquare, TerminalSquare } from 'lucide-react';

const Navbar = ({ onShareClick }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-50 border-b border-brand-border">
      <div className="container mx-auto px-6 py-4 max-w-6xl flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
          <TerminalSquare size={28} className="text-brand-purple group-hover:text-brand-purpleLight transition-colors" />
          <span className="text-2xl font-black text-white tracking-tight">
            Dev<span className="text-brand-purple">Blog</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <button onClick={onShareClick} className="flex items-center gap-2 text-white bg-brand-purple hover:bg-brand-purpleLight transition-colors px-4 py-2 rounded-lg font-medium">
                <PenSquare size={18} />
                <span className="hidden sm:inline">Write</span>
              </button>
              <div className="flex items-center gap-2 text-brand-textMuted hover:text-white transition-colors cursor-pointer">
                <User size={18} />
                <span className="hidden sm:inline font-medium">{user.name}</span>
              </div>
              <button onClick={logout} className="flex items-center gap-2 text-brand-textMuted hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }))} className="text-brand-textMuted hover:text-white transition-colors font-medium">Log In</button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))} className="bg-brand-purple text-white hover:bg-brand-purpleDark transition-colors font-semibold rounded-lg px-6 py-2">Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;