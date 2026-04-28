"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import SectionLayout from "../components/SectionLayout";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Their AI audit gave us a clear risk map in week one. We fixed model drift and cut failed automations by 38% in a single sprint.",
    name: "Ayesha Khan",
    role: "Head of Data & AI, Fintech",
    company: "NexaLedger",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    quote:
      "We hired them for AI services, but the audit became the real unlock. Their team found prompt injection gaps our internal review missed.",
    name: "Marcus Lee",
    role: "CTO, Health Platform",
    company: "CareFlow Health",
    avatar: "https://i.pravatar.cc/80?img=33",
  },
  {
    quote:
      "Before launch, they stress-tested our assistant across edge cases and compliance scenarios. We shipped with confidence and no critical findings.",
    name: "Nadia Fernandes",
    role: "VP Product, SaaS",
    company: "OrbitDesk",
    avatar: "https://i.pravatar.cc/80?img=44",
  },
  {
    quote:
      "Their AI services team moved from strategy to implementation fast. Governance, monitoring, and handoff docs were all production-ready.",
    name: "Omar Siddiqui",
    role: "Engineering Manager, Enterprise Ops",
    company: "CoreAxis Systems",
    avatar: "https://i.pravatar.cc/80?img=59",
  },
  {
    quote:
      "The AI audit surfaced where we were over-automating. We reworked the workflow and reduced support tickets by 27%.",
    name: "Priya Menon",
    role: "Customer Experience Director",
    company: "BrightCart",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    quote:
      "From model evaluation to rollout playbooks, their AI services covered everything we needed to scale responsibly.",
    name: "Daniel Ross",
    role: "COO, Logistics Tech",
    company: "RoutePilot",
    avatar: "https://i.pravatar.cc/80?img=45",
  },
  {
    quote:
      "They translated technical audit findings into business actions our leadership could actually prioritize. That clarity was invaluable.",
    name: "Hina Patel",
    role: "Director of Strategy, Retail",
    company: "UrbanNest Retail",
    avatar: "https://i.pravatar.cc/80?img=53",
  },
  {
    quote:
      "Their team helped us stand up an internal AI review process that now catches quality and compliance issues before release.",
    name: "Ryan Cooper",
    role: "Risk & Compliance Lead",
    company: "SentraPay",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    quote:
      "The audit report was detailed, actionable, and honest. It highlighted data quality blind spots that were hurting model performance.",
    name: "Sara Ahmed",
    role: "Head of Analytics",
    company: "MetricLoop",
    avatar: "https://i.pravatar.cc/80?img=49",
  },
  {
    quote:
      "They rebuilt our AI workflow end-to-end with observability in mind. We now track hallucinations, latency, and business impact in one place.",
    name: "Jason Miller",
    role: "Principal Architect",
    company: "StackNorth",
    avatar: "https://i.pravatar.cc/80?img=57",
  },
  {
    quote:
      "As a non-technical team, we appreciated how clearly they explained model risks and mitigation. The process felt structured and practical.",
    name: "Lina Qureshi",
    role: "Marketing Operations Lead",
    company: "Sparklane Media",
    avatar: "https://i.pravatar.cc/80?img=48",
  },
  {
    quote:
      "If you need AI services with governance baked in, this is the team. Their audit-first approach saved us months of rework.",
    name: "Victor Chen",
    role: "Founder, B2B SaaS",
    company: "SignalForge",
    avatar: "https://i.pravatar.cc/80?img=60",
  },
];

const firstColumn = testimonials.slice(0, 4);
const secondColumn = testimonials.slice(4, 8);
const thirdColumn = testimonials.slice(8, 12);

function QuoteIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white/20"
    >
      <path
        d="M9.135 5.215C5.098 7.085 2.78 10.075 2.78 13.665c0 2.66 1.72 4.56 4.02 4.56 2.06 0 3.66-1.54 3.66-3.6 0-1.96-1.36-3.38-3.18-3.38-.48 0-.88.08-1.2.24.4-2.32 2.36-4.72 5.2-6.38L9.135 5.215zm11.34 0c-4.04 1.87-6.36 4.86-6.36 8.45 0 2.66 1.72 4.56 4.02 4.56 2.06 0 3.66-1.54 3.66-3.6 0-1.96-1.36-3.38-3.18-3.38-.48 0-.88.08-1.2.24.4-2.32 2.36-4.72 5.2-6.38l-2.14-.11z"
        fill="currentColor"
      />
    </svg>
  );
}

function TestimonialCard({ quote, name, role, company, avatar }: Testimonial) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-apple-surface-1 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:bg-apple-surface-4">
      <QuoteIcon />
      <p className="mt-3 sm:mt-4 text-caption-ds text-white/70">{quote}</p>
      <div className="mt-4 sm:mt-6 flex items-center gap-3">
        <Image
          src={avatar}
          alt={name}
          width={40}
          height={40}
          sizes="40px"
          className="rounded-full grayscale"
        />
        <div>
          <p className="text-caption-ds font-semibold text-white">{name}</p>
          <p className="text-micro text-white/50">{role}</p>
          <p className="text-micro text-white/40">{company}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsColumn({
  testimonials,
  duration = 10,
  className,
}: {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, dupeIndex) => (
          <React.Fragment key={dupeIndex}>
            {testimonials.map((t) => (
              <TestimonialCard key={`${dupeIndex}-${t.name}`} {...t} />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <SectionLayout
      sectionId="testimonials"
      bg="bg-black"
      dark
      title="Hear from our clients"
      description="What teams say after partnering with Jupitix on AI audit, risk, and implementation work."
    >
      <div className="relative max-h-[450px] sm:max-h-[550px] md:max-h-[650px] lg:max-h-[750px] overflow-hidden">
        <div className="flex justify-center gap-4 sm:gap-6">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 sm:h-24 md:h-32 bg-linear-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-24 md:h-32 bg-linear-to-t from-black to-transparent" />
      </div>
    </SectionLayout>
  );
}
