import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPen, Download, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyOutput, ExampleButton, Field, GenerateButton, PageHeader, Pane, fakeLatency } from "@/components/workspace";
import { SAMPLE_TRANSCRIPT, summarizeMeeting, type MeetingSummary } from "@/lib/mock-ai";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      { name: "description", content: "Extract summaries, action items, decisions and deadlines from meeting notes." },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      { property: "og:description", content: "Turn raw transcripts into clear, editable meeting summaries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingsPage,
});

function Card({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <h3 className="mb-2.5 text-sm font-semibold">{emoji} {title}</h3>
      {children}
    </div>
  );
}

function MeetingsPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<MeetingSummary | null>(null);

  const loadSample = () => {
    setTitle("Q4 Mobile Launch Sync");
    setDate(new Date().toISOString().slice(0, 10));
    setNotes(SAMPLE_TRANSCRIPT);
  };

  const run = async () => {
    if (!notes.trim()) { toast.error("Paste some notes or load the sample transcript."); return; }
    setLoading(true);
    await fakeLatency();
    setOut(summarizeMeeting(title, notes));
    setLoading(false);
    toast.success("Summary extracted — verify owners and dates.");
  };

  const exportMd = () => {
    if (!out) return;
    const md = [
      `# ${title || "Meeting"}${date ? ` (${date})` : ""}`,
      `\n## Executive Summary\n${out.summary}`,
      `\n## Action Items\n${out.actions.map((a) => `- [${a.done ? "x" : " "}] ${a.text} — ${a.owner}`).join("\n")}`,
      `\n## Key Decisions\n${out.decisions.map((d) => `- ${d}`).join("\n")}`,
      `\n## Deadlines & Next Steps\n${out.deadlines.map((d) => `- ${d}`).join("\n")}`,
    ].join("\n");
    navigator.clipboard.writeText(md);
    toast.success("Summary copied as Markdown");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader icon={<NotebookPen className="size-5" />} title="Meeting Notes Summarizer" description="Paste raw notes — get decisions, owners and deadlines." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Pane title="Input" action={<ExampleButton onClick={loadSample} />}>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <Field label="Meeting title">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Weekly product sync" />
              </Field>
              <Field label="Date">
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
            </div>
            <Field label="Raw notes / transcript">
              <Textarea rows={12} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your meeting notes or transcript here…" />
            </Field>
            <Button variant="outline" size="sm" onClick={loadSample}><FileText /> Load Sample Transcript</Button>
            <GenerateButton loading={loading} onClick={run}>Summarize & Extract</GenerateButton>
          </div>
        </Pane>

        <Pane
          title="Insights"
          action={out && (
            <div className="flex gap-2">
              <Button size="sm" onClick={exportMd}><Download /> Export Summary</Button>
              <Button size="sm" variant="ghost" onClick={() => setOut(null)}><Trash2 /></Button>
            </div>
          )}
        >
          {out ? (
            <div className="space-y-4">
              <Card emoji="📌" title="Executive Summary">
                <Textarea rows={4} value={out.summary} onChange={(e) => setOut({ ...out, summary: e.target.value })} />
              </Card>
              <Card emoji="✅" title="Action Items & Owners">
                {out.actions.length === 0 && <p className="text-sm text-muted-foreground">None found.</p>}
                <ul className="space-y-2">
                  {out.actions.map((a) => (
                    <li key={a.id} className="flex items-center gap-2.5">
                      <Checkbox
                        checked={a.done}
                        onCheckedChange={(v) => setOut({ ...out, actions: out.actions.map((x) => (x.id === a.id ? { ...x, done: !!v } : x)) })}
                      />
                      <input
                        value={a.text}
                        onChange={(e) => setOut({ ...out, actions: out.actions.map((x) => (x.id === a.id ? { ...x, text: e.target.value } : x)) })}
                        className={`min-w-0 flex-1 rounded-md bg-transparent px-1 py-0.5 text-sm outline-none focus:bg-secondary ${a.done ? "text-muted-foreground line-through" : ""}`}
                      />
                      <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">{a.owner}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card emoji="⚖️" title="Key Decisions">
                {out.decisions.length === 0 ? <p className="text-sm text-muted-foreground">None found.</p> : (
                  <ul className="list-disc space-y-1 pl-5 text-sm">{out.decisions.map((d, i) => <li key={i}>{d}</li>)}</ul>
                )}
              </Card>
              <Card emoji="⏰" title="Deadlines & Next Steps">
                <div className="flex flex-wrap gap-2">
                  {out.deadlines.length === 0 && <p className="text-sm text-muted-foreground">None found.</p>}
                  {out.deadlines.map((d, i) => (
                    <span key={i} className="rounded-full bg-warning px-3 py-1 text-xs font-medium text-warning-foreground">{d}</span>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <EmptyOutput text="Summary, action items, decisions and deadlines will appear here." />
          )}
        </Pane>
      </div>
    </div>
  );
}
