"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, ArrowUp } from "lucide-react";
import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";

/* ─── FAQ Data ─────────────────────────────────────────────────── */
const faqs = [
  {
    question: "Will automation put our compliance at risk?",
    answer:
      "It is built the other way round. Your compliance rules are written into every workflow, each decision is logged against the account, and anything sensitive, like a dispute or a cease request, goes to a person before the next contact.",
  },
  {
    question: "Do we have to replace our collection software?",
    answer:
      "No. We build around the collection system, dialer and messaging tools you already use. No migrations, no starting from scratch.",
  },
  {
    question:
      "How is Jupitex different from every other AI company out there?",
    answer:
      "We don't just build AI — we build AI that actually gets used. Most firms hand off a prototype and disappear. We stay through adoption, training, and optimization to make sure it delivers real ROI.",
  },
  {
    question: "How do I know if we're ready for AI?",
    answer:
      "You're ready if you have clear pain points, repetitive work, or untapped data slowing things down. We'll help you figure out what's worth automating — and what's not.",
  },
  {
    question: "What happens after you deliver?",
    answer:
      "We don't hand off and vanish. We train your people, monitor how it's used, and refine until it runs smoothly without us.",
  },
  {
    question: "How much internal time will this take?",
    answer:
      "We know that you hired us to get things off of your team's plate. So, we keep your team's involvement focused and efficient — just enough to capture what matters, then we do the rest.",
  },
  {
    question: "How long until we see real results?",
    answer:
      "You'll typically see a working pilot within weeks, not months. We move fast, test early, and scale only once it's proven.",
  },
  {
    question:
      "We don't have clean data or a big tech team — can we still do this?",
    answer:
      "Yes. We work with what you have, design around your existing collection system, and handle the technical lift so your team can stay on accounts.",
  },
  {
    question:
      "We've already tried AI and it didn't work. Why would this be any different?",
    answer:
      "Most teams fail because they start with the wrong use cases or stop at the prototype. We focus only on what's worth building and stay through adoption — so it actually ships and delivers.",
  },
];

const SUGGESTIONS = [
  "What can you automate for a collection agency?",
  "How does the free audit work?",
  "Will this work with our collection software?",
  "How do I get started?",
];

/* ─── Safe Lightweight Markdown Renderer ───────────────────────── */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return (
        <strong key={idx} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      return (
        <code
          key={idx}
          className="px-1 py-0.5 rounded bg-black/[0.06] font-mono text-[0.9em]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return <em key={idx}>{token.slice(1, -1)}</em>;
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Ordered list (1. 2. etc.), including nested bullet sub-items and blank lines between numbered items
    if (/^\d+\.\s+/.test(trimmed)) {
      const firstMatch = trimmed.match(/^(\d+)\.\s+/);
      const startNum = firstMatch ? parseInt(firstMatch[1], 10) : 1;
      const listItems: { title: string; bullets: string[] }[] = [];

      while (i < lines.length) {
        const currentTrimmed = lines[i].trim();
        const numMatch = currentTrimmed.match(/^\d+\.\s+(.*)/);
        if (!numMatch) break;

        const title = numMatch[1];
        const bullets: string[] = [];
        i++;

        while (i < lines.length) {
          const subTrimmed = lines[i].trim();
          if (!subTrimmed) {
            // Look ahead past blank lines to see if the ordered list or sub-bullets continue
            let nextNonEmpty = i + 1;
            while (nextNonEmpty < lines.length && !lines[nextNonEmpty].trim()) {
              nextNonEmpty++;
            }
            if (
              nextNonEmpty < lines.length &&
              (/^[-*•]\s+/.test(lines[nextNonEmpty].trim()) ||
                /^\d+\.\s+/.test(lines[nextNonEmpty].trim()))
            ) {
              i = nextNonEmpty;
              if (/^\d+\.\s+/.test(lines[i].trim())) break;
              continue;
            }
            break;
          }
          if (/^[-*•]\s+/.test(subTrimmed)) {
            bullets.push(subTrimmed.replace(/^[-*•]\s+/, ""));
            i++;
            continue;
          }
          break;
        }

        listItems.push({ title, bullets });
      }

      elements.push(
        <ol
          key={`ol-${i}`}
          start={startNum}
          className="list-decimal pl-4 mb-1.5 space-y-1.5"
        >
          {listItems.map((item, idx) => (
            <li key={idx}>
              <div>{renderInlineMarkdown(item.title)}</div>
              {item.bullets.length > 0 && (
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  {item.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{renderInlineMarkdown(b)}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Unordered list (- or * or •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-4 mb-1 space-y-0.5">
          {items.map((item, idx) => (
            <li key={idx}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Standard paragraph
    const cleanLine = trimmed.replace(/^#{1,6}\s+/, "");
    elements.push(
      <p key={`p-${i}`} className="mb-1 last:mb-0">
        {renderInlineMarkdown(cleanLine)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

/* ─── FAQ Accordion Item ───────────────────────────────────────── */
function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[rgba(0,0,0,0.1)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-5 sm:py-6 text-left cursor-pointer"
      >
        <span
          className={`text-caption-ds pr-4 transition-all duration-200 ${
            isOpen
              ? "font-extrabold text-black"
              : "font-medium text-apple-near-black"
          }`}
        >
          {question}
        </span>
        <span
          className="shrink-0 transition-transform duration-250"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown className="h-5 w-5 text-apple-text-tertiary" />
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 sm:pb-6 text-caption-ds text-apple-text-secondary max-w-3xl">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Chat Types ──────────────────────────────────────────────── */
interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/* ─── AI Avatar ───────────────────────────────────────────────── */
function AiAvatar({ size = 28 }: { size?: number }) {
  const logoSize = Math.round(size * 0.6);
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, #000000 0%, #000000 50%, #000000 100%)",
      }}
    >
      <Image
        src="/JupitexLogos/tab-logo-dark.png"
        alt="JX"
        width={logoSize}
        height={logoSize}
        className="object-contain"
      />
    </div>
  );
}

/* ─── Chat Message Bubble ──────────────────────────────────────── */
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex items-end gap-2 animate-[subtleFadeIn_0.25s_ease-out] ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <AiAvatar />}
      <div
        className={`max-w-[80%] sm:max-w-[72%] px-4 py-3 text-caption-ds leading-relaxed ${
          isUser
            ? "bg-apple-near-black text-white rounded-2xl rounded-br-md"
            : "bg-apple-light-gray text-apple-near-black rounded-2xl rounded-bl-md"
        }`}
      >
        <FormattedMessage content={message.parts[0]?.text ?? ""} />
      </div>
    </div>
  );
}

/* ─── Typing Indicator ────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-[subtleFadeIn_0.2s_ease-out]">
      <AiAvatar />
      <div className="bg-apple-light-gray rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        <span
          className="faq-typing-dot h-1.5 w-1.5 rounded-full bg-apple-text-tertiary"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="faq-typing-dot h-1.5 w-1.5 rounded-full bg-apple-text-tertiary"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="faq-typing-dot h-1.5 w-1.5 rounded-full bg-apple-text-tertiary"
          style={{ animationDelay: "400ms" }}
        />
      </div>
    </div>
  );
}

/* ─── Main FaqChat Section ─────────────────────────────────────── */
/* ─── Wood stage behind the chat ───────────────────────────────── */
// Same reveal as the hero rocks: the mossy branch shows through a soft
// flashlight mask that follows the pointer over the bare branch.
const WOOD_REST = { x: 0.86, y: 0.3 }; // where the light rests, as a fraction of the wood box
const WOOD_INTRO_FROM = { x: 0.06, y: 0.55 }; // where the light starts its first sweep
const WOOD_LIGHT_RADIUS = 240;
const WOOD_MASK_GRADIENT = `radial-gradient(circle ${WOOD_LIGHT_RADIUS}px at var(--wx) var(--wy), rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0) 100%)`;
const WOOD_MASK: React.CSSProperties = {
  maskImage: WOOD_MASK_GRADIENT,
  WebkitMaskImage: WOOD_MASK_GRADIENT,
};

/* ─── Main Section ─────────────────────────────────────────────── */
export default function FaqChatSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Wood stage: entrance, scroll parallax and the flashlight reveal.
  const stageRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const woodRef = useRef<HTMLDivElement>(null);
  const [stageInView, setStageInView] = useState(false);
  const lightTarget = useRef({ ...WOOD_INTRO_FROM });
  const lightCurrent = useRef({ ...WOOD_INTRO_FROM });
  const lightEase = useRef(0.16);
  const lightRaf = useRef(0);

  // Writes the light centre into CSS variables, in the wood box's own pixels.
  const paintLight = useCallback(() => {
    const el = woodRef.current;
    if (!el) return;
    const { x, y } = lightCurrent.current;
    el.style.setProperty("--wx", `${(x * el.offsetWidth).toFixed(1)}px`);
    el.style.setProperty("--wy", `${(y * el.offsetHeight).toFixed(1)}px`);
  }, []);

  // Eases toward the target and stops once settled, so nothing runs while idle.
  const startLightLoop = useCallback(() => {
    if (lightRaf.current) return;
    const tick = () => {
      const dx = lightTarget.current.x - lightCurrent.current.x;
      const dy = lightTarget.current.y - lightCurrent.current.y;
      if (Math.abs(dx) > 0.0004 || Math.abs(dy) > 0.0004) {
        lightCurrent.current.x += dx * lightEase.current;
        lightCurrent.current.y += dy * lightEase.current;
        paintLight();
        lightRaf.current = requestAnimationFrame(tick);
      } else {
        lightRaf.current = 0;
        lightEase.current = 0.16;
      }
    };
    lightRaf.current = requestAnimationFrame(tick);
  }, [paintLight]);

  // Reveal the wood once the stage scrolls into view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStageInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // First sweep: once the branch has slid in, the light drifts slowly across it to rest.
  useEffect(() => {
    if (!stageInView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      lightCurrent.current = { ...WOOD_REST };
      lightTarget.current = { ...WOOD_REST };
      paintLight();
      return;
    }
    const t = window.setTimeout(() => {
      lightEase.current = 0.025;
      lightTarget.current = { ...WOOD_REST };
      startLightLoop();
    }, 500);
    return () => window.clearTimeout(t);
  }, [stageInView, paintLight, startLightLoop]);

  // Scroll parallax on the wood, plus the pointer (or a slow drift on touch screens) steering the light.
  useEffect(() => {
    paintLight();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    let scrollRaf = 0;

    const stageVisible = () => {
      const r = stageRef.current?.getBoundingClientRect();
      return !!r && r.bottom > 0 && r.top < window.innerHeight;
    };

    const updateParallax = () => {
      scrollRaf = 0;
      const stage = stageRef.current;
      const layer = parallaxRef.current;
      if (!stage || !layer) return;
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      // 0 when the stage enters from below, 1 when it leaves at the top
      const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const y = (0.5 - progress) * 140;
      const rot = (0.5 - progress) * 3;
      layer.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
    };
    const onScroll = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(updateParallax);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !stageVisible()) return;
      const el = woodRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      lightEase.current = 0.16;
      lightTarget.current = inside
        ? { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
        : { ...WOOD_REST };
      startLightLoop();
    };

    let drift = 0;
    if (noHover && !reduce) {
      drift = window.setInterval(() => {
        if (!stageVisible() || lightEase.current < 0.1) return;
        const t = performance.now() / 1000;
        lightTarget.current = {
          x: 0.5 + Math.sin(t * 0.4) * 0.4,
          y: 0.42 + Math.cos(t * 0.55) * 0.14,
        };
        startLightLoop();
      }, 120);
    }

    if (!reduce) {
      updateParallax();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", paintLight);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", paintLight);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (drift) window.clearInterval(drift);
      if (lightRaf.current) cancelAnimationFrame(lightRaf.current);
      lightRaf.current = 0;
    };
  }, [paintLight, startLightLoop]);

  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const canScrollUp = scrollTop > 0;
    const canScrollDown = scrollTop + clientHeight < scrollHeight - 1;
    if ((e.deltaY < 0 && canScrollUp) || (e.deltaY > 0 && canScrollDown)) {
      e.stopPropagation();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;

    const userMsg: ChatMessage = { role: "user", parts: [{ text: msg }] };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      const reply =
        res.ok && data.reply
          ? data.reply
          : "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: reply }] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Something went wrong. Please try again." }],
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <SectionWrapper
      id="faq"
      ariaLabel="FAQ and AI Assistant"
      subject="FAQ & AI ASSISTANT"
      title="Questions, answered"
      description="Ask our AI assistant anything about how we work with agencies, or read the questions we hear most."
    >
      {/* ── Chat UI over the wood ─────────────────────────────── */}
      <div ref={stageRef} className="relative w-full py-10 sm:py-14">
        {/* Wood: slides in first, drifts with scroll, moss revealed by the light */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[max(100vw,760px)] aspect-[2000/1116] -translate-x-1/2 -translate-y-1/2"
        >
          <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
            <div
              className="absolute inset-0"
              style={{
                opacity: stageInView ? 1 : 0,
                transform: stageInView ? "none" : "translate3d(-7%, 4%, 0) rotate(-2deg)",
                filter: stageInView ? "none" : "blur(8px)",
                transition:
                  "opacity 900ms var(--ease-out), transform 1300ms var(--ease-out), filter 900ms var(--ease-out)",
              }}
            >
              <div ref={woodRef} className="absolute inset-0">
                <img
                  src="/wood/wood-bare.webp"
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <img
                  src="/wood/wood-green.webp"
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={WOOD_MASK}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chat card: fades in once the wood has settled */}
        <div
          className="relative z-10 mx-auto w-full max-w-[640px] rounded-2xl sm:rounded-3xl border border-[rgba(0,0,0,0.1)] bg-card shadow-[0_18px_50px_rgba(0,0,0,0.12)] overflow-hidden"
          style={{
            opacity: stageInView ? 1 : 0,
            transform: stageInView ? "none" : "translateY(18px) scale(0.98)",
            filter: stageInView ? "none" : "blur(6px)",
            transition:
              "opacity 700ms var(--ease-out) 750ms, transform 800ms var(--ease-out) 750ms, filter 700ms var(--ease-out) 750ms",
          }}
        >
          {/* ── Chat header ──────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-[rgba(0,0,0,0.06)]">
            <div className="relative">
              <AiAvatar size={36} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white faq-pulse" />
            </div>
            <div className="min-w-0">
              <p className="text-caption-ds font-semibold text-apple-near-black leading-tight">
                Jupitex AI
              </p>
              <p className="text-micro text-apple-text-tertiary leading-tight">
                Always online
              </p>
            </div>
          </div>

          {/* ── Messages area ────────────────────────────────── */}
          <div
            ref={scrollContainerRef}
            onWheel={handleWheel}
            className="h-[400px] sm:h-[460px] md:h-[500px] overflow-y-scroll p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 faq-scrollbar"
          >
            {!hasMessages && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center px-4 animate-[subtleFadeIn_0.35s_ease-out]">
                  <div
                    className="mx-auto mb-5 h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #000000 0%, #000000 100%)",
                    }}
                  >
                    <Image
                      src="/JupitexLogos/tab-logo-dark.png"
                      alt="JX"
                      width={38}
                      height={38}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-body-ds font-semibold text-apple-near-black mb-1">
                    Hi, I&apos;m JX
                  </h3>
                  <p className="text-caption-ds text-apple-text-tertiary mb-6">
                    How can I help you today?
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="rounded-full border border-[rgba(0,0,0,0.1)] bg-white px-3.5 py-2 text-micro sm:text-caption-ds text-apple-text-secondary transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] hover:border-[rgba(0,0,0,0.2)] hover:bg-apple-light-gray cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>

          {/* ── Input bar ────────────────────────────────────── */}
          <div className="border-t border-[rgba(0,0,0,0.06)] p-3 sm:p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the audit, compliance, timelines"
                className="flex-1 bg-apple-light-gray text-apple-near-black placeholder:text-apple-text-tertiary rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-caption-ds outline-none border border-[rgba(0,0,0,0.1)] focus:border-[rgba(0,0,0,0.3)] transition-colors"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={isLoading || !input.trim()}
                className="shrink-0 rounded-full bg-apple-near-black p-2.5 sm:p-3 text-white transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="h-6 sm:h-8 md:h-10" />

      {/* ── FAQ Accordion ──────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[640px] text-left">
        {faqs.map((faq, i) => (
          <FaqItem
            key={i}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
