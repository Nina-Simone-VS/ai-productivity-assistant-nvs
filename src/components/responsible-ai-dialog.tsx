import { ShieldCheck, UserCheck, Lock, Scale, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PRINCIPLES = [
  { icon: UserCheck, title: "Human-in-the-loop", text: "All generated text is 100% editable. You review and approve everything before sharing." },
  { icon: Lock, title: "Data privacy", text: "Inputs are kept in local browser state only and are never stored or sent externally." },
  { icon: AlertTriangle, title: "Hallucination warning", text: "AI can be confidently wrong. Always verify dates, names, facts and action items." },
  { icon: Scale, title: "Bias awareness", text: "Check tone and wording for assumptions about people, roles or cultures before sending." },
];

export function ResponsibleAIDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="mb-2 grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <DialogTitle>Responsible AI Principles</DialogTitle>
          <DialogDescription>How this assistant keeps you in control.</DialogDescription>
        </DialogHeader>
        <ul className="mt-2 space-y-3">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="flex gap-3 rounded-xl border bg-secondary/60 p-3.5">
              <p.icon className="mt-0.5 size-4.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
