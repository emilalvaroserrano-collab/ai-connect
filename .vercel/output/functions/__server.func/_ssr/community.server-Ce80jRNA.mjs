import { c as firebaseConfig } from "./manila-BaDjFwMm.mjs";
import { loadProfile } from "./firebase.server-BC4SNhK7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community.server-Ce80jRNA.js
var BASE = `${firebaseConfig.databaseURL}/dailyConnect`;
async function rget(path) {
	const res = await fetch(`${BASE}${path}.json`);
	if (!res.ok) throw new Error("Could not reach the community.");
	return await res.json();
}
async function rput(path, value) {
	if (!(await fetch(`${BASE}${path}.json`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(value)
	})).ok) throw new Error("Could not save the post.");
}
var EDIT_WINDOW_MS = 864e5;
function withinWindow(post, uid) {
	return post.uid === uid && Date.now() - post.createdAt < EDIT_WINDOW_MS;
}
function publicPost(post, uid) {
	return {
		id: post.id,
		name: post.name,
		caption: post.caption,
		mediaUrl: post.mediaUrl,
		createdAt: post.createdAt,
		likes: post.likes,
		liked: Boolean(post.likedBy?.[uid]),
		mine: post.uid === uid,
		canManage: withinWindow(post, uid),
		comments: post.comments ?? []
	};
}
async function listCommunity(idToken) {
	const profile = await loadProfile(idToken);
	const raw = await rget("/communityPosts");
	return {
		posts: Object.values(raw ?? {}).filter((post) => post && post.mediaUrl).sort((a, b) => b.createdAt - a.createdAt).map((post) => publicPost(post, profile.uid)),
		name: profile.name || "Member"
	};
}
async function submitCommunity(input) {
	const profile = await loadProfile(input.idToken);
	const mediaUrl = input.mediaUrl.trim();
	if (!mediaUrl.startsWith("https://")) throw new Error("The video did not upload.");
	const caption = input.caption.trim().slice(0, 500) || "Shared a video";
	const id = `com_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
	const post = {
		id,
		uid: profile.uid,
		name: profile.name || "Member",
		caption,
		mediaUrl,
		createdAt: Date.now(),
		likes: 0,
		likedBy: {},
		comments: []
	};
	await rput(`/communityPosts/${id}`, post);
	return publicPost(post, profile.uid);
}
async function likeCommunity(input) {
	const profile = await loadProfile(input.idToken);
	const post = await rget(`/communityPosts/${input.postId}`);
	if (!post) throw new Error("That post is gone.");
	const likedBy = { ...post.likedBy ?? {} };
	if (likedBy[profile.uid]) delete likedBy[profile.uid];
	else likedBy[profile.uid] = true;
	const likes = Object.keys(likedBy).length;
	await rput(`/communityPosts/${input.postId}`, {
		...post,
		likedBy,
		likes
	});
	return {
		likes,
		liked: Boolean(likedBy[profile.uid])
	};
}
async function rdel(path) {
	if (!(await fetch(`${BASE}${path}.json`, { method: "DELETE" })).ok) throw new Error("Could not delete the post.");
}
async function ownedPost(idToken, postId) {
	const profile = await loadProfile(idToken);
	const post = await rget(`/communityPosts/${postId}`);
	if (!post) throw new Error("That post is gone.");
	if (post.uid !== profile.uid) throw new Error("Only the content author can change this post.");
	if (Date.now() - post.createdAt >= EDIT_WINDOW_MS) throw new Error("Edit and delete close 24 hours after posting.");
	return {
		profile,
		post
	};
}
async function editCommunity(input) {
	const { profile, post } = await ownedPost(input.idToken, input.postId);
	const caption = input.caption.trim().slice(0, 500);
	if (!caption) throw new Error("Write a caption.");
	const next = {
		...post,
		caption
	};
	await rput(`/communityPosts/${post.id}`, next);
	return publicPost(next, profile.uid);
}
async function deleteCommunity(input) {
	const { post } = await ownedPost(input.idToken, input.postId);
	await rdel(`/communityPosts/${post.id}`);
	return { id: post.id };
}
async function commentCommunity(input) {
	const profile = await loadProfile(input.idToken);
	const text = input.text.trim().slice(0, 280);
	if (!text) throw new Error("Write a comment.");
	const post = await rget(`/communityPosts/${input.postId}`);
	if (!post) throw new Error("That post is gone.");
	const comments = [...post.comments ?? [], {
		id: `c_${Date.now().toString(36)}`,
		name: profile.name || "Member",
		text,
		at: Date.now()
	}].slice(-40);
	await rput(`/communityPosts/${input.postId}`, {
		...post,
		comments
	});
	return { comments };
}
//#endregion
export { commentCommunity, deleteCommunity, editCommunity, likeCommunity, listCommunity, submitCommunity };
