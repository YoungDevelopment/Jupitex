/**
 * Founder-experience case studies: back-office work our founder built while employed at a US
 * debt collection agency, before Jupitex. The agency is never named and is never presented as a
 * Jupitex client. One source for the homepage cards, the /work/[slug] pages and the chat.
 *
 * Writing rules: plain words, no buzzwords, told as a story. Only facts the founder confirmed.
 * Wrap key phrases in ==double equals== to highlight them on the page.
 * `draft: true` marks a case study whose interview is not finished yet.
 */

export interface CaseStudySection {
  heading: string;
  /** One string per paragraph */
  body?: string[];
  points?: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** One or two sentences: what changed, for the card and the page intro */
  summary: string;
  /** The homepage card: kept as short as the original cards so they stay the same height */
  card: { name: string; description: string; metric: string; metricLabel: string; tags: string[] };
  image: { src: string; alt: string };
  stats: { value: string; label: string }[];
  sections: CaseStudySection[];
  tools: string[];
  draft?: boolean;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "compliance-reply-review",
    draft: true,
    title: "Every consumer reply reviewed, not a sample",
    summary:
      "Consumer SMS and email replies used to be read by hand. Now every reply is read by AI, anything risky goes straight to a person, and each decision is logged.",
    card: {
      name: "Compliance reply review",
      description: "Every consumer SMS and email reply read by AI, with anything risky sent straight to a person.",
      metric: "$7,500 / mo",
      metricLabel: "Saved in legal fees every month",
      tags: ["Compliance QA", "SMS and email"],
    },
    image: { src: "/images/our-work/Debt Collection.png", alt: "Compliance review of consumer replies" },
    stats: [
      { value: "$7,500 / mo", label: "saved in legal fees" },
      { value: "Days → hours", label: "for reply review" },
      { value: "Every reply", label: "read, not a sample" },
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Compliance staff read consumer SMS and email replies one at a time, hoping an opt-out or a dispute was not sitting in the pile they had not reached yet.",
        ],
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
    title: "New business loaded 3x faster, with no manual work",
    summary:
      "Every month, hundreds of thousands of new accounts arrived, and a team cleaned up and loaded them by hand. This is how that became ==a job that runs itself==.",
    card: {
      name: "New business loading",
      description: "Client files cleaned up and loaded automatically, so new accounts are ready to work the same day.",
      metric: "3x faster",
      metricLabel: "100,000 accounts in under 20 minutes",
      tags: ["Placement loading", "SSIS", "Automation"],
    },
    image: { src: "/images/our-work/Nova Labeling.png", alt: "Automated loading of new business files" },
    stats: [
      { value: "3x faster", label: "100,000 accounts load in under 20 minutes. It used to take at least an hour." },
      { value: "3 people", label: "look after loading for every client. New clients no longer mean new hires." },
      { value: "Same day", label: "new accounts are ready to work the day they arrive." },
      { value: "1M+", label: "accounts handled at the busiest point of the month." },
    ],
    sections: [
      {
        heading: "How it used to work",
        body: [
          "Every month, the agency's clients sent over their new accounts. The middle of the month was the busy part: ==700,000 to 800,000 accounts==, and sometimes more than a million.",
          "Most clients sent their files in a different layout, which meant a different process for each one. Before anything could be loaded, a data operator had to clean up each file by hand into a format the agency's old loading software would accept.",
          "Then came the loading itself. The software was slow: 100,000 accounts took ==at least an hour==, even on a good day, and it slowed the server down for everyone else. It also crashed. When it did, there was no picking up where it stopped. The half-loaded batch had to be ==deleted and the whole thing started again==.",
          "All of this took people. Every new client meant more files, which meant ==hiring more operators==, sometimes on short contracts, just to keep up. And somebody had to keep an eye on the loads, weekends included.",
        ],
      },
      {
        heading: "The fix",
        body: [
          "The idea was simple: ==take the person out of every step that did not need one==.",
          "First, the files. Clients already dropped them on the agency's SFTP server. A small job now checks it ==every 15 minutes==, collects anything new and puts it where it belongs.",
          "Next, every client got its own folder and its own set of jobs, built with SSIS, Microsoft's tool for moving data between systems. The first job cleans up the client's file into the format the old software accepts, the same clean-up an operator used to do by hand. The second loads the accounts straight into the collection database, skipping the slow loading software altogether.",
          "Then the parts that make it trustworthy. If a file shows up with a missing column or a changed layout, ==it is not loaded==. Instead the team gets a message in Microsoft Teams and an email saying which file it is and what is wrong. If a load is interrupted, it ==carries on from where it stopped==. Once a file is done, it moves to a \"processed\" folder, so it can never be loaded twice, and anyone can see what is still waiting.",
          "Last, the order. The most important clients load first. Less urgent ones wait for the afternoon, when the database is quieter.",
        ],
      },
      {
        heading: "A safety net, just in case",
        body: [
          "There was one more rule: ==never leave the team stuck==. Every file is still cleaned up into the format the old software accepts. So if a job ever breaks, the team can load that day's files the old way while it is fixed. Nobody has to wait.",
        ],
      },
      {
        heading: "Switching over without the risk",
        body: [
          "The first client took about a week to build, working a few hours a day. But it did not go live straight away.",
          "For the next two monthly cycles, ==both ways ran side by side==. The same accounts went through the old software into the live system and through the new jobs into a test copy of the database. Then the two were compared.",
          "Only when ==both cycles matched== was the old loading switched off. After that, each new client took about a week to set up, or two to three weeks for the tricky ones whose data arrives split across several files.",
        ],
      },
      {
        heading: "The difference",
        points: [
          "Loading 100,000 accounts now takes ==under 20 minutes==, and usually under 15. It used to take at least an hour. At the mid-month peak, that is hours back every single cycle.",
          "New accounts can be worked ==the same day they arrive==, so collecting starts sooner.",
          "Nobody cleans up files by hand any more, and a bad file gets caught before it reaches the database.",
          "==Three people== now look after loading for every client. Their job is a few minutes a day with a checklist: did everything load, and is everything where it should be? Then it goes to QA.",
          "Adding a client ==no longer means hiring==. The operators who used to load files moved on to collections and to finding information for the compliance team.",
          "Nobody watches loads over the weekend any more. If something needs a person, Teams and email will say so.",
        ],
      },
    ],
    tools: ["SSIS", "SFTP", "The agency's collection database", "Microsoft Teams and email alerts"],
  },
  {
    slug: "client-reporting",
    draft: true,
    title: "Client reports for every client, built automatically",
    summary: "A reporting tool that now produces the agency's reporting for all of its clients.",
    card: {
      name: "Client reporting",
      description: "One tool that now builds the reports for every one of the agency's clients.",
      metric: "Every client",
      metricLabel: "Reported on by one tool",
      tags: ["Client reporting", "Automation"],
    },
    image: { src: "/images/our-work/Maxhpllc.png", alt: "Automated client reporting" },
    stats: [{ value: "Every client", label: "reported on by one tool" }],
    sections: [
      {
        heading: "What was built",
        body: ["A reporting tool that handles all of the agency's reporting for all of its clients."],
      },
    ],
    tools: [],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
