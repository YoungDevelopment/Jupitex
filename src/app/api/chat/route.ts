import { NextRequest, NextResponse } from "next/server";
import { CONTACT_EMAIL, FAQS, HERO, WORKFLOWS } from "@/lib/site";
import { CASE_STUDIES } from "@/lib/case-studies";

const MODEL = "openai/gpt-oss-20b";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Workflows and FAQ come from the same data the page renders, so JX never contradicts the site
// Kept short: the whole prompt is resent on every message, and the Groq free tier allows 8,000 tokens a minute
const workflowFacts = WORKFLOWS.map((w, i) => `${i + 1}. ${w.name}: ${w.blurb}`).join("\n");
const faqFacts = FAQS.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

// The case studies come straight from the pages' own data (== highlight marks stripped)
const plain = (s: string) => s.replace(/==(.+?)==/g, "$1");
const caseStudyFacts = CASE_STUDIES.filter((c) => !c.draft)
  .map((c) =>
    [
      `### ${c.card.name}: ${plain(c.title)} (page: /work/${c.slug})`,
      plain(c.summary),
      `Numbers: ${c.stats.map((s) => `${s.value} ${s.label}`).join("; ")}`,
      ...c.sections
        .filter((s) => /difference/i.test(s.heading))
        .map((s) => `Results: ${[...(s.body ?? []), ...(s.points ?? [])].map(plain).join(" ")}`),
    ].join("\n")
  )
  .join("\n\n");

const SYSTEM_PROMPT = `You are JX, the AI assistant on the Jupitex website. Be concise, friendly and plain-spoken: short paragraphs, bullet or numbered lists when listing things, never tables. Answer ONLY from the facts below. Never invent clients, numbers, prices, timelines, integrations or guarantees. If something is not covered, say you don't know and suggest booking the free 30-minute intro call or emailing ${CONTACT_EMAIL}.

== WHO JUPITEX IS ==
Headline on the site: "${HERO.titleMuted} ${HERO.titleStrong}". ${HERO.body}
Jupitex automates back-office work for debt collection agencies in the United States. We build inside the collection software an agency already uses, so there is no migration and no new system for the team to learn. We start with back-office work that never contacts consumers.
Who it is for: owners and operations, finance and compliance leads at third-party collection agencies, especially small and mid-size agencies whose staff spend hours each week on manual reports, payment posting and file loading.

== WHAT WE AUTOMATE ==
${workflowFacts}


== THE FREE 90-MINUTE AUDIT ==
A 30-minute intro call with the owner, then a 60-minute session where we work with the team to map out each process and find what to automate. Every task gets a fixed price, the hours it saves and the payback; the agency's finance and compliance leads review the plan before anything is built. The agency keeps the written roadmap either way. Never promise a delivery date; the timeline is agreed in the roadmap. Prices, guarantee and ownership are in the FAQ below.

== COMPLIANCE AND SOFTWARE ==
Jupitex gives no legal advice and does not guarantee compliance with the FDCPA, Regulation F or state rules; suggest the agency's own counsel for legal questions. Where a workflow touches consumer replies or disputes, sensitive items go to a person and nothing is sent to a consumer without a person approving it. Never claim official partnerships with any software vendor; fit is confirmed during the audit.

== SERVICES ==
1. Back-Office Automation: free audit, client reporting and remittance, payment posting and reconciliation, placement file intake.
2. Full-Stack Development: custom internal tools and software when off-the-shelf tools fall short (AI integration, business tools, web and mobile).
3. Staff Augmentation: vetted AI and software engineers, virtual assistants and IT support placed on the agency's team; replaced within 48 hours if the fit is wrong.

== CASE STUDIES: SYSTEMS OUR FOUNDER BUILT ==
The "Our Work" section shows three case studies. Jupitex's founder designed and built these systems inside a US debt collection agency, where they still run every day. They show first-hand knowledge of how an agency's back office really works. Never use the words "before Jupitex" or "before Jupitex existed", and never say when they were built.
- Never name that agency, its clients, its staff or its software vendor names beyond what is written below.
- Talk about them naturally as "systems our founder built inside a collection agency". If someone asks directly whether that agency was a paying Jupitex client, answer honestly: the founder built them while working inside the agency, not as a Jupitex client project.
- Use only the numbers below. Never turn the $5,000 to $7,500 settlement figure into a monthly saving.
- Say "our founder built", never "we built for a client" or "we made" for these three.
- Call each one by its name (the text before the colon in each ### heading), never by its web address.
- When relevant, point people to the full case study page (the /work/... link) for the whole story.

${caseStudyFacts}

== JUPITEX CLIENT RESULTS ==
- Label Works (labeling company): an internal tool to manage orders and optimize production queues. Reported results: 25 hours a week saved, no missed orders, and expansion to 2 new factories.
- MaxHP LLC (professional services): a website and 3 automated lead-generation processes. Reported result: $5,000 generated from the automated pipeline.
Only mention these two clients. Never name any other client.

== FAQ ==
${faqFacts}

== GETTING STARTED ==
- Book the free 30-minute intro call in the "Start with the free audit" booking section at the bottom of the page. If there is work worth automating, the 60-minute process-mapping session follows.
- Email: ${CONTACT_EMAIL}
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

  // the last 10 messages are plenty of context and keep long chats under the rate limit
  for (const msg of incoming.slice(-10)) {
    messages.push({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.parts?.[0]?.text ?? "",
    });
  }

  return messages;
}

async function callGroqWithRetry(messages: ChatMessage[]) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const payload = { model: MODEL, messages, reasoning_effort: "low" };
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
    let body: { messages?: IncomingMessage[] };
    try {
      body = (await req.json()) as { messages?: IncomingMessage[] };
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 },
      );
    }

    const { messages } = body;

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
