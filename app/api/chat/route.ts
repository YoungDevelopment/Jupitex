import { NextRequest, NextResponse } from "next/server";

const MODEL = "openai/gpt-oss-20b";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are the Jupitex AI assistant embedded on the Jupitex website.
Use ONLY the following facts to answer questions. Be concise, friendly, and professional.
If the answer is not covered by these facts, suggest the user reach out via the website contact form.

Product: Jupitex — AI-powered technology solutions that help businesses innovate and scale.
Services:
  - AI Transformation: Strategic AI integration, LLM implementation, prompt engineering, and data analysis.
  - Automation: Workflow design, process mining, RPA solutions, and API integration.
  - Custom Development: Full-stack development, cloud architecture, UI/UX design, and mobile optimization.
Why Jupitex: Industry-leading expertise, cutting-edge innovation, and dedicated support from onboarding to scaling.
Support: Available via the website contact form or by emailing hello@jupitex.com.
Getting Started: Reach out through the contact form to schedule a free consultation.
do not give tables as answers always give answers in a number list format.
`;

interface IncomingMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function toOpenAIMessages(incoming: IncomingMessage[]): ChatMessage[] {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  for (const msg of incoming) {
    messages.push({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.parts[0]?.text ?? "",
    });
  }

  return messages;
}

async function callGroqWithRetry(messages: ChatMessage[]) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const payload = { model: MODEL, messages };
  const backoffMs = [1000, 2000, 4000, 8000, 16000];

  for (let attempt = 0; attempt < backoffMs.length; attempt++) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return res.json();
    }

    if (res.status === 429 && attempt < backoffMs.length - 1) {
      await new Promise((r) => setTimeout(r, backoffMs[attempt]));
      continue;
    }

    const body = await res.text();
    throw new Error(`Groq API error ${res.status}: ${body}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: IncomingMessage[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 },
      );
    }

    const openAIMessages = toOpenAIMessages(messages);
    const data = await callGroqWithRetry(openAIMessages);
    const reply =
      data?.choices?.[0]?.message?.content ??
      "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("Chat API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
