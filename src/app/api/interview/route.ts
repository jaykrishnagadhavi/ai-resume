import { NextResponse } from 'next/server';
import getGemini from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { messages, context, jobDescription, resumeText } = await req.json();

    if (!messages || !context) {
      return NextResponse.json({ error: 'Missing messages or context' }, { status: 400 });
    }

    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    // Build the system prompt using the context
    const systemInstruction = `
      You are an expert technical interviewer conducting a mock interview for the following position:
      
      Job Description:
      ${jobDescription}

      The candidate's resume summary/key points:
      ${resumeText}

      Instructions for you (the interviewer):
      - If this is the start of the conversation, ask the first technical or behavioral question based on the context.
      - If the user has responded, briefly evaluate their response (in 1-2 sentences), then ask a follow-up question or move to a new topic.
      - Keep your responses concise, conversational, and constructive.
      - Do not break character. 
      - End the response with your next question or an invitation to continue.
    `;

    // Convert the messages to Gemini's format
    // messages format: [{ role: 'user' | 'model', parts: [{ text: string }] }]
    // we need to inject the system instruction. Gemini 1.5 allows system instructions in the model initialization, 
    // but for simplicity we can just prepend it to the first user message or use the systemInstruction property.

    const chatModel = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemInstruction 
    });

    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Gemini API strictly requires that the first message in history comes from the 'user'
    if (history.length > 0 && history[0].role === 'model') {
      history.unshift({
        role: 'user',
        parts: [{ text: 'Hello, I am ready to begin the interview.' }]
      });
    }

    const chat = chatModel.startChat({
      history: history
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Error during interview chat:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
