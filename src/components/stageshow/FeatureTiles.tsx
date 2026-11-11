"use client";

import type { ReactNode } from "react";
import { Database, PhoneCall, MessagesSquare, CreditCard } from "lucide-react";
import {
  Stage,
  Bar,
  Badge,
  Card,
  Check,
  Connector,
  Count,
  Meter,
  Roll,
  Row,
  Avatar,
  Toggle,
  Window,
  type Act,
} from "./kit";
import "./feature-tiles.css";

/**
 * Small product illustrations for the Services and Why Jupitex cards, built on
 * the stageshow kit. Each is one picture with one change: it plays while the
 * card is hovered and settles back after (on phones it plays once in view).
 * All names and figures are illustrative.
 */

export type TileName = "audit" | "build" | "team" | "integrations" | "numbers" | "handover";

type S = { on: boolean };
const REST: S = { on: false };
const FONT = 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const script = async (a: Act<S>) => {
  await a.wait(180);
  a.put({ on: true });
  await a.wait(1600);
};

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/* 1. AI transformation: the audit ranks what is worth automating */
function AuditTile(s: S) {
  const rows = [
    { name: "Compliance QA", value: 0.86 },
    { name: "Placement intake", value: 0.62 },
    { name: "Client reports", value: 0.44 },
  ];
  return (
    <Card className="jxt-card jxt-card--foot" lift pad="medium" gap={0}>
      <div className="jxt-head">
        <span className="jxt-strong">Audit findings</span>
        <Badge tone={s.on ? "accent" : "neutral"}>
          <Roll variant="fade">{s.on ? "Ranked by return" : "Reviewing"}</Roll>
        </Badge>
      </div>
      {rows.map((r, i) => (
        <div key={r.name} className="jxt-line">
          <span>{r.name}</span>
          <Meter
            value={s.on ? r.value : 0.08}
            tone={i === 0 ? "accent" : "ink"}
            className="jxt-meter"
            style={{ transitionDelay: s.on ? `${i * 110}ms` : "0ms" }}
          />
        </div>
      ))}
      <div className="jxt-line">
        <Bar w={84} h={6} tone={3} />
        <Bar w={120} h={6} tone={2} />
      </div>
    </Card>
  );
}

/* 2. Full-stack development: a tool built around the agency's own work */
function BuildTile(s: S) {
  return (
    <Window
      title="Exceptions"
      className="jxt-window"
      sidebarWidth={64}
      sidebar={
        <div className="jxt-side">
          <Bar w={36} h={6} tone={3} />
          <Bar w={28} h={6} tone={2} />
          <Bar w={40} h={6} tone={2} />
          <Bar w={30} h={6} tone={2} />
        </div>
      }
    >
      <div className="jxt-pane">
        <div className="jxt-pane__head">
          <span className="jxt-muted">Open</span>
          <Count className="jxt-figure" value={s.on ? 11 : 12} duration={600} />
        </div>
        <Row
          className="jxt-row"
          pad={8}
          lead={<Check on={s.on} size={16} />}
          title="Missing birth date"
        >
          <Badge tone={s.on ? "success" : "neutral"}>
            <Roll variant="fade">{s.on ? "Fixed" : "Review"}</Roll>
          </Badge>
        </Row>
        {[64, 52, 72].map((w, i) => (
          <Row key={i} pad={8} lead={<Check on={false} size={16} />} title={<Bar w={w} h={6} tone={3} />}>
            <Bar w={34} h={6} tone={2} />
          </Row>
        ))}
      </div>
    </Window>
  );
}

/* 3. Staff augmentation: someone joins the team and is working on day one */
function TeamTile(s: S) {
  return (
    <Card className="jxt-card jxt-card--foot" lift pad="small" gap={0}>
      <div className="jxt-head jxt-head--pad">
        <span className="jxt-strong">Your team</span>
        <Count className="jxt-figure" value={s.on ? 5 : 4} duration={500} />
      </div>
      <Row
        className="jxt-row jxt-row--new"
        pad={8}
        lead={
          <span className="jxt-seat" data-on={s.on || undefined}>
            <Avatar name="AI engineer" tone="accent" size={24} />
          </span>
        }
        title="AI engineer"
      >
        <Badge tone={s.on ? "success" : "neutral"}>
          <Roll variant="fade">{s.on ? "Day one" : "Open role"}</Roll>
        </Badge>
      </Row>
      {[70, 56, 78].map((w, i) => (
        <Row key={i} pad={8} lead={<Avatar plain size={24} />} title={<Bar w={w} h={6} tone={3} />}>
          <Bar w={i % 2 ? 44 : 36} h={6} tone={2} />
        </Row>
      ))}
    </Card>
  );
}

/* 4. Integrations: built around the systems already in place */
const NODE_W = 150;
const NODE_H = 36;
const HUB = { x: 183, y: 120, r: 26 };
const NODES: { label: string; icon: ReactNode; x: number; y: number }[] = [
  { label: "Collection system", icon: <Database size={14} strokeWidth={1.5} absoluteStrokeWidth />, x: 24, y: 28 },
  { label: "SMS and email", icon: <MessagesSquare size={14} strokeWidth={1.5} absoluteStrokeWidth />, x: 192, y: 28 },
  { label: "Dialer", icon: <PhoneCall size={14} strokeWidth={1.5} absoluteStrokeWidth />, x: 24, y: 176 },
  { label: "Payments", icon: <CreditCard size={14} strokeWidth={1.5} absoluteStrokeWidth />, x: 192, y: 176 },
];

function IntegrationsTile(s: S) {
  return (
    <>
      {NODES.map((n) => {
        const above = n.y < HUB.y;
        const left = n.x < HUB.x;
        return (
          <Connector
            key={n.label}
            show
            route="straight"
            dots="none"
            from={{ x: n.x + NODE_W / 2 + (left ? 30 : -30), y: above ? n.y + NODE_H : n.y }}
            to={{ x: HUB.x + (left ? -14 : 14), y: HUB.y + (above ? -HUB.r + 4 : HUB.r - 4) }}
          />
        );
      })}
      {NODES.map((n, i) => (
        <div
          key={n.label}
          className="jxt-node"
          data-on={s.on || undefined}
          style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H, transitionDelay: s.on ? `${i * 90}ms` : "0ms" }}
        >
          <span className="jxt-node__icon">{n.icon}</span>
          <span>{n.label}</span>
        </div>
      ))}
      <div className="jxt-hub" data-on={s.on || undefined} style={{ left: HUB.x - HUB.r, top: HUB.y - HUB.r }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/JupitexLogos/tab-logo-dark.png" alt="" width={24} height={24} />
      </div>
    </>
  );
}

/* 5. The numbers come first: cost, saving and timeline before any build */
function NumbersTile(s: S) {
  return (
    <Card className="jxt-card jxt-card--quote" lift pad="medium" gap={0}>
      <div className="jxt-head">
        <span className="jxt-strong">Before we build</span>
        <Badge tone={s.on ? "success" : "neutral"}>
          <Roll variant="fade">{s.on ? "Approved by you" : "Your quote"}</Roll>
        </Badge>
      </div>
      <div className="jxt-saves">
        <span className="jxt-muted">Saves per year</span>
        <Count className="jxt-figure jxt-figure--lg" value={64000} format={usd} />
      </div>
      <div className="jxt-line">
        <span className="jxt-muted">Build cost</span>
        <span>Fixed quote</span>
      </div>
      <div className="jxt-line">
        <span className="jxt-muted">First pilot</span>
        <span>In weeks</span>
      </div>
    </Card>
  );
}

/* 6. Your team owns it: the handover */
function HandoverTile(s: S) {
  return (
    <Card className="jxt-card jxt-card--foot" lift pad="medium" gap={0}>
      <div className="jxt-head">
        <span className="jxt-strong">Message review</span>
        <Toggle on />
      </div>
      <div className="jxt-line">
        <span className="jxt-muted">Run by</span>
        <span className="jxt-strong">
          <Roll>{s.on ? "Your team" : "Jupitex"}</Roll>
        </span>
      </div>
      {["Team trained", "Rules documented", "Sign-offs in place"].map((label, i) => (
        <div key={label} className="jxt-line jxt-line--check">
          <span style={{ transitionDelay: `${i * 140}ms` }} className="jxt-delay">
            <Check on={s.on} size={16} />
          </span>
          <span>{label}</span>
        </div>
      ))}
    </Card>
  );
}

const TILES: Record<TileName, (s: S) => ReactNode> = {
  audit: AuditTile,
  build: BuildTile,
  team: TeamTile,
  integrations: IntegrationsTile,
  numbers: NumbersTile,
  handover: HandoverTile,
};

export default function FeatureTile({ name }: { name: TileName }) {
  return (
    <Stage<S>
      width={366}
      height={240}
      initial={REST}
      play="hover"
      poster={{ on: true }}
      script={script}
      accent="#FF731E"
      tokens={{ "--ss-font": FONT }}
      className={`jxt jxt--${name}`}
    >
      {(s) => TILES[name](s)}
    </Stage>
  );
}
