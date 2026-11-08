import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio.functions-BAncVXHP.js
var token = string().min(20);
var id = string().regex(/^[A-Za-z0-9_-]{4,40}$/);
var listFeed_createServerFn_handler = createServerRpc({
	id: "3db129ac3bd7c0eeddbf83cd607a34cd31cd79ff6503a3bf9a30bae9a35275d6",
	name: "listFeed",
	filename: "src/lib/studio.functions.ts"
}, (opts) => listFeed.__executeServer(opts));
var listFeed = createServerFn({ method: "POST" }).validator(object({ idToken: token })).handler(listFeed_createServerFn_handler, async ({ data }) => {
	const { listFeed: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.idToken);
});
var recordView_createServerFn_handler = createServerRpc({
	id: "3ade3bc90052405024f936103e63e1d42ac4433c22149fdc2289ea4e3a8958ab",
	name: "recordView",
	filename: "src/lib/studio.functions.ts"
}, (opts) => recordView.__executeServer(opts));
var recordView = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	postId: id
})).handler(recordView_createServerFn_handler, async ({ data }) => {
	const { recordView: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.idToken, data.postId);
});
var submitPost_createServerFn_handler = createServerRpc({
	id: "deab5756f3dc38e185e65041a2bdc6c871c5b1db0266e6b2de0bdf597ca4909d",
	name: "submitPost",
	filename: "src/lib/studio.functions.ts"
}, (opts) => submitPost.__executeServer(opts));
var submitPost = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	title: string().trim().min(1).max(80),
	caption: string().trim().max(500),
	hashtags: string().trim().max(120),
	kind: _enum(["video", "image"]),
	mediaUrl: string().min(1).max(12e5),
	posterUrl: string().max(12e5),
	durationSec: number().min(0).max(120),
	width: number().min(0).max(8e3),
	height: number().min(0).max(8e3),
	mime: string().max(40),
	productCode: string().max(40),
	rightsConfirmed: boolean()
})).handler(submitPost_createServerFn_handler, async ({ data }) => {
	const { submitPost: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data);
});
var revisePost_createServerFn_handler = createServerRpc({
	id: "0a97294987222ad7a4ed7df30582c94f59e5efa154784ce61f15b44a3df7ddc0",
	name: "revisePost",
	filename: "src/lib/studio.functions.ts"
}, (opts) => revisePost.__executeServer(opts));
var revisePost = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	postId: id,
	title: string().trim().min(1).max(80),
	caption: string().trim().max(500)
})).handler(revisePost_createServerFn_handler, async ({ data }) => {
	const { revisePost: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data);
});
var generateStudio_createServerFn_handler = createServerRpc({
	id: "a7d1c31428ca4249a3dc8b1937852c1e906e2155a52b9f2af103cdf830e40e0f",
	name: "generateStudio",
	filename: "src/lib/studio.functions.ts"
}, (opts) => generateStudio.__executeServer(opts));
var generateStudio = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	productCode: string().regex(/^[a-z0-9-]{2,40}$/),
	output: _enum([
		"image",
		"caption",
		"script"
	]),
	style: string().max(240)
})).handler(generateStudio_createServerFn_handler, async ({ data }) => {
	const { generateStudio: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data);
});
var speakCaption_createServerFn_handler = createServerRpc({
	id: "373c98d347d041f29f5540670e0847f9dc124f399a6f846c50b1ac9d853eb4d3",
	name: "speakCaption",
	filename: "src/lib/studio.functions.ts"
}, (opts) => speakCaption.__executeServer(opts));
var speakCaption = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	text: string().trim().min(1).max(400)
})).handler(speakCaption_createServerFn_handler, async ({ data }) => {
	const { speakCaption: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.idToken, data.text);
});
var listProducts_createServerFn_handler = createServerRpc({
	id: "a7647f7687f12d34447bc7c37ce939e89aabc14691132b4b74d62a9472b79e86",
	name: "listProducts",
	filename: "src/lib/studio.functions.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "POST" }).validator(object({ idToken: token })).handler(listProducts_createServerFn_handler, async ({ data }) => {
	const { listProducts: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.idToken);
});
var loadCreator_createServerFn_handler = createServerRpc({
	id: "eccf5d0f350b99145a401b8b762229401f13292e7e79416817dc3f680220c43e",
	name: "loadCreator",
	filename: "src/lib/studio.functions.ts"
}, (opts) => loadCreator.__executeServer(opts));
var loadCreator = createServerFn({ method: "POST" }).validator(object({ idToken: token })).handler(loadCreator_createServerFn_handler, async ({ data }) => {
	const { loadCreator: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.idToken);
});
var listLive_createServerFn_handler = createServerRpc({
	id: "9e62663aaf357beadad5a3e56d39a7e6b00fad4f2b1601eb63dde4383ddfe718",
	name: "listLive",
	filename: "src/lib/studio.functions.ts"
}, (opts) => listLive.__executeServer(opts));
var listLive = createServerFn({ method: "POST" }).validator(object({ idToken: token })).handler(listLive_createServerFn_handler, async ({ data }) => {
	const { listLive: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.idToken);
});
var saveLive_createServerFn_handler = createServerRpc({
	id: "9bff47c6c6b2844a55ebc1bd360a7f0a7efbd36ea62290c4920a2d23904ae1c9",
	name: "saveLive",
	filename: "src/lib/studio.functions.ts"
}, (opts) => saveLive.__executeServer(opts));
var saveLive = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	title: string().trim().max(80),
	scheduledAt: number().min(0),
	productCodes: array(string().regex(/^[a-z0-9-]{2,40}$/)).max(6),
	script: string().max(2e3)
})).handler(saveLive_createServerFn_handler, async ({ data }) => {
	const { saveLive: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data);
});
var startLive_createServerFn_handler = createServerRpc({
	id: "dec34bc29a76ece895e7b96d550def5774a2d282471b808a25adb97babf00892",
	name: "startLive",
	filename: "src/lib/studio.functions.ts"
}, (opts) => startLive.__executeServer(opts));
var startLive = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	sessionId: id
})).handler(startLive_createServerFn_handler, async ({ data }) => {
	const { startLive: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.idToken, data.sessionId);
});
var loadModeration_createServerFn_handler = createServerRpc({
	id: "26f89283351c4f85977e2c4627d0764b51ebcf6ce7f8ee9740f899e6c9a1b15e",
	name: "loadModeration",
	filename: "src/lib/studio.functions.ts"
}, (opts) => loadModeration.__executeServer(opts));
var loadModeration = createServerFn({ method: "POST" }).validator(object({ idToken: token })).handler(loadModeration_createServerFn_handler, async ({ data }) => {
	const { loadModeration: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.idToken);
});
var moderatePost_createServerFn_handler = createServerRpc({
	id: "5b992e28ad99fbe07a6f9db973867d5a6b980cea23868573fed2bf5b12c85b9f",
	name: "moderatePost",
	filename: "src/lib/studio.functions.ts"
}, (opts) => moderatePost.__executeServer(opts));
var moderatePost = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	postId: id,
	action: _enum([
		"approve",
		"reject",
		"changes"
	]),
	note: string().max(240)
})).handler(moderatePost_createServerFn_handler, async ({ data }) => {
	const { moderatePost: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data);
});
var retryPublish_createServerFn_handler = createServerRpc({
	id: "ce33efd19864a05e20b92b183c5b843a15fbaeac37ebb033fbe9b7b79d17d209",
	name: "retryPublish",
	filename: "src/lib/studio.functions.ts"
}, (opts) => retryPublish.__executeServer(opts));
var retryPublish = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	postId: id,
	platform: _enum([
		"tiktok",
		"youtube",
		"facebook"
	])
})).handler(retryPublish_createServerFn_handler, async ({ data }) => {
	const { retryPublish: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.idToken, data.postId, data.platform);
});
var confirmOrder_createServerFn_handler = createServerRpc({
	id: "67fbc9469ebbbc697120f2caa6f236c352c4042d1ea4ee93b7332dd45bc67cc7",
	name: "confirmOrder",
	filename: "src/lib/studio.functions.ts"
}, (opts) => confirmOrder.__executeServer(opts));
var confirmOrder = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	orderId: id,
	memberCode: string().regex(/^[A-Z0-9]{4,12}$/),
	productCode: string().regex(/^[a-z0-9-]{2,40}$/),
	salePesos: number().int().min(1).max(1e7),
	event: _enum([
		"confirmed",
		"refunded",
		"cancelled"
	])
})).handler(confirmOrder_createServerFn_handler, async ({ data }) => {
	const { confirmOrder: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data);
});
var recordRevenue_createServerFn_handler = createServerRpc({
	id: "214ad44472567cb49c11a23e0e5a34949845dcb1283f9681bc6c9aadd84a9d6d",
	name: "recordRevenue",
	filename: "src/lib/studio.functions.ts"
}, (opts) => recordRevenue.__executeServer(opts));
var recordRevenue = createServerFn({ method: "POST" }).validator(object({
	idToken: token,
	reportId: id,
	postId: id,
	gross: number().int().min(0).max(1e7),
	deductions: number().int().min(0).max(1e7),
	source: string().max(80),
	status: _enum(["estimated", "confirmed"])
})).handler(recordRevenue_createServerFn_handler, async ({ data }) => {
	const { recordRevenue: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data);
});
var recordClick_createServerFn_handler = createServerRpc({
	id: "c8f5ae6173767a184510c5f857738bd376a06eaf8546b06b3b4d4132aac1129c",
	name: "recordClick",
	filename: "src/lib/studio.functions.ts"
}, (opts) => recordClick.__executeServer(opts));
var recordClick = createServerFn({ method: "POST" }).validator(object({
	memberCode: string().regex(/^[A-Za-z0-9]{4,12}$/),
	productCode: string().regex(/^[A-Za-z0-9-]{2,40}$/)
})).handler(recordClick_createServerFn_handler, async ({ data }) => {
	const { recordClick: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.memberCode, data.productCode);
});
var loadAffiliateLanding_createServerFn_handler = createServerRpc({
	id: "2c11d69d4db1c99e9c2bb911c773d1ea22ed1b76f35566e979594d91c51f0a0b",
	name: "loadAffiliateLanding",
	filename: "src/lib/studio.functions.ts"
}, (opts) => loadAffiliateLanding.__executeServer(opts));
var loadAffiliateLanding = createServerFn({ method: "POST" }).validator(object({
	memberCode: string().regex(/^[A-Za-z0-9]{4,12}$/),
	productCode: string().regex(/^[A-Za-z0-9-]{2,40}$/)
})).handler(loadAffiliateLanding_createServerFn_handler, async ({ data }) => {
	const { loadAffiliateLanding: run } = await import("./studio.server-Da-2Yihe.mjs");
	return run(data.memberCode, data.productCode);
});
//#endregion
export { confirmOrder_createServerFn_handler, generateStudio_createServerFn_handler, listFeed_createServerFn_handler, listLive_createServerFn_handler, listProducts_createServerFn_handler, loadAffiliateLanding_createServerFn_handler, loadCreator_createServerFn_handler, loadModeration_createServerFn_handler, moderatePost_createServerFn_handler, recordClick_createServerFn_handler, recordRevenue_createServerFn_handler, recordView_createServerFn_handler, retryPublish_createServerFn_handler, revisePost_createServerFn_handler, saveLive_createServerFn_handler, speakCaption_createServerFn_handler, startLive_createServerFn_handler, submitPost_createServerFn_handler };
