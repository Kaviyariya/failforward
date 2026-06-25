import { X } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const defaultTemplate = {
  category: 'Technology',
  title: '',
  content: '',
  image: ''
};

const ShareStoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useContext(AuthContext);
  
  // Form State
  const [formData, setFormData] = useState(defaultTemplate);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultTemplate);
      setIsSubmitting(false);
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        alert("You must be logged in to post!");
        return;
    }
    setIsSubmitting(true);
    
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        image: formData.image,
        category: formData.category
      };

      await axios.post('http://localhost:5000/api/blogs', payload);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData(defaultTemplate);
        onClose();
        if(onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error submitting blog:', error);
      alert('Failed to submit blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto py-10" onClick={onClose}>
      <div className="bg-brand-card w-full max-w-2xl p-6 md:p-8 rounded-2xl relative shadow-2xl border border-brand-border my-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-textMuted hover:text-white transition-colors">
          <X size={24} />
        </button>
        
        {submitted ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Blog Shared Successfully!</h2>
            <p className="text-brand-textMuted">Thank you for sharing your knowledge.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">
                Write a Blog
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-brand-text mb-1">Author Name</label>
                  <input 
                    type="text" 
                    value={user ? user.name : "Not Logged In"}
                    disabled={true}
                    className="w-full bg-[#0B0F19] border border-brand-border text-white rounded-lg px-4 py-2.5 focus:border-brand-purple focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-text mb-1">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#0B0F19] border border-brand-border text-white rounded-lg px-4 py-2.5 focus:border-brand-purple focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option>Technology</option>
                    <option>Engineering</option>
                    <option>Career</option>
                    <option>Tutorials</option>
                    <option>Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-text mb-1">Blog Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#0B0F19] border border-brand-border text-white rounded-lg px-4 py-2.5 focus:border-brand-purple focus:outline-none transition-colors placeholder-brand-textMuted" />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-text mb-1">Image URL</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-[#0B0F19] border border-brand-border text-white rounded-lg px-4 py-2.5 focus:border-brand-purple focus:outline-none transition-colors placeholder-brand-textMuted" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-text mb-1">Content (Markdown/HTML supported)</label>
                <textarea required name="content" value={formData.content} onChange={handleChange} className="w-full bg-[#0B0F19] border border-brand-border text-white rounded-lg px-4 py-3 focus:border-brand-purple focus:outline-none transition-colors min-h-[250px] placeholder-brand-textMuted"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !user}
                className="btn-primary w-full py-4 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed bg-brand-purple text-white rounded-xl hover:bg-brand-purpleLight transition-colors font-bold"
              >
                {isSubmitting ? 'Submitting...' : 'Publish Blog'}
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareStoryModal;
