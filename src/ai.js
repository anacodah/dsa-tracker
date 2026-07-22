// src/ai.js
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getProgressAnalysis = async (problems) => {
  if (!API_KEY) {
    throw new Error('Missing VITE_GEMINI_API_KEY in environment variables.');
  }
  
  if (!problems || problems.length === 0) {
    return "You haven't logged any problems yet. Start solving and logging to get an AI analysis!";
  }

  // Aggregate stats
  const total = problems.length;
  const recent = problems.slice(0, 30); // focus on recent trends
  const topicCounts = {};
  const difficulties = { Easy: 0, Medium: 0, Hard: 0 };
  
  recent.forEach(p => {
    topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
    if (p.difficulty) difficulties[p.difficulty]++;
  });

  const prompt = `
You are an expert Data Structures and Algorithms (DSA) coach.
Analyze this student's recent performance based on their last 30 logged problems.

Total problems solved (all-time): ${total}
Recent topics tackled: ${JSON.stringify(topicCounts)}
Recent difficulties: ${JSON.stringify(difficulties)}

Provide a concise, motivating 3-paragraph summary:
1. Acknowledge their recent effort and strengths.
2. Point out any weaknesses or imbalances (e.g., avoiding hard problems, focusing too much on one topic).
3. Give 2-3 specific, actionable recommendations on what topics or difficulties to focus on next.

Keep the tone encouraging, professional, and directly address the student ("You...").
Format with simple markdown (bolding, bullet points).
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to fetch AI analysis');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};
