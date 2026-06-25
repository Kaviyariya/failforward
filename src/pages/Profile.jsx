import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { TerminalSquare, BookOpen, Heart, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/blogs');
        const filtered = res.data.filter(b => b.author._id === user?.id || b.author === user?.id);
        setMyBlogs(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMyBlogs();
    }
  }, [user]);

  if (!user) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto mt-8 animate-fade-in pb-20">
      
      {/* Profile Header */}
      <div className="bg-brand-card p-10 md:p-12 rounded-[2rem] shadow-2xl border border-brand-border flex flex-col md:flex-row items-center md:justify-between gap-8 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-purple to-brand-purpleDark text-white flex items-center justify-center text-5xl font-black shadow-xl shadow-brand-purple/20 border-4 border-[#0B0F19]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-white mb-2">{user.name}</h1>
            <p className="text-brand-textMuted text-lg font-medium bg-[#0B0F19] inline-block px-4 py-1.5 rounded-full border border-brand-border">{user.email}</p>
          </div>
        </div>
        
        <button onClick={logout} className="px-8 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-colors relative z-10">
          Log Out
        </button>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="text-brand-purple" size={28} />
        <h2 className="text-3xl font-black text-white tracking-tight">My Publications</h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2].map(i => <div key={i} className="h-64 bg-brand-card animate-pulse rounded-2xl border border-brand-border"></div>)}
        </div>
      ) : myBlogs.length === 0 ? (
        <div className="bg-brand-card p-16 text-center rounded-[2rem] shadow-2xl border border-brand-border relative overflow-hidden">
           <TerminalSquare size={64} className="mx-auto text-brand-border mb-6" />
           <h3 className="text-2xl font-bold text-white mb-4">No publications yet</h3>
           <p className="text-brand-textMuted mb-8 max-w-md mx-auto">Share your knowledge with the developer community by writing your first technical article.</p>
           <Link to="/create-blog" className="inline-block bg-brand-purple text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-purpleLight transition-colors shadow-lg shadow-brand-purple/20">
             Start Writing
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {myBlogs.map(blog => (
            <Link to={`/blog/${blog._id}`} key={blog._id} className="group bg-brand-card rounded-2xl border border-brand-border hover:border-brand-purple/50 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 shadow-lg">
              {blog.image ? (
                <div className="w-full h-48 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="w-full h-48 bg-[#0B0F19] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <TerminalSquare size={40} className="text-brand-border relative z-10" />
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col relative z-10 bg-brand-card">
                <span className="inline-block self-start mb-4 px-3 py-1 bg-[#0B0F19] border border-brand-border text-brand-purpleLight text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {blog.category}
                </span>
                <h3 className="font-bold text-2xl text-white mb-4 leading-snug group-hover:text-brand-purpleLight transition-colors line-clamp-2">{blog.title}</h3>
                
                <div className="mt-auto pt-6 border-t border-brand-border flex justify-between items-center text-sm font-medium text-brand-textMuted">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={16} className={blog.likes?.length > 0 ? "text-red-400" : ""} />
                    <span>{blog.likes?.length || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
