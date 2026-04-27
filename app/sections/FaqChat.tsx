"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import SectionLayout from "../components/SectionLayout";

/* ─── FAQ Data ─────────────────────────────────────────────────── */
const faqs = [
  {
    question:
      "How is side Jupitex different from every other AI company out there?",
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
      "Too vague to answer. If this sounds like you, let's have a chat. Bottom line: We work with what you have, design around your existing systems, and handle the technical lift so your team can focus on their real work.",
  },
  {
    question:
      "We've already tried AI and it didn't work. Why would this be any different?",
    answer:
      "Most teams fail because they start with the wrong use cases or stop at the prototype. We focus only on what's worth building and stay through adoption — so it actually ships and delivers.",
  },
];

const SUGGESTIONS = [
  "What services does Jupitex offer?",
  "How can AI help my business?",
  "Tell me about your process",
  "How do I get started?",
];

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
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 sm:py-6 text-left cursor-pointer"
      >
        <span className={`text-caption-ds pr-4 transition-all duration-200 ${isOpen ? "font-extrabold text-black" : "font-medium text-apple-near-black"}`}>
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-apple-text-tertiary" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 sm:pb-6 text-caption-ds text-apple-text-secondary max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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
        src="/images/logo/tab-logo-dark.png" alt="JX" width={logoSize} height={logoSize} className="object-contain" />
    </div>
  );
} 
/* ─── Chat Message Bubble ──────────────────────────────────────── */
function ChatBubble({
  message,
  index,
}: {
  message: ChatMessage;
  index: number;
}) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && <AiAvatar />}
      <div
        className={`max-w-[80%] sm:max-w-[72%] px-4 py-3 text-caption-ds leading-relaxed ${
          isUser
            ? "bg-apple-near-black text-white rounded-2xl rounded-br-md"
            : "bg-apple-light-gray text-apple-near-black rounded-2xl rounded-bl-md"
        }`}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
            ol: ({ children }) => (
              <ol className="list-decimal pl-4 mb-1">{children}</ol>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-4 mb-1">{children}</ul>
            ),
          }}
        >
          {message.parts[0]?.text ?? ""}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}

/* ─── Typing Indicator ────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
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
    </motion.div>
  );
}

/* ─── Main FaqChat Section ─────────────────────────────────────── */
export default function FaqChat() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const reply = data.reply ?? "Sorry, something went wrong.";
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
    <SectionLayout
      sectionId="faq"
      bg="bg-apple-light-gray"
      title="FAQ"
      description="Got questions? We've got answers. If you can't find what you're looking for, ask our AI assistant below."
    >
      {/* ── Chat UI ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <div className="rounded-2xl sm:rounded-3xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] overflow-hidden">
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
            className="h-[420px] sm:h-[500px] md:h-[560px] overflow-y-scroll p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 faq-scrollbar"
          >
            {!hasMessages && (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center px-4"
                >
                  <div
                    className="mx-auto mb-5 h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #000000 0%, #000000 100%)",
                    }}
                  >
                    <Image
                      src="/images/logo/tab-logo-dark.png"
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
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.15 + i * 0.08,
                          ease: "easeOut",
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSend(s)}
                        className="rounded-full border border-[rgba(0,0,0,0.1)] bg-white px-3.5 py-2 text-micro sm:text-caption-ds text-apple-text-secondary transition-colors hover:border-[rgba(0,0,0,0.2)] hover:bg-apple-light-gray cursor-pointer"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} index={i} />
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
                placeholder="Ask Jupitex AI anything..."
                className="flex-1 bg-apple-light-gray text-apple-near-black placeholder:text-apple-text-tertiary rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-caption-ds outline-none border border-[rgba(0,0,0,0.1)] focus:border-[rgba(0,0,0,0.3)] transition-colors"
              />
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="shrink-0 rounded-full bg-apple-near-black p-2.5 sm:p-3 text-white transition-colors hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>

      <div className="h-10 sm:h-14 md:h-16 lg:h-20" />

      {/* ── FAQ Accordion ──────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto">
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
    </SectionLayout>
  );
}
