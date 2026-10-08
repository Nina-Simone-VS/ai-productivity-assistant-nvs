// Local, deterministic "AI" generators. Everything runs in the browser; nothing is sent anywhere.

export type Tone = "Formal" | "Friendly" | "Persuasive" | "Urgent";
export type Length = "Concise" | "Detailed";

export type Audience = "Client" | "Manager/Executive" | "Team/Colleagues";

export type PromptStructure = { role: string; context: string; task: string; constraints: string[] };

export const AUDIENCE_GUIDANCE: Record<Audience, string> = {
  Client: "External client: polished, service-oriented, value-focused; avoid internal jargon.",
  "Manager/Executive": "Senior leadership: lead with the bottom line, keep it brief, highlight impact and decisions needed.",
  "Team/Colleagues": "Internal peers: collaborative, direct and practical; clear owners and next steps.",
};

export function emailPrompt(i: { recipient: string; points: string; tone: Tone; length: Length; audience: Audience }): PromptStructure {
  return {
    role: "You are a professional workplace communication assistant.",
    context: `Recipient: ${i.recipient || "[recipient]"}. Audience: ${i.audience} — ${AUDIENCE_GUIDANCE[i.audience]} Tone: ${i.tone}. Length: ${i.length}.`,
    task: `Write an email with a clear subject line and a structured body covering these key points:\n${i.points || "[key points]"}`,
    constraints: [
      "Do not invent facts, figures, names or dates.",
      `Match the ${i.tone.toLowerCase()} tone and ${i.audience} expectations.`,
      i.length === "Concise" ? "Keep it short and scannable (bullets allowed)." : "Elaborate each point in its own paragraph.",
      "Flag anything the sender should verify before sending.",
    ],
  };
}

export function meetingPrompt(title: string, notes: string): PromptStructure {
  return {
    role: "You are an expert meeting analyst and note-taker.",
    context: `Meeting: ${title || "[untitled]"}. Raw notes/transcript of ${notes.split("\n").filter(Boolean).length} lines provided by the user.`,
    task: "Extract an executive summary, action items with owners, key decisions, and deadlines / next steps.",
    constraints: [
      "Only use information present in the notes — never infer owners or dates.",
      "Mark action items without a clear owner as 'Unassigned'.",
      "Keep the summary under 80 words.",
      "Return each section separately so the user can edit it.",
    ],
  };
}

export function plannerPrompt(dump: string, horizon: string, start: string, end: string): PromptStructure {
  return {
    role: "You are a productivity coach and scheduling assistant.",
    context: `Planning horizon: ${horizon}. Working hours: ${start}–${end}. Tasks: ${dump || "[brain dump]"}`,
    task: "Classify each task as High / Medium / Low priority (urgency × importance) and build a time-blocked schedule.",
    constraints: [
      "Respect any fixed times mentioned (e.g. 'at 10am').",
      "Sort strictly by priority, then by start time.",
      "Stay within working hours and leave short buffers between blocks.",
      "Never drop a task the user listed.",
    ],
  };
}

export const EMAIL_PROMPT_TEMPLATE = "";

const splitPoints = (text: string) =>
  text
    .split(/\n|;|(?<=\.)\s+/)
    .map((s) => s.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const trimDot = (s: string) => s.replace(/[.\s]+$/, "");

export function generateEmail(input: {
  recipient: string;
  points: string;
  tone: Tone;
  length: Length;
  audience?: Audience;
}): { subject: string; body: string } {
  const recipient = input.recipient.trim() || "Team";
  const name = (recipient.split(/[,(]/)[0] ?? recipient).trim();
  const points = splitPoints(input.points);
  const topic = points[0] ? trimDot(points[0]) : "a quick update";
  const short = topic.length > 48 ? topic.slice(0, 45).trim() + "…" : topic;

  const subjects: Record<Tone, string> = {
    Formal: `Regarding: ${cap(short)}`,
    Friendly: `Quick note: ${short}`,
    Persuasive: `An opportunity worth considering: ${short}`,
    Urgent: `Action required: ${cap(short)}`,
  };
  const greet: Record<Tone, string> = {
    Formal: `Dear ${name},`,
    Friendly: `Hi ${name},`,
    Persuasive: `Hi ${name},`,
    Urgent: `Hi ${name},`,
  };
  const open: Record<Tone, string> = {
    Formal: "I hope this message finds you well. I am writing to follow up on the following matters.",
    Friendly: "Hope your week is going well! I wanted to share a few quick things with you.",
    Persuasive: "I'd love to get your support on something I believe will make a real difference.",
    Urgent: "I need your attention on a time-sensitive matter, please.",
  };
  const close: Record<Tone, string> = {
    Formal: "Please let me know if you require any further information.\n\nKind regards,",
    Friendly: "Let me know what you think — happy to chat anytime!\n\nCheers,",
    Persuasive: "I'm confident this is worth it and would value 15 minutes to walk you through it. Would later this week work?\n\nBest regards,",
    Urgent: "Could you please confirm by end of day? Thank you for the quick turnaround.\n\nThanks,",
  };

  const audience = input.audience ?? "Team/Colleagues";
  const audienceLine: Record<Audience, string> = {
    Client: "Our priority is making sure this delivers clear value for you and your team.",
    "Manager/Executive": "Bottom line up front: here is what you need to know and any decision required from you.",
    "Team/Colleagues": "Here's a quick rundown so we're all on the same page.",
  };
  const signoff: Record<Audience, string> = {
    Client: "\nWe appreciate your partnership.",
    "Manager/Executive": "\nHappy to provide more detail if useful.",
    "Team/Colleagues": "",
  };
  const list = points.length ? points : ["Sharing a brief update and next steps."];
  let middle: string;
  if (input.length === "Concise") {
    middle = list.map((p) => `• ${cap(trimDot(p))}.`).join("\n");
  } else {
    const connectors = ["First,", "In addition,", "Furthermore,", "Finally,"];
    middle = list
      .map((p, i) => {
        const c = list.length === 1 ? "" : (i === list.length - 1 && i > 0 ? "Finally," : connectors[Math.min(i, 2)]) + " ";
        return `${c}${i === 0 && c ? trimDot(p) : cap(trimDot(p))}. ${detailFor(input.tone)}`;
      })
      .join("\n\n");
  }

  return {
    subject: subjects[input.tone],
    body: `${greet[input.tone]}\n\n${open[input.tone]} ${audienceLine[audience]}\n\n${middle}\n${signoff[audience]}\n\n${close[input.tone]}\n[Your name]`,
  };
}

function detailFor(tone: Tone) {
  return {
    Formal: "I would appreciate your review of this point at your earliest convenience.",
    Friendly: "Shout if anything here doesn't make sense.",
    Persuasive: "This directly supports our goals and keeps us ahead of schedule.",
    Urgent: "Delays here will affect downstream work.",
  }[tone];
}

/* ---------------- Meeting summarizer ---------------- */

export type ActionItem = { id: string; text: string; owner: string; done: boolean };
export type MeetingSummary = {
  summary: string;
  actions: ActionItem[];
  decisions: string[];
  deadlines: string[];
};

const DATE_RE =
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|eod|end of (day|week|month)|next week|\d{1,2}(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2})\b/i;

export function summarizeMeeting(title: string, notes: string): MeetingSummary {
  const lines = notes
    .split(/\n|(?<=[.!?])\s+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  const actions: ActionItem[] = [];
  const decisions: string[] = [];
  const deadlines: string[] = [];
  const topics: string[] = [];

  lines.forEach((raw, i) => {
    const m = raw.match(/^([A-Z][a-zA-Z]+)\s*:\s*(.*)$/);
    const speaker = m?.[1];
    const line: string = (m ? m[2] : raw) ?? raw;
    const lower = line.toLowerCase();

    if (/\b(decided|agreed|approved|we will go with|decision|consensus)\b/.test(lower)) {
      decisions.push(cap(trimDot(line.replace(/^(we\s+)?(decided|agreed)\s+(to|that)\s+/i, ""))));
    }
    const actionMatch =
      line.match(/\b(I'll|I will)\s+(.*)/i) ||
      line.match(/\b([A-Z][a-z]+)\s+(will|to|should|needs to)\s+(.*)/) ||
      line.match(/\baction( item)?:\s*(.*)/i);
    if (actionMatch) {
      let owner = "Unassigned";
      let text = line;
      if (/^(I'll|I will)$/i.test(actionMatch[1] ?? "")) {
        owner = speaker ?? "Unassigned";
        text = actionMatch[2] ?? line;
      } else if (actionMatch.length === 4 && !/^(We|It|This|That|They)$/.test(actionMatch[1] ?? "We")) {
        owner = actionMatch[1] ?? owner;
        text = actionMatch[3] ?? line;
      } else if (/action/i.test(actionMatch[0])) {
        text = actionMatch[actionMatch.length - 1] ?? line;
      }
      actions.push({ id: `a${i}`, text: cap(trimDot(text)), owner, done: false });
    }
    const d = line.match(DATE_RE);
    if (d) deadlines.push(`${cap(trimDot(line).slice(0, 70))}`);
    if (!actionMatch && topics.length < 4) topics.push(trimDot(line));
  });

  const summary = lines.length
    ? `${title || "The meeting"} covered ${topics.length} main discussion point${topics.length === 1 ? "" : "s"}: ${topics
        .slice(0, 3)
        .map((t) => t.charAt(0).toLowerCase() + t.slice(1))
        .join("; ")}. The group reached ${decisions.length} decision${decisions.length === 1 ? "" : "s"} and assigned ${actions.length} action item${actions.length === 1 ? "" : "s"}.`
    : "No notes provided.";

  return { summary, actions, decisions, deadlines: [...new Set(deadlines)] };
}

export const SAMPLE_TRANSCRIPT = `Sarah: Welcome everyone, this is the Q4 launch sync for the mobile app.
James: Beta feedback is mostly positive but onboarding is too long.
Sarah: We agreed to cut onboarding from five screens down to three.
Priya: The payment integration is blocked on API keys from finance.
James will chase finance for the API keys by Wednesday.
Priya: I'll update the onboarding designs and share them Friday.
Sarah: Marketing wants the launch date confirmed. We decided to launch on 14 November.
Tom: QA needs two full days for regression testing.
Tom will draft the regression test plan by next week.
Sarah: Action item: send the stakeholder update by end of day.`;

/* ---------------- Task planner ---------------- */

export type Priority = "High" | "Medium" | "Low";
export type PlannedTask = {
  id: string;
  title: string;
  priority: Priority;
  start: string;
  end: string;
  day?: string;
  done: boolean;
  fixed: boolean;
};

const PRIORITY_RANK: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

export function classifyPriority(task: string): Priority {
  const t = task.toLowerCase();
  if (/\b(urgent|asap|client|deadline|due|today|critical|boss|ceo|outage|bug|fix|submit|invoice|prep|present)/.test(t)) return "High";
  if (/\b(review|pr|sync|meeting|call|reply|plan|update|draft|1:1|standup|interview)\b/.test(t)) return "Medium";
  return "Low";
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m || 0);
};
const fmt = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

function parseFixedTime(task: string): number | null {
  const m = task.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b|\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (!m) return null;
  let h = Number(m[1] ?? m[4]);
  const min = Number(m[2] ?? m[5] ?? 0);
  const ap = (m[3] ?? m[6])?.toLowerCase();
  if (ap === "pm" && h < 12) h += 12;
  if (ap === "am" && h === 12) h = 0;
  if (!ap && h < 8) h += 12;
  return h * 60 + min;
}

const DURATION: Record<Priority, number> = { High: 60, Medium: 45, Low: 30 };

/** Sort strictly by priority (High → Medium → Low), then by start time. */
export function sortByPriority(tasks: PlannedTask[]): PlannedTask[] {
  return [...tasks].sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || toMin(a.start) - toMin(b.start),
  );
}

export function planTasks(
  dump: string,
  horizon: "Daily" | "Weekly",
  workStart: string,
  workEnd: string,
): PlannedTask[] {
  const items = dump
    .split(/,|\n|;/)
    .map((s) => s.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);

  const tasks = items.map((title, i) => ({
    id: `t${i}`,
    title: cap(title),
    priority: classifyPriority(title),
    fixedAt: parseFixedTime(title),
  }));

  const startMin = toMin(workStart);
  const endMin = toMin(workEnd);

  if (horizon === "Weekly") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const ordered = [...tasks].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
    return sortByPriority(
      ordered.map((t, i) => {
        const s = startMin + (i % 3) * 90;
        return {
          id: t.id,
          title: t.title,
          priority: t.priority,
          day: days[Math.floor(i / 3) % 5] ?? "Mon",
          start: fmt(s),
          end: fmt(Math.min(s + DURATION[t.priority], endMin)),
          done: false,
          fixed: false,
        };
      }),
    );
  }

  const busy: [number, number][] = [];
  const result: PlannedTask[] = [];
  tasks
    .filter((t) => t.fixedAt !== null)
    .forEach((t) => {
      const s = t.fixedAt!;
      const e = s + 60;
      busy.push([s, e]);
      result.push({ id: t.id, title: t.title, priority: t.priority, start: fmt(s), end: fmt(e), done: false, fixed: true });
    });

  let cursor = startMin;
  tasks
    .filter((t) => t.fixedAt === null)
    .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
    .forEach((t) => {
      const dur = DURATION[t.priority];
      let moved = true;
      while (moved) {
        moved = false;
        for (const [bs, be] of busy) {
          if (cursor < be && cursor + dur > bs) {
            cursor = be;
            moved = true;
          }
        }
      }
      const s = Math.min(cursor, Math.max(endMin - dur, startMin));
      busy.push([s, s + dur]);
      result.push({ id: t.id, title: t.title, priority: t.priority, start: fmt(s), end: fmt(s + dur), done: false, fixed: false });
      cursor = s + dur + 15;
    });

  return sortByPriority(result);
}

export const SAMPLE_TASKS =
  "Prep slides for client pitch at 2pm, reply to client email about invoice, review code PR, team sync at 10am, update project roadmap, book flights for conference, clean up inbox";
