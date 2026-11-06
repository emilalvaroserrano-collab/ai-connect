import { firebaseConfig } from "@/lib/firebase-config";
import { loadProfile } from "@/lib/firebase.server";

const BASE = `${firebaseConfig.databaseURL}/dailyConnect`;

export type CommunityComment = { id: string; name: string; text: string; at: number };

export type CommunityPost = {
  id: string;
  uid: string;
  name: string;
  caption: string;
  mediaUrl: string;
  createdAt: number;
  likes: number;
  likedBy: Record<string, boolean>;
  comments: CommunityComment[];
};

async function rget<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}${path}.json`);
  if (!res.ok) throw new Error("Could not reach the community.");
  return (await res.json()) as T | null;
}

async function rput(path: string, value: unknown) {
  const res = await fetch(`${BASE}${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error("Could not save the post.");
}

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

function withinWindow(post: CommunityPost, uid: string) {
  return post.uid === uid && Date.now() - post.createdAt < EDIT_WINDOW_MS;
}

function publicPost(post: CommunityPost, uid: string) {
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
    comments: post.comments ?? [],
  };
}

export async function listCommunity(idToken: string) {
  const profile = await loadProfile(idToken);
  const raw = await rget<Record<string, CommunityPost>>("/communityPosts");
  const posts = Object.values(raw ?? {})
    .filter((post) => post && post.mediaUrl)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((post) => publicPost(post, profile.uid));
  return { posts, name: profile.name || "Member" };
}

export async function submitCommunity(input: { idToken: string; caption: string; mediaUrl: string }) {
  const profile = await loadProfile(input.idToken);
  const mediaUrl = input.mediaUrl.trim();
  if (!mediaUrl.startsWith("https://")) throw new Error("The video did not upload.");
  const caption = input.caption.trim().slice(0, 500) || "Shared a video";
  const id = `com_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  const post: CommunityPost = {
    id,
    uid: profile.uid,
    name: profile.name || "Member",
    caption,
    mediaUrl,
    createdAt: Date.now(),
    likes: 0,
    likedBy: {},
    comments: [],
  };
  await rput(`/communityPosts/${id}`, post);
  return publicPost(post, profile.uid);
}

export async function likeCommunity(input: { idToken: string; postId: string }) {
  const profile = await loadProfile(input.idToken);
  const post = await rget<CommunityPost>(`/communityPosts/${input.postId}`);
  if (!post) throw new Error("That post is gone.");
  const likedBy = { ...(post.likedBy ?? {}) };
  if (likedBy[profile.uid]) delete likedBy[profile.uid];
  else likedBy[profile.uid] = true;
  const likes = Object.keys(likedBy).length;
  await rput(`/communityPosts/${input.postId}`, { ...post, likedBy, likes });
  return { likes, liked: Boolean(likedBy[profile.uid]) };
}

async function rdel(path: string) {
  const res = await fetch(`${BASE}${path}.json`, { method: "DELETE" });
  if (!res.ok) throw new Error("Could not delete the post.");
}

async function ownedPost(idToken: string, postId: string) {
  const profile = await loadProfile(idToken);
  const post = await rget<CommunityPost>(`/communityPosts/${postId}`);
  if (!post) throw new Error("That post is gone.");
  if (post.uid !== profile.uid) throw new Error("Only the content author can change this post.");
  if (Date.now() - post.createdAt >= EDIT_WINDOW_MS) throw new Error("Edit and delete close 24 hours after posting.");
  return { profile, post };
}

export async function editCommunity(input: { idToken: string; postId: string; caption: string }) {
  const { profile, post } = await ownedPost(input.idToken, input.postId);
  const caption = input.caption.trim().slice(0, 500);
  if (!caption) throw new Error("Write a caption.");
  const next = { ...post, caption };
  await rput(`/communityPosts/${post.id}`, next);
  return publicPost(next, profile.uid);
}

export async function deleteCommunity(input: { idToken: string; postId: string }) {
  const { post } = await ownedPost(input.idToken, input.postId);
  await rdel(`/communityPosts/${post.id}`);
  return { id: post.id };
}

export async function commentCommunity(input: { idToken: string; postId: string; text: string }) {
  const profile = await loadProfile(input.idToken);
  const text = input.text.trim().slice(0, 280);
  if (!text) throw new Error("Write a comment.");
  const post = await rget<CommunityPost>(`/communityPosts/${input.postId}`);
  if (!post) throw new Error("That post is gone.");
  const comments = [
    ...(post.comments ?? []),
    { id: `c_${Date.now().toString(36)}`, name: profile.name || "Member", text, at: Date.now() },
  ].slice(-40);
  await rput(`/communityPosts/${input.postId}`, { ...post, comments });
  return { comments };
}
