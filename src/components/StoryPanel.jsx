import { ArrowLeft, Heart, Share2, TerminalSquare, User, MessageSquare, Send, Edit3, Trash2 } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const StoryPanel = ({ story, onClose, onStoryUpdated }) => {
  const { user } = useContext(AuthContext);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [currentStory, setCurrentStory] = useState(story);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editContent, setEditContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    setCurrentStory(story);
    if (story) {
      setEditTitle(story.title || '');
      setEditCategory(story.category || 'Technology');
      setEditContent(story.content || story.summary || '');
    }
  }, [story]);

  // Increment views, fetch comments and related when story opens
  useEffect(() => {
    if (story && story._id) {
      // Increment view
      axios.put(`http://localhost:5000/api/blogs/${story._id}/view`)
        .then(res => {
          if (res.data && res.data.views) {
            setCurrentStory(prev => prev ? { ...prev, views: res.data.views } : prev);
            if (onStoryUpdated) onStoryUpdated();
          }
        })
        .catch(() => {});

      // Fetch comments
      axios.get(`http://localhost:5000/api/blogs/${story._id}/comments`)
        .then(res => setComments(res.data || []))
        .catch(() => {});

      // Fetch related
      axios.get(`http://localhost:5000/api/blogs/${story._id}/related`)
        .then(res => setRelatedBlogs(res.data))
        .catch(err => console.error(err));
    }
  }, [story]);

  const authorId = currentStory?.author?._id || currentStory?.author?.id || (typeof currentStory?.author === 'string' ? currentStory?.author : null);
  const authorName = currentStory?.author?.name || (typeof currentStory?.author === 'string' ? currentStory?.author : 'Developer');
  const isAuthor = user && (
    (user.id && authorId && user.id.toString() === authorId.toString()) ||
    (user.name && authorName && user.name.toLowerCase() === authorName.toLowerCase()) ||
    (currentStory?._id?.toString().startsWith('local_'))
  );

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this story?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${currentStory._id}`, {
        headers: { 'x-auth-token': token }
      });
      if (onStoryUpdated) onStoryUpdated();
      onClose();
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete story.");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setSavingEdit(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/blogs/${currentStory._id}`, {
        title: editTitle,
        category: editCategory,
        content: editContent
      }, {
        headers: { 'x-auth-token': token }
      });
      setCurrentStory(res.data);
      setIsEditing(false);
      if (onStoryUpdated) onStoryUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to update story.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleLike = async () => {
    if (!currentStory) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in or sign up to like this blog!");
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }));
      return;
    }
    try {
      const res = await axios.put(`http://localhost:5000/api/blogs/${currentStory._id}/like`, {}, {
        headers: { 'x-auth-token': token }
      });
      setCurrentStory(prev => ({ ...prev, likes: res.data }));
      if (onStoryUpdated) onStoryUpdated();
    } catch (err) {
      console.error("Error liking blog:", err);
      alert("Failed to like story. Make sure you are logged in!");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in or sign up to comment!");
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }));
      return;
    }
    setSubmittingComment(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/blogs/${currentStory._id}/comments`, {
        comment: newComment.trim()
      }, {
        headers: { 'x-auth-token': token }
      });
      setComments(prev => [res.data, ...prev]);
      setNewComment('');
      if (onStoryUpdated) onStoryUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to post comment. Make sure you are logged in!");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="w-full md:w-[640px] bg-[#0B0D14] h-screen overflow-y-auto border-l border-white/10 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)] relative z-50 transition-all animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-5 sm:p-7 pb-4 border-b border-white/10 sticky top-0 bg-[#0B0D14]/95 backdrop-blur-md z-[50]">
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="flex items-center gap-2 text-white hover:bg-white/20 transition-all bg-white/10 border border-white/20 px-4 py-2 rounded-xl font-bold text-xs shadow-sm cursor-pointer">
            <ArrowLeft size={16} /> Back to Blogs
          </button>
          <div className="flex items-center gap-2">
            {isAuthor && !isEditing && (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 bg-brand-purple/20 border border-brand-purple/40 text-brand-purpleLight hover:bg-brand-purple/30 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </>
            )}
            <span className="text-gray-400 text-xs font-semibold">{new Date(currentStory.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
        
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purpleLight border border-brand-purple/20 text-[11px] font-bold uppercase tracking-wider">
          {currentStory.category || 'Technology'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight tracking-tight">{currentStory.title}</h2>
        
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400 text-xs font-semibold pb-4">
          <span className="flex items-center gap-1.5"><Heart size={16} className="text-red-500 fill-red-500"/> {currentStory.likes?.length || 0} Likes</span>
          <span className="flex items-center gap-1.5"><MessageSquare size={16} className="text-blue-400"/> {comments.length} Comments</span>
          <span className="flex items-center gap-1.5"><User size={16}/> {currentStory.author?.name || 'Developer'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-7 space-y-8 flex-1">
        
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="bg-[#0E1019] border border-brand-purple/40 rounded-2xl p-6 space-y-4 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
            <h3 className="text-white font-black text-lg mb-2">Edit Your Story</h3>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Title</label>
              <input 
                type="text" 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-brand-purple"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
              <select 
                value={editCategory} 
                onChange={e => setEditCategory(e.target.value)}
                className="w-full bg-[#0E1019] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-brand-purple"
              >
                <option value="Technology">Technology</option>
                <option value="Startup">Startup</option>
                <option value="Career">Career</option>
                <option value="Product">Product</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Story Content</label>
              <textarea 
                rows="8" 
                value={editContent} 
                onChange={e => setEditContent(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-brand-purple leading-relaxed"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={savingEdit}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-purple text-white hover:bg-brand-purpleDark transition-all cursor-pointer disabled:opacity-50"
              >
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-3">Blog Story</h3>
            <div className="bg-[#0E1019] border border-white/10 rounded-2xl p-5 sm:p-6 relative">
               <div 
                 className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-sm whitespace-pre-line"
                 dangerouslySetInnerHTML={{ __html: currentStory.content || currentStory.summary || '' }}
               ></div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 mb-5 text-white font-black text-lg">
            <MessageSquare size={20} className="text-brand-purpleLight" />
            <h3>Community Advice & Comments ({comments.length})</h3>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6 flex gap-3">
            <input 
              type="text" 
              placeholder="Share advice or encouragement..." 
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-1 bg-[#0E1019] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-purple transition-all"
            />
            <button 
              type="submit" 
              disabled={submittingComment || !newComment.trim()}
              className="bg-brand-purple text-white px-5 py-3 rounded-xl font-bold text-xs hover:bg-brand-purpleDark transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer flex-shrink-0"
            >
              <Send size={14} /> {submittingComment ? 'Posting...' : 'Post'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-gray-500 text-xs text-center py-6 bg-[#0E1019]/50 rounded-xl border border-white/5 font-medium">
                No comments yet. Be the first to leave feedback!
              </div>
            ) : (
              comments.map((c, i) => (
                <div key={c._id || i} className="bg-[#0E1019] border border-white/10 p-4 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-brand-purpleLight flex items-center gap-1.5">
                      <User size={13} /> {c.userId?.name || 'Developer'}
                    </span>
                    <span className="text-gray-500 text-[11px]">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now'}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{c.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Related */}
        {relatedBlogs.length > 0 && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4 text-brand-purpleLight font-black">
              <TerminalSquare size={20} />
              <h3>Related Reads</h3>
            </div>
            <div className="space-y-3">
              {relatedBlogs.map(rb => (
                <div key={rb._id} className="bg-[#0E1019] border border-white/10 hover:border-brand-purple/50 p-4 rounded-xl transition-all cursor-pointer">
                  <h4 className="text-white font-bold mb-1 text-sm">{rb.title}</h4>
                  <p className="text-[10px] text-brand-purpleLight font-bold uppercase tracking-wider">{rb.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0B0D14] flex gap-4 sticky bottom-0">
        <button 
          onClick={handleLike}
          className="flex-1 bg-brand-purple text-white hover:bg-brand-purpleDark hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-semibold rounded-xl py-3 flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer"
        >
          <Heart size={16} className={currentStory.likes?.length ? "fill-white" : ""} /> Like this Blog ({currentStory.likes?.length || 0})
        </button>
        <button className="bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer">
          <Share2 size={16} /> Share
        </button>
      </div>

    </div>
  );
};

export default StoryPanel;
