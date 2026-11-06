import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CATALOG, CATALOG_VERSION } from "@/lib/catalog";
import { isMasterEmail, MASTER_EMAIL } from "@/lib/master";
import {
  DIRECT_BONUS,
  firebaseConfig,
  LEVEL_BONUS,
  LEVELS,
  MEMBERSHIP_FEE,
  PAYOUT_MIN,
} from "@/lib/firebase-config";
import { dayIndex, manilaPeriod, peso } from "@/lib/manila";
import type {
  CatalogTutorial,
} from "@/lib/catalog";
import type {
  Desk,
  NetworkView,
  Notice,
  Progress,
  Recruit,
  Session,
  TreeNode,
  TutorialCard,
  UserPublic,
  WalletTx,
  WalletView,
} from "@/lib/types";

const BASE = `${firebaseConfig.databaseURL}/dailyConnect`;

type UserRec = UserPublic;

type NodeRec = {
  userId: string;
  parentId: string | null;
  level: number;
  children: Record<string, boolean>;
  ancestorIds: string;
};

async function rget<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}${path}.json`);
  if (!res.ok) throw new Error("Could not reach the membership database.");
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

async function rpatch(path: string, value: unknown) {
  const res = await fetch(`${BASE}${path}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error("Could not save.");
}

function authMessage(raw: string) {
  const code = raw.split(":")[0]?.trim() ?? raw;
  if (code === "EMAIL_EXISTS") return "An account already uses that email. Sign in instead.";
  if (code === "EMAIL_NOT_FOUND" || code === "INVALID_PASSWORD" || code === "INVALID_LOGIN_CREDENTIALS") {
    return "Email or password doesn’t match.";
  }
  if (code === "WEAK_PASSWORD") return "Use at least 8 characters.";
  if (code === "INVALID_EMAIL") return "That email doesn’t look right.";
  if (code === "TOO_MANY_ATTEMPTS_TRY_LATER") return "Too many attempts. Wait a minute and try again.";
  return "Could not sign in. Try again.";
}

async function identity<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/${path}?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(authMessage(data.error?.message ?? "AUTH"));
  return data;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return {};
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return Object.keys(asRecord(value))
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => asRecord(value)[key])
    .filter((item): item is string => typeof item === "string");
}

function uidOk(uid: string) {
  return /^[A-Za-z0-9]{8,128}$/.test(uid);
}

function cleanCode(code: string | undefined) {
  const next = (code ?? "").trim().toUpperCase();
  if (!next) return "";
  if (!/^[A-Z0-9]{4,12}$/.test(next)) return "";
  return next;
}

function digits(phone: string) {
  return phone.replace(/\D/g, "");
}

async function verify(idToken: string): Promise<{ uid: string; email: string; name: string }> {
  const data = await identity<{ users?: { localId: string; email?: string; displayName?: string }[] }>(
    "accounts:lookup",
    { idToken },
  );
  const user = data.users?.[0];
  if (!user?.localId) throw new Error("Sign in again.");
  return { uid: user.localId, email: user.email ?? "", name: user.displayName ?? "" };
}

function toSession(input: {
  idToken: string;
  refreshToken: string;
  localId: string;
  email: string;
  expiresIn: string;
}): Session {
  return {
    idToken: input.idToken,
    refreshToken: input.refreshToken,
    uid: input.localId,
    email: input.email,
    expiresAt: Date.now() + Number(input.expiresIn || 3600) * 1000,
  };
}

async function updateUser(uid: string, mutate: (user: UserRec) => UserRec): Promise<UserRec> {
  const url = `${BASE}/users/${uid}.json`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const res = await fetch(url, { headers: { "X-Firebase-ETag": "true" } });
    if (!res.ok) throw new Error("Could not read membership.");
    const etag = res.headers.get("etag");
    const current = (await res.json()) as UserRec | null;
    if (!current) throw new Error("Member not found.");
    const next = mutate(current);
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(etag ? { "if-match": etag } : {}),
      },
      body: JSON.stringify(next),
    });
    if (putRes.status === 412) continue;
    if (!putRes.ok) throw new Error("Could not save membership.");
    return next;
  }
  throw new Error("Could not save membership. Try again.");
}

async function resolveSponsor(uid: string, code: string) {
  if (!code) return null;
  const sponsorId = await rget<string>(`/referralCodes/${code}`);
  if (!sponsorId || sponsorId === uid || !uidOk(sponsorId)) return null;
  const sponsor = await rget<UserRec>(`/users/${sponsorId}`);
  if (!sponsor || sponsor.membershipStatus !== "active") return null;
  return sponsorId;
}

async function createProfile(input: {
  uid: string;
  email: string;
  name: string;
  phone: string;
  referralCode: string;
  cookieTimestamp?: number;
}): Promise<UserRec> {
  const existing = await rget<UserRec>(`/users/${input.uid}`);
  if (existing) {
    if ((!existing.name && input.name) || (!existing.phone && input.phone)) {
      return updateUser(input.uid, (user) => ({
        ...user,
        name: user.name || input.name,
        phone: user.phone || input.phone,
        email: user.email || input.email,
      }));
    }
    return existing;
  }
  const phone = digits(input.phone);
  if (phone && phone.length < 10) throw new Error("Enter a mobile number with at least 10 digits, or leave it blank.");
  const sponsorId = await resolveSponsor(input.uid, cleanCode(input.referralCode));
  const profile: UserRec = {
    uid: input.uid,
    name: input.name.trim() || input.email.split("@")[0] || "Member",
    email: input.email,
    phone,
    facebook: "",
    whatsapp: "",
    membershipStatus: "inactive",
    referralCode: null,
    sponsorId,
    placementParentId: null,
    walletBalance: 0,
    joinDate: null,
    createdAt: Date.now(),
  };
  await rput(`/users/${input.uid}`, profile);
  if (sponsorId) {
    await rput(`/bySponsor/${sponsorId}/${input.uid}`, {
      name: profile.name,
      membershipStatus: "inactive",
      placed: false,
    });
    if (input.cookieTimestamp) {
      await rpatch(`/users/${input.uid}`, { sponsorCookieAt: input.cookieTimestamp });
    }
  }
  return profile;
}

export async function signUpWithEmail(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  referralCode?: string;
  cookieTimestamp?: number;
}): Promise<{ session: Session; profile: UserRec }> {
  const phone = digits(input.phone ?? "");
  if (phone.length < 10) throw new Error("Enter a mobile number with at least 10 digits.");
  const created = await identity<{
    idToken: string;
    refreshToken: string;
    localId: string;
    email: string;
    expiresIn: string;
  }>("accounts:signUp", {
    email: input.email.trim(),
    password: input.password,
    returnSecureToken: true,
  });
  await identity("accounts:update", {
    idToken: created.idToken,
    displayName: input.name.trim(),
    returnSecureToken: false,
  }).catch(() => undefined);
  const session = toSession(created);
  const profile = await createProfile({
    uid: created.localId,
    email: created.email,
    name: input.name,
    phone: input.phone ?? "",
    referralCode: input.referralCode ?? "",
    cookieTimestamp: input.cookieTimestamp,
  });
  return { session, profile };
}

export async function signInWithEmail(input: {
  email: string;
  password: string;
}): Promise<{ session: Session; profile: UserRec }> {
  const signed = await identity<{
    idToken: string;
    refreshToken: string;
    localId: string;
    email: string;
    expiresIn: string;
    displayName?: string;
  }>("accounts:signInWithPassword", {
    email: input.email.trim(),
    password: input.password,
    returnSecureToken: true,
  });
  const session = toSession(signed);
  const profile = await createProfile({
    uid: signed.localId,
    email: signed.email,
    name: signed.displayName ?? "",
    phone: "",
    referralCode: "",
  });
  return { session, profile };
}

export async function refresh(refreshToken: string): Promise<Session> {
  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  const data = (await res.json()) as {
    id_token?: string;
    refresh_token?: string;
    user_id?: string;
    expires_in?: string;
    error?: { message?: string };
  };
  if (!res.ok || !data.id_token || !data.user_id) {
    const message = data.error?.message ?? "";
    if (/INVALID_REFRESH_TOKEN|TOKEN_EXPIRED|USER_DISABLED|USER_NOT_FOUND/.test(message)) {
      throw new Error("SESSION_REVOKED");
    }
    throw new Error("Could not refresh the sign-in. Stay on this screen and try again.");
  }
  return {
    idToken: data.id_token,
    refreshToken: data.refresh_token ?? refreshToken,
    uid: data.user_id,
    email: "",
    expiresAt: Date.now() + Number(data.expires_in ?? 3600) * 1000,
  };
}

export async function ensureProfile(input: {
  idToken: string;
  name?: string;
  phone?: string;
  referralCode?: string;
  cookieTimestamp?: number;
}): Promise<UserRec> {
  const who = await verify(input.idToken);
  const existing = await rget<UserRec>(`/users/${who.uid}`);
  if (!existing && digits(input.phone ?? "").length < 10) {
    throw new Error("Enter a mobile number with at least 10 digits.");
  }
  return createProfile({
    uid: who.uid,
    email: who.email,
    name: input.name || who.name,
    phone: input.phone ?? "",
    referralCode: input.referralCode ?? "",
    cookieTimestamp: input.cookieTimestamp,
  });
}

export async function loadSponsorCard(code: string) {
  const clean = cleanCode(code);
  if (!clean) return null;
  const sponsorId = await rget<string>(`/referralCodes/${clean}`);
  if (!sponsorId || !uidOk(sponsorId)) return null;
  const sponsor = await rget<UserRec>(`/users/${sponsorId}`);
  if (!sponsor || sponsor.membershipStatus !== "active") return null;
  return publicSponsorCard(sponsor);
}

export async function loadMySponsor(idToken: string) {
  const profile = await requireUser(idToken);
  if (!profile.sponsorId) return null;
  const sponsor = await rget<UserRec>(`/users/${profile.sponsorId}`);
  if (!sponsor) return null;
  return publicSponsorCard(sponsor);
}

async function publicSponsorCard(sponsor: UserRec) {
  return {
    name: sponsor.name,
    phone: sponsor.phone || "",
    facebook: sponsor.facebook || "",
    whatsapp: sponsor.whatsapp || "",
  };
}

function cleanFacebook(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  const withProto = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(withProto);
  } catch {
    throw new Error("Facebook link should look like facebook.com/your-name.");
  }
  if (!/(^|\.)facebook\.com$|(^|\.)fb\.com$/i.test(url.hostname)) {
    throw new Error("Use a facebook.com profile link.");
  }
  return url.toString().slice(0, 200);
}

function cleanWhatsapp(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new Error("That WhatsApp link is not valid.");
    }
    if (!/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/i.test(url.hostname)) {
      throw new Error("Use a wa.me link or a mobile number.");
    }
    return url.toString().slice(0, 200);
  }
  const number = value.replace(/\D/g, "");
  if (number.length < 10 || number.length > 15) throw new Error("WhatsApp number needs 10 to 15 digits.");
  return number;
}

export async function savePublicContact(input: { idToken: string; phone: string; facebook: string; whatsapp: string }) {
  const profile = await requireUser(input.idToken);
  const phone = digits(input.phone);
  if (phone && phone.length < 10) throw new Error("Enter a mobile number with at least 10 digits, or leave it blank.");
  const facebook = cleanFacebook(input.facebook);
  const whatsapp = cleanWhatsapp(input.whatsapp);
  return updateUser(profile.uid, (user) => ({
    ...user,
    phone,
    facebook,
    whatsapp,
  }));
}

export async function loadProfile(idToken: string): Promise<UserRec> {
  const who = await verify(idToken);
  const profile = await rget<UserRec>(`/users/${who.uid}`);
  if (!profile) throw new Error("Sign in again.");
  return profile;
}

async function requireUser(idToken: string) {
  const who = await verify(idToken);
  const profile = await rget<UserRec>(`/users/${who.uid}`);
  if (!profile) throw new Error("Sign in again.");
  return profile;
}

async function requireMember(idToken: string) {
  const profile = await requireUser(idToken);
  if (profile.membershipStatus !== "active") throw new Error("Membership required.");
  return profile;
}

export async function requireActiveMember(idToken: string) {
  return requireMember(idToken);
}

export async function postLedger(input: {
  uid: string;
  txId: string;
  type: WalletTx["type"];
  amount: number;
  note: string;
  sourceUserId?: string | null;
  status?: WalletTx["status"];
}): Promise<{ applied: boolean; balance: number }> {
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(input.txId)) throw new Error("Invalid ledger id.");
  if (!Number.isFinite(input.amount) || input.amount === 0) throw new Error("Invalid amount.");
  const path = `/walletTransactions/${input.uid}/${input.txId}`;
  const prior = await rget<WalletTx>(path);
  if (prior) {
    const user = await rget<UserRec>(`/users/${input.uid}`);
    return { applied: false, balance: Number(user?.walletBalance ?? 0) };
  }
  const claim = await fetch(`${BASE}${path}.json?print=silent`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "if-none-match": "*",
    },
    body: JSON.stringify({
      userId: input.uid,
      type: input.type,
      amount: input.amount,
      status: input.status ?? "posted",
      period: manilaPeriod(),
      note: input.note.slice(0, 180),
      sourceUserId: input.sourceUserId ?? null,
      createdAt: Date.now(),
    }),
  });
  if (claim.status === 412 || claim.status === 409) {
    const user = await rget<UserRec>(`/users/${input.uid}`);
    return { applied: false, balance: Number(user?.walletBalance ?? 0) };
  }
  if (!claim.ok) throw new Error("Could not write the ledger.");
  const again = await rget<WalletTx>(path);
  if (again && again.createdAt !== undefined && prior) {
    const user = await rget<UserRec>(`/users/${input.uid}`);
    return { applied: false, balance: Number(user?.walletBalance ?? 0) };
  }
  const next = await updateUser(input.uid, (user) => ({
    ...user,
    walletBalance: user.walletBalance + input.amount,
  }));
  return { applied: true, balance: next.walletBalance };
}

async function seedTutorials() {
  const version = await rget<number>("/tutorialCatalogVersion");
  if (version === CATALOG_VERSION) return;
  await Promise.all(CATALOG.map((tutorial) => rput(`/tutorials/${tutorial.id}`, tutorial)));
  await rput("/tutorialCatalogVersion", CATALOG_VERSION);
}

function orderedTutorials(raw: Record<string, CatalogTutorial> | null) {
  return Object.values(raw ?? {}).sort((a, b) => a.sortOrder - b.sortOrder);
}

function toCard(tutorial: CatalogTutorial): TutorialCard {
  return {
    id: tutorial.id,
    title: tutorial.title,
    description: tutorial.description,
    difficulty: tutorial.difficulty,
    durationMin: tutorial.durationMin,
    thumbnail: tutorial.thumbnail,
    reel: tutorial.reel,
    muxPlaybackId: tutorial.muxPlaybackId ?? "",
    tags: Array.isArray(tutorial.tags) ? tutorial.tags : asStringList(tutorial.tags),
    sortOrder: tutorial.sortOrder,
  };
}

function readProgress(tutorialId: string, raw: unknown): Progress | null {
  const row = asRecord(raw);
  if (!row.tutorialId && !row.progressPercent && row.progressPercent !== 0) return null;
  return {
    tutorialId: typeof row.tutorialId === "string" ? row.tutorialId : tutorialId,
    progressPercent: Number(row.progressPercent ?? 0),
    completed: Boolean(row.completed),
    lastPositionSec: Number(row.lastPositionSec ?? 0),
    exercises: asStringList(row.exercises),
    updatedAt: Number(row.updatedAt ?? 0),
  };
}

async function noticesFor(uid: string): Promise<Notice[]> {
  const raw = await rget<Record<string, Omit<Notice, "id">>>(`/notifications/${uid}`);
  return Object.entries(raw ?? {})
    .map(([id, notice]) => ({ ...notice, id }))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 20);
}

export async function loadDesk(idToken: string): Promise<Desk> {
  const profile = await requireUser(idToken);
  await seedTutorials();
  const tutorials = orderedTutorials(await rget("/tutorials"));
  const today = tutorials[dayIndex(tutorials.length)];
  const progressRaw = await rget<Record<string, unknown>>(`/userProgress/${profile.uid}`);
  const progress = Object.entries(progressRaw ?? {})
    .map(([id, row]) => readProgress(id, row))
    .filter((row): row is Progress => row !== null);
  const notifications = await noticesFor(profile.uid);
  return {
    profile,
    todayId: today?.id ?? "",
    tutorials: tutorials.map(toCard),
    progress,
    notifications,
    unread: notifications.filter((notice) => !notice.read).length,
  };
}

export async function loadTutorial(idToken: string, tutorialId: string) {
  const profile = await requireMember(idToken);
  const tutorial = await rget<CatalogTutorial>(`/tutorials/${tutorialId}`);
  if (!tutorial) throw new Error("That tutorial is gone.");
  const progress = readProgress(
    tutorialId,
    await rget(`/userProgress/${profile.uid}/${tutorialId}`),
  );
  return { tutorial, progress };
}

export async function saveProgress(input: {
  idToken: string;
  tutorialId: string;
  progressPercent: number;
  lastPositionSec: number;
  completed: boolean;
  exercises: string[];
}): Promise<Progress> {
  const profile = await requireMember(input.idToken);
  const progress: Progress = {
    tutorialId: input.tutorialId,
    progressPercent: Math.round(input.progressPercent),
    completed: input.completed || input.progressPercent >= 100,
    lastPositionSec: Math.round(input.lastPositionSec),
    exercises: input.exercises,
    updatedAt: Date.now(),
  };
  await rput(`/userProgress/${profile.uid}/${input.tutorialId}`, progress);
  return progress;
}

async function mintCode(uid: string, name: string) {
  const stem = name.normalize("NFD").replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "DC";
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const bytes = crypto.getRandomValues(new Uint8Array(4));
    let rand = "";
    for (const byte of bytes) rand += alphabet[byte % alphabet.length];
    const code = (stem + rand).slice(0, 8);
    const taken = await rget<string>(`/referralCodes/${code}`);
    if (!taken) {
      await rput(`/referralCodes/${code}`, uid);
      return code;
    }
  }
  throw new Error("Could not mint a referral code. Try again.");
}

export async function saveUploadedVideo(idToken: string, bytes: Uint8Array, mime: string) {
  const profile = await requireMember(idToken);
  if (bytes.byteLength < 1000) throw new Error("That file is empty.");
  if (bytes.byteLength > 80_000_000) throw new Error("That video is too large. Trim it under a minute.");
  if (mime && !mime.startsWith("video/")) throw new Error("Choose a video file.");
  const shrunk = await shrinkVideo(bytes);
  if (shrunk.byteLength > 9_000_000) throw new Error("That video is still too large after compressing. Trim it shorter.");
  const id = `v${Date.now().toString(36)}${profile.uid.slice(0, 6)}`;
  await rput(`/mediaFiles/${id}`, {
    mime: "video/mp4",
    data: Buffer.from(shrunk).toString("base64"),
    uid: profile.uid,
    createdAt: Date.now(),
  });
  return { url: `/api/media/${id}` };
}

export async function readUploadedVideo(id: string) {
  if (!/^v[a-z0-9]+$/i.test(id)) return null;
  const row = await rget<{ mime?: string; data?: string }>(`/mediaFiles/${id}`);
  if (!row?.data) return null;
  return { mime: row.mime || "video/mp4", data: row.data };
}

function shrinkVideo(bytes: Uint8Array) {
  return new Promise<Buffer>((resolve, reject) => {
    void (async () => {
      const dir = await mkdtemp(join(tmpdir(), "dc-"));
      const input = join(dir, "in.bin");
      const output = join(dir, "out.mp4");
      try {
        await writeFile(input, bytes);
        await new Promise<void>((done, fail) => {
          const child = spawn("ffmpeg", [
            "-y",
            "-i",
            input,
            "-t",
            "58",
            "-vf",
            "scale='min(720,iw)':-2",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "32",
            "-c:a",
            "aac",
            "-b:a",
            "64k",
            "-movflags",
            "+faststart",
            output,
          ]);
          child.on("error", fail);
          child.on("close", (code) => {
            if (code === 0) done();
            else fail(new Error("Could not prepare that video. Use an MP4 clip."));
          });
        });
        resolve(await readFile(output));
      } catch (error) {
        reject(error);
      } finally {
        await rm(dir, { recursive: true, force: true });
      }
    })();
  });
}

export async function masterAccess(idToken: string) {
  const who = await verify(idToken);
  return { email: who.email, allowed: isMasterEmail(who.email) };
}

type ActivationCodeRec = {
  code: string;
  status: "available" | "used";
  createdAt: number;
  createdByUid: string;
  createdByEmail: string;
  createdByName: string;
  createdWhere: string;
  sponsorId: string;
  sponsorCode: string;
  sponsorName: string;
  usedAt: number | null;
  usedByUid: string | null;
  usedByName: string | null;
  usedByEmail: string | null;
  issuedBy: string;
  redeemedBy: string | null;
  redeemedAt: number | null;
};

async function saveActivationCode(record: ActivationCodeRec) {
  await rput(`/activationCodes/${record.code}`, record);
  await rput(`/activationCodeList/${record.code}`, record);
}

function asCodeRecord(code: string, raw: Partial<ActivationCodeRec> & { issuedBy?: string; redeemedBy?: string | null; redeemedAt?: number | null }): ActivationCodeRec {
  const usedByUid = raw.usedByUid || raw.redeemedBy || null;
  const usedAt = raw.usedAt || raw.redeemedAt || null;
  return {
    code,
    status: raw.status === "used" || usedByUid ? "used" : "available",
    createdAt: raw.createdAt ?? 0,
    createdByUid: raw.createdByUid || raw.issuedBy || "",
    createdByEmail: raw.createdByEmail || "",
    createdByName: raw.createdByName || "",
    createdWhere: raw.createdWhere || "",
    sponsorId: raw.sponsorId || "",
    sponsorCode: raw.sponsorCode || "",
    sponsorName: raw.sponsorName || "",
    usedAt,
    usedByUid,
    usedByName: raw.usedByName || null,
    usedByEmail: raw.usedByEmail || null,
    issuedBy: raw.issuedBy || raw.createdByUid || "",
    redeemedBy: usedByUid,
    redeemedAt: usedAt,
  };
}
export async function issueActivationCode(idToken: string) {
  const who = await verify(idToken);
  if (!isMasterEmail(who.email)) throw new Error("Only master@dailyconnect.tech can create activation codes.");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    let code = "";
    for (const byte of bytes) code += alphabet[byte % alphabet.length];
    const taken = await rget(`/activationCodes/${code}`);
    if (taken) continue;
    await saveActivationCode({
      code,
      status: "available",
      createdAt: Date.now(),
      createdByUid: who.uid,
      createdByEmail: who.email,
      createdByName: who.name || MASTER_EMAIL,
      createdWhere: "/code/create",
      sponsorId: "",
      sponsorCode: "",
      sponsorName: "",
      usedAt: null,
      usedByUid: null,
      usedByName: null,
      usedByEmail: null,
      issuedBy: who.uid,
      redeemedBy: null,
      redeemedAt: null,
    });
    return { code };
  }
  throw new Error("Could not issue a code. Try again.");
}

export async function listSponsorCodes(idToken: string) {
  const profile = await requireMember(idToken);
  const raw = await rget<Record<string, boolean>>(`/codesBySponsor/${profile.uid}`);
  const codes: string[] = [];
  for (const code of Object.keys(raw ?? {})) {
    const row = await rget<{ redeemedBy?: string | null }>(`/activationCodes/${code}`);
    if (row && !row.redeemedBy) codes.push(code);
  }
  return { codes };
}

export async function listIssuedCodes(idToken: string) {
  const who = await verify(idToken);
  if (!isMasterEmail(who.email)) throw new Error("Only master@dailyconnect.tech can view activation codes.");
  const raw = await rget<Record<string, Partial<ActivationCodeRec>>>("/activationCodes");
  const codes: ActivationCodeRec[] = [];
  for (const [code, row] of Object.entries(raw ?? {})) {
    const record = asCodeRecord(code, row ?? {});
    if (record.createdByUid && !record.createdByEmail) {
      const creator = await rget<UserRec>(`/users/${record.createdByUid}`);
      if (creator) {
        record.createdByEmail = creator.email || "";
        record.createdByName = record.createdByName || creator.name;
      }
    }
    if (record.sponsorId && !record.sponsorName) {
      const sponsor = await rget<UserRec>(`/users/${record.sponsorId}`);
      if (sponsor) record.sponsorName = sponsor.name;
    }
    if (record.usedByUid && !record.usedByName) {
      const member = await rget<UserRec>(`/users/${record.usedByUid}`);
      if (member) {
        record.usedByName = member.name;
        record.usedByEmail = member.email;
      }
    }
    await rput(`/activationCodeList/${code}`, record);
    codes.push(record);
  }
  codes.sort((a, b) => b.createdAt - a.createdAt);
  return { codes };
}

export async function redeemActivationCode(input: { idToken: string; code: string }) {
  const profile = await requireUser(input.idToken);
  if (profile.membershipStatus === "active") return profile;
  const code = input.code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(code)) throw new Error("Enter the activation code.");
  const stored = await rget<Partial<ActivationCodeRec>>(`/activationCodes/${code}`);
  if (!stored || (!stored.issuedBy && !stored.createdByUid && !stored.createdAt)) {
    throw new Error("That activation code is not valid.");
  }
  const record = asCodeRecord(code, stored);
  if (record.status === "used" || record.redeemedBy) throw new Error("That activation code was already used.");
  const next = await activateMembership(input.idToken);
  const usedAt = Date.now();
  let sponsorId = record.sponsorId;
  let sponsorName = record.sponsorName;
  let sponsorCode = record.sponsorCode;
  const linkedSponsor = profile.sponsorId;
  if (!sponsorId && linkedSponsor) {
    const sponsor = await rget<UserRec>(`/users/${linkedSponsor}`);
    sponsorId = linkedSponsor;
    sponsorName = sponsor?.name ?? "";
    sponsorCode = sponsor?.referralCode ?? "";
  }
  await saveActivationCode({
    ...record,
    sponsorId,
    sponsorName,
    sponsorCode,
    status: "used",
    usedAt,
    usedByUid: profile.uid,
    usedByName: profile.name,
    usedByEmail: profile.email,
    redeemedBy: profile.uid,
    redeemedAt: usedAt,
  });
  if (record.sponsorId) await rput(`/codesBySponsor/${record.sponsorId}/${code}`, null);
  return next;
}

export async function activateMembership(idToken: string) {
  const profile = await requireUser(idToken);
  if (profile.membershipStatus === "active") return profile;
  const code = profile.referralCode ?? (await mintCode(profile.uid, profile.name));
  const now = Date.now();
  if (profile.sponsorId && profile.sponsorId !== profile.uid) {
    const prior = await rget(`/referrals/${profile.uid}`);
    if (!prior) {
      await updateUser(profile.sponsorId, (sponsor) => ({
        ...sponsor,
        walletBalance: sponsor.walletBalance + DIRECT_BONUS,
      }));
      await rput(`/referrals/${profile.uid}`, {
        referrerId: profile.sponsorId,
        referredId: profile.uid,
        cookieTimestamp: now,
        bonusPaid: true,
        createdAt: now,
      });
      await rput(`/walletTransactions/${profile.sponsorId}/ref_${profile.uid}`, {
        userId: profile.sponsorId,
        type: "referral_bonus",
        amount: DIRECT_BONUS,
        status: "posted",
        period: manilaPeriod(),
        note: `${profile.name} joined`,
        sourceUserId: profile.uid,
        createdAt: now,
      });
      await rput(`/notifications/${profile.sponsorId}/ref_${profile.uid}`, {
        kind: "referral",
        title: `${peso(DIRECT_BONUS)} referral`,
        body: `${profile.name} joined with your link.`,
        read: false,
        createdAt: now,
      });
    }
  }
  const next = await updateUser(profile.uid, (user) => ({
    ...user,
    membershipStatus: "active",
    referralCode: code,
    joinDate: user.joinDate ?? now,
  }));
  const node = await rget<NodeRec>(`/unilevelTree/${profile.uid}`);
  if (!node) {
    await rput(`/unilevelTree/${profile.uid}`, {
      userId: profile.uid,
      parentId: null,
      level: 0,
      children: {},
      ancestorIds: "",
    } satisfies NodeRec);
  }
  await rput(`/payments/${profile.uid}/${now}`, {
    userId: profile.uid,
    amount: MEMBERSHIP_FEE,
    status: "recorded",
    gateway: "sponsor",
    gatewayRef: `sponsor_${now.toString(36)}`,
    method: "sponsor",
    timestamp: now,
  });
  if (profile.sponsorId) {
    await rpatch(`/bySponsor/${profile.sponsorId}/${profile.uid}`, {
      name: profile.name,
      membershipStatus: "active",
      placed: false,
    });
  }
  await rput(`/notifications/${profile.uid}/welcome`, {
    kind: "welcome",
    title: "Desk is open",
    body: "Membership is active. Today’s pick is waiting.",
    read: false,
    createdAt: now,
  });
  const sponsor = profile.sponsorId ? await rget<UserRec>(`/users/${profile.sponsorId}`) : null;
  await announceNewMember(next, sponsor?.name || "No sponsor");
  await seedTutorials();
  return next;
}

async function announceNewMember(member: UserRec, sponsorName: string) {
  const users = await rget<Record<string, UserRec>>("/users");
  const roster = Object.values(users ?? {}).filter((user) => user?.uid && user.membershipStatus === "active");
  if (!roster.some((user) => user.uid === member.uid)) roster.push(member);
  const notice = {
    kind: "join",
    title: "New member",
    body: `${sponsorName} sponsored ${member.name}.`,
    read: false,
    createdAt: Date.now(),
  };
  await Promise.all(roster.map((user) => rput(`/notifications/${user.uid}/join_${member.uid}`, notice)));
}

async function settle(uid: string) {
  const period = manilaPeriod();
  const raw = await rget<Record<string, WalletTx>>(`/walletTransactions/${uid}`);
  let add = 0;
  await Promise.all(
    Object.entries(raw ?? {}).map(async ([id, tx]) => {
      if (tx.type === "unilevel" && tx.status === "scheduled" && tx.period < period) {
        await rpatch(`/walletTransactions/${uid}/${id}`, { status: "posted" });
        add += Number(tx.amount);
      }
    }),
  );
  if (add > 0) {
    await updateUser(uid, (user) => ({ ...user, walletBalance: user.walletBalance + add }));
  }
}

export async function loadWallet(idToken: string): Promise<WalletView> {
  const profile = await requireUser(idToken);
  await settle(profile.uid);
  const fresh = (await rget<UserRec>(`/users/${profile.uid}`)) ?? profile;
  const txRaw = await rget<Record<string, Omit<WalletTx, "id">>>(`/walletTransactions/${profile.uid}`);
  const transactions = Object.entries(txRaw ?? {})
    .map(([id, tx]) => ({ ...tx, id, amount: Number(tx.amount) }))
    .sort((a, b) => b.createdAt - a.createdAt);
  const recruits = await rget<Record<string, Recruit>>(`/bySponsor/${profile.uid}`);
  const list = Object.values(recruits ?? {});
  const accruing = transactions
    .filter((tx) => tx.type === "unilevel" && tx.status === "scheduled")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const accumulated = transactions
    .filter((tx) => tx.type !== "payout" && tx.status !== "scheduled" && tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const pendingPayout = transactions
    .filter((tx) => tx.type === "payout" && tx.status === "requested")
    .reduce((sum, tx) => sum + tx.amount, 0);
  return {
    profile: fresh,
    transactions,
    directPaid: list.filter((recruit) => recruit.membershipStatus === "active").length,
    directPending: list.filter((recruit) => recruit.membershipStatus !== "active").length,
    directBonus: transactions
      .filter((tx) => tx.type === "referral_bonus")
      .reduce((sum, tx) => sum + tx.amount, 0),
    accruing,
    teamSize: await teamSize(profile.uid),
    accumulated,
    available: Math.max(0, Number(fresh.walletBalance) - pendingPayout),
    pendingPayout,
  };
}

async function teamSize(uid: string) {
  const seen = new Set<string>();
  const queue = [uid];
  while (queue.length) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    seen.add(current);
    const node = await rget<NodeRec>(`/unilevelTree/${current}`);
    for (const child of Object.keys(node?.children ?? {})) queue.push(child);
  }
  return Math.max(0, seen.size - 1);
}

function cleanPayoutAccount(input: {
  method: "gcash" | "maya";
  account: string;
  phone: string;
  accountName: string;
}) {
  const accountName = input.accountName.trim().replace(/\s+/g, " ");
  if (accountName.length < 2) throw new Error("Enter the account name.");
  if (input.method === "gcash") {
    const account = input.account.replace(/\D/g, "");
    if (account.length < 10 || account.length > 16) throw new Error("Enter the GCash account number.");
    return { method: input.method, account, phone: account, accountName };
  }
  const account = input.account.replace(/\D/g, "");
  if (account.length < 10 || account.length > 16) throw new Error("Enter the Maya account number.");
  return { method: input.method, account, phone: account, accountName };
}

export async function requestPayout(
  idToken: string,
  input: { amount: number; method: "gcash" | "maya"; account: string; phone: string; accountName: string },
) {
  const profile = await requireUser(idToken);
  if (profile.membershipStatus !== "active") throw new Error("Activate membership before requesting a payout.");
  if (input.amount < PAYOUT_MIN) throw new Error(`Minimum payout is ${peso(PAYOUT_MIN)}.`);
  const payoutMethod = cleanPayoutAccount(input);
  await settle(profile.uid);
  const fresh = (await rget<UserRec>(`/users/${profile.uid}`)) ?? profile;
  const txRaw = await rget<Record<string, WalletTx>>(`/walletTransactions/${profile.uid}`);
  const pending = Object.values(txRaw ?? {})
    .filter((tx) => tx?.type === "payout" && tx.status === "requested")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  if (Number(fresh.walletBalance) - pending < input.amount) {
    throw new Error("That is more than your available balance.");
  }
  const next = await updateUser(profile.uid, (user) => ({ ...user, payoutMethod }));
  const now = Date.now();
  const requestId = `payout_${now}`;
  await rput(`/walletTransactions/${profile.uid}/${requestId}`, {
    userId: profile.uid,
    type: "payout",
    amount: input.amount,
    status: "requested",
    period: manilaPeriod(),
    note: `${payoutMethod.method === "gcash" ? "GCash" : "Maya"} payout requested. Not paid yet.`,
    sourceUserId: null,
    createdAt: now,
  });
  await rput(`/payoutRequests/${requestId}`, {
    id: requestId,
    uid: profile.uid,
    name: profile.name,
    email: profile.email,
    amount: input.amount,
    method: payoutMethod.method,
    account: payoutMethod.account,
    phone: payoutMethod.phone,
    accountName: payoutMethod.accountName,
    status: "requested",
    createdAt: now,
    paidAt: null,
  });
  await rput(`/notifications/${profile.uid}/${requestId}`, {
    kind: "payout",
    title: "Payout requested",
    body: `$${input.amount} is waiting for the admin to pay it. Your balance is unchanged.`,
    read: false,
    createdAt: now,
  });
  return next;
}

export async function listPayoutRequests(idToken: string) {
  const who = await verify(idToken);
  if (!isMasterEmail(who.email)) throw new Error("Only master@dailyconnect.tech can open payout requests.");
  const raw = await rget<Record<string, PayoutRequest>>("/payoutRequests");
  const requests = Object.values(raw ?? {}).sort((a, b) => b.createdAt - a.createdAt);
  return { requests };
}

export async function markPayoutPaid(idToken: string, requestId: string) {
  const who = await verify(idToken);
  if (!isMasterEmail(who.email)) throw new Error("Only master@dailyconnect.tech can mark a payout paid.");
  if (!/^payout_\d+$/.test(requestId)) throw new Error("That payout request is not valid.");
  const request = await rget<PayoutRequest>(`/payoutRequests/${requestId}`);
  if (!request) throw new Error("That payout request was not found.");
  if (request.status === "paid") return { requests: (await listPayoutRequests(idToken)).requests };
  await updateUser(request.uid, (user) => {
    if (user.walletBalance < request.amount) throw new Error("The balance is lower than this payout.");
    return { ...user, walletBalance: user.walletBalance - request.amount };
  });
  const paidAt = Date.now();
  await rpatch(`/payoutRequests/${requestId}`, { status: "paid", paidAt });
  await rpatch(`/walletTransactions/${request.uid}/${requestId}`, {
    status: "paid",
    note: `${request.method === "gcash" ? "GCash" : "Maya"} payout paid.`,
  });
  await rput(`/notifications/${request.uid}/${requestId}_paid`, {
    kind: "payout",
    title: "Payout paid",
    body: `$${request.amount} was paid to your ${request.method === "gcash" ? "GCash" : "Maya"} account.`,
    read: false,
    createdAt: paidAt,
  });
  return listPayoutRequests(idToken);
}

type PayoutRequest = {
  id: string;
  uid: string;
  name: string;
  email: string;
  amount: number;
  method: "gcash" | "maya";
  account: string;
  phone: string;
  accountName: string;
  status: "requested" | "paid";
  createdAt: number;
  paidAt: number | null;
};

async function buildTree(uid: string, depth: number): Promise<TreeNode> {
  const user = await rget<UserRec>(`/users/${uid}`);
  const node = await rget<NodeRec>(`/unilevelTree/${uid}`);
  const childIds = Object.keys(node?.children ?? {});
  const children =
    depth >= LEVELS ? [] : await Promise.all(childIds.map((child) => buildTree(child, depth + 1)));
  return {
    uid,
    name: user?.name || "Member",
    level: node?.level ?? depth,
    children,
  };
}

async function downline(uid: string) {
  const ids = new Set<string>();
  const queue = [uid];
  while (queue.length) {
    const current = queue.shift();
    if (!current || ids.has(current)) continue;
    ids.add(current);
    const node = await rget<NodeRec>(`/unilevelTree/${current}`);
    for (const child of Object.keys(node?.children ?? {})) queue.push(child);
  }
  return ids;
}

export async function loadNetwork(idToken: string): Promise<NetworkView> {
  const profile = await requireUser(idToken);
  const recruitRaw = await rget<Record<string, Omit<Recruit, "uid">>>(`/bySponsor/${profile.uid}`);
  const recruits = Object.entries(recruitRaw ?? {}).map(([uid, recruit]) => ({ ...recruit, uid }));
  const tree = await buildTree(profile.uid, 0);
  return { profile, recruits, tree };
}

export async function placeMember(input: { idToken: string; recruitUid: string; parentUid: string }) {
  const sponsor = await requireMember(input.idToken);
  if (!uidOk(input.recruitUid) || !uidOk(input.parentUid)) throw new Error("That placement is not valid.");
  if (input.recruitUid === input.parentUid) throw new Error("A member cannot sit under themselves.");
  const recruit = await rget<UserRec>(`/users/${input.recruitUid}`);
  if (!recruit || recruit.sponsorId !== sponsor.uid) throw new Error("You can only place people who joined with your link.");
  if (recruit.membershipStatus !== "active") throw new Error("They need an active membership before placement.");
  if (recruit.placementParentId) throw new Error("They are already placed.");
  const allowed = await downline(sponsor.uid);
  if (!allowed.has(input.parentUid)) throw new Error("Place them under yourself or someone already in your line.");
  if (allowed.has(input.recruitUid)) throw new Error("They are already in the line.");
  const parent = await rget<NodeRec>(`/unilevelTree/${input.parentUid}`);
  const parentLevel = parent?.level ?? 0;
  const ancestors = (parent?.ancestorIds ?? "").split(",").filter(Boolean);
  const chain = [...ancestors, input.parentUid].slice(-LEVELS);
  const recruitNode = (await rget<NodeRec>(`/unilevelTree/${input.recruitUid}`)) ?? {
    userId: input.recruitUid,
    parentId: null,
    level: 0,
    children: {},
    ancestorIds: "",
  };
  await rput(`/unilevelTree/${input.recruitUid}`, {
    ...recruitNode,
    parentId: input.parentUid,
    level: parentLevel + 1,
    ancestorIds: chain.join(","),
  });
  await rpatch(`/unilevelTree/${input.parentUid}`, {
    children: { ...(parent?.children ?? {}), [input.recruitUid]: true },
  });
  await rpatch(`/users/${input.recruitUid}`, { placementParentId: input.parentUid });
  await rpatch(`/bySponsor/${sponsor.uid}/${input.recruitUid}`, { placed: true });
  const period = manilaPeriod();
  const now = Date.now();
  await Promise.all(
    chain.map(async (ancestorId, index) => {
      const level = chain.length - index;
      await rput(`/walletTransactions/${ancestorId}/uni_${input.recruitUid}`, {
        userId: ancestorId,
        type: "unilevel",
        amount: LEVEL_BONUS,
        status: "scheduled",
        period,
        note: `Level ${level} from ${recruit.name}`,
        sourceUserId: input.recruitUid,
        createdAt: now,
      });
      await rput(`/notifications/${ancestorId}/uni_${input.recruitUid}`, {
        kind: "unilevel",
        title: `${peso(LEVEL_BONUS)} unilevel scheduled`,
        body: `${recruit.name} was placed at level ${level}. It posts on the 1st.`,
        read: false,
        createdAt: now,
      });
    }),
  );
  return loadNetwork(input.idToken);
}

export async function markNoticesRead(idToken: string) {
  const profile = await requireUser(idToken);
  const raw = await rget<Record<string, Notice>>(`/notifications/${profile.uid}`);
  await Promise.all(
    Object.entries(raw ?? {})
      .filter(([, notice]) => !notice.read)
      .map(([id]) => rpatch(`/notifications/${profile.uid}/${id}`, { read: true })),
  );
  return noticesFor(profile.uid);
}

export async function listNotices(idToken: string) {
  const profile = await requireUser(idToken);
  const notifications = await noticesFor(profile.uid);
  return { notifications, unread: notifications.filter((notice) => !notice.read).length };
}
