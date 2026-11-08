import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { o as object, s as string, t as _enum } from "../_libs/zod.mjs";
import { c as VOICES } from "./vapi-preset-D6zKfZEq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/csr.functions-CJ7ts8xF.js
var token = string().min(20);
var listCsr_createServerFn_handler = createServerRpc({
	id: "3e647e470b37b215feadb3207046de52f03763f93a089edd42aeb47e53f3811c",
	name: "listCsr",
	filename: "src/lib/csr.functions.ts"
}, (opts) => listCsr.__executeServer(opts));
var listCsr = createServerFn({ method: "POST" }).validator(object({ idToken: token })).handler(listCsr_createServerFn_handler, async ({ data }) => {
	const { listCsr: run } = await import("./csr.server-PZbe5n_L.mjs");
	return run(data.idToken);
});
var saveCsr_createServerFn_handler = createServerRpc({
	id: "37d5ab7b84bf0a06f1269c4ba00f5753aa8372c0b0f2403c17d47f1656f0507b",
	name: "saveCsr",
	filename: "src/lib/csr.functions.ts"
}, (opts) => saveCsr.__executeServer(opts));
var saveCsr = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	persona: string().trim().max(40).optional().transform((value) => value || "Mike"),
	business: string().trim().max(80).optional().transform((value) => value || "TechSolutions"),
	offer: string().trim().max(400).optional().transform((value) => value || ""),
	contact: string().trim().max(120).optional().transform((value) => value || ""),
	hours: string().max(80).optional().transform((value) => value || ""),
	languages: string().max(80).optional().transform((value) => value || ""),
	refund: string().max(240).optional().transform((value) => value || ""),
	firstMessage: string().trim().max(600).optional(),
	voicemailMessage: string().trim().max(600).optional(),
	endCallMessage: string().trim().max(600).optional(),
	voiceId: _enum(VOICES).optional(),
	systemPrompt: string().trim().max(12e3).optional(),
	plan: _enum([
		"use",
		"sell",
		"rent"
	]),
	price: string().max(40).optional().transform((value) => value || "")
})).handler(saveCsr_createServerFn_handler, async ({ data }) => {
	const { saveCsr: run } = await import("./csr.server-PZbe5n_L.mjs");
	return run(data);
});
var readCsr_createServerFn_handler = createServerRpc({
	id: "0cdfbf0f3a251b355d5807273b696f0115723a456ba5ee41d09527fd3f0ea081",
	name: "readCsr",
	filename: "src/lib/csr.functions.ts"
}, (opts) => readCsr.__executeServer(opts));
var readCsr = createServerFn({ method: "POST" }).validator(object({
	userId: string().min(6).max(40),
	slug: string().min(4).max(80)
})).handler(readCsr_createServerFn_handler, async ({ data }) => {
	const { readCsr: run } = await import("./csr.server-PZbe5n_L.mjs");
	return run(data.userId, data.slug);
});
//#endregion
export { listCsr_createServerFn_handler, readCsr_createServerFn_handler, saveCsr_createServerFn_handler };
