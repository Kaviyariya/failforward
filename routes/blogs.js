import express from 'express';
import { protect } from './auth.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const dummyBlogs = [
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
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

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
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Blog.deleteOne({ _id: req.params.id });
    
    // Also delete associated comments
    await Comment.deleteMany({ blogId: req.params.id });

    res.json({ message: 'Blog removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/blogs/:id/like
// @desc    Like or unlike a blog
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user.id;
    
    // Check if the blog has already been liked by this user
    if (blog.likes.includes(userId)) {
      // Unlike
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      blog.likes.push(userId);
    }

    await blog.save();
    res.json(blog.likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- Comments ---

// @route   GET /api/blogs/:id/comments
// @desc    Get comments for a blog
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/blogs/:id/comments
// @desc    Add a comment to a blog
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const newComment = new Comment({
      blogId: req.params.id,
      userId: req.user.id,
      comment: req.body.comment
    });

    const savedComment = await newComment.save();
    const populatedComment = await savedComment.populate('userId', 'name');
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
