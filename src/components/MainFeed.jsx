import { useState, useEffect } from 'react';
import { Search, Heart, Eye, MessageSquare, TerminalSquare, User, Briefcase, BookOpen, PenTool } from 'lucide-react';

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
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex-1 overflow-y-auto min-h-screen px-4 md:px-12 py-10">
      
      {/* Hero Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center relative">
        <div className="max-w-xl z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Learn from developers.<br />
            Grow <span className="text-brand-purple">stronger.</span>
          </h1>
          <p className="text-brand-textMuted text-lg font-medium">
            Real stories. Real lessons. Real growth.
          </p>
        </div>
        
        {/* Placeholder for the illustration shown in the image */}
        <div className="hidden md:flex w-64 h-48 bg-gradient-to-tr from-brand-purple/10 to-transparent rounded-2xl border border-brand-border mt-8 md:mt-0 items-center justify-center relative overflow-hidden">
           <div className="absolute top-4 right-4 text-brand-textMuted text-4xl">☁️</div>
           <div className="absolute top-12 right-12 text-brand-purple text-4xl transform -rotate-12">⚡</div>
           <div className="w-20 h-20 bg-brand-purple/20 rounded-full flex items-center justify-center">
             <TerminalSquare size={32} className="text-brand-purple" />
           </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-textMuted" size={20} />
        <input 
          type="text" 
          placeholder="Search technologies, bugs, AI features..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#131821] border border-brand-border text-white rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-brand-purple transition-colors placeholder-brand-textMuted"
        />
      </div>

      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Developer Blogs</h2>
        <div className="w-12 h-1 bg-brand-purple rounded-full mt-2"></div>
      </div>

      {/* Story List */}
      <div className="space-y-4 max-w-4xl pb-20">
        {loading ? (
           <div className="text-brand-textMuted py-4">Loading blogs...</div>
        ) : blogs.length === 0 ? (
           <div className="text-brand-textMuted py-4">No blogs found.</div>
        ) : (
          blogs.map(blog => (
          <div key={blog._id} className="bg-brand-card border border-brand-border rounded-xl p-6 hover:border-brand-purple/50 transition-colors">
            
            <div className="flex gap-5">
              {/* Left Icon */}
              <div className="hidden sm:flex flex-shrink-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getIconBgForCategory(blog.category)}`}>
                  {getIconForCategory(blog.category)}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="text-xl font-bold text-white truncate">{blog.title}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded bg-brand-purple/10 text-brand-purpleLight border border-brand-purple/20 flex-shrink-0">
                    {blog.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-brand-textMuted text-sm mb-4">
                  <div className="w-4 h-4 rounded border border-brand-textMuted flex items-center justify-center text-[10px]">📅</div>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span>• By {blog.author?.name || 'Developer'}</span>
                </div>
                
                {/* Expanded Summary */}
                <div className="text-brand-text text-sm mb-6 leading-relaxed bg-[#131821] p-4 rounded-lg border border-brand-border/50">
                  <p className="line-clamp-4">
                    {stripHtml(blog.content).substring(0, 300)}...
                  </p>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between border-t border-brand-border pt-4">
                  <div className="flex items-center gap-6 text-brand-textMuted text-sm font-medium">
                    <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer"><Heart size={16}/> {blog.likes?.length || 0}</span>
                  </div>
                  <button onClick={() => onSelectStory(blog)} className="text-brand-purpleLight font-semibold text-sm flex items-center gap-1 hover:text-brand-purple transition-colors">
                    Read Full Story <span className="text-lg leading-none">→</span>
                  </button>
                </div>
              </div>
            </div>
            
          </div>
          ))
        )}
      </div>
      
    </div>
  );
};

export default MainFeed;
