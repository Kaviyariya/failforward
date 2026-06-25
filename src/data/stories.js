export const trendingStories = [
  {
    id: 1,
    title: "Rejected in Zoho Technical Round",
    category: "Placement",
    date: "May 12, 2024",
    excerpt: "I focused only on Java theory and ignored DSA. During the interview I couldn't solve HashMap questions...",
    originalStatement: "I focused only on Java theory and ignored DSA. During the interview I couldn't solve HashMap questions and got rejected.",
    whatHappened: "I was very confident about my Java knowledge and thought it would be enough. But the technical round was completely DSA based. I panicked and couldn't solve even easy questions.",
    howIOvercame: [
      "Started solving 2 problems daily on LeetCode",
      "Watched DSA tutorials and made my own notes",
      "Gave mock interviews and solved previous year questions",
      "Focused on concepts + patterns"
    ],
    lessons: [
      "Never ignore the basics (DSA is important)",
      "Consistent practice is the key",
      "Mock tests build confidence"
    ],
    advice: "Don't make the same mistake I did. Start early, stay consistent, and practice smart. It's not about how much you study, it's about how well you practice.",
    likes: 124,
    comments: 18,
    views: "1.2k"
  },
  {
    id: 2,
    title: "Lost Hackathon Finals",
    category: "Hackathon",
    date: "May 10, 2024",
    excerpt: "Our team spent too much time adding features instead of building an MVP...",
    originalStatement: "Our team spent too much time adding features instead of building an MVP. The core feature didn't even work during the demo.",
    whatHappened: "We had a great idea and wanted to make it perfect. We added 10 different features but didn't test the main integration. During the live demo, the primary API failed to connect.",
    howIOvercame: [
      "Started scoping projects strictly to MVP first",
      "Always ensured the core loop works before adding UI polish",
      "Practiced quick deployments during the first 12 hours"
    ],
    lessons: [
      "An ugly working project wins over a beautiful broken one",
      "Time management is the most important skill in a hackathon"
    ],
    advice: "Scope your project down. Build the core loop first. Once that works, then you can add the fancy features.",
    likes: 89,
    comments: 11,
    views: "856"
  },
  {
    id: 3,
    title: "Failed First Internship Interview",
    category: "Interview",
    date: "May 8, 2024",
    excerpt: "I knew the answers but couldn't explain my project confidently...",
    originalStatement: "I knew the answers but couldn't explain my project confidently to the interviewers.",
    whatHappened: "When asked to explain my final year project architecture, I fumbled. I knew the code inside out because I wrote it, but I had never practiced explaining it verbally to another person.",
    howIOvercame: [
      "Started doing peer-to-peer mock interviews",
      "Wrote down a structured summary of my projects (STAR method)",
      "Practiced explaining technical concepts to non-technical friends"
    ],
    lessons: [
      "Communication is just as important as technical skills",
      "The STAR method (Situation, Task, Action, Result) works"
    ],
    advice: "Don't just write code. Practice talking about your code. If you can't explain why you made a technical decision, it looks like you copied it.",
    likes: 67,
    comments: 9,
    views: "723"
  },
  {
    id: 4,
    title: "Burnt Out Before Finals",
    category: "Career",
    date: "April 20, 2024",
    excerpt: "I tried to juggle a full-time internship, 5 courses, and a club leadership role...",
    originalStatement: "I tried to do everything at once and ended up crashing right before my final exams.",
    whatHappened: "I said 'yes' to every opportunity that came my way. By week 10, I was sleeping 4 hours a night. I ended up getting sick and missing a crucial final exam, dropping my GPA significantly.",
    howIOvercame: [
      "Learned to say 'no' to non-essential commitments",
      "Started using a strict calendar block for rest",
      "Communicated honestly with my professors about my health"
    ],
    lessons: [
      "Rest is a requirement, not a reward",
      "Quality of work > Quantity of commitments"
    ],
    advice: "Don't sacrifice your health for your resume. A gap in your resume is easier to explain than a breakdown in your health.",
    likes: 210,
    comments: 34,
    views: "2.5k"
  },
  {
    id: 5,
    title: "Dropped Production Database",
    category: "Project",
    date: "March 15, 2024",
    excerpt: "I ran a migration script on the production server instead of staging...",
    originalStatement: "I accidentally ran a destructive migration script on the live production database instead of my local staging environment.",
    whatHappened: "I had two terminal windows open that looked exactly identical. One was connected to staging, one to prod. I pasted the DROP TABLE command into the wrong one. We lost 4 hours of user data before the backup was restored.",
    howIOvercame: [
      "Immediately escalated the issue to the senior dev",
      "Helped write the incident post-mortem",
      "Changed my terminal profiles to have bright red backgrounds for production servers"
    ],
    lessons: [
      "Always verify your environment before destructive actions",
      "Mistakes happen, owning up to them immediately saves time"
    ],
    advice: "Configure your terminal colors differently for production! And never try to hide a massive mistake—your seniors will find out anyway.",
    likes: 450,
    comments: 89,
    views: "5.1k"
  },
  {
    id: 6,
    title: "Over-engineered My Portfolio",
    category: "Project",
    date: "February 10, 2024",
    excerpt: "I decided to use microservices and Kubernetes for a simple static portfolio...",
    originalStatement: "I spent 3 months building a personal portfolio site using microservices, Docker, and Kubernetes, and it still doesn't have my actual resume on it.",
    whatHappened: "I wanted to impress recruiters with my tech stack. I built a microservice for contact forms, another for serving images, and deployed it on a complex K8s cluster. It cost me $40/month to host and was constantly breaking. Recruiters just wanted to see a simple PDF resume and clear project links.",
    howIOvercame: [
      "Scrapped the entire microservices architecture",
      "Rebuilt the site in a single weekend using Next.js and Vercel",
      "Added a direct download link for a plain PDF resume"
    ],
    lessons: [
      "Use the right tool for the job, not the trendiest one",
      "Recruiters care about content and clarity, not how your CSS is hosted"
    ],
    advice: "Keep personal portfolios simple. Spend that extra time building actual projects instead of over-engineering your personal website.",
    likes: 340,
    comments: 56,
    views: "4.2k"
  },
  {
    id: 7,
    title: "Missed Google OA Deadline",
    category: "Placement",
    date: "January 25, 2024",
    excerpt: "I waited until the last possible hour to take the Online Assessment...",
    originalStatement: "I missed the submission deadline for the Google Online Assessment because my internet went down in the last 30 minutes.",
    whatHappened: "I was given a 7-day window to complete the OA. I wanted to be perfectly prepared, so I studied for 6 days and 20 hours. When I finally sat down to take it with 4 hours left, a massive storm knocked out my neighborhood's power and internet.",
    howIOvercame: [
      "Accepted that the opportunity was gone",
      "Started taking OAs within the first 48 hours of receiving them",
      "Bought a UPS for my router to prevent local power-cuts from killing my WiFi"
    ],
    lessons: [
      "Procrastination disguised as 'preparation' is still procrastination",
      "You cannot control technical difficulties, so give yourself a buffer"
    ],
    advice: "Never leave important assessments until the last day. Take them when you are 80% ready, because waiting for 100% readiness often leads to missing the boat completely.",
    likes: 512,
    comments: 73,
    views: "6.8k"
  },
  {
    id: 8,
    title: "Fired from Startup After 1 Month",
    category: "Career",
    date: "December 5, 2023",
    excerpt: "I was too afraid to ask questions and ended up blocking the entire team...",
    originalStatement: "I was let go from my first startup job because I spent three weeks stuck on a task without asking for help.",
    whatHappened: "I suffered from severe imposter syndrome. Whenever I got stuck, I was afraid that asking for help would make me look incompetent. I spent weeks staring at legacy code I didn't understand. By the time the sprint review happened, I had zero deliverables.",
    howIOvercame: [
      "Read 'The Pragmatic Programmer' which normalized asking questions",
      "Started using the '15-minute rule' (try for 15 mins, then ask)",
      "Found a new role and communicated openly about my blockers daily"
    ],
    lessons: [
      "Asking questions shows you are engaged, not stupid",
      "Silent failure is much worse than noisy learning"
    ],
    advice: "If you're stuck for more than an hour on something purely contextual (like internal company tools or legacy code), ask a senior. They would rather spend 5 minutes unblocking you than have you waste 5 days.",
    likes: 890,
    comments: 145,
    views: "12k"
  },
  {
    id: 9,
    title: "Ignored System Design",
    category: "Interview",
    date: "November 18, 2023",
    excerpt: "I aced the LeetCode Hard but failed miserably at designing a URL shortener...",
    originalStatement: "I failed the final round at a major tech company because I hadn't studied any System Design concepts.",
    whatHappened: "I spent 100% of my prep time grinding LeetCode algorithms. During the final round, they asked me to design a URL shortener. I didn't know what a load balancer was, had no idea how to scale a database, and completely froze.",
    howIOvercame: [
      "Read 'Designing Data-Intensive Applications'",
      "Watched the 'Grokking the System Design Interview' series",
      "Started looking at the architecture of the apps I use daily"
    ],
    lessons: [
      "Algorithms get you the interview, System Design gets you the job",
      "You need to understand how computers actually talk to each other at scale"
    ],
    advice: "Don't just code in a vacuum. Learn how web applications actually work. Understand caching, databases, and network protocols.",
    likes: 275,
    comments: 42,
    views: "3.1k"
  },
  {
    id: 10,
    title: "Chose the Wrong Co-founder",
    category: "Career",
    date: "October 30, 2023",
    excerpt: "I started a company with my best friend without setting clear expectations...",
    originalStatement: "My startup died not because the product was bad, but because my co-founder and I had completely different work ethics and no legal agreement.",
    whatHappened: "We were best friends, so we thought we'd make a great team. But I was working 60 hours a week while he treated it like a side hobby. Because we never signed a vesting agreement, he owned 50% of the company despite doing 10% of the work. The resentment killed the business and the friendship.",
    howIOvercame: [
      "Walked away from the project completely to save my sanity",
      "Took a course on startup law and equity vesting",
      "Learned to separate personal relationships from business relationships"
    ],
    lessons: [
      "Always use a vesting schedule with a 1-year cliff, even with friends",
      "Have the difficult conversations about expectations on Day 1"
    ],
    advice: "Friendship does not equal business compatibility. Treat your co-founder relationship like a professional marriage: get everything in writing before you start building.",
    likes: 640,
    comments: 112,
    views: "8.5k"
  }
];

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'placement', name: 'Placement' },
  { id: 'interview', name: 'Interview' },
  { id: 'project', name: 'Project' },
  { id: 'hackathon', name: 'Hackathon' },
  { id: 'career', name: 'Career' }
];