import React, { useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TerminalSquare, Image as ImageIcon, Tag, Type, RefreshCw } from 'lucide-react';

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Technology');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const categories = ['Technology', 'Engineering', 'Career', 'Tutorials', 'Design'];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        const blog = res.data;
        if (blog.author._id !== user?.id && blog.author !== user?.id) {
            navigate('/'); // not authorized
        }
        setTitle(blog.title);
        setContent(blog.content);
        setImage(blog.image || '');
        setCategory(blog.category);
      } catch (err) {
        console.error(err);
        setError('Failed to load blog data.');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
        fetchBlog();
    }
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/blogs/${id}`, {
        title,
        content,
        image,
        category
      });
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update blog.');
    }
  };

  if (!user || loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-fade-in pb-20">
      <div className="bg-brand-card p-10 md:p-14 rounded-[2rem] shadow-2xl border border-brand-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-purple/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <h1 className="text-4xl font-black text-white mb-8 tracking-tight flex items-center gap-4 relative z-10">
          <RefreshCw className="text-brand-purple" /> Edit Post
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-sm font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-6 relative">
            <label className="block text-brand-textMuted text-xs font-bold uppercase tracking-wider mb-2 ml-1">Article Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Type size={18} className="text-brand-textMuted" />
              </div>
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-4 bg-[#0B0F19] text-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-lg font-bold"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 relative">
              <label className="block text-brand-textMuted text-xs font-bold uppercase tracking-wider mb-2 ml-1">Cover Image URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ImageIcon size={18} className="text-brand-textMuted" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 bg-[#0B0F19] text-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 relative">
              <label className="block text-brand-textMuted text-xs font-bold uppercase tracking-wider mb-2 ml-1">Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Tag size={18} className="text-brand-textMuted" />
                </div>
                <select 
                  className="w-full pl-12 pr-4 py-3 bg-[#0B0F19] text-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all appearance-none cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-brand-textMuted text-xs font-bold uppercase tracking-wider mb-2 ml-1">Content Body</label>
            <div className="bg-[#0B0F19] rounded-xl border border-brand-border overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-brand-border [&_.ql-toolbar]:bg-brand-card [&_.ql-container]:border-none [&_.ql-editor]:min-h-[400px] [&_.ql-editor]:text-white [&_.ql-editor]:text-lg [&_.ql-stroke]:stroke-brand-textMuted [&_.ql-fill]:fill-brand-textMuted">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-purple text-white font-bold py-4 px-6 rounded-xl hover:bg-brand-purpleLight transition-colors shadow-lg shadow-brand-purple/20 text-lg flex justify-center items-center gap-2">
             Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
