import { createFileRoute } from '@tanstack/react-router'
import { Mic, MicOff, Phone, PhoneOff, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Splash } from "@/components/shell";
import { readCsr } from "@/lib/csr.functions";
import { DEFAULT_ASSISTANT_ID, VAPI_PUBLIC_KEY } from "@/lib/vapi-preset";

export const Route = createFileRoute("/$userId/csr/$agentSlug")({ component: AgentPage });

type Agent = {
  persona: string;
  business: string;
  firstMessage: string;
  voiceId?: string;
  systemPrompt?: string;
  vapiAssistantId: string;
};

type Line = { stop: () => void; setMuted: (muted: boolean) => void };
type Turn = { who: string; text: string };

function AgentPage() {
  const { userId, agentSlug } = Route.useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [missing, setMissing] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [muted, setMuted] = useState(false);
  const [live, setLive] = useState(false);
  const [level, setLevel] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [note, setNote] = useState("");
  const line = useRef<Line | null>(null);

  useEffect(() => {
    void readCsr({ data: { userId, slug: agentSlug } }).then((next) => {
      if (!next) setMissing(true);
      else setAgent(next as Agent);
    });
    return () => line.current?.stop();
  }, [agentSlug, userId]);

  function answer() {
    if (!agent || line.current) return;
    setStatus("Connecting");
    setNote("");
    setTurns([]);
    const name = agent.persona.trim() || "Mike";
    void import("@vapi-ai/web")
      .then(({ default: Vapi }) => {
        const vapi = new Vapi(VAPI_PUBLIC_KEY);
        line.current = vapi;
        vapi.on("call-start", () => {
          setLive(true);
          setStatus("On the line");
        });
        vapi.on("call-end", () => {
          line.current = null;
          setLive(false);
          setLevel(0);
          setStatus("Call ended");
        });
        vapi.on("volume-level", (value: number) => setLevel(Math.max(0, Math.min(1, value))));
        vapi.on("local-volume-level", (value: number) => setLevel((current) => Math.max(current * 0.65, value)));
        vapi.on("message", (message: { type?: string; transcriptType?: string; role?: string; transcript?: string }) => {
          if (message.type !== "transcript" || message.transcriptType !== "final" || !message.transcript) return;
          const who = message.role === "user" ? "You" : name;
          setTurns((rows) => [...rows, { who, text: message.transcript! }].slice(-8));
        });
        vapi.on("error", (error: { message?: string } | string) => {
          const detail = typeof error === "string" ? error : error?.message;
          setNote(detail || "Allow the microphone, then tap Answer again.");
          setStatus("Could not connect");
        });
        const assistantId = agent.vapiAssistantId || DEFAULT_ASSISTANT_ID;
        return vapi.start(assistantId, {
          firstMessage: agent.firstMessage,
          voice: { provider: "vapi", voiceId: agent.voiceId || "Elliot" },
          ...(agent.systemPrompt
            ? {
                model: {
                  provider: "anthropic",
                  model: "claude-sonnet-4-6",
                  messages: [{ role: "system" as const, content: agent.systemPrompt }],
                },
              }
            : {}),
        });
      })
      .catch(() => {
        setStatus("Could not connect");
        setNote("The call did not start.");
      });
  }

  function hangUp() {
    line.current?.stop();
    line.current = null;
    setLive(false);
    setLevel(0);
    setMuted(false);
    setStatus("Call ended");
  }

  if (!agent && !missing) return <Splash />;
  if (missing || !agent) {
    return (
      <main className="fixed inset-0 z-50 grid place-items-center bg-[#141414] text-sm text-[#a3a3a3]">
        That agent is not published.
      </main>
    );
  }

  const name = agent.persona.trim() || "Mike";
  const bars = [0.4, 0.65, 0.9, 1, 0.75, 0.5, 0.85, 0.6, 0.95, 0.45];

  return (
    <main className="fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-[#141414] text-[#f3f3f3]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_420px_at_50%_0%,rgba(212,175,55,0.28),transparent_58%)]" />
      <header className="relative px-6 pt-[max(1.25rem,env(safe-area-inset-top))] text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">{agent.business || "Customer support"}</p>
      </header>
      <section className="relative mt-10 flex flex-col items-center px-6 text-center">
        <span className="grid size-28 place-items-center rounded-full bg-[#d4af37]/15 ring-1 ring-[#d4af37]/70">
          <span className="grid size-24 place-items-center rounded-full bg-[#1e1e1e] text-[#f3e2a6]">
            <UserRound className="size-12" strokeWidth={1.5} />
          </span>
        </span>
        <h1 className="mt-6 font-display text-4xl tracking-tight">{name}</h1>
        <p className="mt-2 text-sm text-[#a3a3a3]">{status}</p>
        <div className="mt-6 flex h-14 items-end gap-1.5" aria-hidden>
          {bars.map((weight, index) => (
            <span
              key={weight + index}
              className="w-1.5 rounded-full bg-[#d4af37]"
              style={{ height: live ? 8 + level * weight * 44 : 8, transition: "height 80ms linear" }}
            />
          ))}
        </div>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#f3e2a6]">{turns.at(-1)?.text || agent.firstMessage}</p>
      </section>
      <section className="relative mx-auto mt-6 w-full max-w-md flex-1 space-y-2 overflow-y-auto px-6">
        {turns.map((turn, index) => (
          <p key={`${turn.who}-${index}`} className="rounded-2xl bg-[#1e1e1e] px-3 py-2 text-sm">
            <span className="text-[#d4af37]">{turn.who}. </span>
            {turn.text}
          </p>
        ))}
        {note ? <p className="text-center text-xs text-[#a3a3a3]">{note}</p> : null}
      </section>
      <footer className="relative flex items-center justify-center gap-10 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
        <button
          type="button"
          className="grid size-14 place-items-center rounded-full bg-[#2a2a2a] text-sm text-[#f3e2a6] ring-1 ring-[#3f3f3f]"
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={() => {
            const next = !muted;
            setMuted(next);
            line.current?.setMuted(next);
          }}
        >
          {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </button>
        {live ? (
          <button type="button" aria-label="End call" onClick={hangUp} className="grid size-16 place-items-center rounded-full bg-[#2a2a2a] text-[#f3f3f3] ring-1 ring-[#3f3f3f]">
            <PhoneOff className="size-6" />
          </button>
        ) : (
          <button type="button" aria-label="Answer" onClick={answer} className="grid size-16 place-items-center rounded-full bg-[#d4af37] text-[#1a1a1a]">
            <Phone className="size-6" />
          </button>
        )}
      </footer>
    </main>
  );
}
