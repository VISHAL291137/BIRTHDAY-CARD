import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// AI Wish Generator Endpoint
app.post('/api/generate-wish', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in secrets.' });
    }

    const { recipientName, senderName, age, tone, interests, theme } = req.body;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are a legendary, creative birthday wish writer. Write a personalized, heartwarming, and engaging birthday card content for ${
      recipientName || 'a special person'
    }${age ? ` who is turning ${age}` : ''}.
From: ${senderName || 'Someone who loves you'}
Tone/Style requested: ${tone || 'sweet & warm'}
Card Theme context: ${theme || 'Arcade / Celebration'}
Recipient's interests/memories/inside jokes: ${interests || 'None provided'}

Guidelines:
- If tone is "Arcade / 8-Bit Gamer": Use gaming terms like "LEVEL UP!", "+1 Wisdom", "Boss Battle Cleared", "Quest Unlocked".
- If tone is "Funny / Roast": Mild friendly teasing about getting older, grey hair, staying up past 10 PM, but remaining super affectionate.
- If tone is "Romantic & Sweet": Deeply touching, romantic, glowing praise.
- If tone is "Poetic & Cinematic": Rich imagery, stars, memories, beautifully crafted verse.
- If tone is "Hype & Celebration": High energy, fireworks, legend status!

Output strictly JSON in this exact structure:
{
  "headline": "A short 3 to 6 word punchy celebratory title (e.g. Happy Level 25 Victory, Alex!)",
  "message": "A 3-5 sentence main birthday wish message that feels personal and memorable.",
  "questTitle": "A fun short quest title or sub-theme (e.g. Quest: Cake Annihilation)",
  "specialQuote": "A 1-sentence inspirational or funny birthday motto",
  "suggestedBalloonNotes": [
    "Short 3-5 word wish #1",
    "Short 3-5 word wish #2",
    "Short 3-5 word wish #3",
    "Short 3-5 word wish #4"
  ],
  "giftBoxNote": "A surprise message to put inside the unboxing present"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating AI wish:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate wish' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CelebrationCraft server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
