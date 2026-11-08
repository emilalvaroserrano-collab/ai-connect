import { c as firebaseConfig } from "./manila-BaDjFwMm.mjs";
import { loadProfile } from "./firebase.server-BC4SNhK7.mjs";
import { l as personalizeAssistant, s as VAPI_PUBLIC_KEY } from "./vapi-preset-D6zKfZEq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/csr.server-PZbe5n_L.js
var BASE = `${firebaseConfig.databaseURL}/dailyConnect`;
var VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY?.trim() || "37efc195-c7cb-4894-b7e0-9169ecfea4af";
async function rget(path) {
	const res = await fetch(`${BASE}${path}.json`);
	if (!res.ok) throw new Error("Could not reach the agent desk.");
	return await res.json();
}
async function rput(path, value) {
	if (!(await fetch(`${BASE}${path}.json`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(value)
	})).ok) throw new Error("Could not save the agent.");
}
function slugify(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "csr";
}
async function createVapiAssistant(persona) {
	const body = personalizeAssistant(persona);
	const res = await fetch("https://api.vapi.ai/assistant", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	});
	const data = await res.json();
	if (!res.ok || !data.id) throw new Error(data.message || data.error || "Vapi did not create this persona.");
	return {
		id: data.id,
		firstMessage: body.firstMessage
	};
}
function publicAgent(agent) {
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
		voicemailMessage: agent.voicemailMessage || "",
		endCallMessage: agent.endCallMessage || "",
		voiceId: agent.voiceId || "Elliot",
		systemPrompt: agent.systemPrompt || "",
		vapiAssistantId: agent.vapiAssistantId || "",
		publicKey: VAPI_PUBLIC_KEY,
		path: `/${agent.uid}/csr/${agent.slug}`,
		createdAt: agent.createdAt
	};
}
async function listCsr(idToken) {
	const raw = await rget(`/csrAgents/${(await loadProfile(idToken)).uid}`);
	return { agents: Object.values(raw ?? {}).filter((agent) => agent && agent.slug).sort((a, b) => b.createdAt - a.createdAt).map(publicAgent) };
}
async function saveCsr(input) {
	const profile = await loadProfile(input.idToken);
	const persona = input.persona.trim().slice(0, 40);
	const business = input.business.trim().slice(0, 80);
	const offer = input.offer.trim().slice(0, 400);
	const contact = input.contact.trim().slice(0, 120);
	if (!persona) throw new Error("Name the persona. Mike is only the default.");
	const facts = {
		persona,
		business: business || "TechSolutions",
		offer,
		contact,
		hours: input.hours.trim().slice(0, 80),
		languages: input.languages.trim().slice(0, 80) || "English",
		refund: input.refund.trim().slice(0, 240),
		firstMessage: input.firstMessage,
		voicemailMessage: input.voicemailMessage,
		endCallMessage: input.endCallMessage,
		voiceId: input.voiceId,
		systemPrompt: input.systemPrompt
	};
	const vapi = await createVapiAssistant(facts);
	const spoken = personalizeAssistant(facts);
	const id = `agt${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
	const slug = `${`${slugify(persona)}-${slugify(business)}`.replace(/-+$/g, "").slice(0, 40)}-${id}`;
	const now = Date.now();
	const agent = {
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
		firstMessage: spoken.firstMessage,
		voicemailMessage: spoken.voicemailMessage,
		endCallMessage: spoken.endCallMessage,
		voiceId: spoken.voice.voiceId,
		systemPrompt: spoken.model.messages[0]?.content || "",
		vapiAssistantId: vapi.id,
		createdAt: now,
		updatedAt: now
	};
	await rput(`/csrAgents/${profile.uid}/${id}`, agent);
	return publicAgent(agent);
}
async function readCsr(userId, slug) {
	if (!/^[A-Za-z0-9]{6,40}$/.test(userId)) return null;
	if (!/^[a-z0-9-]{4,80}$/.test(slug)) return null;
	const id = slug.match(/-(agt[a-z0-9]{8})$/)?.[1];
	if (!id) return null;
	const agent = await rget(`/csrAgents/${userId}/${id}`);
	if (!agent || agent.slug !== slug) return null;
	return publicAgent(agent);
}
//#endregion
export { listCsr, readCsr, saveCsr };
