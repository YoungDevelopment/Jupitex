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
    title: "90% of consumer replies handled automatically, around the clock",
    summary:
      "Thousands of consumer replies a day used to be read, sorted and logged by hand. This is how ==nine out of ten== now take care of themselves.",
    card: {
      name: "AI reply handling",
      description: "Every consumer SMS and email reply read and sorted the moment it arrives, with only the unclear ones sent to a person.",
      metric: "90%",
      metricLabel: "Of replies handled automatically",
      tags: ["AI reply handling", "SMS and email"],
    },
    image: { src: "/images/our-work/Debt Collection.png", alt: "AI sorting consumer SMS and email replies" },
    stats: [
      { value: "90%", label: "of consumer replies are handled automatically. Only the unclear ones go to a person." },
      { value: "24/7", label: "replies are handled around the clock, almost as soon as they arrive." },
      { value: "6,000+", label: "replies a day, read and sorted without anyone opening a file." },
      { value: "$5,000+", label: "what a single missed opt-out could cost to settle before." },
    ],
    sections: [
      {
        heading: "How it used to work",
        body: [
          "The agency sent about a million emails and half a million text messages every day. That brought back ==6,000 to 7,000 replies a day==, delivered as files from the messaging vendors.",
          "A five-person team inside compliance handled them. Every hour they opened the latest files and read the replies one by one, looking for three things: people who wanted to ==stop being contacted==, people who ==wanted to pay==, and people with questions. Payments and questions were passed on to the calling team.",
          "Every reply that needed action took ==1.5 to 2 minutes==: read it, find the account in the agency's old collection software, update it there, and sometimes write back. All day, every day.",
        ],
      },
      {
        heading: "Why it mattered",
        body: [
          "Missing even one opt-out meant that person got another email or text the next day. That can turn into a lawsuit, and a single case could cost ==$5,000 to $7,500== to settle. It also looked bad in front of the agency's own clients.",
          "Slow replies cost money the other way too. People who wanted to pay were left waiting, and some of them were lost.",
          "And the team only worked office hours, so anything that arrived in the evening or at the weekend ==waited until the next morning==. As volumes grew, the only answer was hiring more people.",
        ],
      },
      {
        heading: "The fix",
        body: [
          "The goal: ==read every reply the moment it arrives==, and only ask a person when it really needs one.",
          "The system collects the reply files and reads every response in two passes. First, simple rules. Clear words like \"stop\" or \"unsubscribe\" ==unsubscribe the person straight away==, and other words mark a reply as a question or a payment request.",
          "Second, anything the rules cannot place goes to AI, which reads the reply the way a person would and decides what it is.",
          "Every reply then becomes a ticket in a web portal the compliance team can see. ==Most tickets close themselves==: the system records the outcome in the collection system, so nobody has to open the old software. The rest come with ==one-click buttons== that make the change in the database for them.",
        ],
      },
      {
        heading: "Getting it right",
        body: [
          "After launch, it took about a month of tuning the rules against real replies. Since then it has run around the clock.",
        ],
      },
      {
        heading: "The difference",
        points: [
          "About ==90% of replies== are now handled automatically. The compliance team can look over them whenever they want.",
          "Only replies that are genuinely unclear go to a person, with the reply and the account already in front of them.",
          "Replies are handled ==around the clock, almost as soon as they arrive==. Nothing waits for the morning.",
          "Opt-outs are acted on straight away instead of sitting in a file, which is where the lawsuits came from.",
          "People who want to pay are passed on while they still want to.",
          "The same five people now spend most of their time on ==other compliance work== instead of sorting replies, and more messages no longer means more hires.",
        ],
      },
    ],
    tools: ["Keyword rules", "AI classification", "Web ticket portal", "The agency's collection database"],
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
