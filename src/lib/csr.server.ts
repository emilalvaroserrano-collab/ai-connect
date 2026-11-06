import { firebaseConfig } from "@/lib/firebase-config";
import { loadProfile } from "@/lib/firebase.server";
import { personalizeAssistant, VAPI_PUBLIC_KEY, type PersonaInput } from "@/lib/vapi-preset";

const BASE = `${firebaseConfig.databaseURL}/dailyConnect`;
const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY?.trim() || "37efc195-c7cb-4894-b7e0-9169ecfea4af";

export type CsrPlan = "use" | "sell" | "rent";

export type CsrAgent = {
  id: string;
  uid: string;
  ownerName: string;
  slug: string;
  persona: string;
  business: string;
  offer: string;
  contact: string;
  hours: string;
  languages: string;
  refund: string;
  plan: CsrPlan;
  price: string;
  firstMessage: string;
  vapiAssistantId: string;
  createdAt: number;
  updatedAt: number;
};

async function rget<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}${path}.json`);
  if (!res.ok) throw new Error("Could not reach the agent desk.");
  return (await res.json()) as T | null;
}

async function rput(path: string, value: unknown) {
  const res = await fetch(`${BASE}${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error("Could not save the agent.");
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return slug || "csr";
}

async function createVapiAssistant(persona: PersonaInput) {
  const body = personalizeAssistant(persona);
  const res = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { id?: string; message?: string; error?: string };
  if (!res.ok || !data.id) throw new Error(data.message || data.error || "Vapi did not create this persona.");
  return { id: data.id, firstMessage: body.firstMessage };
}

function publicAgent(agent: CsrAgent) {
  return {
    id: agent.id,
    uid: agent.uid,
    ownerName: agent.ownerName,
    slug: agent.slug,
    persona: agent.persona || "Mike",
    business: agent.business,
    offer: agent.offer,
    contact: agent.contact,
    hours: agent.hours,
    languages: agent.languages,
    refund: agent.refund,
    plan: agent.plan,
    price: agent.price,
    firstMessage: agent.firstMessage,
    vapiAssistantId: agent.vapiAssistantId || "",
    publicKey: VAPI_PUBLIC_KEY,
    path: `/${agent.uid}/csr/${agent.slug}`,
    createdAt: agent.createdAt,
  };
}

export async function listCsr(idToken: string) {
  const profile = await loadProfile(idToken);
  const raw = await rget<Record<string, CsrAgent>>(`/csrAgents/${profile.uid}`);
  const agents = Object.values(raw ?? {})
    .filter((agent) => agent && agent.slug)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(publicAgent);
  return { agents };
}

export async function saveCsr(input: {
  idToken: string;
  persona: string;
  business: string;
  offer: string;
  contact: string;
  hours: string;
  languages: string;
  refund: string;
  plan: CsrPlan;
  price: string;
}) {
  const profile = await loadProfile(input.idToken);
  const persona = input.persona.trim().slice(0, 40);
  const business = input.business.trim().slice(0, 80);
  const offer = input.offer.trim().slice(0, 400);
  const contact = input.contact.trim().slice(0, 120);
  if (!persona) throw new Error("Name the persona. Mike is only the default.");
  if (!business) throw new Error("Add the business name.");
  if (!offer) throw new Error("Say what the business sells or does.");
  if (!contact) throw new Error("Add a phone or email the agent can hand over.");
  const facts: PersonaInput = {
    persona,
    business,
    offer,
    contact,
    hours: input.hours.trim().slice(0, 80),
    languages: input.languages.trim().slice(0, 80) || "English",
    refund: input.refund.trim().slice(0, 240),
  };
  const vapi = await createVapiAssistant(facts);
  const id = `agt${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
  const head = `${slugify(persona)}-${slugify(business)}`.replace(/-+$/g, "").slice(0, 40);
  const slug = `${head}-${id}`;
  const now = Date.now();
  const agent: CsrAgent = {
    id,
    uid: profile.uid,
    ownerName: profile.name || "Member",
    slug,
    persona,
    business,
    offer,
    contact,
    hours: facts.hours || "Monday–Friday, 8am–8pm ET; Saturday 9am–5pm",
    languages: facts.languages,
    refund: facts.refund || "Do not process refunds. Offer a person instead.",
    plan: input.plan,
    price: input.price.trim().slice(0, 40),
    firstMessage: vapi.firstMessage,
    vapiAssistantId: vapi.id,
    createdAt: now,
    updatedAt: now,
  };
  await rput(`/csrAgents/${profile.uid}/${id}`, agent);
  return publicAgent(agent);
}

export async function readCsr(userId: string, slug: string) {
  if (!/^[A-Za-z0-9]{6,40}$/.test(userId)) return null;
  if (!/^[a-z0-9-]{4,80}$/.test(slug)) return null;
  const id = slug.match(/-(agt[a-z0-9]{8})$/)?.[1];
  if (!id) return null;
  const agent = await rget<CsrAgent>(`/csrAgents/${userId}/${id}`);
  if (!agent || agent.slug !== slug) return null;
  return publicAgent(agent);
}
