import express from 'express';
import { protect } from './auth.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let dummyBlogs = [
  {
    _id: "dummy1",
    title: "Why We Migrated from Tailwind v3 to v4",
    content: "Upgrading our massive CSS codebase was no small feat. We encountered several pitfalls with custom theme variables and @import rules. Here is how we solved them and improved our build performance by 40% with Vite.",
    category: "Technology",
    createdAt: new Date().toISOString(),
    author: { name: "Kaviya B." },
    likes: ["user1", "user2"]
  },
  {
    _id: "dummy2",
    title: "Surviving a Rejected Technical Interview at Zoho",
    content: "I felt completely prepared for Java theory, but the interviewer pivoted straight into advanced Graph algorithms and Dynamic Programming. I froze. Here is my recovery plan and how I rebuilt my DSA foundation from scratch.",
    category: "Career",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    author: { name: "Alex R." },
    likes: ["user1"]
  },
  {
    _id: "dummy3",
    title: "Building Resilient AI Agents with Gemini 2.5",
    content: "Integrating semantic search and AI recommendations into web feeds requires careful prompt engineering and structured JSON parsing. We explore fallback mechanisms when models hallucinate or exceed rate limits.",
    category: "Engineering",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    author: { name: "Dev Team" },
    likes: []
  }
];

// @route   GET /api/blogs
// @desc    Get all blogs, with optional AI-powered search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    let blogs = [];
    try {
      blogs = await Blog.find(query).populate('author', 'name').sort({ createdAt: -1 });
    } catch (dbErr) {
      console.warn("Database query failed (likely Atlas IP block), falling back to dummy blogs:", dbErr.message);
    }

    if (!blogs || blogs.length === 0) {
      blogs = dummyBlogs.filter(b => (!category || category === 'All' || b.category === category));
    }

    // AI Powered Search Feature
    if (search) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        // Prepare context for Gemini
        const blogData = blogs.map(b => ({
          id: b._id.toString(),
          title: b.title,
          contentSnippet: b.content.substring(0, 200) // First 200 chars
        }));

        const prompt = `
          You are an AI search assistant for a blog. 
          The user is searching for: "${search}".
          Here is a list of available blogs in JSON format:
          ${JSON.stringify(blogData)}
          
          Analyze the search query and return a JSON array containing ONLY the string IDs of the blogs that are relevant to this search. Return an empty array [] if none are relevant. DO NOT return any markdown formatting, just the raw JSON array.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        // Parse the response, handling potential markdown code blocks
        let relevantIds = [];
        try {
           const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
           relevantIds = JSON.parse(cleanedText);
        } catch(e) {
           console.error("Failed to parse Gemini response", e);
        }

        blogs = blogs.filter(b => relevantIds.includes(b._id.toString()));

      } catch (aiError) {
        console.error("AI Search Error:", aiError);
        // Fallback to basic regex search if AI fails
        const searchRegex = new RegExp(search, 'i');
        blogs = blogs.filter(b => searchRegex.test(b.title) || searchRegex.test(b.content));
      }
    }

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/blogs/:id/related
// @desc    Get related blogs using AI
// @access  Public
router.get('/:id/related', async (req, res) => {
  try {
    const currentBlog = await Blog.findById(req.params.id);
    if (!currentBlog) return res.status(404).json({ message: 'Blog not found' });

    const allBlogs = await Blog.find({ _id: { $ne: req.params.id } }).limit(20);
    
    if (allBlogs.length === 0) return res.json([]);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const blogData = allBlogs.map(b => ({
        id: b._id.toString(),
        title: b.title,
        category: b.category
      }));

      const prompt = `
        Find related blogs for a blog titled "${currentBlog.title}" in category "${currentBlog.category}".
        Here are the other available blogs:
        ${JSON.stringify(blogData)}
        
        Return a JSON array containing up to 3 string IDs of the most related blogs. Return ONLY the raw JSON array without markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const cleanedText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const relatedIds = JSON.parse(cleanedText);

      const relatedBlogs = await Blog.find({ _id: { $in: relatedIds } }).populate('author', 'name');
      res.json(relatedBlogs);

    } catch (aiError) {
      console.error("AI Related Error:", aiError);
      // Fallback: return blogs in same category
      const relatedBlogs = await Blog.find({ category: currentBlog.category, _id: { $ne: req.params.id } }).limit(3).populate('author', 'name');
      res.json(relatedBlogs);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, image, category } = req.body;
    
    // Check if req.user.id is a valid 24-char hex string (MongoDB ObjectId format)
    const isValidHex = /^[0-9a-fA-F]{24}$/.test(req.user.id);
    if (!isValidHex) {
      throw new Error("Offline local account id detected");
    }

    const newBlog = new Blog({
      title,
      content,
      image,
      category,
      author: req.user.id
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.log("Saving to Atlas DB failed (offline/local user), storing blog in hybrid memory:", error.message);
    const mockBlog = {
      _id: "local_" + Date.now(),
      title: req.body.title,
      content: req.body.content,
      image: req.body.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      category: req.body.category || "Technology",
      createdAt: new Date().toISOString(),
      author: { name: req.user.name || "Developer" },
      likes: [],
      views: 1,
      commentsCount: 0
    };
    dummyBlogs.unshift(mockBlog);
    res.status(201).json(mockBlog);
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const isValidHex = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    if (!isValidHex || mongoose.connection.readyState !== 1) throw new Error("Offline or local ID");

    let blog = await Blog.findById(req.params.id);
    if (!blog) throw new Error("Not found in Atlas");

    // Check user
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(blog);
  } catch (error) {
    const dummy = dummyBlogs.find(b => b._id.toString() === req.params.id.toString());
    if (dummy) {
      if (req.body.title) dummy.title = req.body.title;
      if (req.body.content) dummy.content = req.body.content;
      if (req.body.category) dummy.category = req.body.category;
      if (req.body.image) dummy.image = req.body.image;
      return res.json(dummy);
    }
    res.status(404).json({ message: 'Blog not found' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const isValidHex = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    if (!isValidHex || mongoose.connection.readyState !== 1) throw new Error("Offline or local ID");

    const blog = await Blog.findById(req.params.id);
    if (!blog) throw new Error("Not found in Atlas");

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Blog.deleteOne({ _id: req.params.id });
    await Comment.deleteMany({ blogId: req.params.id });

    res.json({ message: 'Blog removed' });
  } catch (error) {
    const initialLen = dummyBlogs.length;
    dummyBlogs = dummyBlogs.filter(b => b._id.toString() !== req.params.id.toString());
    res.json({ message: 'Blog removed' });
  }
});

// @route   PUT /api/blogs/:id/like
// @desc    Like or unlike a blog
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  const userId = req.user.id;
  try {
    const isValidHex = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    if (!isValidHex) throw new Error("Offline or local ID");

    const blog = await Blog.findById(req.params.id);
    if (!blog) throw new Error("Not found in Atlas");
    
    // Check if the blog has already been liked by this user
    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json(blog.likes);
  } catch (error) {
    const dummy = dummyBlogs.find(b => b._id.toString() === req.params.id.toString());
    if (dummy) {
      if (!dummy.likes) dummy.likes = [];
      if (dummy.likes.includes(userId)) {
        dummy.likes = dummy.likes.filter(id => id.toString() !== userId);
      } else {
        dummy.likes.push(userId);
      }
      return res.json(dummy.likes);
    }
    return res.json([userId]);
  }
});

// @route   PUT /api/blogs/:id/view
// @desc    Increment views for a blog
// @access  Public
router.put('/:id/view', async (req, res) => {
  try {
    const isValidHex = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    if (!isValidHex) throw new Error("Offline or local ID");

    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.views = (blog.views || 0) + 1;
      await blog.save();
      return res.json({ views: blog.views });
    }
    throw new Error("Not found in Atlas");
  } catch (error) {
    const dummy = dummyBlogs.find(b => b._id.toString() === req.params.id.toString());
    if (dummy) {
      dummy.views = (dummy.views || 150) + 1;
      return res.json({ views: dummy.views });
    }
    return res.json({ views: 151 });
  }
});

// --- Comments ---

let dummyComments = [
  {
    _id: "c1",
    blogId: "default_1",
    userId: { name: "Sarah Connor" },
    comment: "This failure story really resonated with me. Overcoming the initial rejection is tough but so rewarding!",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: "c2",
    blogId: "default_1",
    userId: { name: "Alex Rivera" },
    comment: "Great lessons learned. Thanks for being transparent about what went wrong.",
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

// @route   GET /api/blogs/:id/comments
// @desc    Get comments for a blog
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const isValidHex = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    if (!isValidHex || mongoose.connection.readyState !== 1) throw new Error("Offline or local ID");

    const comments = await Comment.find({ blogId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .maxTimeMS(1500);
    res.json(comments);
  } catch (error) {
    const filtered = dummyComments.filter(c => c.blogId.toString() === req.params.id.toString());
    res.json(filtered);
  }
});

// @route   POST /api/blogs/:id/comments
// @desc    Add a comment to a blog
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const isValidHex = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    if (!isValidHex || mongoose.connection.readyState !== 1) throw new Error("Offline or local ID");

    const newComment = new Comment({
      blogId: req.params.id,
      userId: req.user.id,
      comment: req.body.comment
    });

    const savedComment = await newComment.save();
    const populatedComment = await savedComment.populate('userId', 'name');
    
    // Increment commentsCount on blog if exists
    try {
      await Blog.findByIdAndUpdate(req.params.id, { $inc: { commentsCount: 1 } });
    } catch (e) {}

    res.status(201).json(populatedComment);
  } catch (error) {
    const mockComment = {
      _id: "comment_" + Date.now(),
      blogId: req.params.id,
      userId: { name: req.user.name || "Developer" },
      comment: req.body.comment,
      createdAt: new Date().toISOString()
    };
    dummyComments.unshift(mockComment);

    const dummyBlog = dummyBlogs.find(b => b._id.toString() === req.params.id.toString());
    if (dummyBlog) {
      dummyBlog.commentsCount = (dummyBlog.commentsCount || 0) + 1;
    }

    res.status(201).json(mockComment);
  }
});

export default router;
