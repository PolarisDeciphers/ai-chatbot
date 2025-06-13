// Required for Next.js to use edge runtime (optional)
export const runtime = 'edge';

import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing OpenAI API Key' }), {
      status: 500,
    });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to connect to OpenAI' }), {
      status: 500,
    });
  }
}
