const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateInterviewQuestions(targetRole, difficulty, count = 5) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Generate exactly ${count} mock interview questions for a ${targetRole} role.
      Difficulty level: ${difficulty}.
      
      Mix of question types:
      - 2 DSA/coding questions
      - 1 system design question
      - 1 CS fundamentals question (OS, DBMS, Networks, or OOP)
      - 1 behavioral question
      
      Return ONLY a valid JSON array in this exact format, no explanation, no markdown:
      [
        {
          "question": "question text here",
          "topic": "DSA/System Design/CS Fundamentals/Behavioral",
          "hint": "brief hint for the interviewer"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean response — remove markdown fences if present
    const cleaned = text.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleaned);

    return questions;

  } catch (error) {
    console.error('Gemini error:', error);
    // Fallback questions if API fails
    return [
      {
        question: `Explain the time and space complexity of common sorting algorithms.`,
        topic: 'DSA',
        hint: 'Look for mention of merge sort O(n log n), quicksort average case'
      },
      {
        question: `Design a URL shortener like bit.ly.`,
        topic: 'System Design',
        hint: 'Look for: hash function, database choice, scaling, caching'
      },
      {
        question: `What is the difference between a process and a thread?`,
        topic: 'CS Fundamentals',
        hint: 'Memory space, context switching, communication'
      },
      {
        question: `Tell me about a challenging problem you solved and how you approached it.`,
        topic: 'Behavioral',
        hint: 'Look for STAR format: Situation, Task, Action, Result'
      },
      {
        question: `Given an array of integers, find two numbers that add up to a target sum.`,
        topic: 'DSA',
        hint: 'Optimal solution uses HashMap for O(n) time complexity'
      },
    ];
  }
}

module.exports = { generateInterviewQuestions };
