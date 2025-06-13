export const runtime = 'edge';

import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.messages) {
      return new Response(
        JSON.stringify({ error: 'Missing "messages" in request body' }),
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o';

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not set in env variables' }),
        { status: 500 }
      );
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: body.messages,
        temperature: 0.7,
      }),
    });

    const result = await openaiResponse.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
  const error = err as Error;
  return new Response(
    JSON.stringify({ error: 'Unexpected server error', details: error.message }),
    { status: 500 }
  );
}
