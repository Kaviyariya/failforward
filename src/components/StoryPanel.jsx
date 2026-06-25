import { ArrowLeft, Moon, Bookmark, Heart, Eye, MessageSquare, Share2, X, TerminalSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const StoryPanel = ({ story, onClose }) => {
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (story && story._id) {
        try {
          const res = await axios.get(`http://localhost:5000/api/blogs/${story._id}/related`);
          setRelatedBlogs(res.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchRelated();
  }, [story]);

  if (!story) return null;

  return (
    <div className="w-full md:w-[600px] bg-[#0F131D] h-screen overflow-y-auto border-l border-brand-border flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.5)] relative">
      
      {/* Header */}
      <div className="p-6 pb-2 border-b border-brand-border sticky top-0 bg-[#0F131D]/90 backdrop-blur-md z-[50]">
        
        <div className="flex items-center justify-between mb-8 mt-2 text-brand-textMuted">
          <div></div>
          <div className="flex items-center gap-4">
            <button className="hover:text-white transition-colors"><Moon size={18} /></button>
            <button className="hover:text-white transition-colors"><Bookmark size={18} /></button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="flex items-center gap-2 text-brand-textMuted hover:text-white transition-colors bg-[#131821] hover:bg-[#1F2937] border border-brand-border px-3 py-1.5 rounded-lg">
            <X size={18} /> Close
          </button>
          <span className="text-brand-textMuted text-sm">{new Date(story.createdAt).toLocaleDateString()}</span>
        </div>
        
        <span className="inline-block mb-3 px-3 py-1 rounded bg-brand-purple/10 text-brand-purpleLight border border-brand-purple/20 text-xs font-bold uppercase">
          {story.category}
        </span>
        <h2 className="text-3xl font-bold text-white mb-4 leading-snug">{story.title}</h2>
        
        <div className="flex items-center gap-6 text-brand-textMuted text-sm font-medium pb-6 border-b border-dashed border-[#333]">
          <span className="flex items-center gap-1.5"><Heart size={16} className="text-red-400"/> {story.likes?.length || 0}</span>
          <span className="flex items-center gap-1.5"><User size={16}/> {story.author?.name || 'Developer'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-8 flex-1">
        
        {story.image && (
          <img src={story.image} alt={story.title} className="w-full h-48 object-cover rounded-xl border border-brand-border" />
        )}

        <div>
          <h3 className="text-white font-bold text-lg mb-4">Content</h3>
          <div className="bg-[#131821] border border-brand-border rounded-xl p-6 relative">
             <div 
               className="prose prose-invert prose-brand-purple max-w-none text-brand-text"
               dangerouslySetInnerHTML={{ __html: story.content }}
             ></div>
          </div>
        </div>

        {/* AI Related */}
        {relatedBlogs.length > 0 && (
          <div className="mt-8 pt-8 border-t border-brand-border border-dashed">
            <div className="flex items-center gap-2 mb-4 text-brand-purpleLight font-bold">
              <TerminalSquare size={20} />
              <h3>AI Suggested Reads</h3>
            </div>
            <div className="space-y-4">
              {relatedBlogs.map(rb => (
                <div key={rb._id} className="bg-[#131821] border border-brand-border p-4 rounded-xl">
                  <h4 className="text-white font-bold mb-1">{rb.title}</h4>
                  <p className="text-xs text-brand-textMuted uppercase">{rb.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 border-t border-brand-border bg-[#0F131D] flex gap-3 sticky bottom-0">
        <button className="flex-1 bg-transparent border border-brand-purple text-brand-purpleLight hover:bg-brand-purple/10 transition-colors font-medium rounded-lg py-2.5 flex items-center justify-center gap-2">
          <Heart size={18} /> Like
        </button>
        <button className="bg-transparent border border-[#333] text-brand-textMuted hover:border-gray-500 hover:text-white transition-colors font-medium rounded-lg px-6 py-2.5 flex items-center justify-center gap-2">
          <Share2 size={18} /> Share
        </button>
      </div>

    </div>
  );
};

// Quick shim for User icon since I forgot to import it
import { User } from 'lucide-react';

export default StoryPanel;
