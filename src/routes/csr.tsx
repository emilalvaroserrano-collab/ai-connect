import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Splash } from "@/components/shell";
import { listCsr, saveCsr } from "@/lib/csr.functions";
import { useConnect } from "@/lib/connect";
import { errorText } from "@/lib/manila";
import {
  DEFAULT_END,
  DEFAULT_FIRST,
  DEFAULT_NAME,
  DEFAULT_PROMPT,
  DEFAULT_VOICE_ID,
  DEFAULT_VOICEMAIL,
  VOICES,
} from "@/lib/vapi-preset";

export const Route = createFileRoute("/csr")({ component: CsrPage });

const steps = [
  {
    title: "What you are building",
    body: "A customer-service agent that already knows how to behave. You can use it for your own customers, sell the finished agent to one business, or rent the same link month to month.",
  },
  {
    title: "What is already locked",
    body: "The call rules stay. You edit the name, the three messages, the voice, and the role prompt. They start as Mike at TechSolutions.",
  },
  {
    title: "Only fill what changes",
    body: "Business name, what they sell, a phone or email, hours, language, and one refund sentence. Everything else is preset so two members do not ship two different personalities.",
  },
  {
    title: "Publish the link",
    body: "Saving creates /your-id/csr/business-slug-agent-id. Send that link to customers, or to the business paying you to use it.",
  },
];

type Agent = { id: string; persona?: string; business: string; slug: string; path: string; plan: string };

function CsrPage() {
  const { ready, session, profile } = useConnect();
  const [step, setStep] = useState(0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [made, setMade] = useState<Agent | null>(null);
  const [plan, setPlan] = useState<"use" | "sell" | "rent">("use");
  const [persona, setPersona] = useState(DEFAULT_NAME);
  const [firstMessage, setFirstMessage] = useState(DEFAULT_FIRST);
  const [voicemailMessage, setVoicemailMessage] = useState(DEFAULT_VOICEMAIL);
  const [endCallMessage, setEndCallMessage] = useState(DEFAULT_END);
  const [voiceId, setVoiceId] = useState<(typeof VOICES)[number]>(DEFAULT_VOICE_ID);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT);

  useEffect(() => {
    if (!session) return;
    void listCsr({ data: { idToken: session.idToken } })
      .then((result) => setAgents(result.agents as Agent[]))
      .catch(() => undefined);
  }, [session]);

  if (!ready) return <Splash />;
  if (!session || !profile) return <Navigate to="/login" />;
  if (profile.membershipStatus !== "active") return <Navigate to="/checkout" />;

  return (
    <Shell>
      <div className="mx-auto max-w-xl px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-teal">Master Piece</p>
        <h1 className="mt-1 font-display text-3xl">Creating a CSR Agent</h1>
        <p className="mt-2 text-sm text-muted">Step {step + 1} of {steps.length}. Walk it in order. The brain is already written.</p>
        <ol className="mt-4 flex gap-2">
          {steps.map((item, index) => (
            <li key={item.title} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-teal" : "bg-line"}`} />
          ))}
        </ol>
        <article className="mt-4 rounded-3xl border border-line bg-raise p-4">
          <p className="text-xs text-muted">Step {step + 1}</p>
          <h2 className="mt-1 text-lg font-medium">{steps[step]?.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{steps[step]?.body}</p>
        </article>
        {step < 3 ? (
          <div className="mt-4 flex gap-2">
            {step > 0 ? (
              <button type="button" className="h-11 rounded-full px-4 text-sm text-muted" onClick={() => setStep((value) => value - 1)}>
                Back
              </button>
            ) : null}
            <button type="button" className="h-11 flex-1 rounded-full bg-teal text-sm font-medium text-ink" onClick={() => setStep((value) => value + 1)}>
              Next step
            </button>
          </div>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              setBusy(true);
              setError("");
              void saveCsr({
                data: {
                  idToken: session.idToken,
                  persona,
                  business: String(form.get("business") ?? ""),
                  offer: String(form.get("offer") ?? ""),
                  contact: String(form.get("contact") ?? ""),
                  hours: String(form.get("hours") ?? ""),
                  languages: String(form.get("languages") ?? ""),
                  refund: String(form.get("refund") ?? ""),
                  firstMessage,
                  voicemailMessage,
                  endCallMessage,
                  voiceId,
                  systemPrompt,
                  plan,
                  price: String(form.get("price") ?? ""),
                },
              })
                .then((agent) => {
                  setMade(agent);
                  setAgents((rows) => [agent, ...rows]);
                })
                .catch((caught) => setError(errorText(caught)))
                .finally(() => setBusy(false));
            }}
          >
            <label className="block text-sm">
              Agent name
              <input value={persona} onChange={(event) => setPersona(event.target.value)} className="mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3" />
            </label>
            <label className="block text-sm">
              Opening greeting
              <textarea value={firstMessage} onChange={(event) => setFirstMessage(event.target.value)} className="mt-1 h-24 w-full rounded-xl border border-line bg-raise px-3 py-2" />
            </label>
            <label className="block text-sm">
              Voicemail greeting
              <textarea value={voicemailMessage} onChange={(event) => setVoicemailMessage(event.target.value)} className="mt-1 h-24 w-full rounded-xl border border-line bg-raise px-3 py-2" />
            </label>
            <label className="block text-sm">
              Closing message
              <textarea value={endCallMessage} onChange={(event) => setEndCallMessage(event.target.value)} className="mt-1 h-20 w-full rounded-xl border border-line bg-raise px-3 py-2" />
            </label>
            <label className="block text-sm">
              Voice
              <select value={voiceId} onChange={(event) => setVoiceId(event.target.value as (typeof VOICES)[number])} className="mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3">
                {VOICES.map((voice) => (
                  <option key={voice} value={voice}>{voice}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Role and description
              <textarea value={systemPrompt} onChange={(event) => setSystemPrompt(event.target.value)} className="mt-1 h-56 w-full rounded-xl border border-line bg-raise px-3 py-2 text-sm" />
            </label>
            <input name="business" placeholder="Business name, default TechSolutions" className="h-12 w-full rounded-xl border border-line bg-raise px-3" />
            <textarea name="offer" placeholder="What they sell or do, in two sentences" className="h-24 w-full rounded-xl border border-line bg-raise px-3 py-2" />
            <input name="contact" placeholder="Phone or email to hand over" className="h-12 w-full rounded-xl border border-line bg-raise px-3" />
            <input name="hours" placeholder="Hours, or leave blank" className="h-12 w-full rounded-xl border border-line bg-raise px-3" />
            <input name="languages" placeholder="Languages, default English" className="h-12 w-full rounded-xl border border-line bg-raise px-3" />
            <input name="refund" placeholder="One refund sentence, or leave the safe default" className="h-12 w-full rounded-xl border border-line bg-raise px-3" />
            <div className="flex gap-2">
              {(["use", "sell", "rent"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPlan(option)}
                  className={`h-10 flex-1 rounded-full text-sm ${plan === option ? "bg-teal text-ink" : "bg-surface text-muted"}`}
                >
                  {option === "use" ? "Use it" : option === "sell" ? "Sell it" : "Rent it"}
                </button>
              ))}
            </div>
            {plan !== "use" ? (
              <input name="price" placeholder={plan === "sell" ? "Sale price, optional" : "Monthly rent, optional"} className="h-12 w-full rounded-xl border border-line bg-raise px-3" />
            ) : null}
            {error ? <p className="text-sm text-teal">{error}</p> : null}
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#1aa7b8] via-[#146a86] to-[#0c2744] px-6 py-8 text-center text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-white/70">Preview</p>
              <span className="mx-auto mt-4 grid size-20 place-items-center rounded-full bg-white text-[#c5d0dc]">
                <svg viewBox="0 0 64 64" className="size-12" aria-hidden>
                  <circle cx="32" cy="24" r="10" fill="currentColor" />
                  <path d="M14 52c2.5-10 10-15 18-15s15.5 5 18 15" fill="currentColor" />
                </svg>
              </span>
              <p className="mt-4 text-sm text-white/80">Calling</p>
              <p className="mt-1 text-3xl font-medium">{persona.trim() || "Mike"}</p>
              <p className="mt-2 text-xs text-white/70">Voice · {voiceId}</p>
            </section>
            <div className="flex gap-2">
              <button type="button" className="h-12 rounded-full px-4 text-sm text-muted" onClick={() => setStep(2)}>
                Back
              </button>
              <button type="submit" disabled={busy} className="h-12 flex-1 rounded-full bg-teal font-medium text-ink disabled:opacity-50">
                {busy ? "Saving…" : "Create the agent"}
              </button>
            </div>
          </form>
        )}
        {made ? (
          <p className="mt-4 text-sm">
            Live at{" "}
            <Link to="/$userId/csr/$agentSlug" params={{ userId: profile.uid, agentSlug: made.slug }} className="text-teal">
              {made.path}
            </Link>
          </p>
        ) : null}
        {agents.length > 0 ? (
          <ul className="mt-6 space-y-2">
            {agents.map((agent) => (
              <li key={agent.id}>
                <Link to="/$userId/csr/$agentSlug" params={{ userId: profile.uid, agentSlug: agent.slug }} className="block rounded-2xl border border-line bg-raise px-4 py-3">
                  <span className="block text-sm font-medium">{agent.persona ? `${agent.persona} · ${agent.business}` : agent.business}</span>
                  <span className="mt-1 block text-xs text-muted">{agent.plan} · {agent.path}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Shell>
  );
}
