import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Sparkles, TerminalSquare } from 'lucide-react';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Technology', 'Engineering', 'Career', 'Tutorials', 'Design'];

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs?search=${search}&category=${category}`);
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-card border border-brand-border p-10 md:p-16 mb-12 text-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight flex items-center justify-center gap-4">
            <TerminalSquare size={48} className="text-brand-purple" /> Dev Insights
          </h1>
          <p className="text-lg md:text-xl text-brand-textMuted mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover cutting-edge tutorials, engineering stories, and AI-curated developer resources powered by Gemini.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-brand-textMuted group-focus-within:text-brand-purple transition-colors" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search concepts, frameworks, or AI..." 
              className="w-full bg-[#0B0F19] text-white placeholder-brand-textMuted border border-brand-border rounded-xl py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-brand-purple hover:bg-brand-purpleLight text-white px-6 rounded-lg font-bold flex items-center gap-2 transition-colors">
              <Sparkles size={16} /> <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              category === cat 
                ? 'bg-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                : 'bg-brand-card text-brand-textMuted hover:text-white hover:bg-brand-border border border-brand-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
             <div key={i} className="h-80 bg-brand-card animate-pulse rounded-2xl border border-brand-border"></div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-brand-border">
          <TerminalSquare size={48} className="mx-auto text-brand-border mb-4" />
          <h3 className="text-xl text-white font-bold">404: Not Found</h3>
          <p className="text-brand-textMuted mt-2">No developer blogs matched your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <Link to={`/blog/${blog._id}`} key={blog._id} className="group bg-brand-card rounded-2xl border border-brand-border hover:border-brand-purple/50 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)]">
              {blog.image ? (
                <div className="w-full h-52 overflow-hidden relative">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-card to-transparent"></div>
                </div>
              ) : (
                <div className="w-full h-52 bg-[#0B0F19] flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                   <TerminalSquare size={40} className="text-brand-border relative z-10" />
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col relative z-10 -mt-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-brand-bg border border-brand-border text-brand-purpleLight text-xs font-bold uppercase tracking-widest rounded-full">
                    {blog.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 leading-snug group-hover:text-brand-purpleLight transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-brand-textMuted text-sm mb-6 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) + '...' }}></p>
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-brand-border">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple text-xs font-bold">
                       {blog.author?.name?.charAt(0)}
                    </div>
                    <span className="text-xs text-brand-textMuted font-medium">{blog.author?.name || 'Unknown'}</span>
                  </div>
                  <span className="text-brand-purpleLight text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
