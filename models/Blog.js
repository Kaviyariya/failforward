import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store image URL
  },
  category: {
    type: String,
    default: 'General',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId], // Array of User IDs to prevent double liking
    ref: 'User',
    default: [],
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
