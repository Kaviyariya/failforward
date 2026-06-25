import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Story from './models/Story.js';
import connectDB from './config/db.js';

dotenv.config();

const mockStories = [
  {
    title: "Rejected in Zoho Technical Round",
    summary: "I focused only on Java theory and ignored DSA. During the interview I couldn't solve HashMap questions and got rejected.",
    failureReason: "I was very confident about my Java knowledge and thought it would be enough. But the technical round was completely DSA based. I panicked and couldn't solve even easy questions.",
    lessonLearned: "✓ Never ignore the basics (DSA is important)\n✓ Consistent practice is the key\n✓ Mock tests build confidence",
    actionsTaken: [
      "Started solving 2 problems daily on LeetCode",
      "Watched DSA tutorials and made my own notes",
      "Gave mock interviews and solved previous year questions",
      "Focused on concepts + patterns"
    ],
    outcome: "Landed a job at a different product-based company 6 months later.",
    advice: "Don't make the same mistake I did. Start early, stay consistent, and practice smart. It's not about how much you study, it's about how well you practice.",
    tags: ["Java", "DSA", "Placement"],
    likes: 124,
    views: 1200,
    category: "Placement"
  },
  {
    title: "Lost Hackathon Finals",
    summary: "Our team spent too much time adding features instead of building an MVP. The core feature didn't even work during the demo.",
    failureReason: "We had a great idea and wanted to make it perfect. We added 10 different features but didn't test the main integration. During the live demo, the primary API failed to connect.",
    lessonLearned: "An ugly working project wins over a beautiful broken one. Time management is the most important skill in a hackathon.",
    actionsTaken: [
      "Started scoping projects strictly to MVP first",
      "Always ensured the core loop works before adding UI polish",
      "Practiced quick deployments during the first 12 hours"
    ],
    outcome: "Won 1st place in the very next hackathon by submitting a working MVP.",
    advice: "Scope your project down. Build the core loop first. Once that works, then you can add the fancy features.",
    tags: ["Hackathon", "Project Management"],
    likes: 89,
    views: 856,
    category: "Hackathon"
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await Story.deleteMany(); // Clear existing stories
    await Story.insertMany(mockStories);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedData();
