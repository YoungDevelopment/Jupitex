import { notFound } from "next/navigation";
import CaseStudyContent from "@/components/case-study/CaseStudyContent";
import CaseStudyModal from "@/components/case-study/CaseStudyModal";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

/** Clicking a case study on the homepage opens it here, over the page, at its own URL */
export default async function CaseStudyModalRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const titleId = `case-study-title-${study.slug}`;

  return (
    <CaseStudyModal titleId={titleId}>
      <CaseStudyContent study={study} headingLevel="h2" titleId={titleId} />
    </CaseStudyModal>
  );
}
