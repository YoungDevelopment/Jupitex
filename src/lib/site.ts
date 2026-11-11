/**
 * Site-wide copy and navigation for the collection-agency version of the site.
 * Section components read from here so the positioning can be changed in one place.
 */

export const ACCENT = "#FF731E";

export const NAV_LINKS = [
  { label: "Audit", id: "audit" },
  { label: "Automations", id: "automations" },
  { label: "Services", id: "services" },
  { label: "Work", id: "our-work" },
  { label: "FAQ", id: "faq" },
] as const;

export const CONTACT_EMAIL = "contact@jupitex.io";

export const HERO = {
  eyebrow: "AI & automation for collection agencies",
  titleMuted: "Less manual work.",
  titleStrong: "More accounts resolved.",
  body: "We automate the repetitive work inside debt collection agencies: compliance review, placements and client reporting. It starts with a free audit.",
  primaryCta: "Book the free audit",
  secondaryCta: "See what we automate",
};

/** Smooth-scrolls to a section without touching the URL hash. */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export interface Workflow {
  id: string;
  name: string;
  blurb: string;
  today: string;
  steps: { title: string; detail: string }[];
  staysWithTeam: string;
  proof?: { figure: string; label: string };
}

export const WORKFLOWS: Workflow[] = [
  {
    id: "compliance-qa",
    name: "Compliance QA on SMS and email",
    blurb: "Every consumer reply is read, not a sample of them.",
    today:
      "A compliance lead spot-checks a slice of replies by hand and hopes the opt-out or dispute is in the slice.",
    steps: [
      {
        title: "Reply arrives",
        detail: "SMS or email, straight from the platform you already send with.",
      },
      {
        title: "AI reads it",
        detail:
          "Looks for opt-outs, disputes, cease requests, attorney and bankruptcy mentions.",
      },
      {
        title: "Routed by your rules",
        detail: "Suppressed, queued for compliance, or cleared for the collector.",
      },
      {
        title: "Logged",
        detail: "The decision and the reason are saved against the account.",
      },
    ],
    staysWithTeam: "Anything flagged gets a human decision before the next contact.",
    proof: { figure: "$7,500 / mo", label: "saved in legal fees at Compliance Ops" },
  },
  {
    id: "placements",
    name: "Placement file intake",
    blurb: "New business loaded the morning it arrives.",
    today:
      "Every client sends a different spreadsheet. Someone re-maps columns, fixes dates and keys accounts in before a collector can touch them.",
    steps: [
      {
        title: "File lands",
        detail: "From email or SFTP, in whatever layout the client uses.",
      },
      {
        title: "Mapped and validated",
        detail: "Columns matched to your system, missing or odd fields called out.",
      },
      {
        title: "Scrubbed",
        detail: "Duplicates removed and your vendor scrubs run before loading.",
      },
      {
        title: "Loaded",
        detail: "Accounts created in your collection system, ready to work.",
      },
    ],
    staysWithTeam: "Your team reviews a short exceptions list instead of the whole file.",
  },
  {
    id: "client-reporting",
    name: "Client reporting and remittance",
    blurb: "Statements that build and send themselves.",
    today:
      "Month-end means exporting payments, splitting them per client in Excel and emailing statements one at a time.",
    steps: [
      {
        title: "Schedule fires",
        detail: "Daily, weekly or month-end, per client agreement.",
      },
      {
        title: "Data pulled",
        detail: "Payments, fees and inventory read directly from your system.",
      },
      {
        title: "Statement built",
        detail: "Each client gets their own format and their own numbers.",
      },
      {
        title: "Sent and archived",
        detail: "Delivered to the client and filed where your team can find it.",
      },
    ],
    staysWithTeam: "Finance approves the remittance totals before anything goes out.",
  },
  {
    id: "disputes",
    name: "Dispute and validation handling",
    blurb: "No dispute sits unseen in an inbox.",
    today:
      "Disputes arrive by letter, email and portal. Pausing the account and pulling documents depends on who noticed and when.",
    steps: [
      {
        title: "Dispute detected",
        detail: "From mail scans, email, portal messages or call notes.",
      },
      {
        title: "Account paused",
        detail: "Flagged in your system so outreach stops while it is open.",
      },
      {
        title: "Packet assembled",
        detail: "Account documents gathered into a validation response draft.",
      },
      {
        title: "Queued for approval",
        detail: "Lands with compliance, with the deadline on it.",
      },
    ],
    staysWithTeam: "Nothing is sent to a consumer without a person approving it.",
  },
  {
    id: "payment-follow-up",
    name: "Payment plan follow-up",
    blurb: "Promises to pay that do not fall through.",
    today:
      "Collectors keep promise dates in notes and sticky reminders. Broken promises surface days late, if at all.",
    steps: [
      {
        title: "Promise recorded",
        detail: "Picked up from the collector's notes or the payment portal.",
      },
      {
        title: "Reminder scheduled",
        detail: "Inside the contact windows and frequency limits you set.",
      },
      {
        title: "Payment checked",
        detail: "Matched against what actually posted on the due date.",
      },
      {
        title: "Collector task created",
        detail: "Missed promises go back on the right desk the same day.",
      },
    ],
    staysWithTeam: "Collectors handle the conversation. The system handles the calendar.",
  },
];
