import { useState, useEffect, useContext } from 'react';
import { Search, Heart, Eye, MessageSquare, TerminalSquare, User, Briefcase, BookOpen, PenTool, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const getIconForCategory = (category) => {
  if (!category) return <TerminalSquare size={20} className="text-brand-textMuted" />;
  switch (category.toLowerCase()) {
    case 'technology': return <TerminalSquare size={20} className="text-brand-purpleLight" />;
    case 'engineering': return <Briefcase size={20} className="text-blue-400" />;
    case 'career': return <User size={20} className="text-green-400" />;
    case 'tutorials': return <BookOpen size={20} className="text-yellow-400" />;
    case 'design': return <PenTool size={20} className="text-pink-400" />;
    default: return <TerminalSquare size={20} className="text-brand-textMuted" />;
  }
};

const getIconBgForCategory = (category) => {
  if (!category) return 'bg-gray-800';
  switch (category.toLowerCase()) {
    case 'technology': return 'bg-brand-purple/20';
    case 'engineering': return 'bg-blue-500/10';
    case 'career': return 'bg-green-500/10';
    case 'tutorials': return 'bg-yellow-500/10';
    case 'design': return 'bg-pink-500/10';
    default: return 'bg-gray-800';
  }
};

const stripHtml = (html) => {
   let doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
};

const MainFeed = ({ onSelectStory, refreshTrigger }) => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const handleDeleteCard = async (e, blog) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete your story?")) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/blogs/${blog._id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      setBlogs(prev => prev.filter(b => b._id !== blog._id));
    } catch (err) {
      alert("Failed to delete story.");
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs?search=${searchQuery}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setBlogs(data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [refreshTrigger, searchQuery]);

  // Sort blogs by popularity (likes + views)
  const popularBlogs = [...blogs].sort((a, b) => {
    const scoreA = (a.likes?.length || 0) * 2 + (a.views || 150);
    const scoreB = (b.likes?.length || 0) * 2 + (b.views || 150);
    return scoreB - scoreA;
  });

  const handleLikeCard = async (e, blog) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in or sign up to like this blog!");
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }));
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${blog._id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      const newLikes = await res.json();
      setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, likes: newLikes } : b));
    } catch (err) {
      console.error("Error liking card:", err);
    }
  };

  const handleCardClick = (blog) => {
    onSelectStory(blog);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 md:px-16 py-6 sm:py-10 bg-[#090A0F]">
      
      <div className="max-w-4xl space-y-8">
        {/* Simple Quotes Left */}
        <div className="border-l-4 border-brand-purple pl-4 py-1.5 bg-white/[0.02] pr-4 rounded-r-xl">
          <p className="text-base sm:text-lg font-serif italic text-gray-200 leading-relaxed">
            “Failure is simply the opportunity to begin again, this time more intelligently.”
          </p>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-purpleLight mt-1.5 block">
            Henry Ford • Growth Mindset
          </span>
        </div>

        {/* Search Bar Left */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search blogs, errors, advice..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all shadow-sm placeholder-gray-500 text-sm font-medium"
          />
        </div>

        {/* Section Title */}
        <div className="pt-2">
          <h2 className="text-2xl font-black text-white tracking-tight">Popular Blogs</h2>
          <p className="text-xs text-gray-400 mt-1">Sorted based on community engagement and views</p>
        </div>

        {/* Story List */}
        <div className="space-y-5 pb-24">
          {loading ? (
             <div className="text-gray-400 py-12 text-center font-medium animate-pulse">Loading popular blogs...</div>
          ) : popularBlogs.length === 0 ? (
             <div className="text-gray-400 py-12 text-center font-medium bg-[#0E1019] rounded-2xl border border-white/10 p-8">No blogs found. Be the first to share your journey!</div>
          ) : (
            popularBlogs.map((blog, idx) => {
              const mockViews = blog.views || (idx + 1) * 240 + 120;
              const mockCommentsCount = blog.commentsCount || Math.floor(mockViews / 15);

              return (
              <div key={blog._id || idx} className="bg-[#0E1019] border border-white/10 rounded-2xl p-5 sm:p-7 hover:border-brand-purple/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300 group">
                
                <div className="flex gap-4 sm:gap-5">
                  {/* Category Icon */}
                  <div className="hidden sm:flex flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purpleLight font-bold group-hover:scale-110 transition-transform duration-300">
                      {getIconForCategory(blog.category)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-brand-purpleLight transition-colors cursor-pointer" onClick={() => handleCardClick(blog)}>
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {user && (
                          (user.id && (blog.author?._id === user.id || blog.author === user.id)) ||
                          (user.name && blog.author?.name && user.name.toLowerCase() === blog.author?.name?.toLowerCase()) ||
                          (blog._id?.toString().startsWith('local_'))
                        ) && (
                          <>
                            <span className="text-[10px] font-black bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Your Story
                            </span>
                            <button
                              onClick={(e) => handleDeleteCard(e, blog)}
                              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete story"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purpleLight border border-brand-purple/20">
                          {blog.category || 'Tech'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-3">
                      <span>By {blog.author?.name || 'Developer'}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {stripHtml(blog.content || blog.summary || '').substring(0, 250)}...
                    </p>
                    
                    {/* Card Footer Metrics & Action */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                      <div className="flex items-center gap-5 text-gray-400 text-xs font-semibold">
                        <span 
                          onClick={(e) => handleLikeCard(e, blog)}
                          className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer select-none"
                        >
                          <Heart size={16} className={blog.likes?.length ? "text-red-500 fill-red-500" : ""}/> 
                          {blog.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
                          <MessageSquare size={16}/> 
                          {mockCommentsCount}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Eye size={16}/> 
                          {mockViews}
                        </span>
                      </div>

                      <button 
                        onClick={() => handleCardClick(blog)} 
                        className="bg-brand-purple text-white hover:bg-brand-purpleDark hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
                      >
                        Read Full <span className="text-sm leading-none group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </div>
                
              </div>
              );
            })
          )}
        </div>
      </div>
      
    </div>
  );
};

export default MainFeed;
