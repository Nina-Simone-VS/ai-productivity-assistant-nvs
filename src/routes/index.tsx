import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Lock, Layers, Mail, NotebookPen, ListChecks, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate routine communication, extract meeting insights, and prioritize your schedule." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Draft emails, summarize meetings and plan your day with a responsible AI assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Turn a few bullet points into a polished email in the right tone." },
  { to: "/meetings", icon: NotebookPen, title: "Meeting Notes Summarizer", desc: "Extract summaries, decisions, owners and deadlines from raw notes." },
  { to: "/planner", icon: ListChecks, title: "AI Task Planner", desc: "Turn a messy brain dump into a prioritized, time-blocked plan." },
] as const;

const METRICS = [
  { icon: Clock, value: "8.5h", label: "Avg. weekly hours saved" },
  { icon: Lock, value: "100%", label: "Editable & private workspace" },
  { icon: Layers, value: "3-in-1", label: "Integrated productivity workflow" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-hero p-8 text-primary-foreground shadow-lift animate-fade-up md:p-12">
        <Leaf className="absolute -right-6 -bottom-8 size-56 rotate-12 opacity-10" />
        <p className="mb-3 inline-flex rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">Good to see you</p>
        <h1 className="max-w-xl text-3xl font-bold tracking-tight md:text-5xl">Your AI Workplace Assistant</h1>
        <p className="mt-3 max-w-lg text-primary-foreground/85 md:text-lg">
          Automate routine communication, extract meeting insights, and prioritize your schedule.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {TOOLS.map((t) => (
            <Button key={t.to} asChild variant="secondary" className="rounded-full">
              <Link to={t.to}>
                <t.icon /> {t.title.replace("Smart ", "").replace("Meeting Notes ", "Meeting ")}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {METRICS.map((m, i) => (
          <div key={m.label} className="rounded-2xl border bg-card p-5 shadow-soft animate-fade-up" style={{ animationDelay: `${80 * i}ms` }}>
            <m.icon className="mb-3 size-5 text-primary" />
            <p className="text-3xl font-bold tracking-tight">{m.value}</p>
            <p className="text-sm text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Productivity tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TOOLS.map((t, i) => (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-2xl border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift animate-fade-up"
              style={{ animationDelay: `${120 + 80 * i}ms` }}
            >
              <div className="mb-4 grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <t.icon className="size-5" />
              </div>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open tool <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
