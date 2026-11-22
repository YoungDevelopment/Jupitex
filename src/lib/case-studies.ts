/**
 * Founder-experience case studies: back-office work our founder built while employed at a US
 * debt collection agency, before Jupitex. The agency is never named and is never presented as a
 * Jupitex client. One source for the homepage cards, the modal, the full page and the chat.
 *
 * `draft: true` marks a case study whose interview is not finished yet.
 */

export interface CaseStudySection {
  heading: string;
  body?: string;
  points?: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** One or two sentences: what changed, for the card and the page intro */
  summary: string;
  card: { metric: string; metricLabel: string; tags: string[] };
  image: { src: string; alt: string };
  stats: { value: string; label: string }[];
  sections: CaseStudySection[];
  tools: string[];
  draft?: boolean;
}

/** Shown on every founder-experience case study, so nobody reads it as client work */
export const FOUNDER_NOTE =
  "Built by our founder while working inside a US debt collection agency, before starting Jupitex. The agency is not named and was not a Jupitex client.";

// Placeholder art for all three until the case-study images are made
const PLACEHOLDER_IMAGE = "/images/our-work/Debt Collection.png";

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "compliance-reply-review",
    draft: true,
    title: "Every consumer reply reviewed, not a sample",
    summary:
      "Consumer SMS and email replies used to be read by hand. Now every reply is read by AI, anything risky goes straight to a person, and each decision is logged.",
    card: {
      metric: "$7,500 / mo",
      metricLabel: "saved in legal fees",
      tags: ["Compliance QA", "SMS and email", "AI review"],
    },
    image: { src: PLACEHOLDER_IMAGE, alt: "Compliance review of consumer replies" },
    stats: [
      { value: "$7,500 / mo", label: "saved in legal fees" },
      { value: "Days → hours", label: "for reply review" },
      { value: "Every reply", label: "read, not a sample" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Compliance staff read consumer SMS and email replies one at a time, hoping an opt-out or a dispute was not sitting in the pile they had not reached yet.",
      },
      {
        heading: "What was built",
        points: [
          "Every reply comes in automatically from the SMS and email tools the agency already used.",
          "AI reads each one for opt-outs, disputes, cease requests, and attorney or bankruptcy mentions.",
          "Replies are routed by the agency's own rules: contact suppressed, queued for compliance, or cleared for the collector.",
          "Anything risky stops contact at once and goes to the compliance lead to decide.",
          "Each decision and the reason for it is saved against the account.",
        ],
      },
      {
        heading: "The results",
        points: [
          "About $7,500 a month saved in legal fees.",
          "Review that used to take whole days now takes hours.",
        ],
      },
    ],
    tools: ["AI review", "The agency's SMS and email platforms", "Compliance queue and audit log"],
  },
  {
    slug: "new-business-loading",
    title: "From hand-fixed files to accounts ready the same day",
    summary:
      "New business files used to be fixed and loaded by hand through slow, crash-prone software. Now every client's file loads itself, at least 3x faster, and a team of three runs it all.",
    card: {
      metric: "3x faster",
      metricLabel: "100,000 accounts in under 20 minutes, down from an hour",
      tags: ["Placement loading", "SSIS", "Automation"],
    },
    image: { src: PLACEHOLDER_IMAGE, alt: "Automated placement file loading" },
    stats: [
      { value: "3x faster", label: "100,000 accounts in under 20 minutes, down from at least an hour" },
      { value: "3 people", label: "run loading for every client; new clients no longer mean new hires" },
      { value: "Every 15 min", label: "new files picked up automatically" },
      { value: "1M+ accounts", label: "handled at the monthly peak" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "A team of data operators loaded new business by hand through the agency's legacy loading software. Every client sent files in its own format, so each one had to be fixed by hand first. The software was slow and tied up server resources, and if it crashed partway through, the backlog had to be deleted and the load started again. Every new client meant hiring more operators, sometimes contractors, just to keep up.",
      },
      {
        heading: "What was built",
        points: [
          "Automatic pickup: a scheduled job collects files from the clients' SFTP drops every 15 minutes.",
          "A folder and SSIS jobs for each client convert its file into the agency's standard layout, with no hand-fixing.",
          "Accounts are loaded straight into the collection database instead of through the slow legacy loader.",
          "If a file arrives with a missing column or a changed layout, it is held back and the team gets a Microsoft Teams message and an email explaining why.",
          "An interrupted load picks up where it stopped, so nobody deletes a backlog and starts over.",
          "Finished files move to a processed folder, so nothing loads twice, and the team can see what is still waiting.",
          "Important clients load first; less urgent ones are scheduled for the quieter afternoon, when the database is under less load.",
        ],
      },
      {
        heading: "Built with a fail-safe",
        body: "Files are still produced in the layout the legacy software accepts. If a job ever needs fixing, the team can load the old way the same day while it is repaired, with no waiting on anyone.",
      },
      {
        heading: "How it was rolled out",
        body: "The first client's jobs took about a week to build. For the next two placement cycles both processes ran side by side: the same accounts went through the old software into the live system and through the new jobs into a test database, and the results were compared. The old loading was switched off only when both cycles matched. Each further client took about a week, or 2 to 3 weeks for complex clients whose data arrives split across several files.",
      },
      {
        heading: "The results",
        points: [
          "At least 3x faster: 100,000 accounts load in under 20 minutes (usually under 15), down from at least an hour. At the monthly peak of hundreds of thousands to over a million accounts, that saves hours of loading every cycle.",
          "Accounts are worked the same day they arrive, so collection starts sooner.",
          "No manual re-keying, and bad files are flagged before they reach the database.",
          "Three people run loading for every client, with a few minutes a day on a QA checklist. Weeks of monthly loading work became a few hours of checks.",
          "New clients no longer mean new hires, and the other operators moved to collections and to research for the compliance team.",
          "No weekend babysitting: alerts arrive in Teams and email.",
        ],
      },
    ],
    tools: ["SSIS (SQL Server Integration Services)", "SFTP", "The agency's collection database", "Microsoft Teams and email alerts"],
  },
  {
    slug: "client-reporting",
    draft: true,
    title: "Client reports for every client, built automatically",
    summary: "A reporting tool that now produces the agency's reporting for all of its clients.",
    card: {
      metric: "Every client",
      metricLabel: "reported on by one tool",
      tags: ["Client reporting", "Remittance", "Automation"],
    },
    image: { src: PLACEHOLDER_IMAGE, alt: "Automated client reporting" },
    stats: [{ value: "Every client", label: "reported on by one tool" }],
    sections: [
      {
        heading: "What was built",
        body: "A reporting tool that handles all of the agency's reporting for all of its clients.",
      },
    ],
    tools: [],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
