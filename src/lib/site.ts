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
  eyebrow: "AI & automation for debt collection agencies",
  titleMuted: "We Automate Back-Office Work",
  titleStrong: "for Debt Collection Agencies",
  body: "Client reports, payment posting and new account files, done automatically inside the software you already use. Your team gets hours back every week.",
  primaryCta: "Book the free 90-minute audit",
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
  steps: { title: string; detail: string }[];
  /** How we set it up, in plain words: three short lines */
  howWeAutomate: string[];
  proof?: { figure: string; label: string };
}

export const WORKFLOWS: Workflow[] = [
  {
    id: "client-reporting",
    name: "Client reporting and remittance",
    blurb: "Month-end statements that build and send themselves.",
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
    howWeAutomate: [
      "We set up each client's report format and schedule one time.",
      "On the day, the numbers come straight from your collection system. No exports, no Excel.",
      "Finance gives the totals a quick OK, then every statement goes out on schedule.",
    ],
  },
  {
    id: "payment-posting",
    name: "Payment posting and reconciliation",
    blurb: "Every payment matched and posted. Nobody re-keys it.",
    steps: [
      {
        title: "Payments arrive",
        detail: "Portal, card processor and lockbox files, in whatever format they come.",
      },
      {
        title: "Matched to accounts",
        detail: "Each payment is matched to the right account and client.",
      },
      {
        title: "Posted and balanced",
        detail: "Posted in your collection system and checked against the deposit total.",
      },
      {
        title: "Exceptions flagged",
        detail: "Anything that does not match goes on a short list for your team.",
      },
    ],
    howWeAutomate: [
      "We read the payment files you already receive, so nobody types a payment in twice.",
      "Every posting is checked against the deposit, so the totals balance before anyone signs off.",
      "Only the payments that do not match reach a person, with the reason attached.",
    ],
  },
  {
    id: "placements",
    name: "Placement file intake",
    blurb: "New business loaded the morning it arrives.",
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
    howWeAutomate: [
      "We save each client's file layout once, so every new file is read the same way.",
      "Missing or wrong data is caught before it reaches your system, not after.",
      "Clean accounts load on their own. Your team only checks the short list of problems.",
    ],
  },
  {
    id: "disputes",
    name: "Dispute and validation paperwork",
    blurb: "No dispute sits unseen in an inbox.",
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
    howWeAutomate: [
      "We watch every place disputes arrive: mail, email, the portal and call notes.",
      "The moment one is found, contact on that account stops.",
      "Documents are gathered and a reply is drafted, ready for your team to approve before the deadline.",
    ],
  },
  {
    id: "compliance-qa",
    name: "Compliance review of consumer replies",
    blurb: "Every consumer reply is read, not a sample of them.",
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
    howWeAutomate: [
      "We connect to the SMS and email tools you already use, so every reply comes in on its own.",
      "We teach it your compliance rules: what counts as an opt-out, a dispute or a cease request.",
      "Anything risky stops contact at once and goes to your compliance lead to decide.",
    ],
    proof: { figure: "$7,500 / mo", label: "saved in legal fees at Compliance Ops, a collection agency" },
  },
];
