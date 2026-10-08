import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Mail, RotateCcw, Trash2, Code2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EmptyOutput, ExampleButton, Field, GenerateButton, PageHeader, Pane, Segmented, fakeLatency } from "@/components/workspace";
import { EMAIL_PROMPT_TEMPLATE, generateEmail, type Length, type Tone } from "@/lib/mock-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      { name: "description", content: "Draft professional emails in any tone from a few key points." },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      { property: "og:description", content: "Turn bullet points into polished, editable emails in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive", "Urgent"] as const;
const LENGTHS = ["Concise", "Detailed"] as const;

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [length, setLength] = useState<Length>("Concise");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!points.trim()) return toast.error("Add a few key points first.");
    setLoading(true);
    await fakeLatency();
    const r = generateEmail({ recipient, points, tone, length });
    setSubject(r.subject);
    setBody(r.body);
    setLoading(false);
    toast.success("Draft ready — please review before sending.");
  };

  const prompt = EMAIL_PROMPT_TEMPLATE.replace("{recipient}", recipient || "[recipient]")
    .replace("{tone}", tone)
    .replace("{length}", length)
    .replace("{key_points}", points || "[key points]");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader icon={<Mail className="size-5" />} title="Smart Email Generator" description="Describe what you need to say — get an editable draft." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Pane
          title="Input"
          action={
            <ExampleButton
              onClick={() => {
                setRecipient("Maria Chen, Head of Finance");
                setPoints("Q3 budget report is ready for review\nMarketing spend came in 8% under forecast\nNeed sign-off before the board meeting on Friday");
                setTone("Formal");
              }}
            />
          }
        >
          <div className="space-y-5">
            <Field label="Recipient role / name">
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Maria Chen, Head of Finance" />
            </Field>
            <Field label="Key points / purpose">
              <Textarea rows={6} value={points} onChange={(e) => setPoints(e.target.value)} placeholder={"e.g. Follow up on proposal sent last week\nAsk for feedback by Thursday\nOffer a call to discuss"} />
            </Field>
            <Field label="Tone">
              <Segmented options={TONES} value={tone} onChange={setTone} />
            </Field>
            <Field label="Length">
              <Segmented options={LENGTHS} value={length} onChange={setLength} />
            </Field>
            <GenerateButton loading={loading} onClick={run}>Generate Email</GenerateButton>
          </div>
        </Pane>

        <Pane title="Output workspace">
          {body ? (
            <div className="space-y-4">
              <Field label="Subject">
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="font-medium" />
              </Field>
              <Field label="Body">
                <Textarea rows={14} value={body} onChange={(e) => setBody(e.target.value)} className="leading-relaxed" />
              </Field>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy /> Copy to Clipboard
                </Button>
                <Button variant="outline" onClick={run} disabled={loading}>
                  <RotateCcw /> Regenerate
                </Button>
                <Button variant="ghost" onClick={() => { setSubject(""); setBody(""); }}>
                  <Trash2 /> Clear
                </Button>
              </div>
            </div>
          ) : (
            <EmptyOutput text="Your generated email will appear here, fully editable." />
          )}
          <Accordion type="single" collapsible className="mt-5 rounded-xl border bg-secondary/50 px-4">
            <AccordionItem value="p" className="border-none">
              <AccordionTrigger className="text-sm">
                <span className="flex items-center gap-2"><Code2 className="size-4 text-primary" /> View Prompt Template</span>
              </AccordionTrigger>
              <AccordionContent>
                <pre className="whitespace-pre-wrap rounded-lg bg-card p-3 font-mono text-xs leading-relaxed text-muted-foreground">{prompt}</pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Pane>
      </div>
    </div>
  );
}
