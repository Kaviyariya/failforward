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
    type: String, // Store cover image URL
  },
  images: {
    type: [String], // Array of image URLs/data for multiple photos
    default: [],
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
