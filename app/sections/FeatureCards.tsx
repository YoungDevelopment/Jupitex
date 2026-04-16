import SectionLayout from "../components/SectionLayout";

interface ProblemItem {
  tag: string;
  statement: string;
}

const problems: ProblemItem[] = [
  {
    tag: "AI & Automation",
    statement:
      "Your team is buried in repetitive tasks that drain time and budget.",
  },
  {
    tag: "Staff Augmentation",
    statement:
      "You need skilled engineers now, but hiring takes months.",
  },
  {
    tag: "Development",
    statement:
      "Your software is held together with duct tape and tech debt.",
  },
];

export default function FeatureCards() {
  return (
    <SectionLayout
      bg="bg-apple-light-gray"
      title="Do You Have This Problem?"
      description="If any of these sound familiar, you're not alone — and we can help."
    >
      <div className="flex flex-col divide-y divide-[rgba(0,0,0,0.1)]">
        {problems.map((problem) => (
          <div key={problem.tag} className="py-6 sm:py-8 md:py-10 first:pt-0 last:pb-0">
            <span className="text-micro font-semibold uppercase tracking-widest text-orange-500">
              {problem.tag}
            </span>
            <p className="mt-3 text-section-heading text-apple-near-black">
              {problem.statement}
            </p>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
