import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community.functions-3ZS47rci.js
var token = string().min(20);
var postId = string().regex(/^com_[A-Za-z0-9]{8,20}$/);
var listCommunity_createServerFn_handler = createServerRpc({
	id: "81dce9d7e2ad26d4fe4abc6f3cd2adda6e992e5d0223e35f8e9de9890c23cfe0",
	name: "listCommunity",
	filename: "src/lib/community.functions.ts"
}, (opts) => listCommunity.__executeServer(opts));
var listCommunity = createServerFn({ method: "POST" }).validator(object({ idToken: token })).handler(listCommunity_createServerFn_handler, async ({ data }) => {
	const { listCommunity: run } = await import("./community.server-Ce80jRNA.mjs");
	return run(data.idToken);
});
var submitCommunity_createServerFn_handler = createServerRpc({
	id: "68c2e53c398da601c3502877e5f666a9aea85d4a977c085ce5d3c2d2b4877c06",
	name: "submitCommunity",
	filename: "src/lib/community.functions.ts"
}, (opts) => submitCommunity.__executeServer(opts));
var submitCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	caption: string().max(500),
	mediaUrl: string().url().max(500)
})).handler(submitCommunity_createServerFn_handler, async ({ data }) => {
	const { submitCommunity: run } = await import("./community.server-Ce80jRNA.mjs");
	return run(data);
});
var likeCommunity_createServerFn_handler = createServerRpc({
	id: "fb43604e6a446b78a13311fcd8952ab900be8f18563c1582a865aadb27ea537b",
	name: "likeCommunity",
	filename: "src/lib/community.functions.ts"
}, (opts) => likeCommunity.__executeServer(opts));
var likeCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	postId
})).handler(likeCommunity_createServerFn_handler, async ({ data }) => {
	const { likeCommunity: run } = await import("./community.server-Ce80jRNA.mjs");
	return run(data);
});
var deleteCommunity_createServerFn_handler = createServerRpc({
	id: "7a619c9bd3ad0b6635e3f1c64ecaa21f54c9f66b038431e0c7f68933cb6cc7bf",
	name: "deleteCommunity",
	filename: "src/lib/community.functions.ts"
}, (opts) => deleteCommunity.__executeServer(opts));
var deleteCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	postId
})).handler(deleteCommunity_createServerFn_handler, async ({ data }) => {
	const { deleteCommunity: run } = await import("./community.server-Ce80jRNA.mjs");
	return run(data);
});
var editCommunity_createServerFn_handler = createServerRpc({
	id: "77cd5de5058cf469d71144dcbede9f27371d1683495e21a87cf7286a8107057e",
	name: "editCommunity",
	filename: "src/lib/community.functions.ts"
}, (opts) => editCommunity.__executeServer(opts));
var editCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	postId,
	caption: string().trim().min(1).max(500)
})).handler(editCommunity_createServerFn_handler, async ({ data }) => {
	const { editCommunity: run } = await import("./community.server-Ce80jRNA.mjs");
	return run(data);
});
var commentCommunity_createServerFn_handler = createServerRpc({
	id: "c89202165a854c47a15ad0ce1adb57eeea402b93ca1ad3833b8d2887ea6f826d",
	name: "commentCommunity",
	filename: "src/lib/community.functions.ts"
}, (opts) => commentCommunity.__executeServer(opts));
var commentCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	postId,
	text: string().trim().min(1).max(280)
})).handler(commentCommunity_createServerFn_handler, async ({ data }) => {
	const { commentCommunity: run } = await import("./community.server-Ce80jRNA.mjs");
	return run(data);
});
//#endregion
export { commentCommunity_createServerFn_handler, deleteCommunity_createServerFn_handler, editCommunity_createServerFn_handler, likeCommunity_createServerFn_handler, listCommunity_createServerFn_handler, submitCommunity_createServerFn_handler };
