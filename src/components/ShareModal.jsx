import { X } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const defaultTemplate = {
  title: '',
  category: 'Placement',
  image: '',
  originalFailure: '',
  whyFailed: '',
  howOvercame: '',
  lessonsLearned: '',
  wishKnew: '',
  advice: '',
  tags: '',
  postAnonymously: false
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image file size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        alert("Please sign up or log in to publish your story! Your typed text will stay right here.");
        window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }));
        return;
    }
    setIsSubmitting(true);
    
    try {
      const assembledContent = `
### Original Failure Story
${formData.originalFailure}

### Why Did You Fail?
${formData.whyFailed}

### How Did You Overcome It?
${formData.howOvercame}

### Lessons Learned
${formData.lessonsLearned}

### What I Wish I Knew Earlier
${formData.wishKnew}

### Advice for Others
${formData.advice}

${formData.tags ? `**Tags:** ${formData.tags.split(',').map(t => `#${t.trim()}`).join(' ')}` : ''}
`.trim();

      const payload = {
        title: formData.title,
        content: assembledContent,
        category: formData.category,
        image: formData.image || '',
        isAnonymous: formData.postAnonymously
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
      console.error('Error submitting story:', error);
      alert('Failed to submit story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto py-10" onClick={onClose}>
      <div className="bg-[#0B0D14] w-full max-w-2xl p-7 md:p-9 rounded-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 my-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full cursor-pointer">
          <X size={20} />
        </button>
        
        {submitted ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Failure Story Shared!</h2>
            <p className="text-gray-400">Thank you for helping others learn from your journey.</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Share Your Failure Story
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Story Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-colors placeholder-gray-600 text-sm font-medium shadow-sm" placeholder="e.g., Rejected by 15 Companies before landing Google" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-colors cursor-pointer text-sm font-medium shadow-sm"
                  >
                    <option value="Placement">Placement</option>
                    <option value="Technology">Technology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Career">Career</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cover Image (Optional)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      name="image"
                      value={formData.image?.startsWith('data:') ? 'Local file selected' : formData.image}
                      onChange={handleChange}
                      placeholder="Image URL or upload ->"
                      className="flex-1 min-w-0 bg-[#0E1019] border border-white/10 text-white rounded-xl px-3 py-3 text-xs focus:border-brand-purple focus:outline-none placeholder-gray-600 font-medium"
                    />
                    <label className="bg-brand-purple/10 hover:bg-brand-purple/20 border border-brand-purple/30 text-brand-purpleLight px-3.5 py-3 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center transition-colors flex-shrink-0 shadow-sm">
                      Upload
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={formData.image} alt="Preview" className="h-12 w-20 rounded-lg object-cover border border-white/20" />
                      <button type="button" onClick={() => setFormData(p => ({ ...p, image: '' }))} className="text-xs text-red-400 hover:text-red-300 font-bold">Remove</button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Original Failure Story</label>
                <textarea required name="originalFailure" value={formData.originalFailure} onChange={handleChange} className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-colors min-h-[100px] placeholder-gray-600 text-sm leading-relaxed shadow-sm"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Why Did You Fail?</label>
                <textarea required name="whyFailed" value={formData.whyFailed} onChange={handleChange} className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-colors min-h-[90px] placeholder-gray-600 text-sm leading-relaxed shadow-sm"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">How Did You Overcome It?</label>
                <textarea required name="howOvercame" value={formData.howOvercame} onChange={handleChange} className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-colors min-h-[90px] placeholder-gray-600 text-sm leading-relaxed shadow-sm"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Lessons Learned</label>
                <textarea required name="lessonsLearned" value={formData.lessonsLearned} onChange={handleChange} className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-colors min-h-[80px] placeholder-gray-600 text-sm leading-relaxed shadow-sm"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">What I Wish I Knew Earlier</label>
                <textarea required name="wishKnew" value={formData.wishKnew} onChange={handleChange} className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-colors min-h-[80px] placeholder-gray-600 text-sm leading-relaxed shadow-sm"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Advice for Others</label>
                <textarea required name="advice" value={formData.advice} onChange={handleChange} className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-colors min-h-[80px] placeholder-gray-600 text-sm leading-relaxed shadow-sm"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tags</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-[#0E1019] border border-white/10 text-white rounded-xl px-4 py-3 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-colors placeholder-gray-600 text-sm font-medium shadow-sm" placeholder="Java, DSA, Placement" />
              </div>

              <div className="pt-2 flex items-center">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    name="postAnonymously" 
                    checked={formData.postAnonymously} 
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-purple focus:ring-brand-purple cursor-pointer"
                  />
                  <span className="text-sm font-bold text-gray-300">Post Anonymously</span>
                </label>
              </div>

              <div className="pt-4 flex justify-center">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-12 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed bg-brand-purple text-white rounded-xl hover:bg-brand-purpleDark hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all font-bold shadow-lg cursor-pointer"
                >
                  {isSubmitting ? 'Sharing...' : 'Share My Story'}
                </button>
              </div>

            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareStoryModal;
