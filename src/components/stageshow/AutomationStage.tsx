"use client";

import { useEffect, useMemo, useRef } from "react";
import { FileSpreadsheet, CalendarClock, MessageSquareText, ScanText, NotebookPen } from "lucide-react";
// Direct imports (not the kit barrel) so only these parts and their CSS ship.
import { Stage } from "./kit/stage";
import type { Act } from "./kit/act";
import { Bar } from "./kit/bar";
import { Badge } from "./kit/controls/Badge";
import { Avatar } from "./kit/parts/Avatar";
import { Check } from "./kit/parts/Check";
import { Row } from "./kit/parts/Row";
import { Collapse } from "./kit/motion/Collapse";
import { Connector } from "./kit/motion/Connector";
import { Count } from "./kit/motion/Count";
import { Roll } from "./kit/motion/Roll";
import "./automation-stage.css";

/**
 * One cursorless system story, told five ways: something arrives, the AI reads
 * it, it is routed to the right queue, and the outcome is recorded.
 * Built on the stageshow kit, starting from its `payout-flow` example.
 * All names and figures are illustrative sample data.
 */

export interface AutomationScene {
  /** What arrived, and what it says */
  source: string;
  icon: "sms" | "file" | "schedule" | "scan" | "note";
  body: string;
  /** What the AI picked out of it */
  found: [string, string];
  /** Where it went */
  queue: string;
  record: string;
  before: string;
  after: string;
  /** The one figure that changes */
  countLabel: string;
  countFrom: number;
  countTo: number;
  note: string;
}

export const AUTOMATION_SCENES: Record<string, AutomationScene> = {
  "compliance-qa": {
    source: "SMS reply",
    icon: "sms",
    body: "Stop texting me. I already said this is not my debt.",
    found: ["Opt-out", "Dispute"],
    queue: "Compliance queue",
    record: "Acct ···4821",
    before: "Needs review",
    after: "Contact paused",
    countLabel: "Replies read today",
    countFrom: 1186,
    countTo: 1187,
    note: "Decision and reason saved",
  },
  placements: {
    source: "Placement file",
    icon: "file",
    body: "northside_medical_nov.xlsx, 1,204 accounts in the client's own layout.",
    found: ["Columns mapped", "12 exceptions"],
    queue: "Ready to work",
    record: "Northside Medical",
    before: "Importing",
    after: "Loaded",
    countLabel: "Accounts loaded",
    countFrom: 0,
    countTo: 1192,
    note: "12 exceptions sent for review",
  },
  "client-reporting": {
    source: "Month-end schedule",
    icon: "schedule",
    body: "Remittance statements for November, one per client agreement.",
    found: ["14 clients", "Totals approved"],
    queue: "Sent to clients",
    record: "Northside Medical",
    before: "Building",
    after: "Sent",
    countLabel: "Statements sent",
    countFrom: 0,
    countTo: 14,
    note: "Filed in each client folder",
  },
  disputes: {
    source: "Letter scan",
    icon: "scan",
    body: "I dispute this debt and request validation of the amount owed.",
    found: ["Dispute", "Validation request"],
    queue: "Awaiting approval",
    record: "Acct ···2207",
    before: "Drafting",
    after: "To approve",
    countLabel: "Accounts paused",
    countFrom: 3,
    countTo: 4,
    note: "Outreach stopped while open",
  },
  "payment-posting": {
    source: "Card processor file",
    icon: "file",
    body: "card_batch_1120.csv, 342 payments from the portal and card processor.",
    found: ["340 matched", "2 exceptions"],
    queue: "Posted and balanced",
    record: "Batch 11/20",
    before: "Matching",
    after: "Posted",
    countLabel: "Payments posted",
    countFrom: 0,
    countTo: 340,
    note: "2 exceptions sent for review",
  },
};

const ICONS = {
  sms: MessageSquareText,
  file: FileSpreadsheet,
  schedule: CalendarClock,
  scan: ScanText,
  note: NotebookPen,
};

type S = { step: number };
const START: S = { step: 0 };
const FILLER = [58, 44, 66, 50];

const FONT = 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export default function AutomationStage({
  scene,
  onStep,
  onDone,
}: {
  scene: AutomationScene;
  /** Called as each of the four beats begins (1 to 4), and with 0 on a restart. */
  onStep?: (step: number) => void;
  onDone?: () => void;
}) {
  // The script is created once; it reads the latest callbacks through a ref.
  const cb = useRef({ onStep, onDone });
  useEffect(() => {
    cb.current = { onStep, onDone };
  });

  const script = useMemo(
    () => async (a: Act<S>) => {
      cb.current.onStep?.(0);
      await a.wait(350);
      a.mark("arrives");
      cb.current.onStep?.(1);
      a.put({ step: 1 }); // the item rises in
      await a.wait(1200);
      a.mark("read");
      cb.current.onStep?.(2);
      a.put({ step: 2 }); // what the AI found, one tag after the other
      await a.wait(1400);
      a.mark("routed");
      cb.current.onStep?.(3);
      a.put({ step: 3 }); // the line draws to the queue and its row opens
      await a.wait(1500);
      a.mark("logged");
      cb.current.onStep?.(4);
      a.put({ step: 4 }); // the status settles, the count rolls, the log line is written
      await a.wait(1200);
      cb.current.onDone?.();
    },
    []
  );

  const Glyph = ICONS[scene.icon];

  return (
    <Stage<S>
      width={640}
      height={231}
      compact={{ below: 560, width: 358, height: 452 }}
      initial={START}
      play="once"
      poster={{ step: 4 }}
      script={script}
      accent="#FF731E"
      tokens={{ "--ss-font": FONT }}
      className="jxa"
    >
      {(s, rect, layout) => {
        const compact = layout === "compact";
        const item = rect("item");
        const row = rect("record");
        const queue = rect("queue");
        return (
          <>
            {/* What arrived */}
            <section className="jxa-item" data-target="item" data-in={s.step >= 1 || undefined}>
              <div className="jxa-item__head">
                <span className="jxa-item__mark">
                  <Glyph size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                </span>
                <span className="jxa-strong">{scene.source}</span>
                <span className="jxa-muted jxa-item__time">just now</span>
              </div>
              <p className="jxa-item__body">{scene.body}</p>
              <div className="jxa-found">
                <span className="jxa-muted">Found</span>
                <span className="jxa-found__tags">
                  {scene.found.map((tag, i) => (
                    <span
                      key={tag}
                      className="jxa-tag"
                      data-in={s.step >= 2 || undefined}
                      style={{ transitionDelay: s.step >= 2 ? `${i * 160}ms` : "0ms" }}
                    >
                      <Badge tone={i === 0 ? "warning" : "neutral"}>{tag}</Badge>
                    </span>
                  ))}
                </span>
              </div>
              {/* The record of what was decided, written last */}
              <div className="jxa-log" data-in={s.step >= 4 || undefined}>
                <Check on={s.step >= 4} size={14} />
                <span>{scene.note}</span>
              </div>
            </section>

            {/* Where it goes: a queue that runs past the stage's foot */}
            <section className="jxa-queue" data-target="queue" data-in={s.step >= 1 || undefined}>
              <div className="jxa-queue__head">
                <div>
                  <div className="jxa-strong">{scene.queue}</div>
                  <div className="jxa-muted">{scene.countLabel}</div>
                </div>
                <Count
                  className="jxa-count"
                  value={s.step >= 4 ? scene.countTo : scene.countFrom}
                  duration={900}
                />
              </div>

              <Collapse open={s.step >= 3}>
                <Row
                  data-target="record"
                  className="jxa-record"
                  lead={<Avatar name={scene.record} tone="accent" size={22} />}
                  title={scene.record}
                >
                  <Badge tone={s.step >= 4 ? "success" : "neutral"}>
                    <Roll variant="fade">{s.step >= 4 ? scene.after : scene.before}</Roll>
                  </Badge>
                </Row>
              </Collapse>

              {FILLER.map((w, i) => (
                <Row
                  key={i}
                  lead={<Avatar plain size={22} />}
                  title={<Bar w={w} h={6} tone={3} />}
                >
                  <Bar w={i % 2 ? 46 : 38} h={6} tone={2} />
                </Row>
              ))}
            </section>

            {item.width > 0 && row.width > 0 && (
              <Connector
                show={s.step >= 3}
                from={
                  compact
                    ? { x: item.x + 44, y: item.y + item.height + 4 }
                    : { x: item.x + item.width + 6, y: row.y + row.height / 2 }
                }
                to={
                  compact
                    ? { x: item.x + 44, y: queue.y - 5 }
                    : { x: row.x - 6, y: row.y + row.height / 2 }
                }
                route={compact ? "v" : "straight"}
              />
            )}
          </>
        );
      }}
    </Stage>
  );
}
