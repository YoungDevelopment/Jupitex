"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import SectionLayout from "../components/SectionLayout";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "What a fantastic AI Proactiv AI is, I just love it. It has completely transformed the way I approach problems and develop solutions.",
    name: "Manu Arora",
    role: "Tech Innovator & Entrepreneur",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    quote: "Absolutely revolutionary, a game-changer for our industry.",
    name: "Bob Smith",
    role: "Industry Analyst",
    avatar: "https://i.pravatar.cc/80?img=33",
  },
  {
    quote:
      "The efficiency it brings is unmatched. It's a vital tool that has helped us cut costs and improve our end product significantly.",
    name: "Eva Green",
    role: "Operations Director",
    avatar: "https://i.pravatar.cc/80?img=44",
  },
  {
    quote:
      "It has saved us countless hours. Highly recommended for anyone looking to enhance their efficiency and productivity.",
    name: "Henry Ford",
    role: "Operations Analyst",
    avatar: "https://i.pravatar.cc/80?img=59",
  },
  {
    quote: "I made a soap with the help of AI, it was so easy to use.",
    name: "Tyler Durden",
    role: "Creative Director & Business Owner",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    quote:
      "I can't imagine going back to how things were before this AI.",
    name: "Cathy Lee",
    role: "Product Manager",
    avatar: "https://i.pravatar.cc/80?img=45",
  },
  {
    quote:
      "A robust solution that fits perfectly into our workflow. It has enhanced our team's capabilities and allowed us to tackle more complex projects.",
    name: "Frank Moore",
    role: "Project Manager",
    avatar: "https://i.pravatar.cc/80?img=53",
  },
  {
    quote:
      "A must-have tool for any professional. It's revolutionized the way we approach problem-solving and decision-making.",
    name: "Ivy Wilson",
    role: "Business Consultant",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    quote:
      "This AI has transformed the way I work! It's like having a brilliant assistant who knows exactly what I need before I even ask.",
    name: "Alice Johnson",
    role: "Senior Software Engineer",
    avatar: "https://i.pravatar.cc/80?img=49",
  },
  {
    quote:
      "It's like having a superpower! This AI tool has given us the ability to do things we never thought were possible in our field.",
    name: "David Wright",
    role: "Research Scientist",
    avatar: "https://i.pravatar.cc/80?img=57",
  },
  {
    quote:
      "It's incredibly intuitive and easy to use. Even those without technical expertise can leverage its power to improve their workflows.",
    name: "Grace Hall",
    role: "Marketing Specialist",
    avatar: "https://i.pravatar.cc/80?img=48",
  },
  {
    quote:
      "The results are always impressive. This AI has helped us to not only meet but exceed our performance targets.",
    name: "Jack Brown",
    role: "Performance Manager",
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

function TestimonialCard({ quote, name, role, avatar }: Testimonial) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-apple-surface-1 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:bg-apple-surface-4">
      <QuoteIcon />
      <p className="mt-3 sm:mt-4 text-caption-ds text-white/70">
        {quote}
      </p>
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
      title="Loved by thousands of people"
      description="Here's what some of our users have to say about Jupitex."
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
