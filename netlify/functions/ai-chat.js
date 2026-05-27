exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'AI service not configured' }) };
  }

  try {
    const { messages, planProfile, weekData } = JSON.parse(event.body);

    const goalsMap = {
      fitness:'Build Muscle', weight:'Lose Weight', discipline:'Discipline',
      mindset:'Mindset', finance:'Finance', confidence:'Confidence',
      glowup:'Glow Up', career:'Career Growth'
    };
    const goals = (planProfile.goals || []).map(g => goalsMap[g] || g).join(', ') || 'Not set';
    const ws = planProfile.workSchedule;
    const schedSummary = ws
      ? `Works ${ws.type}, schedule: ${ws.start}–${ws.end}, wake: ${ws.wake}, sleep: ${ws.sleep}`
      : 'No schedule set';
    const weekSummary = weekData?.map(d => `${d.day}: ${d.pct}%`).join(', ') || 'No data';

    const systemPrompt = `You are Empire AI Coach — a direct, no-excuses life optimization coach for the Ethos Empire platform.
User Profile:
- Name: ${planProfile.name || 'Empire Builder'}
- Goals: ${goals}
- Schedule: ${schedSummary}
- Stats: ${planProfile.age ? `Age ${planProfile.age}` : ''}${planProfile.weightKg ? `, ${planProfile.weightKg}kg` : ''}${planProfile.heightCm ? `, ${planProfile.heightCm}cm` : ''}
This week's completion: ${weekSummary}
Guidelines:
- Be direct, concise, and motivational. No fluff.
- Give specific, actionable advice. Never vague.
- Keep replies under 100 words unless the user asks for detail.
- If asked about scheduling, suggest specific times based on their profile.`;

    const recentMessages = (messages || []).slice(-10);

    const geminiContents = recentMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Try again in a moment.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error('ai-chat error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
