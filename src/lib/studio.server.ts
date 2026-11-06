import { requireActiveMember, postLedger } from "@/lib/firebase.server";
import { firebaseConfig } from "@/lib/firebase-config";
import { manilaPeriod } from "@/lib/manila";
import { DEFAULT_POLICY, PRODUCT_CATALOG, productByCode, type StudioProduct } from "@/lib/studio/catalog";
import {
  DISCLOSURE,
  PLATFORMS,
  affiliateSplit,
  applyOrderEvent,
  creatorShare,
  nextRetryAt,
  publishClaim,
  screenCopy,
  videoIssues,
  withDisclosure,
  type OrderStatus,
  type Platform,
} from "@/lib/studio/policy";
import type { UserPublic } from "@/lib/types";

const BASE = `${firebaseConfig.databaseURL}/dailyConnect`;

export type DestinationState = {
  status: "pending" | "needs_connection" | "published" | "failed";
  url: string;
  error: string;
  attempts: number;
};

export type ContentPost = {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorCode: string;
  kind: "video" | "image";
  title: string;
  caption: string;
  hashtags: string;
  mediaUrl: string;
  posterUrl: string;
  durationSec: number;
  productCode: string;
  affiliatePath: string;
  disclosure: string;
  rightsConfirmed: boolean;
  status: "queued" | "changes" | "rejected" | "approved" | "publishing";
  flags: string[];
  moderatorNote: string;
  destinations: Record<Platform, DestinationState>;
  createdAt: number;
  updatedAt: number;
};

export type LiveSession = {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  scheduledAt: number;
  productCodes: string[];
  script: string;
  status: "scheduled" | "blocked";
  destinations: Record<Platform, { status: "not_connected" | "blocked" | "idle"; detail: string }>;
  createdAt: number;
};

export type EarningRow = {
  id: string;
  postId: string;
  creatorId: string;
  period: string;
  source: string;
  gross: number;
  deductions: number;
  net: number;
  share: number;
  basis: "net";
  status: "estimated" | "confirmed";
  createdAt: number;
};

const emptyDestinations = (): Record<Platform, DestinationState> => ({
  tiktok: { status: "pending", url: "", error: "", attempts: 0 },
  youtube: { status: "pending", url: "", error: "", attempts: 0 },
  facebook: { status: "pending", url: "", error: "", attempts: 0 },
});

async function rget<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}${path}.json`);
  if (!res.ok) throw new Error("Could not reach the desk database.");
  return (await res.json()) as T | null;
}

async function rput(path: string, value: unknown) {
  const res = await fetch(`${BASE}${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error("Could not save.");
}

function nid(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

async function member(idToken: string) {
  const profile = await requireActiveMember(idToken);
  if (!profile.referralCode) throw new Error("Your member code is missing. Open membership again.");
  return profile;
}

async function ensureCatalog() {
  const existing = await rget<Record<string, StudioProduct>>("/products");
  if (existing && Object.keys(existing).length > 0) return;
  await Promise.all(PRODUCT_CATALOG.map((product) => rput(`/products/${product.code}`, product)));
  await rput("/commissionPolicies/default", DEFAULT_POLICY);
}

async function policy() {
  const stored = await rget<typeof DEFAULT_POLICY>("/commissionPolicies/default");
  return {
    creatorShareBps: stored?.creatorShareBps ?? DEFAULT_POLICY.creatorShareBps,
    affiliateMemberShareBps: stored?.affiliateMemberShareBps ?? DEFAULT_POLICY.affiliateMemberShareBps,
  };
}

async function ensureSeedPosts() {
  const flag = await rget<boolean>("/studioSeeded");
  if (flag) {
    await refreshSeedCopy();
    return;
  }
  const now = Date.now();
  const samples: Array<Pick<ContentPost, "id" | "title" | "caption" | "mediaUrl" | "posterUrl" | "durationSec" | "kind">> = [
    {
      id: "seed_projects",
      title: "How to set up ChatGPT Projects",
      caption: `Open Projects, write three instructions, and add only the files the chat should use. ${DISCLOSURE}`,
      mediaUrl: "/reels/projects.mp4",
      posterUrl: "/covers/projects.jpg",
      durationSec: 12,
      kind: "video",
    },
    {
      id: "seed_voice",
      title: "How to use ChatGPT voice",
      caption: `Write the first twenty seconds, ask one question, then wait. ${DISCLOSURE}`,
      mediaUrl: "/reels/voice.mp4",
      posterUrl: "/covers/voice.jpg",
      durationSec: 12,
      kind: "video",
    },
    {
      id: "seed_product",
      title: "How to prompt a product image",
      caption: `One object, one light, no stray text. Generate it in ChatGPT, then reject the misses. ${DISCLOSURE}`,
      mediaUrl: "/covers/product.jpg",
      posterUrl: "/covers/product.jpg",
      durationSec: 0,
      kind: "image",
    },
  ];
  for (const sample of samples) {
    const post: ContentPost = {
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
        tiktok: { status: "needs_connection", url: "", error: "Official TikTok account is not connected.", attempts: 0 },
        youtube: { status: "needs_connection", url: "", error: "Official YouTube account is not connected.", attempts: 0 },
        facebook: { status: "needs_connection", url: "", error: "Official Facebook Page is not connected.", attempts: 0 },
      },
      createdAt: now,
      updatedAt: now,
    };
    await rput(`/contentPosts/${post.id}`, post);
  }
  await rput("/studioSeeded", true);
}

async function refreshSeedCopy() {
  const copy: Record<string, { title: string; caption: string }> = {
    seed_projects: {
      title: "How to set up ChatGPT Projects",
      caption: `Open Projects, write three instructions, and add only the files the chat should use. ${DISCLOSURE}`,
    },
    seed_voice: {
      title: "How to use ChatGPT voice",
      caption: `Write the first twenty seconds, ask one question, then wait. ${DISCLOSURE}`,
    },
    seed_product: {
      title: "How to prompt a product image",
      caption: `One object, one light, no stray text. Generate it in ChatGPT, then reject the misses. ${DISCLOSURE}`,
    },
  };
  for (const [id, next] of Object.entries(copy)) {
    const post = await rget<ContentPost>(`/contentPosts/${id}`);
    if (!post) continue;
    await rput(`/contentPosts/${id}`, { ...post, ...next, updatedAt: Date.now() });
  }
}

function asPosts(raw: Record<string, ContentPost> | null) {
  return Object.values(raw ?? {}).sort((a, b) => b.createdAt - a.createdAt);
}

async function isModerator(uid: string) {
  const flag = await rget<boolean>(`/moderators/${uid}`);
  return Boolean(flag);
}

async function moderatorOrBootstrap(profile: UserPublic) {
  if (await isModerator(profile.uid)) return true;
  const mods = await rget<Record<string, boolean>>("/moderators");
  const any = Object.values(mods ?? {}).some(Boolean);
  if (any) return false;
  await rput(`/moderators/${profile.uid}`, true);
  await rput(`/moderationAuditLogs/bootstrap_${profile.uid}`, {
    action: "bootstrap-moderator",
    actorId: profile.uid,
    at: Date.now(),
    note: "First active member opened the moderation desk.",
  });
  return true;
}

async function notify(uid: string, id: string, title: string, body: string) {
  if (!uid || uid === "desk") return;
  await rput(`/notifications/${uid}/${id}`, {
    kind: "studio",
    title,
    body,
    read: false,
    createdAt: Date.now(),
  });
}

function affiliatePath(code: string, productCode: string) {
  return productCode ? `/r/${code}/${productCode}` : "";
}

export async function listFeed(idToken: string) {
  const profile = await member(idToken);
  await ensureCatalog();
  await ensureSeedPosts();
  const posts = asPosts(await rget<Record<string, ContentPost>>("/contentPosts"))
    .filter(
      (post) =>
        post.status === "approved" || post.status === "publishing" || post.creatorId === profile.uid,
    )
    .sort((a, b) => b.createdAt - a.createdAt);
  return { posts, memberCode: profile.referralCode };
}

export async function recordView(idToken: string, postId: string) {
  await member(idToken);
  if (!/^[a-zA-Z0-9_-]{4,40}$/.test(postId)) return { views: 0 };
  const post = await rget<ContentPost>(`/contentPosts/${postId}`);
  if (!post || (post.status !== "approved" && post.status !== "publishing")) return { views: 0 };
  const views = Number((await rget<number>(`/contentAnalytics/${postId}/views`)) ?? 0) + 1;
  await rput(`/contentAnalytics/${postId}/views`, views);
  return { views };
}

export async function submitPost(input: {
  idToken: string;
  title: string;
  caption: string;
  hashtags: string;
  kind: "video" | "image";
  mediaUrl: string;
  posterUrl: string;
  durationSec: number;
  width: number;
  height: number;
  mime: string;
  productCode: string;
  rightsConfirmed: boolean;
}) {
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
      height: input.height,
    });
    if (issues.length) throw new Error(issues[0]);
    if (input.mediaUrl.startsWith("data:") && input.mediaUrl.length > 1_000_000) {
      throw new Error("That clip is too heavy for the desk. Trim it under about 700KB.");
    }
  }
  if (!input.mediaUrl.startsWith("https://") && !input.mediaUrl.startsWith("data:") && !input.mediaUrl.startsWith("/")) {
    throw new Error("The media link is not usable.");
  }
  const product = input.productCode ? productByCode(input.productCode) : null;
  if (input.productCode && !product) throw new Error("That product is not on the marketplace.");
  const flags = screenCopy(title, caption);
  const now = Date.now();
  const post: ContentPost = {
    id: nid("post"),
    creatorId: profile.uid,
    creatorName: profile.name,
    creatorCode: profile.referralCode!,
    kind: input.kind,
    title,
    caption,
    hashtags: input.hashtags.trim().slice(0, 120),
    mediaUrl: input.mediaUrl,
    posterUrl: input.posterUrl || input.mediaUrl,
    durationSec: input.kind === "video" ? Math.round(input.durationSec) : 0,
    productCode: product?.code ?? "",
    affiliatePath: affiliatePath(profile.referralCode!, product?.code ?? ""),
    disclosure: DISCLOSURE,
    rightsConfirmed: true,
    status: "queued",
    flags,
    moderatorNote: "",
    destinations: emptyDestinations(),
    createdAt: now,
    updatedAt: now,
  };
  await rput(`/contentPosts/${post.id}`, post);
  await rput(`/contentReviews/${post.id}`, {
    postId: post.id,
    flags,
    decisions: [
      {
        at: now,
        by: "screening",
        action: flags.length ? "flagged" : "clear",
        note: flags.length ? flags.join(", ") : "No automated flags. Waiting on a person.",
      },
    ],
  });
  return post;
}

export async function revisePost(input: {
  idToken: string;
  postId: string;
  title: string;
  caption: string;
}) {
  const profile = await member(input.idToken);
  const post = await rget<ContentPost>(`/contentPosts/${input.postId}`);
  if (!post || post.creatorId !== profile.uid) throw new Error("That post is not yours.");
  if (post.status !== "changes" && post.status !== "rejected") {
    throw new Error("Only a post sent back for changes can be resubmitted.");
  }
  const title = input.title.trim().slice(0, 80);
  const caption = withDisclosure(input.caption.slice(0, 500));
  const flags = screenCopy(title, caption);
  const now = Date.now();
  const next: ContentPost = { ...post, title, caption, flags, status: "queued", updatedAt: now, moderatorNote: "" };
  await rput(`/contentPosts/${post.id}`, next);
  const review = (await rget<{ decisions?: { at: number; by: string; action: string; note: string }[] }>(
    `/contentReviews/${post.id}`,
  )) ?? { decisions: [] };
  const decisions = [...(review.decisions ?? []), { at: now, by: profile.uid, action: "resubmit", note: "Creator resubmitted." }];
  await rput(`/contentReviews/${post.id}`, { postId: post.id, flags, decisions: decisions.slice(-20) });
  return next;
}

async function grokText(system: string, prompt: string) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 360,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt.slice(0, 1500) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI is unavailable right now (${res.status}).`);
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return (body.choices?.[0]?.message?.content ?? "").trim();
}

export async function generateStudio(input: {
  idToken: string;
  productCode: string;
  output: "image" | "caption" | "script";
  style: string;
}) {
  const profile = await member(input.idToken);
  await ensureCatalog();
  const product = productByCode(input.productCode);
  if (!product) throw new Error("Pick a product from the marketplace.");
  const style = input.style.trim().slice(0, 240) || "plain desk, morning light";
  const path = affiliatePath(profile.referralCode!, product.code);
  if (input.output === "caption" || input.output === "script") {
    const system =
      input.output === "caption"
        ? "Write one social caption under 400 characters for Daily Connect, a Philippine learning desk. No income guarantees, no medical claims, no celebrity names. End with: Affiliate link. Daily Connect may earn a commission."
        : "Write a 90-second live-selling script for one host. Short lines. No income guarantees. Mention the price in US dollars and that it is an affiliate link.";
    let text = await grokText(system, `${product.name}. ${product.description}. Price $${product.price}. Style: ${style}. ${product.guidelines}`);
    const source = text ? "grok" : "desk-draft";
    if (!text) {
      text =
        input.output === "caption"
          ? withDisclosure(`${product.name} — ${product.description} $${product.price.toLocaleString("en-US")}.`)
          : `Open on the product. ${product.name}, $${product.price.toLocaleString("en-US")}. ${product.description} Close with the tracked link and say it is an affiliate link.`;
    }
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
      createdAt: Date.now(),
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
      output: "image" as const,
      text: withDisclosure(`${product.name}. ${product.guidelines}`),
      imageUrl: product.image,
      affiliatePath: path,
      source: "desk-draft",
      createdAt: Date.now(),
    };
    await rput(`/drafts/${profile.uid}/${id}`, draft);
    return draft;
  }
  const res = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "grok-imagine-image",
      n: 1,
      response_format: "url",
      prompt: `Portrait product photograph, 9:16, of ${product.name}. ${product.description}. Style: ${style}. No logos of other brands, no celebrity faces, no overlaid text.`,
    }),
  });
  if (!res.ok) throw new Error(`Image generation is unavailable (${res.status}).`);
  const body = (await res.json()) as { data?: { url?: string }[] };
  const imageUrl = body.data?.[0]?.url;
  if (!imageUrl) throw new Error("The image service returned nothing.");
  const id = nid("draft");
  const draft = {
    id,
    creatorId: profile.uid,
    productCode: product.code,
    output: "image" as const,
    text: withDisclosure(`${product.name} — ${product.description}`),
    imageUrl,
    affiliatePath: path,
    source: "grok",
    createdAt: Date.now(),
  };
  await rput(`/drafts/${profile.uid}/${id}`, draft);
  return draft;
}

export async function speakCaption(idToken: string, text: string) {
  await member(idToken);
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("Voice is not configured on this desk.");
  const spoken = text.trim().slice(0, 400);
  if (!spoken) throw new Error("Nothing to read.");
  const res = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ text: spoken, voice_id: "eve" }),
  });
  if (!res.ok) throw new Error(`Voice is unavailable (${res.status}).`);
  const bytes = Buffer.from(await res.arrayBuffer());
  return { audio: `data:audio/mpeg;base64,${bytes.toString("base64")}` };
}

export async function listProducts(idToken: string) {
  const profile = await member(idToken);
  await ensureCatalog();
  const raw = await rget<Record<string, StudioProduct>>("/products");
  const products = Object.values(raw ?? {}).sort((a, b) => a.name.localeCompare(b.name));
  const rules = await policy();
  return {
    products,
    policy: rules,
    links: products.map((product) => ({
      productCode: product.code,
      path: affiliatePath(profile.referralCode!, product.code),
    })),
  };
}

export async function loadCreator(idToken: string) {
  const profile = await member(idToken);
  await ensureSeedPosts();
  const posts = asPosts(await rget<Record<string, ContentPost>>("/contentPosts")).filter(
    (post) => post.creatorId === profile.uid,
  );
  const earnings = Object.entries((await rget<Record<string, EarningRow>>("/creatorEarnings")) ?? {})
    .map(([id, row]) => ({ ...row, id }))
    .filter((row) => row.creatorId === profile.uid)
    .sort((a, b) => b.createdAt - a.createdAt);
  const clicks = Number((await rget<number>(`/clicksByMember/${profile.referralCode}`)) ?? 0);
  const orders = Object.values((await rget<Record<string, { memberCode: string; status: string; memberPesos: number; productCode: string; id?: string }>>("/affiliateOrders")) ?? {})
    .filter((order) => order.memberCode === profile.referralCode);
  const views: Record<string, number> = {};
  await Promise.all(
    posts.map(async (post) => {
      views[post.id] = Number((await rget<number>(`/contentAnalytics/${post.id}/views`)) ?? 0);
    }),
  );
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
      confirmed: earnings.filter((row) => row.status === "confirmed").reduce((sum, row) => sum + row.share, 0),
    },
  };
}

export async function listLive(idToken: string) {
  const profile = await member(idToken);
  await ensureCatalog();
  const sessions = Object.values((await rget<Record<string, LiveSession>>("/liveSessions")) ?? {})
    .filter((session) => session.creatorId === profile.uid)
    .sort((a, b) => b.createdAt - a.createdAt);
  const products = Object.values((await rget<Record<string, StudioProduct>>("/products")) ?? {});
  return { sessions, products };
}

export async function saveLive(input: {
  idToken: string;
  title: string;
  scheduledAt: number;
  productCodes: string[];
  script: string;
}) {
  const profile = await member(input.idToken);
  const codes = input.productCodes.filter((code) => productByCode(code)).slice(0, 6);
  if (!codes.length) throw new Error("Pick at least one approved product.");
  const now = Date.now();
  const session: LiveSession = {
    id: nid("live"),
    creatorId: profile.uid,
    creatorName: profile.name,
    title: input.title.trim().slice(0, 80) || "Live desk",
    scheduledAt: input.scheduledAt || now,
    productCodes: codes,
    script: input.script.trim().slice(0, 2000),
    status: "scheduled",
    destinations: {
      youtube: { status: "not_connected", detail: "YouTube Live is not connected. The stream key stays on the server." },
      facebook: { status: "not_connected", detail: "Facebook Live is not connected." },
      tiktok: { status: "not_connected", detail: "TikTok Live is not connected." },
    },
    createdAt: now,
  };
  await rput(`/liveSessions/${session.id}`, session);
  return session;
}

export async function startLive(idToken: string, sessionId: string) {
  const profile = await member(idToken);
  const session = await rget<LiveSession>(`/liveSessions/${sessionId}`);
  if (!session || session.creatorId !== profile.uid) throw new Error("That session is not yours.");
  const detail = "Ingestion is not connected for this destination, so it did not go live. Other destinations are checked on their own.";
  const next: LiveSession = {
    ...session,
    status: "blocked",
    destinations: {
      youtube: { status: "blocked", detail },
      facebook: { status: "blocked", detail },
      tiktok: { status: "blocked", detail },
    },
  };
  await rput(`/liveSessions/${session.id}`, next);
  await rput(`/liveDestinations/${session.id}`, next.destinations);
  return next;
}

export async function loadModeration(idToken: string) {
  const profile = await member(idToken);
  await ensureCatalog();
  await ensureSeedPosts();
  const allowed = await moderatorOrBootstrap(profile);
  if (!allowed) return { allowed: false as const, posts: [] as ContentPost[], products: [] as StudioProduct[] };
  const posts = asPosts(await rget<Record<string, ContentPost>>("/contentPosts")).filter((post) => post.creatorId !== "desk");
  const products = Object.values((await rget<Record<string, StudioProduct>>("/products")) ?? {});
  return { allowed: true as const, posts, products };
}

const CONNECT_NOTE: Record<Platform, string> = {
  tiktok: "Official TikTok account is not connected. This job will not post until the server has an approved token.",
  youtube: "Official YouTube account is not connected. This job will not post until the server has an approved token.",
  facebook: "Official Facebook Page is not connected. This job will not post until the server has an approved token.",
};

export async function moderatePost(input: {
  idToken: string;
  postId: string;
  action: "approve" | "reject" | "changes";
  note: string;
}) {
  const profile = await member(input.idToken);
  if (!(await moderatorOrBootstrap(profile))) throw new Error("Only a desk moderator can do that.");
  const post = await rget<ContentPost>(`/contentPosts/${input.postId}`);
  if (!post) throw new Error("Post not found.");
  if (post.creatorId === profile.uid && input.action === "approve") {
    const mods = await rget<Record<string, boolean>>("/moderators");
    const others = Object.entries(mods ?? {}).some(([id, on]) => on && id !== profile.uid);
    if (others) throw new Error("Ask another moderator to approve your own post.");
  }
  const now = Date.now();
  const note = input.note.trim().slice(0, 240);
  let status: ContentPost["status"] = "queued";
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
        updatedAt: now,
      };
      await rput(`/socialPublishJobs/${jobId}`, job);
      destinations[platform] = { status: "needs_connection", url: "", error: CONNECT_NOTE[platform], attempts: 0 };
    }
  }
  const next: ContentPost = { ...post, status, moderatorNote: note, destinations, updatedAt: now };
  await rput(`/contentPosts/${post.id}`, next);
  const review = (await rget<{ decisions?: { at: number; by: string; action: string; note: string }[]; flags?: string[] }>(
    `/contentReviews/${post.id}`,
  )) ?? { decisions: [], flags: post.flags };
  const decisions = [
    ...(review.decisions ?? []),
    { at: now, by: profile.uid, action: input.action, note: note || input.action },
  ].slice(-20);
  await rput(`/contentReviews/${post.id}`, { postId: post.id, flags: review.flags ?? post.flags, decisions });
  await rput(`/moderationAuditLogs/${nid("audit")}`, {
    action: input.action,
    actorId: profile.uid,
    postId: post.id,
    at: now,
    note,
  });
  await notify(
    post.creatorId,
    `mod_${post.id}_${now}`,
    input.action === "approve" ? "Approved, waiting on platforms" : input.action === "reject" ? "Not published" : "Changes requested",
    note || (input.action === "approve" ? "A person approved it. TikTok, YouTube, and Facebook still need a connected official account." : "Open Creator Studio for the note."),
  );
  return next;
}

export async function retryPublish(idToken: string, postId: string, platform: Platform) {
  const profile = await member(idToken);
  const post = await rget<ContentPost>(`/contentPosts/${postId}`);
  if (!post) throw new Error("Post not found.");
  const moderator = await isModerator(profile.uid);
  if (post.creatorId !== profile.uid && !moderator) throw new Error("You cannot retry this post.");
  if (post.status !== "publishing" && post.status !== "approved") throw new Error("This post is not in the publishing queue.");
  const jobId = `${post.id}_${platform}`;
  const job = await rget<{ attempts?: number; idempotencyKey?: string }>(`/socialPublishJobs/${jobId}`);
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
    updatedAt: now,
  });
  const destinations = {
    ...post.destinations,
    [platform]: { status: "needs_connection" as const, url: "", error, attempts },
  };
  await rput(`/contentPosts/${post.id}`, { ...post, destinations, updatedAt: now });
  await notify(post.creatorId, `retry_${jobId}_${attempts}`, `${platform} still waiting`, error);
  return { attempts, nextAttemptAt: nextRetryAt(attempts, now), error };
}

export async function confirmOrder(input: {
  idToken: string;
  orderId: string;
  memberCode: string;
  productCode: string;
  salePesos: number;
  event: "confirmed" | "refunded" | "cancelled";
}) {
  const profile = await member(input.idToken);
  if (!(await moderatorOrBootstrap(profile))) throw new Error("Only a desk moderator can record merchant orders.");
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(input.orderId)) throw new Error("Order id should be the merchant’s id, letters and numbers.");
  const product = productByCode(input.productCode);
  if (!product) throw new Error("Unknown product.");
  const memberId = await rget<string>(`/referralCodes/${input.memberCode}`);
  if (!memberId) throw new Error("Unknown member code.");
  const rules = await policy();
  const split = affiliateSplit(input.salePesos, product.commissionBps, rules.affiliateMemberShareBps);
  const existing = await rget<{ status: OrderStatus; memberPesos: number }>(`/affiliateOrders/${input.orderId}`);
  const prior: OrderStatus = existing?.status ?? "none";
  const action = applyOrderEvent(prior, input.event);
  const now = Date.now();
  if (action === "credit" && split.member > 0) {
    const ledger = await postLedger({
      uid: memberId,
      txId: `aff_${input.orderId}`,
      type: "affiliate_commission",
      amount: split.member,
      note: `${product.name} order ${input.orderId}`,
      sourceUserId: null,
    });
    if (!ledger.applied && prior === "none") {
      const again = await rget<{ status: OrderStatus }>(`/affiliateOrders/${input.orderId}`);
      if (again?.status === "confirmed") return { action: "noop" as const, member: split.member };
    }
  }
  if (action === "reverse") {
    const amount = -Math.abs(existing?.memberPesos ?? split.member);
    if (amount !== 0) {
      await postLedger({
        uid: memberId,
        txId: `adj_${input.orderId}`,
        type: "adjustment",
        amount,
        note: `Reversal ${input.orderId}`,
      });
    }
  }
  if (action === "noop") return { action, member: existing?.memberPesos ?? 0 };
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
    updatedAt: now,
  });
  await rput(`/moderationAuditLogs/${nid("audit")}`, {
    action: `order-${input.event}`,
    actorId: profile.uid,
    orderId: input.orderId,
    at: now,
  });
  if (action === "credit") {
    await notify(memberId, `aff_${input.orderId}`, "Affiliate commission", `$${split.member} from ${product.name}. Merchant confirmed the order.`);
  }
  return { action, member: split.member };
}

export async function recordRevenue(input: {
  idToken: string;
  reportId: string;
  postId: string;
  gross: number;
  deductions: number;
  source: string;
  status: "estimated" | "confirmed";
}) {
  const profile = await member(input.idToken);
  if (!(await moderatorOrBootstrap(profile))) throw new Error("Only a desk moderator can record revenue.");
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(input.reportId)) throw new Error("Use a report id with letters and numbers.");
  const post = await rget<ContentPost>(`/contentPosts/${input.postId}`);
  if (!post) throw new Error("Unknown post.");
  if (post.creatorId === "desk") throw new Error("Desk reels are not in the creator pool.");
  const rules = await policy();
  const share = creatorShare(input.gross, input.deductions, rules.creatorShareBps);
  const existing = await rget<EarningRow>(`/creatorEarnings/${input.reportId}`);
  if (existing) return { applied: false, share: existing.share, status: existing.status };
  const row: EarningRow = {
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
    createdAt: Date.now(),
  };
  await rput(`/creatorEarnings/${input.reportId}`, row);
  if (input.status === "confirmed" && share.share > 0) {
    await postLedger({
      uid: post.creatorId,
      txId: `earn_${input.reportId}`,
      type: "creator_share",
      amount: share.share,
      note: `50% of net on ${post.title}`,
    });
    await notify(post.creatorId, `earn_${input.reportId}`, "Creator share confirmed", `$${share.share} posted to the wallet. Estimated figures were not paid.`);
  }
  await rput(`/moderationAuditLogs/${nid("audit")}`, {
    action: `revenue-${input.status}`,
    actorId: profile.uid,
    reportId: input.reportId,
    postId: post.id,
    at: Date.now(),
  });
  return { applied: true, share: share.share, status: input.status };
}

export async function recordClick(memberCode: string, productCode: string) {
  const product = productByCode(productCode.toLowerCase());
  if (!product) throw new Error("Unknown product.");
  const code = memberCode.toUpperCase();
  const memberId = await rget<string>(`/referralCodes/${code}`);
  if (!memberId) throw new Error("Unknown member link.");
  const stamp = await rget<number>(`/affiliateLinks/${code}/${product.code}/lastClick`);
  const now = Date.now();
  if (stamp && now - stamp < 30_000) return { recorded: false, product };
  const clickId = nid("click");
  await rput(`/affiliateClicks/${clickId}`, { id: clickId, memberCode: code, memberId, productCode: product.code, at: now });
  await rput(`/affiliateLinks/${code}/${product.code}`, {
    memberCode: code,
    productCode: product.code,
    path: `/r/${code}/${product.code}`,
    lastClick: now,
  });
  const clicks = Number((await rget<number>(`/clicksByMember/${code}`)) ?? 0) + 1;
  await rput(`/clicksByMember/${code}`, clicks);
  return { recorded: true, product };
}

export async function loadAffiliateLanding(memberCode: string, productCode: string) {
  await ensureCatalog();
  const product = productByCode(productCode.toLowerCase());
  if (!product) throw new Error("That product is not listed.");
  const memberId = await rget<string>(`/referralCodes/${memberCode.toUpperCase()}`);
  if (!memberId) throw new Error("That member link is not active.");
  const user = await rget<UserPublic>(`/users/${memberId}`);
  return {
    product,
    memberName: user?.name || "Member",
    disclosure: DISCLOSURE,
    windowDays: product.windowDays,
  };
}
