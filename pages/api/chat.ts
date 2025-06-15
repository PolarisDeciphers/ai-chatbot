import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query } = req.body;
console.log("Query received:", query);


  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: query }],
    });

    const reply = completion.choices?.[0]?.message?.content || "No reply generated.";
    return res.status(200).json({ response: reply });

  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
