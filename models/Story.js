import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  failureReason: {
    type: String,
    required: true,
  },
  lessonLearned: {
    type: String,
    required: true,
  },
  actionsTaken: {
    type: [String],
    default: [],
  },
  outcome: {
    type: String,
  },
  advice: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: 'General',
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

const Story = mongoose.model('Story', storySchema);

export default Story;
