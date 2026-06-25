import express from 'express';
import Story from '../models/Story.js';

const router = express.Router();

// @route   GET /api/stories
// @desc    Get all stories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/stories
// @desc    Create a new story
// @access  Public (should be Private if using auth later)
router.post('/', async (req, res) => {
  try {
    const newStory = new Story(req.body);
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
