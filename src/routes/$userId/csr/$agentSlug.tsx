import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Splash } from "@/components/shell";
import { readCsr } from "@/lib/csr.functions";
import { VAPI_PUBLIC_KEY } from "@/lib/vapi-preset";

export const Route = createFileRoute("/$userId/csr/$agentSlug")({ component: AgentPage });

type Agent = {
  persona: string;
  business: string;
  offer: string;
  contact: string;
  hours: string;
  languages: string;
  refund: string;
  plan: string;
  price: string;
  ownerName: string;
  firstMessage: string;
  vapiAssistantId: string;
};

function AgentPage() {
  const { userId, agentSlug } = Route.useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [missing, setMissing] = useState(false);
  const [call, setCall] = useState("");

  useEffect(() => {
    void readCsr({ data: { userId, slug: agentSlug } }).then((next) => {
      if (!next) setMissing(true);
      else setAgent(next as Agent);
    });
  }, [agentSlug, userId]);

  if (!agent && !missing) return <Splash />;

  return (
    <Shell>
      <div className="mx-auto max-w-xl px-4 py-4">
        {missing || !agent ? (
          <p className="text-sm text-muted">That agent is not published.</p>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-teal">CSR Agent</p>
            <h1 className="mt-1 font-display text-3xl">{agent.persona}</h1>
            <p className="mt-2 text-sm text-muted">{agent.business}. Set up by {agent.ownerName}. Voice and call rules stay on the Mike preset.</p>
            <p className="mt-4 rounded-2xl bg-raise p-4 text-sm">{agent.firstMessage}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl bg-raise p-3"><dt className="text-xs text-muted">Plan</dt><dd className="mt-1 capitalize">{agent.plan}{agent.price ? ` · ${agent.price}` : ""}</dd></div>
              <div className="rounded-2xl bg-raise p-3"><dt className="text-xs text-muted">Hours</dt><dd className="mt-1">{agent.hours}</dd></div>
              <div className="rounded-2xl bg-raise p-3"><dt className="text-xs text-muted">Languages</dt><dd className="mt-1">{agent.languages}</dd></div>
              <div className="rounded-2xl bg-raise p-3"><dt className="text-xs text-muted">Contact</dt><dd className="mt-1 break-all">{agent.contact}</dd></div>
            </dl>
            <p className="mt-4 text-sm">{agent.offer}</p>
            {agent.vapiAssistantId ? (
              <button
                type="button"
                className="mt-4 h-12 w-full rounded-full bg-teal font-medium text-ink"
                onClick={() => {
                  setCall("Connecting…");
                  void import("@vapi-ai/web")
                    .then(({ default: Vapi }) => {
                      const vapi = new Vapi(VAPI_PUBLIC_KEY);
                      vapi.on("call-start", () => setCall(`Talking with ${agent.persona}`));
                      vapi.on("call-end", () => setCall("Call ended"));
                      vapi.on("error", () => setCall("The call did not start. Allow the microphone and try again."));
                      return vapi.start(agent.vapiAssistantId);
                    })
                    .catch(() => setCall("The call did not start."));
                }}
              >
                Talk to {agent.persona}
              </button>
            ) : null}
            {call ? <p className="mt-2 text-sm text-muted">{call}</p> : null}
          </>
        )}
        <Link to="/csr" className="mt-6 inline-block text-sm text-teal">Build your own</Link>
      </div>
    </Shell>
  );
}
