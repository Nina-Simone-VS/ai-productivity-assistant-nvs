import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, ArrowDownUp, Pin } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyOutput, ExampleButton, Field, GenerateButton, PageHeader, Pane, PromptAccordion, Segmented, fakeLatency } from "@/components/workspace";
import { SAMPLE_TASKS, planTasks, plannerPrompt, sortByPriority, type PlannedTask, type Priority } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      { name: "description", content: "Turn a brain dump into a prioritized, time-blocked schedule." },
      { property: "og:title", content: "AI Task Planner — Workplace AI" },
      { property: "og:description", content: "Prioritize tasks by urgency and importance with a time-blocked plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const BADGE: Record<Priority, string> = {
  High: "bg-prio-high text-prio-high-foreground",
  Medium: "bg-prio-med text-prio-med-foreground",
  Low: "bg-prio-low text-prio-low-foreground",
};
const PRIORITIES: Priority[] = ["High", "Medium", "Low"];
const HORIZONS = ["Daily Schedule", "Weekly Priorities"] as const;

function PlannerPage() {
  const [dump, setDump] = useState("");
  const [horizon, setHorizon] = useState<(typeof HORIZONS)[number]>("Daily Schedule");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<PlannedTask[]>([]);

  const run = async () => {
    if (!dump.trim()) { toast.error("List a few tasks first."); return; }
    setLoading(true);
    await fakeLatency();
    setTasks(planTasks(dump, horizon === "Daily Schedule" ? "Daily" : "Weekly", start, end));
    setLoading(false);
    toast.success("Plan generated — adjust as needed.");
  };

  const update = (id: string, patch: Partial<PlannedTask>) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader icon={<ListChecks className="size-5" />} title="AI Task Planner" description="Dump everything on your mind — get a prioritized plan." />
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <Pane title="Input" action={<ExampleButton onClick={() => setDump(SAMPLE_TASKS)} />}>
          <div className="space-y-5">
            <Field label="Brain dump">
              <Textarea rows={8} value={dump} onChange={(e) => setDump(e.target.value)} placeholder="Prep slides for 2pm, reply to client email, review code PR, team sync at 10am" />
            </Field>
            <Field label="Planning horizon">
              <Segmented options={HORIZONS} value={horizon} onChange={setHorizon} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Work starts"><Input type="time" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
              <Field label="Work ends"><Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
            </div>
            <GenerateButton loading={loading} onClick={run}>Generate Prioritized Plan</GenerateButton>
          </div>
        </Pane>

        <Pane
          title={tasks.length ? `Plan · ${doneCount}/${tasks.length} done` : "Plan"}
          action={tasks.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => { setTasks(sortByPriority(tasks)); toast("Re-sorted by priority"); }}>
              <ArrowDownUp /> Re-sort
            </Button>
          )}
        >
          {tasks.length ? (
            <ol className="relative space-y-3 border-l-2 border-border pl-5">
              {tasks.map((t) => (
                <li key={t.id} className="relative animate-fade-up">
                  <span className={cn("absolute top-5 -left-[27px] size-3 rounded-full border-2 border-card", t.done ? "bg-muted-foreground" : "bg-primary-glow")} />
                  <div className={cn("flex items-center gap-3 rounded-xl border bg-background p-3.5 transition-opacity", t.done && "opacity-60")}>
                    <Checkbox checked={t.done} onCheckedChange={(v) => update(t.id, { done: !!v })} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        {t.day && <span className="font-sans font-semibold text-foreground">{t.day}</span>}
                        {t.start} – {t.end}
                        {t.fixed && <Pin className="size-3" />}
                      </p>
                      <input
                        value={t.title}
                        onChange={(e) => update(t.id, { title: e.target.value })}
                        className={cn("w-full rounded-md bg-transparent px-1 py-0.5 text-sm font-medium outline-none focus:bg-secondary", t.done && "line-through")}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Change priority (${t.priority})`}
                        className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-shadow hover:shadow-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", BADGE[t.priority])}
                      >
                        {t.priority} <ChevronDown className="size-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-32">
                        {PRIORITIES.map((p) => (
                          <DropdownMenuItem key={p} onSelect={() => { update(t.id, { priority: p }); toast(`Priority set to ${p}`); }}>
                            <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", BADGE[p])}>{p}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyOutput text="Your prioritized, time-blocked plan will appear here." />
          )}
          {tasks.length > 0 && (
            <div className="mt-5 rounded-xl border border-primary/15 bg-accent/60 p-4 animate-fade-up">
              <h3 className="mb-2 text-sm font-semibold text-accent-foreground">💡 Time Optimization Strategy</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/80">
                <li>Tackle your {tasks.filter((t) => t.priority === "High").length || "most"} high-impact task{tasks.filter((t) => t.priority === "High").length === 1 ? "" : "s"} early, while focus and energy are at their peak.</li>
                <li>Batch your {tasks.filter((t) => t.priority === "Low").length || "small"} low-priority task{tasks.filter((t) => t.priority === "Low").length === 1 ? "" : "s"} into one block late in the day to cut down on context switching.</li>
              </ul>
            </div>
          )}
          <PromptAccordion prompt={plannerPrompt(dump, horizon, start, end)} />
        </Pane>
      </div>
    </div>
  );
}
