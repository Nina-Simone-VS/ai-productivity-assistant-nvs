import { Loader2, Sparkles, Wand2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3 animate-fade-up">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">{icon}</div>
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function Pane({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 shadow-soft animate-fade-up md:p-6", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-full bg-secondary p-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
            value === o ? "bg-card text-primary shadow-soft" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function GenerateButton({ loading, children, onClick }: { loading: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <Button size="lg" className="w-full rounded-xl" disabled={loading} onClick={onClick}>
      {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
      {loading ? "Thinking…" : children}
    </Button>
  );
}

export function ExampleButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" className="rounded-full" onClick={onClick}>
      <Wand2 /> Load Example Data
    </Button>
  );
}

export function EmptyOutput({ text }: { text: string }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-xl border border-dashed bg-secondary/40 p-8 text-center">
      <div>
        <Sparkles className="mx-auto mb-3 size-6 text-primary-glow" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export const fakeLatency = () => new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
