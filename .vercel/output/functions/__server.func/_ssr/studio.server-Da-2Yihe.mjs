import { c as firebaseConfig, d as manilaPeriod } from "./manila-BaDjFwMm.mjs";
import { postLedger, requireActiveMember } from "./firebase.server-BC4SNhK7.mjs";
import { n as PRODUCT_CATALOG, r as productByCode, t as DEFAULT_POLICY } from "./catalog-CzqFis8i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio.server-Da-2Yihe.js
var PLATFORMS = [
	"tiktok",
	"youtube",
	"facebook"
];
var DISCLOSURE = "Affiliate link. Daily Connect may earn a commission.";
var MISLEADING = /guaranteed\s+(income|profit|cure|sales)|100%\s*(cure|profit|safe)|get rich/i;
var COPYRIGHT = /\b(disney|pokemon|marvel studios|nike|adidas|hello kitty)\b/i;
function screenCopy(title, caption) {
	const text = `${title}\n${caption}`;
	const flags = [];
	if (MISLEADING.test(text)) flags.push("misleading-claim");
	if (COPYRIGHT.test(text)) flags.push("possible-copyright");
	return flags;
}
function videoIssues(input) {
	const issues = [];
	if (!input.mime.startsWith("video/")) issues.push("Use a video file.");
	if (!Number.isFinite(input.durationSec) || input.durationSec < 1 || input.durationSec > 58) issues.push("Video must run between 1 and 58 seconds.");
	if (input.width < 1 || input.height < 1) issues.push("Could not read the frame size.");
	else {
		const ratio = input.width / input.height;
		if (ratio < .45 || ratio > .7) issues.push("Use a portrait frame, close to 9:16.");
	}
	return issues;
}
/** 50% of net eligible revenue actually received, unless a policy overrides the bps. */
function creatorShare(gross, deductions, shareBps = 5e3) {
	const safeGross = Math.max(0, Math.round(gross));
	const safeDeductions = Math.max(0, Math.round(deductions));
	const net = Math.max(0, safeGross - safeDeductions);
	const bps = Math.min(1e4, Math.max(0, Math.round(shareBps)));
	return {
		gross: safeGross,
		deductions: safeDeductions,
		net,
		share: Math.round(net * bps / 1e4),
		basis: "net",
		shareBps: bps
	};
}
function affiliateSplit(salePesos, commissionBps, memberShareBps) {
	const sale = Math.max(0, Math.round(salePesos));
	const commission = Math.round(sale * Math.max(0, commissionBps) / 1e4);
	const memberBps = Math.min(1e4, Math.max(0, Math.round(memberShareBps)));
	const member = Math.round(commission * memberBps / 1e4);
	return {
		sale,
		grossCommission: commission,
		member,
		house: commission - member,
		memberShareBps: memberBps
	};
}
function nextRetryAt(attempts, now) {
	return now + Math.min(36e5, 3e4 * 2 ** Math.max(0, attempts));
}
function applyOrderEvent(prior, event) {
	if (prior === event) return "noop";
	if (prior === "none" && event === "confirmed") return "credit";
	if (prior === "confirmed" && (event === "refunded" || event === "cancelled")) return "reverse";
	if (prior === "none") return "record";
	return "noop";
}
function publishClaim(existing) {
	return existing ? "duplicate" : "create";
}
function withDisclosure(caption) {
	const text = caption.trim();
	if (/affiliate link/i.test(text)) return text;
	return text ? `${text} ${DISCLOSURE}` : DISCLOSURE;
}
var BASE = `${firebaseConfig.databaseURL}/dailyConnect`;
var emptyDestinations = () => ({
	tiktok: {
		status: "pending",
		url: "",
		error: "",
		attempts: 0
	},
	youtube: {
		status: "pending",
		url: "",
		error: "",
		attempts: 0
	},
	facebook: {
		status: "pending",
		url: "",
		error: "",
		attempts: 0
	}
});
async function rget(path) {
	const res = await fetch(`${BASE}${path}.json`);
	if (!res.ok) throw new Error("Could not reach the desk database.");
	return await res.json();
}
async function rput(path, value) {
	if (!(await fetch(`${BASE}${path}.json`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(value)
	})).ok) throw new Error("Could not save.");
}
function nid(prefix) {
	return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}
async function member(idToken) {
	const profile = await requireActiveMember(idToken);
	if (!profile.referralCode) throw new Error("Your member code is missing. Open membership again.");
	return profile;
}
async function ensureCatalog() {
	const existing = await rget("/products");
	if (existing && Object.keys(existing).length > 0) return;
	await Promise.all(PRODUCT_CATALOG.map((product) => rput(`/products/${product.code}`, product)));
	await rput("/commissionPolicies/default", DEFAULT_POLICY);
}
async function policy() {
	const stored = await rget("/commissionPolicies/default");
	return {
		creatorShareBps: stored?.creatorShareBps ?? DEFAULT_POLICY.creatorShareBps,
		affiliateMemberShareBps: stored?.affiliateMemberShareBps ?? DEFAULT_POLICY.affiliateMemberShareBps
	};
}
async function ensureSeedPosts() {
	if (await rget("/studioSeeded")) {
		await refreshSeedCopy();
		return;
	}
	const now = Date.now();
	const samples = [
		{
			id: "seed_projects",
			title: "How to set up ChatGPT Projects",
			caption: `Open Projects, write three instructions, and add only the files the chat should use. ${DISCLOSURE}`,
			mediaUrl: "/reels/projects.mp4",
			posterUrl: "/covers/projects.jpg",
			durationSec: 12,
			kind: "video"
		},
		{
			id: "seed_voice",
			title: "How to use ChatGPT voice",
			caption: `Write the first twenty seconds, ask one question, then wait. ${DISCLOSURE}`,
			mediaUrl: "/reels/voice.mp4",
			posterUrl: "/covers/voice.jpg",
			durationSec: 12,
			kind: "video"
		},
		{
			id: "seed_product",
			title: "How to prompt a product image",
			caption: `One object, one light, no stray text. Generate it in ChatGPT, then reject the misses. ${DISCLOSURE}`,
			mediaUrl: "/covers/product.jpg",
			posterUrl: "/covers/product.jpg",
			durationSec: 0,
			kind: "image"
		}
	];
	for (const sample of samples) {
		const post = {
			...sample,
			creatorId: "desk",
			creatorName: "Daily Connect desk",
			creatorCode: "DESK",
			hashtags: "#DailyConnect",
			productCode: sample.kind === "image" ? "course-kit" : "",
			affiliatePath: "",
			disclosure: DISCLOSURE,
			rightsConfirmed: true,
			status: "approved",
			flags: [],
			moderatorNote: "Seeded desk reel.",
			destinations: {
				tiktok: {
					status: "needs_connection",
					url: "",
					error: "Official TikTok account is not connected.",
					attempts: 0
				},
				youtube: {
					status: "needs_connection",
					url: "",
					error: "Official YouTube account is not connected.",
					attempts: 0
				},
				facebook: {
					status: "needs_connection",
					url: "",
					error: "Official Facebook Page is not connected.",
					attempts: 0
				}
			},
			createdAt: now,
			updatedAt: now
		};
		await rput(`/contentPosts/${post.id}`, post);
	}
	await rput("/studioSeeded", true);
}
async function refreshSeedCopy() {
	const copy = {
		seed_projects: {
			title: "How to set up ChatGPT Projects",
			caption: `Open Projects, write three instructions, and add only the files the chat should use. ${DISCLOSURE}`
		},
		seed_voice: {
			title: "How to use ChatGPT voice",
			caption: `Write the first twenty seconds, ask one question, then wait. ${DISCLOSURE}`
		},
		seed_product: {
			title: "How to prompt a product image",
			caption: `One object, one light, no stray text. Generate it in ChatGPT, then reject the misses. ${DISCLOSURE}`
		}
	};
	for (const [id, next] of Object.entries(copy)) {
		const post = await rget(`/contentPosts/${id}`);
		if (!post) continue;
		await rput(`/contentPosts/${id}`, {
			...post,
			...next,
			updatedAt: Date.now()
		});
	}
}
function asPosts(raw) {
	return Object.values(raw ?? {}).sort((a, b) => b.createdAt - a.createdAt);
}
async function isModerator(uid) {
	const flag = await rget(`/moderators/${uid}`);
	return Boolean(flag);
}
async function moderatorOrBootstrap(profile) {
	if (await isModerator(profile.uid)) return true;
	const mods = await rget("/moderators");
	if (Object.values(mods ?? {}).some(Boolean)) return false;
	await rput(`/moderators/${profile.uid}`, true);
	await rput(`/moderationAuditLogs/bootstrap_${profile.uid}`, {
		action: "bootstrap-moderator",
		actorId: profile.uid,
		at: Date.now(),
		note: "First active member opened the moderation desk."
	});
	return true;
}
async function notify(uid, id, title, body) {
	if (!uid || uid === "desk") return;
	await rput(`/notifications/${uid}/${id}`, {
		kind: "studio",
		title,
		body,
		read: false,
		createdAt: Date.now()
	});
}
function affiliatePath(code, productCode) {
	return productCode ? `/r/${code}/${productCode}` : "";
}
async function listFeed(idToken) {
	const profile = await member(idToken);
	await ensureCatalog();
	await ensureSeedPosts();
	return {
		posts: asPosts(await rget("/contentPosts")).filter((post) => post.status === "approved" || post.status === "publishing" || post.creatorId === profile.uid).sort((a, b) => b.createdAt - a.createdAt),
		memberCode: profile.referralCode
	};
}
async function recordView(idToken, postId) {
	await member(idToken);
	if (!/^[a-zA-Z0-9_-]{4,40}$/.test(postId)) return { views: 0 };
	const post = await rget(`/contentPosts/${postId}`);
	if (!post || post.status !== "approved" && post.status !== "publishing") return { views: 0 };
	const views = Number(await rget(`/contentAnalytics/${postId}/views`) ?? 0) + 1;
	await rput(`/contentAnalytics/${postId}/views`, views);
	return { views };
}
async function submitPost(input) {
	const profile = await member(input.idToken);
	if (!input.rightsConfirmed) throw new Error("Confirm you have rights to the picture, footage, and music.");
	const title = input.title.trim().slice(0, 80);
	const caption = withDisclosure(input.caption.slice(0, 500));
	if (!title) throw new Error("Add a title.");
	if (input.kind === "video") {
		const issues = videoIssues({
			mime: input.mime,
			durationSec: input.durationSec,
			width: input.width,
			height: input.height
		});
		if (issues.length) throw new Error(issues[0]);
		if (input.mediaUrl.startsWith("data:") && input.mediaUrl.length > 1e6) throw new Error("That clip is too heavy for the desk. Trim it under about 700KB.");
	}
	if (!input.mediaUrl.startsWith("https://") && !input.mediaUrl.startsWith("data:") && !input.mediaUrl.startsWith("/")) throw new Error("The media link is not usable.");
	const product = input.productCode ? productByCode(input.productCode) : null;
	if (input.productCode && !product) throw new Error("That product is not on the marketplace.");
	const flags = screenCopy(title, caption);
	const now = Date.now();
	const post = {
		id: nid("post"),
		creatorId: profile.uid,
		creatorName: profile.name,
		creatorCode: profile.referralCode,
		kind: input.kind,
		title,
		caption,
		hashtags: input.hashtags.trim().slice(0, 120),
		mediaUrl: input.mediaUrl,
		posterUrl: input.posterUrl || input.mediaUrl,
		durationSec: input.kind === "video" ? Math.round(input.durationSec) : 0,
		productCode: product?.code ?? "",
		affiliatePath: affiliatePath(profile.referralCode, product?.code ?? ""),
		disclosure: DISCLOSURE,
		rightsConfirmed: true,
		status: "queued",
		flags,
		moderatorNote: "",
		destinations: emptyDestinations(),
		createdAt: now,
		updatedAt: now
	};
	await rput(`/contentPosts/${post.id}`, post);
	await rput(`/contentReviews/${post.id}`, {
		postId: post.id,
		flags,
		decisions: [{
			at: now,
			by: "screening",
			action: flags.length ? "flagged" : "clear",
			note: flags.length ? flags.join(", ") : "No automated flags. Waiting on a person."
		}]
	});
	return post;
}
async function revisePost(input) {
	const profile = await member(input.idToken);
	const post = await rget(`/contentPosts/${input.postId}`);
	if (!post || post.creatorId !== profile.uid) throw new Error("That post is not yours.");
	if (post.status !== "changes" && post.status !== "rejected") throw new Error("Only a post sent back for changes can be resubmitted.");
	const title = input.title.trim().slice(0, 80);
	const caption = withDisclosure(input.caption.slice(0, 500));
	const flags = screenCopy(title, caption);
	const now = Date.now();
	const next = {
		...post,
		title,
		caption,
		flags,
		status: "queued",
		updatedAt: now,
		moderatorNote: ""
	};
	await rput(`/contentPosts/${post.id}`, next);
	const decisions = [...(await rget(`/contentReviews/${post.id}`) ?? { decisions: [] }).decisions ?? [], {
		at: now,
		by: profile.uid,
		action: "resubmit",
		note: "Creator resubmitted."
	}];
	await rput(`/contentReviews/${post.id}`, {
		postId: post.id,
		flags,
		decisions: decisions.slice(-20)
	});
	return next;
}
async function grokText(system, prompt) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return null;
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 360,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: prompt.slice(0, 1500)
			}]
		})
	});
	if (!res.ok) throw new Error(`AI is unavailable right now (${res.status}).`);
	return ((await res.json()).choices?.[0]?.message?.content ?? "").trim();
}
async function generateStudio(input) {
	const profile = await member(input.idToken);
	await ensureCatalog();
	const product = productByCode(input.productCode);
	if (!product) throw new Error("Pick a product from the marketplace.");
	const style = input.style.trim().slice(0, 240) || "plain desk, morning light";
	const path = affiliatePath(profile.referralCode, product.code);
	if (input.output === "caption" || input.output === "script") {
		let text = await grokText(input.output === "caption" ? "Write one social caption under 400 characters for Daily Connect, a Philippine learning desk. No income guarantees, no medical claims, no celebrity names. End with: Affiliate link. Daily Connect may earn a commission." : "Write a 90-second live-selling script for one host. Short lines. No income guarantees. Mention the price in US dollars and that it is an affiliate link.", `${product.name}. ${product.description}. Price $${product.price}. Style: ${style}. ${product.guidelines}`);
		const source = text ? "grok" : "desk-draft";
		if (!text) text = input.output === "caption" ? withDisclosure(`${product.name} — ${product.description} $${product.price.toLocaleString("en-US")}.`) : `Open on the product. ${product.name}, $${product.price.toLocaleString("en-US")}. ${product.description} Close with the tracked link and say it is an affiliate link.`;
		const id = nid("draft");
		const draft = {
			id,
			creatorId: profile.uid,
			productCode: product.code,
			output: input.output,
			text,
			imageUrl: product.image,
			affiliatePath: path,
			source,
			createdAt: Date.now()
		};
		await rput(`/drafts/${profile.uid}/${id}`, draft);
		return draft;
	}
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) {
		const id = nid("draft");
		const draft = {
			id,
			creatorId: profile.uid,
			productCode: product.code,
			output: "image",
			text: withDisclosure(`${product.name}. ${product.guidelines}`),
			imageUrl: product.image,
			affiliatePath: path,
			source: "desk-draft",
			createdAt: Date.now()
		};
		await rput(`/drafts/${profile.uid}/${id}`, draft);
		return draft;
	}
	const res = await fetch("https://api.x.ai/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-imagine-image",
			n: 1,
			response_format: "url",
			prompt: `Portrait product photograph, 9:16, of ${product.name}. ${product.description}. Style: ${style}. No logos of other brands, no celebrity faces, no overlaid text.`
		})
	});
	if (!res.ok) throw new Error(`Image generation is unavailable (${res.status}).`);
	const imageUrl = (await res.json()).data?.[0]?.url;
	if (!imageUrl) throw new Error("The image service returned nothing.");
	const id = nid("draft");
	const draft = {
		id,
		creatorId: profile.uid,
		productCode: product.code,
		output: "image",
		text: withDisclosure(`${product.name} — ${product.description}`),
		imageUrl,
		affiliatePath: path,
		source: "grok",
		createdAt: Date.now()
	};
	await rput(`/drafts/${profile.uid}/${id}`, draft);
	return draft;
}
async function speakCaption(idToken, text) {
	await member(idToken);
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("Voice is not configured on this desk.");
	const spoken = text.trim().slice(0, 400);
	if (!spoken) throw new Error("Nothing to read.");
	const res = await fetch("https://api.x.ai/v1/tts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			text: spoken,
			voice_id: "eve"
		})
	});
	if (!res.ok) throw new Error(`Voice is unavailable (${res.status}).`);
	return { audio: `data:audio/mpeg;base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}` };
}
async function listProducts(idToken) {
	const profile = await member(idToken);
	await ensureCatalog();
	const raw = await rget("/products");
	const products = Object.values(raw ?? {}).sort((a, b) => a.name.localeCompare(b.name));
	return {
		products,
		policy: await policy(),
		links: products.map((product) => ({
			productCode: product.code,
			path: affiliatePath(profile.referralCode, product.code)
		}))
	};
}
async function loadCreator(idToken) {
	const profile = await member(idToken);
	await ensureSeedPosts();
	const posts = asPosts(await rget("/contentPosts")).filter((post) => post.creatorId === profile.uid);
	const earnings = Object.entries(await rget("/creatorEarnings") ?? {}).map(([id, row]) => ({
		...row,
		id
	})).filter((row) => row.creatorId === profile.uid).sort((a, b) => b.createdAt - a.createdAt);
	const clicks = Number(await rget(`/clicksByMember/${profile.referralCode}`) ?? 0);
	const orders = Object.values(await rget("/affiliateOrders") ?? {}).filter((order) => order.memberCode === profile.referralCode);
	const views = {};
	await Promise.all(posts.map(async (post) => {
		views[post.id] = Number(await rget(`/contentAnalytics/${post.id}/views`) ?? 0);
	}));
	return {
		posts,
		earnings,
		clicks,
		orders,
		views,
		summary: {
			submitted: posts.length,
			pending: posts.filter((post) => post.status === "queued" || post.status === "changes").length,
			approved: posts.filter((post) => post.status === "approved" || post.status === "publishing").length,
			rejected: posts.filter((post) => post.status === "rejected").length,
			estimated: earnings.filter((row) => row.status === "estimated").reduce((sum, row) => sum + row.share, 0),
			confirmed: earnings.filter((row) => row.status === "confirmed").reduce((sum, row) => sum + row.share, 0)
		}
	};
}
async function listLive(idToken) {
	const profile = await member(idToken);
	await ensureCatalog();
	return {
		sessions: Object.values(await rget("/liveSessions") ?? {}).filter((session) => session.creatorId === profile.uid).sort((a, b) => b.createdAt - a.createdAt),
		products: Object.values(await rget("/products") ?? {})
	};
}
async function saveLive(input) {
	const profile = await member(input.idToken);
	const codes = input.productCodes.filter((code) => productByCode(code)).slice(0, 6);
	if (!codes.length) throw new Error("Pick at least one approved product.");
	const now = Date.now();
	const session = {
		id: nid("live"),
		creatorId: profile.uid,
		creatorName: profile.name,
		title: input.title.trim().slice(0, 80) || "Live desk",
		scheduledAt: input.scheduledAt || now,
		productCodes: codes,
		script: input.script.trim().slice(0, 2e3),
		status: "scheduled",
		destinations: {
			youtube: {
				status: "not_connected",
				detail: "YouTube Live is not connected. The stream key stays on the server."
			},
			facebook: {
				status: "not_connected",
				detail: "Facebook Live is not connected."
			},
			tiktok: {
				status: "not_connected",
				detail: "TikTok Live is not connected."
			}
		},
		createdAt: now
	};
	await rput(`/liveSessions/${session.id}`, session);
	return session;
}
async function startLive(idToken, sessionId) {
	const profile = await member(idToken);
	const session = await rget(`/liveSessions/${sessionId}`);
	if (!session || session.creatorId !== profile.uid) throw new Error("That session is not yours.");
	const detail = "Ingestion is not connected for this destination, so it did not go live. Other destinations are checked on their own.";
	const next = {
		...session,
		status: "blocked",
		destinations: {
			youtube: {
				status: "blocked",
				detail
			},
			facebook: {
				status: "blocked",
				detail
			},
			tiktok: {
				status: "blocked",
				detail
			}
		}
	};
	await rput(`/liveSessions/${session.id}`, next);
	await rput(`/liveDestinations/${session.id}`, next.destinations);
	return next;
}
async function loadModeration(idToken) {
	const profile = await member(idToken);
	await ensureCatalog();
	await ensureSeedPosts();
	if (!await moderatorOrBootstrap(profile)) return {
		allowed: false,
		posts: [],
		products: []
	};
	return {
		allowed: true,
		posts: asPosts(await rget("/contentPosts")).filter((post) => post.creatorId !== "desk"),
		products: Object.values(await rget("/products") ?? {})
	};
}
var CONNECT_NOTE = {
	tiktok: "Official TikTok account is not connected. This job will not post until the server has an approved token.",
	youtube: "Official YouTube account is not connected. This job will not post until the server has an approved token.",
	facebook: "Official Facebook Page is not connected. This job will not post until the server has an approved token."
};
async function moderatePost(input) {
	const profile = await member(input.idToken);
	if (!await moderatorOrBootstrap(profile)) throw new Error("Only a desk moderator can do that.");
	const post = await rget(`/contentPosts/${input.postId}`);
	if (!post) throw new Error("Post not found.");
	if (post.creatorId === profile.uid && input.action === "approve") {
		const mods = await rget("/moderators");
		if (Object.entries(mods ?? {}).some(([id, on]) => on && id !== profile.uid)) throw new Error("Ask another moderator to approve your own post.");
	}
	const now = Date.now();
	const note = input.note.trim().slice(0, 240);
	let status = "queued";
	if (input.action === "reject") status = "rejected";
	if (input.action === "changes") status = "changes";
	let destinations = post.destinations;
	if (input.action === "approve") {
		status = "publishing";
		destinations = { ...post.destinations };
		for (const platform of PLATFORMS) {
			const jobId = `${post.id}_${platform}`;
			const existing = await rget(`/socialPublishJobs/${jobId}`);
			if (publishClaim(Boolean(existing)) === "duplicate") continue;
			const job = {
				id: jobId,
				postId: post.id,
				platform,
				status: "needs_connection",
				url: "",
				error: CONNECT_NOTE[platform],
				attempts: 0,
				idempotencyKey: `publish:${post.id}:${platform}`,
				nextAttemptAt: 0,
				updatedAt: now
			};
			await rput(`/socialPublishJobs/${jobId}`, job);
			destinations[platform] = {
				status: "needs_connection",
				url: "",
				error: CONNECT_NOTE[platform],
				attempts: 0
			};
		}
	}
	const next = {
		...post,
		status,
		moderatorNote: note,
		destinations,
		updatedAt: now
	};
	await rput(`/contentPosts/${post.id}`, next);
	const review = await rget(`/contentReviews/${post.id}`) ?? {
		decisions: [],
		flags: post.flags
	};
	const decisions = [...review.decisions ?? [], {
		at: now,
		by: profile.uid,
		action: input.action,
		note: note || input.action
	}].slice(-20);
	await rput(`/contentReviews/${post.id}`, {
		postId: post.id,
		flags: review.flags ?? post.flags,
		decisions
	});
	await rput(`/moderationAuditLogs/${nid("audit")}`, {
		action: input.action,
		actorId: profile.uid,
		postId: post.id,
		at: now,
		note
	});
	await notify(post.creatorId, `mod_${post.id}_${now}`, input.action === "approve" ? "Approved, waiting on platforms" : input.action === "reject" ? "Not published" : "Changes requested", note || (input.action === "approve" ? "A person approved it. TikTok, YouTube, and Facebook still need a connected official account." : "Open Creator Studio for the note."));
	return next;
}
async function retryPublish(idToken, postId, platform) {
	const profile = await member(idToken);
	const post = await rget(`/contentPosts/${postId}`);
	if (!post) throw new Error("Post not found.");
	const moderator = await isModerator(profile.uid);
	if (post.creatorId !== profile.uid && !moderator) throw new Error("You cannot retry this post.");
	if (post.status !== "publishing" && post.status !== "approved") throw new Error("This post is not in the publishing queue.");
	const jobId = `${post.id}_${platform}`;
	const job = await rget(`/socialPublishJobs/${jobId}`);
	if (!job) throw new Error("There is no publishing job yet.");
	const attempts = Number(job.attempts ?? 0) + 1;
	const now = Date.now();
	const error = CONNECT_NOTE[platform];
	await rput(`/socialPublishJobs/${jobId}`, {
		...job,
		id: jobId,
		postId: post.id,
		platform,
		status: "needs_connection",
		url: "",
		error,
		attempts,
		idempotencyKey: job.idempotencyKey ?? `publish:${post.id}:${platform}`,
		nextAttemptAt: nextRetryAt(attempts, now),
		updatedAt: now
	});
	const destinations = {
		...post.destinations,
		[platform]: {
			status: "needs_connection",
			url: "",
			error,
			attempts
		}
	};
	await rput(`/contentPosts/${post.id}`, {
		...post,
		destinations,
		updatedAt: now
	});
	await notify(post.creatorId, `retry_${jobId}_${attempts}`, `${platform} still waiting`, error);
	return {
		attempts,
		nextAttemptAt: nextRetryAt(attempts, now),
		error
	};
}
async function confirmOrder(input) {
	const profile = await member(input.idToken);
	if (!await moderatorOrBootstrap(profile)) throw new Error("Only a desk moderator can record merchant orders.");
	if (!/^[A-Za-z0-9_-]{4,40}$/.test(input.orderId)) throw new Error("Order id should be the merchant’s id, letters and numbers.");
	const product = productByCode(input.productCode);
	if (!product) throw new Error("Unknown product.");
	const memberId = await rget(`/referralCodes/${input.memberCode}`);
	if (!memberId) throw new Error("Unknown member code.");
	const rules = await policy();
	const split = affiliateSplit(input.salePesos, product.commissionBps, rules.affiliateMemberShareBps);
	const existing = await rget(`/affiliateOrders/${input.orderId}`);
	const prior = existing?.status ?? "none";
	const action = applyOrderEvent(prior, input.event);
	const now = Date.now();
	if (action === "credit" && split.member > 0) {
		if (!(await postLedger({
			uid: memberId,
			txId: `aff_${input.orderId}`,
			type: "affiliate_commission",
			amount: split.member,
			note: `${product.name} order ${input.orderId}`,
			sourceUserId: null
		})).applied && prior === "none") {
			if ((await rget(`/affiliateOrders/${input.orderId}`))?.status === "confirmed") return {
				action: "noop",
				member: split.member
			};
		}
	}
	if (action === "reverse") {
		const amount = -Math.abs(existing?.memberPesos ?? split.member);
		if (amount !== 0) await postLedger({
			uid: memberId,
			txId: `adj_${input.orderId}`,
			type: "adjustment",
			amount,
			note: `Reversal ${input.orderId}`
		});
	}
	if (action === "noop") return {
		action,
		member: existing?.memberPesos ?? 0
	};
	await rput(`/affiliateOrders/${input.orderId}`, {
		id: input.orderId,
		memberCode: input.memberCode,
		memberId,
		productCode: product.code,
		salePesos: split.sale,
		grossCommission: split.grossCommission,
		memberPesos: split.member,
		housePesos: split.house,
		status: input.event,
		period: manilaPeriod(),
		updatedAt: now
	});
	await rput(`/moderationAuditLogs/${nid("audit")}`, {
		action: `order-${input.event}`,
		actorId: profile.uid,
		orderId: input.orderId,
		at: now
	});
	if (action === "credit") await notify(memberId, `aff_${input.orderId}`, "Affiliate commission", `$${split.member} from ${product.name}. Merchant confirmed the order.`);
	return {
		action,
		member: split.member
	};
}
async function recordRevenue(input) {
	const profile = await member(input.idToken);
	if (!await moderatorOrBootstrap(profile)) throw new Error("Only a desk moderator can record revenue.");
	if (!/^[A-Za-z0-9_-]{4,40}$/.test(input.reportId)) throw new Error("Use a report id with letters and numbers.");
	const post = await rget(`/contentPosts/${input.postId}`);
	if (!post) throw new Error("Unknown post.");
	if (post.creatorId === "desk") throw new Error("Desk reels are not in the creator pool.");
	const rules = await policy();
	const share = creatorShare(input.gross, input.deductions, rules.creatorShareBps);
	const existing = await rget(`/creatorEarnings/${input.reportId}`);
	if (existing) return {
		applied: false,
		share: existing.share,
		status: existing.status
	};
	const row = {
		id: input.reportId,
		postId: post.id,
		creatorId: post.creatorId,
		period: manilaPeriod(),
		source: input.source.trim().slice(0, 80) || "configured-revenue",
		gross: share.gross,
		deductions: share.deductions,
		net: share.net,
		share: share.share,
		basis: "net",
		status: input.status,
		createdAt: Date.now()
	};
	await rput(`/creatorEarnings/${input.reportId}`, row);
	if (input.status === "confirmed" && share.share > 0) {
		await postLedger({
			uid: post.creatorId,
			txId: `earn_${input.reportId}`,
			type: "creator_share",
			amount: share.share,
			note: `50% of net on ${post.title}`
		});
		await notify(post.creatorId, `earn_${input.reportId}`, "Creator share confirmed", `$${share.share} posted to the wallet. Estimated figures were not paid.`);
	}
	await rput(`/moderationAuditLogs/${nid("audit")}`, {
		action: `revenue-${input.status}`,
		actorId: profile.uid,
		reportId: input.reportId,
		postId: post.id,
		at: Date.now()
	});
	return {
		applied: true,
		share: share.share,
		status: input.status
	};
}
async function recordClick(memberCode, productCode) {
	const product = productByCode(productCode.toLowerCase());
	if (!product) throw new Error("Unknown product.");
	const code = memberCode.toUpperCase();
	const memberId = await rget(`/referralCodes/${code}`);
	if (!memberId) throw new Error("Unknown member link.");
	const stamp = await rget(`/affiliateLinks/${code}/${product.code}/lastClick`);
	const now = Date.now();
	if (stamp && now - stamp < 3e4) return {
		recorded: false,
		product
	};
	const clickId = nid("click");
	await rput(`/affiliateClicks/${clickId}`, {
		id: clickId,
		memberCode: code,
		memberId,
		productCode: product.code,
		at: now
	});
	await rput(`/affiliateLinks/${code}/${product.code}`, {
		memberCode: code,
		productCode: product.code,
		path: `/r/${code}/${product.code}`,
		lastClick: now
	});
	const clicks = Number(await rget(`/clicksByMember/${code}`) ?? 0) + 1;
	await rput(`/clicksByMember/${code}`, clicks);
	return {
		recorded: true,
		product
	};
}
async function loadAffiliateLanding(memberCode, productCode) {
	await ensureCatalog();
	const product = productByCode(productCode.toLowerCase());
	if (!product) throw new Error("That product is not listed.");
	const memberId = await rget(`/referralCodes/${memberCode.toUpperCase()}`);
	if (!memberId) throw new Error("That member link is not active.");
	return {
		product,
		memberName: (await rget(`/users/${memberId}`))?.name || "Member",
		disclosure: DISCLOSURE,
		windowDays: product.windowDays
	};
}
//#endregion
export { confirmOrder, generateStudio, listFeed, listLive, listProducts, loadAffiliateLanding, loadCreator, loadModeration, moderatePost, recordClick, recordRevenue, recordView, retryPublish, revisePost, saveLive, speakCaption, startLive, submitPost };
