import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseStudyContent from "@/components/case-study/CaseStudyContent";
import { ReadingProgress } from "@/components/case-study/motion";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";

// The three case studies are known at build time, so their pages are prerendered
export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} | Jupitex`,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { title: study.title, description: study.summary, url: `/work/${study.slug}` },
  };
}

/** The standalone page: what a shared link, a refresh or a search result opens */
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className="min-h-screen w-full bg-background">
      <ReadingProgress />
      <div className="mx-auto w-full max-w-[calc(860px*var(--ui))] px-5 sm:px-8 pt-8 pb-20">
        <Link
          href="/#our-work"
          className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-[#0a0a0a] hover:opacity-70 transition-opacity"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M11 7H3M3 7L6.5 3.5M3 7L6.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Jupitex
        </Link>
        <div className="mt-10">
          <CaseStudyContent study={study} />
        </div>
      </div>
    </main>
  );
}
