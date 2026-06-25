// Replace this empty string with your actual Gemini API Key when ready
export const GEMINI_API_KEY = "";

/**
 * Placeholder function for AI Lesson Extraction
 * In the future, this will call the Gemini API to analyze the failure story.
 */
export const extractLessons = async (storyText) => {
  if (!GEMINI_API_KEY) {
    console.warn("Gemini API Key is missing. Using mock data.");
    return {
      summary: "Mock AI Summary: A challenging experience that highlighted the need for better preparation.",
      categoryPrediction: "Placement",
      confidenceScore: "89%"
    };
  }

  // Implementation for actual Gemini API call will go here
  // ...
};

/**
 * Placeholder function for fetching related blogs
 * In the future, this will use Gemini embeddings or text matching.
 */
export const getRelatedBlogs = async (storyTitle) => {
  if (!GEMINI_API_KEY) {
    return [
      { id: 4, title: "Failed TCS Coding Round", match: "98%" },
      { id: 5, title: "DSA Preparation Mistakes", match: "85%" },
      { id: 6, title: "Coding Interview Failure", match: "82%" },
    ];
  }
  // Implementation
};
