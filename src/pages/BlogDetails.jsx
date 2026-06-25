import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, MessageSquare, Edit2, Trash2, TerminalSquare, Calendar, User, Share2 } from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blogRes = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(blogRes.data);

        // Fetch comments
        const commentsRes = await axios.get(`http://localhost:5000/api/blogs/${id}/comments`);
        setComments(commentsRes.data);

        // Fetch related blogs powered by Gemini
        const relatedRes = await axios.get(`http://localhost:5000/api/blogs/${id}/related`);
        setRelatedBlogs(relatedRes.data);
      } catch (err) {
        console.error("Failed to fetch blog data", err);
      }
    };
    fetchBlogData();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert('Please login to like this post.');
    try {
      const res = await axios.put(`http://localhost:5000/api/blogs/${id}/like`);
      setBlog({ ...blog, likes: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment.');
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/blogs/${id}/comments`, { comment: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!blog) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
    </div>
  );

  const isAuthor = user && (blog.author._id === user.id || blog.author === user.id);
  const hasLiked = user && blog.likes.includes(user.id);

  return (
    <div className="max-w-5xl mx-auto mt-4 animate-fade-in pb-20">
      {/* Blog Content */}
      <article className="bg-brand-card rounded-[2rem] shadow-2xl border border-brand-border overflow-hidden mb-12">
        {blog.image && (
          <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/20 to-transparent"></div>
          </div>
        )}
        
        <div className={`px-8 md:px-16 ${blog.image ? '-mt-24 relative z-10' : 'pt-16'}`}>
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex justify-between items-start">
              <span className="inline-block px-4 py-1.5 bg-[#0B0F19] border border-brand-purple/30 text-brand-purpleLight text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                {blog.category}
              </span>
              
              {isAuthor && (
                <div className="flex gap-3 bg-[#0B0F19] p-1.5 rounded-full border border-brand-border">
                  <Link to={`/edit-blog/${blog._id}`} className="p-2 text-brand-textMuted hover:text-brand-purple hover:bg-brand-purple/10 rounded-full transition-colors">
                    <Edit2 size={18} />
                  </Link>
                  <button onClick={handleDelete} className="p-2 text-brand-textMuted hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-brand-textMuted font-medium text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purpleLight">
                  <User size={16} />
                </div>
                <span className="text-brand-text hover:text-brand-purple transition-colors cursor-pointer">{blog.author?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-border to-transparent mb-12"></div>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-purpleLight hover:prose-a:text-brand-purple prose-pre:bg-[#0B0F19] prose-pre:border prose-pre:border-brand-border text-brand-text leading-loose" dangerouslySetInnerHTML={{ __html: blog.content }}></div>

          {/* Actions & Share */}
          <div className="mt-16 pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-6 pb-12">
            <div className="flex items-center gap-4 bg-[#0B0F19] p-2 rounded-2xl border border-brand-border">
              <button 
                onClick={handleLike} 
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  hasLiked 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                    : 'hover:bg-brand-border text-brand-textMuted hover:text-white border border-transparent'
                }`}
              >
                <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} className={hasLiked ? 'animate-bounce' : ''} />
                <span>{blog.likes.length} Likes</span>
              </button>
              <div className="w-[1px] h-8 bg-brand-border"></div>
              <div className="flex items-center gap-2 px-6 py-3 text-brand-textMuted font-medium">
                <MessageSquare size={20} />
                <span>{comments.length} Comments</span>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-border text-brand-textMuted hover:text-white hover:bg-brand-card transition-colors">
              <Share2 size={18} />
              <span className="font-medium">Share Article</span>
            </button>
          </div>
        </div>
      </article>

      {/* AI Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TerminalSquare className="text-brand-purple" size={28} />
            <h3 className="text-2xl font-black text-white tracking-tight">
              Related Insights
            </h3>
            <span className="px-2 py-1 bg-brand-purple/20 text-brand-purpleLight text-xs font-bold rounded-md ml-2 border border-brand-purple/30">AI Curated</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map(rb => (
              <Link to={`/blog/${rb._id}`} key={rb._id} className="group bg-brand-card rounded-2xl border border-brand-border overflow-hidden hover:border-brand-purple/50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                {rb.image ? (
                   <img src={rb.image} alt={rb.title} className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                ) : (
                   <div className="w-full h-40 bg-[#0B0F19] flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                     <TerminalSquare size={32} className="text-brand-border relative z-10" />
                   </div>
                )}
                <div className="p-6">
                  <span className="text-xs text-brand-purpleLight font-bold uppercase tracking-widest block mb-2">{rb.category}</span>
                  <h4 className="font-bold text-white text-lg line-clamp-2 group-hover:text-brand-purpleLight transition-colors leading-snug">{rb.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-brand-card rounded-3xl shadow-xl border border-brand-border p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <h3 className="text-2xl font-black text-white mb-8 relative z-10">Developer Discussion</h3>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-12 relative z-10">
            <div className="bg-[#0B0F19] rounded-2xl border border-brand-border p-2 focus-within:border-brand-purple focus-within:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all">
              <textarea
                className="w-full px-4 py-3 bg-transparent text-white placeholder-brand-textMuted focus:outline-none resize-none"
                rows="3"
                placeholder="Share your perspective or ask a question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-end p-2 border-t border-brand-border/50">
                <button type="submit" className="bg-brand-purple text-white font-bold py-2 px-8 rounded-xl hover:bg-brand-purpleLight transition-colors shadow-lg">
                  Post Reply
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-[#0B0F19] p-8 rounded-2xl text-center mb-12 border border-brand-border relative z-10">
            <TerminalSquare size={32} className="mx-auto text-brand-textMuted mb-4" />
            <h4 className="text-lg text-white font-bold mb-2">Join the conversation</h4>
            <p className="text-brand-textMuted mb-4">You must be logged in to leave a comment.</p>
            <Link to="/login" className="inline-block bg-brand-purple text-white font-medium px-6 py-2 rounded-lg hover:bg-brand-purpleLight transition-colors">
              Log In to Reply
            </Link>
          </div>
        )}

        <div className="space-y-8 relative z-10">
          {comments.map((c, index) => (
            <div key={c._id} className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-purple to-brand-purpleDark text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-brand-purple/20">
                {c.userId?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-[#0B0F19] rounded-2xl rounded-tl-none p-5 border border-brand-border hover:border-brand-border/80 transition-colors">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold text-white">{c.userId?.name}</span>
                  <span className="text-xs text-brand-textMuted font-medium tracking-wide">
                    {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-brand-text leading-relaxed text-sm md:text-base">{c.comment}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center py-12 border-t border-brand-border/50 border-dashed">
              <p className="text-brand-textMuted font-medium">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
