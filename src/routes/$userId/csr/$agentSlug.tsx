import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Splash } from "@/components/shell";
import { readCsr } from "@/lib/csr.functions";
import { VAPI_PUBLIC_KEY } from "@/lib/vapi-preset";

export const Route = createFileRoute("/$userId/csr/$agentSlug")({ component: AgentPage });

type Agent = {
  persona: string;
  firstMessage: string;
  vapiAssistantId: string;
};

type Line = { stop: () => void; setMuted: (muted: boolean) => void };

function AgentPage() {
  const { userId, agentSlug } = Route.useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [missing, setMissing] = useState(false);
  const [status, setStatus] = useState("Calling");
  const [muted, setMuted] = useState(false);
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
    if (!agent?.vapiAssistantId || line.current) return;
    setStatus("Calling");
    setNote("");
    void import("@vapi-ai/web")
      .then(({ default: Vapi }) => {
        const vapi = new Vapi(VAPI_PUBLIC_KEY);
        line.current = vapi;
        vapi.on("call-start", () => setStatus("Connected"));
        vapi.on("call-end", () => {
          line.current = null;
          setStatus("Calling");
        });
        vapi.on("error", () => setNote("Allow the microphone, then tap the green button again."));
        return vapi.start(agent.vapiAssistantId);
      })
      .catch(() => setNote("The call did not start."));
  }

  function hangUp() {
    line.current?.stop();
    line.current = null;
    setStatus("Calling");
    setMuted(false);
  }

  if (!agent && !missing) return <Splash />;

  const name = agent?.persona?.trim() || "Mike";

  return (
    <main className="grid min-h-dvh place-items-center bg-[#071018] px-6">
      {missing || !agent ? (
        <p className="text-sm text-white/70">That agent is not published.</p>
      ) : (
        <div className="relative h-[640px] w-[300px] max-w-full overflow-hidden rounded-[2.6rem] bg-gradient-to-b from-[#1aa7b8] via-[#146a86] to-[#0c2744] text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between px-6 pt-5 text-[13px] font-medium">
            <span>09:00</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 18 12" className="h-3 w-4" aria-hidden>
                <rect x="0" y="7" width="3" height="5" rx="0.5" fill="currentColor" />
                <rect x="5" y="4" width="3" height="8" rx="0.5" fill="currentColor" />
                <rect x="10" y="1" width="3" height="11" rx="0.5" fill="currentColor" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.45" />
              </svg>
              <svg viewBox="0 0 25 12" className="h-3 w-6" aria-hidden>
                <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" fill="none" stroke="currentColor" />
                <rect x="2" y="2" width="16" height="8" rx="1" fill="currentColor" />
                <rect x="22.5" y="3.5" width="2" height="5" rx="0.6" fill="currentColor" />
              </svg>
            </span>
          </div>
          <div className="mt-16 flex flex-col items-center">
            <span className="grid size-28 place-items-center rounded-full bg-white/25">
              <span className="grid size-24 place-items-center rounded-full bg-white text-[#c5d0dc]">
                <svg viewBox="0 0 64 64" className="size-16" aria-hidden>
                  <circle cx="32" cy="24" r="10" fill="currentColor" />
                  <path d="M14 52c2.5-10 10-15 18-15s15.5 5 18 15" fill="currentColor" />
                </svg>
              </span>
            </span>
            <p className="mt-6 text-sm text-white/80">{status}</p>
            <h1 className="mt-1 text-3xl font-medium tracking-tight">{name}</h1>
          </div>
          <div className="absolute inset-x-0 bottom-16 flex flex-col items-center">
            <div className="mb-10 flex gap-10 text-white">
              <button
                type="button"
                aria-label={muted ? "Unmute" : "Mute"}
                className="grid size-10 place-items-center"
                onClick={() => {
                  const next = !muted;
                  setMuted(next);
                  line.current?.setMuted(next);
                }}
              >
                <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 10v4h3l5 4V6L7 10H4z" />
                  {muted ? <path d="M16 9l5 6M21 9l-5 6" /> : <path d="M16 9a4 4 0 0 1 0 6" />}
                </svg>
              </button>
              <button type="button" aria-label="Message" className="grid size-10 place-items-center" onClick={() => setNote(agent.firstMessage)}>
                <svg viewBox="0 0 24 24" className="size-7" fill="currentColor">
                  <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v6a3.5 3.5 0 0 1-3.5 3.5H11l-4.2 3.2c-.7.5-1.8 0-1.8-.9V16A3.5 3.5 0 0 1 5 12.5v-6z" />
                </svg>
              </button>
            </div>
            <div className="flex w-full justify-center gap-16">
              <button type="button" aria-label="Answer" onClick={answer} className="grid size-16 place-items-center rounded-full bg-[#3ed15a] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                <svg viewBox="0 0 24 24" className="size-8 text-white" fill="currentColor">
                  <path d="M7 4.5c.4 2.6-.2 4.6-1.6 6.4-1.2 1.5-1.2 3.2.2 4.6l1.6 1.6c1.4 1.4 3.1 1.4 4.6.2 1.8-1.4 3.8-2 6.4-1.6.5.1.8.5.8 1v2.2c0 .6-.5 1.1-1.1 1-3.4-.3-6.5-1.6-9.2-4.3S3.6 9.5 3.3 6.1c-.1-.6.4-1.1 1-1.1H6c.5 0 .9.3 1 .5z" />
                </svg>
              </button>
              <button type="button" aria-label="Decline" onClick={hangUp} className="grid size-16 place-items-center rounded-full bg-[#ff4b3e] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                <svg viewBox="0 0 24 24" className="size-8 rotate-[135deg] text-white" fill="currentColor">
                  <path d="M7 4.5c.4 2.6-.2 4.6-1.6 6.4-1.2 1.5-1.2 3.2.2 4.6l1.6 1.6c1.4 1.4 3.1 1.4 4.6.2 1.8-1.4 3.8-2 6.4-1.6.5.1.8.5.8 1v2.2c0 .6-.5 1.1-1.1 1-3.4-.3-6.5-1.6-9.2-4.3S3.6 9.5 3.3 6.1c-.1-.6.4-1.1 1-1.1H6c.5 0 .9.3 1 .5z" />
                </svg>
              </button>
            </div>
            {note ? <p className="mt-4 max-w-[220px] text-center text-xs text-white/80">{note}</p> : null}
          </div>
        </div>
      )}
    </main>
  );
}
