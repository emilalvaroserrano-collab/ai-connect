import { o as __toESM } from "../_runtime.mjs";
import { C as useRouter, S as useNavigate, Z as require_react, _ as Outlet, b as Link, f as Scripts, g as createRouter, m as useRouterState, p as HeadContent, v as createFileRoute, w as require_jsx_runtime, x as Navigate, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as number, c as union, i as literal, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { a as PAYOUT_MIN, c as firebaseConfig, f as peso, l as formatClock, m as secondsUntilManilaMidnight, n as LEVEL_BONUS, r as MASTER_EMAIL, s as errorText, t as DIRECT_BONUS } from "./manila-BaDjFwMm.mjs";
import { a as DEFAULT_VOICEMAIL, c as VOICES, i as DEFAULT_PROMPT, n as DEFAULT_FIRST, o as DEFAULT_VOICE_ID, r as DEFAULT_NAME, s as VAPI_PUBLIC_KEY, t as DEFAULT_END } from "./vapi-preset-D6zKfZEq.mjs";
import { n as PRODUCT_CATALOG } from "./catalog-CzqFis8i.mjs";
import { A as ChartLine, C as MessageCircle, D as House, E as Image, M as Bot, N as BookOpen, O as Clapperboard, P as Bell, S as MessageSquare, T as Layers, _ as PhoneOff, a as Video, b as Mic, c as Trash2, d as Sparkles, f as Shield, g as Phone, h as Play, i as Wallet, j as Briefcase, k as ChevronRight, l as ThumbsUp, m as Radio, n as X, o as UserRound, p as Route, r as Wrench, s as TriangleAlert, t as Zap, u as Store, v as Pencil, w as Menu, x as MicOff, y as Pause } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BJJHlMxI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
var RELOAD_KEY = "dc.chunk-reload";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function isStaleChunk(message) {
	return /dynamically imported module|module script failed|Importing a module script failed/i.test(message);
}
function AppErrorComponent({ error }) {
	const message = errorMessage(error);
	(0, import_react.useEffect)(() => {
		if (!isStaleChunk(message)) return;
		try {
			if (sessionStorage.getItem(RELOAD_KEY)) return;
			sessionStorage.setItem(RELOAD_KEY, "1");
		} catch {
			return;
		}
		window.location.reload();
	}, [message]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-2 h-11 rounded-full bg-teal px-5 font-medium text-ink",
				onClick: () => {
					try {
						sessionStorage.removeItem(RELOAD_KEY);
					} catch {}
					window.location.reload();
				},
				children: "Reload"
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var token$3 = string().min(20);
var signUp = createServerFn({ method: "POST" }).validator(object({
	name: string().trim().min(1).max(80),
	email: string().trim().email().max(120),
	phone: string().trim().min(10).max(30),
	password: string().min(8).max(100),
	referralCode: string().trim().max(12).optional(),
	cookieTimestamp: number().optional()
})).handler(createSsrRpc("c927ced39ce2c9981e639ac2ff3b1afa897e9ba2c83c95060b108aa0186169c6"));
var signIn = createServerFn({ method: "POST" }).validator(object({
	email: string().trim().email().max(120),
	password: string().min(8).max(100)
})).handler(createSsrRpc("0672a16b80407c0b836f59fefb73164ee4ed7f7c1e28db0ee2ad89961bb61e5f"));
var refreshSession = createServerFn({ method: "POST" }).validator(object({ refreshToken: string().min(10) })).handler(createSsrRpc("3ad40b1316b3f2b7c6098a33a8d32743ea88c365ec3c5558441216b49e72d82b"));
var ensureProfile = createServerFn({ method: "POST" }).validator(object({
	idToken: token$3,
	name: string().trim().max(80).optional(),
	phone: string().trim().max(30).optional(),
	referralCode: string().trim().max(12).optional(),
	cookieTimestamp: number().optional()
})).handler(createSsrRpc("702ed82b72ee1f64c3dc305f55e05dcb70d362e69a8edd2052d3e6318d7e615d"));
var getSponsor = createServerFn({ method: "POST" }).validator(object({ code: string().trim().regex(/^[A-Za-z0-9]{4,12}$/) })).handler(createSsrRpc("965b371c2fddce743c20ddfdb09c7be83716ff999cff906d8ac1edda80d8b42d"));
var getMySponsor = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("75b855d405bf267df0a78ecdf83597e4a9d3622332e26e2481b35cbc539e9755"));
var saveContact = createServerFn({ method: "POST" }).validator(object({
	idToken: token$3,
	phone: string().trim().max(30),
	facebook: string().trim().max(200),
	whatsapp: string().trim().max(200)
})).handler(createSsrRpc("5e3339c256dff075a82110c9036dc9e4f88fbde08465cfc4842a346547e5a7e0"));
var getMe = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("3e20f27d8c771d681ae3f8f1419c2cd915cbad1c55fe6953116a4b8cd71aaada"));
var getDesk = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("86fcd189a13777fb54389a2e3c56995881ba0c90b54934fb81507178f32617fb"));
var getTutorial = createServerFn({ method: "POST" }).validator(object({
	idToken: token$3,
	tutorialId: string().regex(/^[a-z0-9-]{1,40}$/)
})).handler(createSsrRpc("384152df2d0d3c588c5703d3657b5bd01cf8cc6393d3a9f1eeaa94b792de4ae1"));
var saveProgress = createServerFn({ method: "POST" }).validator(object({
	idToken: token$3,
	tutorialId: string().regex(/^[a-z0-9-]{1,40}$/),
	progressPercent: number().min(0).max(100),
	lastPositionSec: number().min(0).max(28800),
	completed: boolean(),
	exercises: array(string().max(40)).max(20)
})).handler(createSsrRpc("6915da1487145ccb93b28c2a2a58263eb81d82d1aef44c5386fd4dab208a5499"));
var masterGate = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("a3d4c7a2d3b84ee3e2b5885286839defd9387da59f3d3cdc09c631a27306e9b2"));
var listIssued = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("0033181f34a62636857de9010babaf2d32c6d12a5e0f400b8ff7cb6b6bf4728b"));
var issueCode = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("d08727e2062d78bc12c5830ea0ba43b0b9f563a16d4b9a43e9b8e63b297a714b"));
var listCodes = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("9230de1213b07f6212815a17740bb13b0bb98d8294e1ba9551e7e56bb1ba3801"));
var redeemCode = createServerFn({ method: "POST" }).validator(object({
	idToken: token$3,
	code: string().trim().min(4).max(16)
})).handler(createSsrRpc("e48b7e79bb0071f80c67ccea351e7d2b0bf422727c337e4f10c6d50c56e394c2"));
var getWallet = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("bc796cd31ddba61610ab4f742fd9ea7e8c88b6fdea755d868ba2f018a1f1e62e"));
var payout = createServerFn({ method: "POST" }).validator(object({
	idToken: token$3,
	amount: number().int().min(100).max(1e6),
	method: _enum(["gcash", "maya"]),
	account: string().trim().max(24),
	phone: string().trim().max(20),
	accountName: string().trim().min(2).max(80)
})).handler(createSsrRpc("f86395d50ca80ad157c25545e2fd6aafba4ec0eb7304a027fae9ace599c39a78"));
var listPayouts = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("99f5c3938d238b23aadf9b03b9b04bef4344ed5a90a96ed9e83cd1a16098213e"));
var payPayout = createServerFn({ method: "POST" }).validator(object({
	idToken: token$3,
	requestId: string().regex(/^payout_\d+$/)
})).handler(createSsrRpc("6c77f419742be2bb2d6b219833ae6306264a063be99783f97806afee196127d7"));
var getNetwork = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("0ab883fdc3081e6c8338a6b4d4d2a9b83d0ad5186a3f655b197b977d4069fbb2"));
var place = createServerFn({ method: "POST" }).validator(object({
	idToken: token$3,
	recruitUid: string().regex(/^[A-Za-z0-9]{8,128}$/),
	parentUid: string().regex(/^[A-Za-z0-9]{8,128}$/)
})).handler(createSsrRpc("63b7dbca97584c54e1e3d08995fe83835f52de1d671f495d05c83daf3444d752"));
var getNotices = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("ddfbc55e2bdcb59385da24f17f202701122bbd991a3d327271c2659a63df289a"));
var readNotices = createServerFn({ method: "POST" }).validator(object({ idToken: token$3 })).handler(createSsrRpc("a16aace1c65bae1b7c94cd994a96cc0ca4f56ec57cb245c66286cb8aa2db6153"));
async function signInWithGoogle() {
	const { initializeApp, getApps } = await import("../_libs/firebase.mjs").then((n) => n.n);
	const { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, signInWithPopup } = await import("../_libs/firebase.mjs").then((n) => n.t);
	const auth = getAuth(getApps()[0] ?? initializeApp(firebaseConfig));
	await setPersistence(auth, browserLocalPersistence);
	const cred = await signInWithPopup(auth, new GoogleAuthProvider());
	const idToken = await cred.user.getIdToken();
	const bag = cred._tokenResponse;
	return {
		idToken,
		refreshToken: cred.user.refreshToken || bag?.refreshToken || "",
		uid: cred.user.uid,
		email: cred.user.email ?? "",
		name: cred.user.displayName ?? "",
		expiresAt: Date.now() + Number(bag?.expiresIn ?? 3600) * 1e3
	};
}
function googleError(error) {
	const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
	const host = typeof window !== "undefined" ? window.location.hostname : "this site";
	if (code.includes("unauthorized-domain")) return `Google isn’t allowed on ${host} yet. Add that domain in Firebase Authentication → Settings → Authorized domains. Email still works.`;
	if (code.includes("popup-blocked")) return "The browser blocked the Google window. Allow popups, or use email.";
	if (code.includes("popup-closed-by-user") || code.includes("cancelled")) return "Google window closed before finishing.";
	if (code.includes("operation-not-allowed")) return "Turn on Google in Firebase Authentication → Sign-in method.";
	if (code.includes("network")) return "Couldn’t reach Google. Try again.";
	return "Google didn’t finish. Use email, or try again.";
}
async function signOutGoogle() {
	try {
		const { getApps } = await import("../_libs/firebase.mjs").then((n) => n.n);
		const { getAuth, signOut } = await import("../_libs/firebase.mjs").then((n) => n.t);
		const app = getApps()[0];
		if (app) await signOut(getAuth(app));
	} catch {}
}
var KEY$1 = "dc.referral.v1";
var COOKIE = "dc_ref";
var MAX_AGE = Math.floor(2592e3);
function valid(code) {
	return /^[A-Z0-9]{4,12}$/.test(code);
}
function parse(raw) {
	if (!raw) return null;
	try {
		const value = JSON.parse(raw);
		if (!value || typeof value.code !== "string" || typeof value.ts !== "number") return null;
		if (!valid(value.code) || Date.now() - value.ts > 2592e6) return null;
		return {
			code: value.code,
			ts: value.ts
		};
	} catch {
		return null;
	}
}
function readCookieRaw() {
	const row = document.cookie.split("; ").find((part) => part.startsWith(`${COOKIE}=`));
	if (!row) return null;
	try {
		return decodeURIComponent(row.slice(7));
	} catch {
		return null;
	}
}
function clearCookie() {
	document.cookie = `${COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
	localStorage.removeItem(KEY$1);
}
function writeReferral(record) {
	const payload = encodeURIComponent(JSON.stringify(record));
	document.cookie = `${COOKIE}=${payload}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;
	localStorage.setItem(KEY$1, JSON.stringify(record));
}
function readReferral() {
	if (typeof window === "undefined") return null;
	const fromCookie = parse(readCookieRaw());
	if (fromCookie) return fromCookie;
	const fromStore = parse(localStorage.getItem(KEY$1));
	if (!fromStore) {
		if (readCookieRaw() || localStorage.getItem(KEY$1)) clearCookie();
		return null;
	}
	writeReferral(fromStore);
	return fromStore;
}
function codeFromLocation() {
	const query = new URLSearchParams(window.location.search).get("ref")?.trim().toUpperCase() ?? "";
	if (valid(query)) return query;
	const fromPath = window.location.pathname.match(/^\/r\/([A-Za-z0-9]{4,12})(?:\/|$)/i)?.[1]?.toUpperCase() ?? "";
	return valid(fromPath) ? fromPath : "";
}
/** First link opener keeps the credit for one month. Later links do not replace it. */
function captureReferralFromUrl() {
	if (typeof window === "undefined") return null;
	const existing = readReferral();
	const ref = codeFromLocation();
	if (!ref) return existing;
	if (existing) return existing;
	const record = {
		code: ref,
		ts: Date.now()
	};
	writeReferral(record);
	return record;
}
var KEY = "dc.session.v1";
var PROFILE = "dc.profile.v1";
function readSession() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const value = JSON.parse(raw);
		if (!value?.idToken || !value.uid) return null;
		return value;
	} catch {
		return null;
	}
}
function writeSession(session) {
	localStorage.setItem(KEY, JSON.stringify(session));
}
function readProfile() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(PROFILE);
		if (!raw) return null;
		const value = JSON.parse(raw);
		if (!value?.uid) return null;
		return value;
	} catch {
		return null;
	}
}
function writeProfile(profile) {
	localStorage.setItem(PROFILE, JSON.stringify(profile));
}
function clearSession() {
	localStorage.removeItem(KEY);
	localStorage.removeItem(PROFILE);
}
function progressCacheKey(uid, tutorialId) {
	return `dc.progress.${uid}.${tutorialId}`;
}
var ConnectContext = (0, import_react.createContext)(null);
async function fresh(session) {
	if (session.expiresAt > Date.now() + 6e4) return session;
	if (!session.refreshToken) throw new Error("Sign in again.");
	const next = await refreshSession({ data: { refreshToken: session.refreshToken } });
	const merged = {
		...next,
		email: next.email || session.email
	};
	writeSession(merged);
	return merged;
}
function remember(session, profile) {
	writeSession(session);
	writeProfile(profile);
}
function ConnectProvider({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfileState] = (0, import_react.useState)(null);
	function setProfile(next) {
		writeProfile(next);
		setProfileState(next);
	}
	(0, import_react.useEffect)(() => {
		captureReferralFromUrl();
		let cancel = false;
		const stored = readSession();
		const cached = readProfile();
		if (stored) setSession(stored);
		if (stored && cached?.uid === stored.uid) setProfileState(cached);
		if (!stored) {
			setReady(true);
			return;
		}
		(async () => {
			try {
				const next = await fresh(stored);
				const me = await getMe({ data: { idToken: next.idToken } });
				if (cancel) return;
				remember(next, me);
				setSession(next);
				setProfileState(me);
			} catch (caught) {
				const message = caught instanceof Error ? caught.message : "";
				if (!cancel && message.includes("SESSION_REVOKED")) {
					clearSession();
					setSession(null);
					setProfileState(null);
				}
			} finally {
				if (!cancel) setReady(true);
			}
		})();
		return () => {
			cancel = true;
		};
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		ready,
		session,
		profile,
		setProfile,
		async signInEmail(email, password) {
			const result = await signIn({ data: {
				email,
				password
			} });
			remember(result.session, result.profile);
			setSession(result.session);
			setProfileState(result.profile);
			return result.profile;
		},
		async signUpEmail(input) {
			const referral = readReferral();
			const result = await signUp({ data: {
				...input,
				referralCode: referral?.code,
				cookieTimestamp: referral?.ts
			} });
			remember(result.session, result.profile);
			setSession(result.session);
			setProfileState(result.profile);
			return result.profile;
		},
		async adopt(next, name, phone) {
			const referral = readReferral();
			writeSession(next);
			const me = await ensureProfile({ data: {
				idToken: next.idToken,
				name,
				phone,
				referralCode: referral?.code,
				cookieTimestamp: referral?.ts
			} });
			remember(next, me);
			setSession(next);
			setProfileState(me);
			return me;
		},
		async signOut() {
			clearSession();
			setSession(null);
			setProfileState(null);
			await signOutGoogle();
		}
	}), [
		profile,
		ready,
		session
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectContext.Provider, {
		value,
		children
	});
}
function useConnect() {
	const value = (0, import_react.useContext)(ConnectContext);
	if (!value) throw new Error("Connect is unavailable.");
	return value;
}
var styles_default = "/assets/styles-LGgvskof.css";
var Route$26 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
			},
			{ title: "AI Master Plan" },
			{
				name: "description",
				content: "One AI tool, taught every morning. $8.73 once."
			},
			{
				name: "theme-color",
				content: "#141414"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-canvas font-sans text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockZoom, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ConnectProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldInactive, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					theme: "dark",
					position: "top-center"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
function HoldInactive() {
	const { ready, session, profile } = useConnect();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	if (!ready || !session || !profile) return null;
	if (profile.membershipStatus === "active") return null;
	if (pathname === "/checkout" || pathname === "/login" || pathname === "/join" || pathname === "/start" || pathname === "/community" || pathname.includes("/csr/") || pathname === "/code/create" || pathname === "/admin") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
}
function LockZoom() {
	(0, import_react.useEffect)(() => {
		const blockGesture = (event) => event.preventDefault();
		const blockPinch = (event) => {
			if (event.ctrlKey) event.preventDefault();
		};
		document.addEventListener("gesturestart", blockGesture, { passive: false });
		document.addEventListener("gesturechange", blockGesture, { passive: false });
		window.addEventListener("wheel", blockPinch, { passive: false });
		return () => {
			document.removeEventListener("gesturestart", blockGesture);
			document.removeEventListener("gesturechange", blockGesture);
			window.removeEventListener("wheel", blockPinch);
		};
	}, []);
	return null;
}
var token$2 = string().min(20);
var postId = string().regex(/^com_[A-Za-z0-9]{8,20}$/);
var listCommunity = createServerFn({ method: "POST" }).validator(object({ idToken: token$2 })).handler(createSsrRpc("81dce9d7e2ad26d4fe4abc6f3cd2adda6e992e5d0223e35f8e9de9890c23cfe0"));
var submitCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token$2,
	caption: string().max(500),
	mediaUrl: string().url().max(500)
})).handler(createSsrRpc("68c2e53c398da601c3502877e5f666a9aea85d4a977c085ce5d3c2d2b4877c06"));
var likeCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token$2,
	postId
})).handler(createSsrRpc("fb43604e6a446b78a13311fcd8952ab900be8f18563c1582a865aadb27ea537b"));
var deleteCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token$2,
	postId
})).handler(createSsrRpc("7a619c9bd3ad0b6635e3f1c64ecaa21f54c9f66b038431e0c7f68933cb6cc7bf"));
var editCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token$2,
	postId,
	caption: string().trim().min(1).max(500)
})).handler(createSsrRpc("77cd5de5058cf469d71144dcbede9f27371d1683495e21a87cf7286a8107057e"));
var commentCommunity = createServerFn({ method: "POST" }).validator(object({
	idToken: token$2,
	postId,
	text: string().trim().min(1).max(280)
})).handler(createSsrRpc("c89202165a854c47a15ad0ce1adb57eeea402b93ca1ad3833b8d2887ea6f826d"));
async function uploadMemberMedia(idToken, file, _objectPath) {
	let ticket;
	try {
		ticket = await fetch("/api/media", {
			method: "POST",
			headers: { "x-id-token": idToken }
		});
	} catch {
		throw new Error("The upload did not reach the server. Try again.");
	}
	if (!ticket.ok) {
		const text = (await ticket.text()).trim();
		throw new Error(text || "Could not start the upload.");
	}
	const signed = await ticket.json();
	const body = new FormData();
	body.set("file", file);
	body.set("api_key", signed.apiKey);
	body.set("timestamp", String(signed.timestamp));
	body.set("signature", signed.signature);
	const res = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/video/upload`, {
		method: "POST",
		body
	});
	const data = await res.json();
	if (!res.ok || !data.secure_url) throw new Error(data.error?.message || "Cloudinary refused the video.");
	return data.secure_url;
}
function readVideoMeta(file) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const video = document.createElement("video");
		video.preload = "metadata";
		video.muted = true;
		video.playsInline = true;
		let settled = false;
		const finish = () => {
			if (settled) return;
			settled = true;
			window.clearTimeout(timer);
			const width = video.videoWidth || 720;
			const height = video.videoHeight || 1280;
			const durationSec = Number.isFinite(video.duration) ? video.duration : 0;
			const canvas = document.createElement("canvas");
			canvas.width = 360;
			canvas.height = Math.max(1, Math.round(360 * height / Math.max(1, width)));
			const ctx = canvas.getContext("2d");
			if (ctx && video.videoWidth) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const posterUrl = canvas.toDataURL("image/jpeg", .72);
			URL.revokeObjectURL(url);
			resolve({
				durationSec,
				width,
				height,
				posterUrl
			});
		};
		const timer = window.setTimeout(finish, 2500);
		video.onloadedmetadata = () => {
			try {
				const target = Math.min(.2, Math.max(0, (video.duration || 0) / 2));
				if (target > 0) video.currentTime = target;
				else finish();
			} catch {
				finish();
			}
		};
		video.onseeked = finish;
		video.onerror = () => {
			if (settled) return;
			settled = true;
			window.clearTimeout(timer);
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Could not read that video."));
		};
		video.src = url;
	});
}
function ago(at) {
	const mins = Math.max(0, Math.round((Date.now() - at) / 6e4));
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins}m`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `${hours}h`;
	return `${Math.round(hours / 24)}d`;
}
function CommunityComposer({ session, name, onPosted }) {
	const fileRef = (0, import_react.useRef)(null);
	const [caption, setCaption] = (0, import_react.useState)("");
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "rounded-2xl border border-line bg-raise p-4",
		onSubmit: (event) => {
			event.preventDefault();
			const file = fileRef.current?.files?.[0];
			if (!file) {
				setError("Choose a video first.");
				return;
			}
			setBusy(true);
			setError("");
			(async () => {
				const mediaUrl = await uploadMemberMedia(session.idToken, file, `community/${Date.now()}.mp4`);
				await submitCommunity({ data: {
					idToken: session.idToken,
					caption,
					mediaUrl
				} });
				setCaption("");
				setFileName("");
				if (fileRef.current) fileRef.current.value = "";
				onPosted?.();
			})().catch((caught) => setError(errorText(caught))).finally(() => setBusy(false));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 shrink-0 place-items-center rounded-full bg-surface text-sm font-medium text-teal",
					children: (name || "M").charAt(0).toUpperCase()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: caption,
					onChange: (event) => setCaption(event.target.value),
					placeholder: "What's on your mind?",
					className: "h-11 flex-1 rounded-full border border-line bg-surface px-4"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between gap-3 border-t border-line pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-teal",
					onClick: () => fileRef.current?.click(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }), "Upload Video"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy,
					className: "h-10 rounded-full bg-teal px-4 text-sm font-medium text-ink disabled:opacity-50",
					children: busy ? "Posting…" : "Post"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "video/*",
				className: "sr-only",
				onChange: (event) => setFileName(event.target.files?.[0]?.name ?? "")
			}),
			fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 truncate text-xs text-muted",
				children: fileName
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-teal",
				children: error
			}) : null
		]
	});
}
function CommunityFeed({ session, name }) {
	const [posts, setPosts] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [editText, setEditText] = (0, import_react.useState)("");
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	function reload() {
		return listCommunity({ data: { idToken: session.idToken } }).then((result) => setPosts(result.posts));
	}
	(0, import_react.useEffect)(() => {
		reload().catch((caught) => setError(errorText(caught)));
		const timer = window.setInterval(() => setNow(Date.now()), 6e4);
		return () => window.clearInterval(timer);
	}, [session.idToken]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-3 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "px-1 font-display text-3xl",
				children: "Community Contents"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 px-1 text-sm text-muted",
				children: "Videos from members, newest first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunityComposer, {
					session,
					name,
					onPosted: () => {
						reload().catch((caught) => setError(errorText(caught)));
					}
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-teal",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-10 text-center text-sm text-muted",
					children: "No videos yet. Upload the first one."
				}) : null, posts.map((post) => {
					const canManage = post.mine && now - post.createdAt < 864e5;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "overflow-hidden rounded-2xl border border-line bg-raise",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
								className: "flex items-start gap-3 px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-10 place-items-center rounded-full bg-surface text-sm font-medium text-teal",
										children: (post.name || "M").charAt(0).toUpperCase()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm font-medium",
												children: post.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 inline-flex rounded-full bg-teal/15 px-2 py-0.5 text-[11px] font-medium text-teal",
												children: "Content Author"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 block text-xs text-muted",
												children: ago(post.createdAt)
											})
										]
									}),
									canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex shrink-0 gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Edit post",
											className: "grid size-9 place-items-center rounded-full text-muted",
											onClick: () => {
												setEditing(post.id);
												setEditText(post.caption);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Delete post",
											className: "grid size-9 place-items-center rounded-full text-muted",
											onClick: () => {
												deleteCommunity({ data: {
													idToken: session.idToken,
													postId: post.id
												} }).then(() => setPosts((rows) => rows.filter((row) => row.id !== post.id))).catch((caught) => setError(errorText(caught)));
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})]
									}) : null
								]
							}),
							editing === post.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "space-y-2 px-4 pb-3",
								onSubmit: (event) => {
									event.preventDefault();
									editCommunity({ data: {
										idToken: session.idToken,
										postId: post.id,
										caption: editText
									} }).then((next) => {
										setPosts((rows) => rows.map((row) => row.id === post.id ? {
											...row,
											caption: next.caption
										} : row));
										setEditing(null);
									}).catch((caught) => setError(errorText(caught)));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: editText,
									onChange: (event) => setEditText(event.target.value),
									className: "h-11 w-full rounded-xl border border-line bg-surface px-3"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "h-9 rounded-full bg-teal px-3 text-sm font-medium text-ink",
										children: "Save"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-9 rounded-full px-3 text-sm text-muted",
										onClick: () => setEditing(null),
										children: "Cancel"
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-4 pb-3 text-sm",
								children: post.caption
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: post.mediaUrl,
								controls: true,
								playsInline: true,
								className: "max-h-[70dvh] w-full bg-black"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "px-4 pt-2 text-xs text-muted",
								children: [
									post.likes,
									" ",
									post.likes === 1 ? "like" : "likes",
									" · ",
									post.comments.length,
									" comments"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 grid grid-cols-2 border-y border-line",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `flex h-11 items-center justify-center gap-2 text-sm ${post.liked ? "text-teal" : "text-muted"}`,
									onClick: () => {
										likeCommunity({ data: {
											idToken: session.idToken,
											postId: post.id
										} }).then((next) => {
											setPosts((rows) => rows.map((row) => row.id === post.id ? {
												...row,
												likes: next.likes,
												liked: next.liked
											} : row));
										}).catch((caught) => setError(errorText(caught)));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "size-4" }), " Like"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex h-11 items-center justify-center gap-2 text-sm text-muted",
									onClick: () => document.getElementById(`c-${post.id}`)?.focus(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " Comment"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2 px-4 py-3",
								children: post.comments.map((comment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-2xl bg-surface px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: comment.name
										}),
										" ",
										comment.text
									]
								}, comment.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
								className: "flex gap-2 px-4 pb-4",
								onSubmit: (event) => {
									event.preventDefault();
									const text = drafts[post.id]?.trim() ?? "";
									if (!text) return;
									commentCommunity({ data: {
										idToken: session.idToken,
										postId: post.id,
										text
									} }).then((next) => {
										setPosts((rows) => rows.map((row) => row.id === post.id ? {
											...row,
											comments: next.comments
										} : row));
										setDrafts((current) => ({
											...current,
											[post.id]: ""
										}));
									}).catch((caught) => setError(errorText(caught)));
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: `c-${post.id}`,
									value: drafts[post.id] ?? "",
									onChange: (event) => setDrafts((current) => ({
										...current,
										[post.id]: event.target.value
									})),
									placeholder: "Write a comment…",
									className: "h-10 flex-1 rounded-full border border-line bg-surface px-4 text-sm"
								})
							})
						]
					}, post.id);
				})]
			})
		]
	});
}
function HomeUpload({ session, name }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunityComposer, {
			session,
			name,
			onPosted: () => void navigate({ to: "/community" })
		})
	});
}
function cn(...values) {
	return twMerge(clsx(values));
}
function whatsappHref(value) {
	if (value.startsWith("http")) return value;
	return `https://wa.me/${value.replace(/\D/g, "")}`;
}
function PhoneIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.58 1 1 0 0 1-.25 1.02z"
		})
	});
}
function WhatsAppIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.16h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.64-.61-2.89-1.25-4.77-4.16-4.91-4.35-.14-.19-1.17-1.55-1.17-2.96s.74-2.1 1-2.39c.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.28-.12.55.16.26.71 1.17 1.52 1.89 1.05.93 1.93 1.22 2.2 1.36.26.14.42.12.58-.07.16-.19.66-.77.84-1.03.17-.26.35-.22.58-.13.24.09 1.49.7 1.75.83.26.12.43.19.49.29.07.1.07.6-.17 1.28z"
		})
	});
}
function FacebookIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M14.5 8.5V6.7c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.5v2H9v2.7h2V21h3.5v-9.8h2.3l.4-2.7h-2.7z"
		})
	});
}
function SponsorContacts({ card }) {
	const items = [
		card.phone ? {
			href: `tel:${card.phone}`,
			label: `Call ${card.name}`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneIcon, {}),
			className: "bg-[#34C759] text-white"
		} : null,
		card.whatsapp ? {
			href: whatsappHref(card.whatsapp),
			label: `WhatsApp ${card.name}`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, {}),
			className: "bg-[#25D366] text-white",
			external: true
		} : null,
		card.facebook ? {
			href: card.facebook,
			label: `Facebook profile of ${card.name}`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacebookIcon, {}),
			className: "bg-[#1877F2] text-white",
			external: true
		} : null
	].filter((item) => Boolean(item));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-line bg-raise px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted",
			children: ["Your sponsor ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium text-fg",
				children: card.name
			})]
		}), items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex gap-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: item.href,
				"aria-label": item.label,
				target: "external" in item && item.external ? "_blank" : void 0,
				rel: "external" in item && item.external ? "noreferrer" : void 0,
				className: `grid size-12 shrink-0 place-items-center overflow-hidden rounded-full ${item.className}`,
				children: item.icon
			}, item.label))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "No number yet. It appears here when they add one."
		})]
	});
}
function SponsorDetails({ card }) {
	const rows = [
		{
			key: "phone",
			label: "Phone",
			value: card.phone,
			href: card.phone ? `tel:${card.phone}` : "",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneIcon, {}),
			tone: "text-[#34C759]",
			empty: "Not added yet"
		},
		{
			key: "facebook",
			label: "Facebook",
			value: card.facebook,
			href: card.facebook,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacebookIcon, {}),
			tone: "text-[#1877F2]",
			empty: "Not added yet",
			external: true
		},
		{
			key: "whatsapp",
			label: "WhatsApp",
			value: card.whatsapp,
			href: card.whatsapp ? whatsappHref(card.whatsapp) : "",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, {}),
			tone: "text-[#25D366]",
			empty: "Not added yet",
			external: true
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-line bg-raise",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg px-5 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted",
					children: "Your sponsor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-lg font-medium text-fg",
					children: card.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: row.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: row.href,
						target: row.external ? "_blank" : void 0,
						rel: row.external ? "noreferrer" : void 0,
						className: "flex items-center gap-3 rounded-2xl bg-surface px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid size-10 shrink-0 place-items-center rounded-full bg-raise ${row.tone}`,
							children: row.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted",
								children: row.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block break-all text-sm text-fg",
								children: row.value
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-2xl bg-surface px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 shrink-0 place-items-center rounded-full bg-raise text-muted",
							children: row.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted",
								children: row.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-muted",
								children: row.empty
							})]
						})]
					}) }, row.key))
				})
			]
		})
	});
}
function FieldIcon({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid size-9 shrink-0 place-items-center rounded-full bg-surface text-fg",
		children
	});
}
function SponsorBar() {
	const href = useRouterState({ select: (state) => state.location.href });
	const { profile } = useConnect();
	const [card, setCard] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const referral = captureReferralFromUrl();
		if (!referral || profile?.membershipStatus === "active") {
			setCard(null);
			return;
		}
		let cancel = false;
		getSponsor({ data: { code: referral.code } }).then((next) => {
			if (!cancel) setCard(next);
		}).catch(() => {
			if (!cancel) setCard(null);
		});
		return () => {
			cancel = true;
		};
	}, [href, profile?.membershipStatus]);
	if (!card || profile?.membershipStatus === "active") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SponsorContacts, { card });
}
function Logo({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2 text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			className: "size-8",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "32",
					height: "32",
					rx: "8",
					fill: "#2a2a2a",
					stroke: "#d4af37",
					strokeWidth: "1.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "16",
					y: "21",
					textAnchor: "middle",
					fontSize: "12",
					fontFamily: "Roboto, sans-serif",
					fontWeight: "700",
					fill: "#f3e2a6",
					children: "AI"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M8 24c6-2 10-2 16 0",
					fill: "none",
					stroke: "#d4af37",
					strokeWidth: "1.6",
					strokeLinecap: "round"
				})
			]
		}), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-display text-lg leading-none",
			children: ["AI ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-teal",
				children: "Master Plan"
			})]
		})]
	});
}
function Splash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-canvas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
	});
}
var primary = [
	{
		to: "/",
		label: "Home",
		icon: House,
		exact: true
	},
	{
		to: "/learn",
		label: "Lessons",
		icon: BookOpen,
		exact: false
	},
	{
		to: "/tools",
		label: "Tools",
		icon: Layers,
		exact: false
	},
	{
		to: "/roadmap",
		label: "Roadmap",
		icon: Route,
		exact: true
	}
];
var profileTab = {
	to: "/profile",
	label: "Profile",
	icon: UserRound,
	exact: false
};
var extra = [
	{
		to: "/community",
		label: "Community",
		hint: "Member videos",
		icon: Clapperboard,
		exact: false
	},
	{
		to: "/csr",
		label: "CSR Agent",
		hint: "Your customer-service persona",
		icon: Phone,
		exact: true
	},
	{
		to: "/deck",
		label: "Deck",
		hint: "Watch or upload a reel",
		icon: Clapperboard,
		exact: false
	},
	{
		to: "/studio",
		label: "Studio",
		hint: "Make a post",
		icon: Sparkles,
		exact: false
	},
	{
		to: "/live",
		label: "Live",
		hint: "Schedule a selling stream",
		icon: Radio,
		exact: false
	},
	{
		to: "/market",
		label: "Market",
		hint: "Products you can share",
		icon: Store,
		exact: false
	},
	{
		to: "/creator",
		label: "Creator",
		hint: "Views and earnings",
		icon: ChartLine,
		exact: false
	},
	{
		to: "/wallet",
		label: "Wallet",
		hint: "Balance and payouts",
		icon: Wallet,
		exact: false
	},
	{
		to: "/moderate",
		label: "Moderate",
		hint: "Review the queue",
		icon: Shield,
		exact: false
	}
];
var bottomTabs = [...primary, profileTab];
function screenTitle(pathname) {
	if (pathname === "/") return "Home";
	if (pathname.startsWith("/learn")) return "Lessons";
	if (pathname.startsWith("/tools")) return "Tools";
	if (pathname.startsWith("/roadmap")) return "Roadmap";
	if (pathname.startsWith("/community")) return "Community";
	if (pathname.startsWith("/csr") || pathname.includes("/csr/")) return "CSR Agent";
	if (pathname.startsWith("/deck")) return "Deck";
	if (pathname.startsWith("/studio")) return "Studio";
	if (pathname.startsWith("/live")) return "Live";
	if (pathname.startsWith("/market")) return "Market";
	if (pathname.startsWith("/creator")) return "Creator";
	if (pathname.startsWith("/wallet")) return "Wallet";
	if (pathname.startsWith("/profile")) return "Profile";
	if (pathname.startsWith("/moderate")) return "Moderate";
	return "Daily Connect";
}
function Shell({ children }) {
	const { session, profile } = useConnect();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const [more, setMore] = (0, import_react.useState)(false);
	const [notices, setNotices] = (0, import_react.useState)([]);
	const [unread, setUnread] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		let cancel = false;
		getNotices({ data: { idToken: session.idToken } }).then((result) => {
			if (cancel) return;
			setNotices(result.notifications);
			setUnread(result.unread);
		}).catch(() => void 0);
		return () => {
			cancel = true;
		};
	}, [pathname, session]);
	const initial = (profile?.name || profile?.email || "M").charAt(0).toUpperCase();
	const title = screenTitle(pathname);
	const moreActive = extra.some((tab) => tab.exact ? pathname === tab.to : pathname.startsWith(tab.to));
	(0, import_react.useEffect)(() => {
		setMore(false);
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-frame relative text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-20 flex shrink-0 flex-col border-b border-line bg-canvas pt-[env(safe-area-inset-top)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-3 md:h-auto md:gap-4 md:px-8 md:py-3 md:pt-[max(0.75rem,env(safe-area-inset-top))]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							"aria-label": "Home",
							className: "shrink-0 md:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { compact: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-w-0 flex-1 truncate text-center text-base font-medium md:hidden",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							"aria-label": "Home",
							className: "hidden shrink-0 md:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Main",
							className: "hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex",
							children: [bottomTabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: tab.to,
								activeOptions: { exact: tab.exact },
								className: "inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-muted hover:bg-surface hover:text-fg",
								activeProps: { className: "inline-flex h-10 items-center gap-2 rounded-full bg-surface px-3 text-sm text-teal" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "size-4" }), tab.label]
							}, tab.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: cn("inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm", moreActive || more ? "bg-surface text-teal" : "text-muted"),
									"aria-expanded": more,
									"aria-label": "More",
									onClick: () => setMore((value) => !value),
									children: [more ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" }), "More"]
								}), more ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-0 top-12 z-30 w-72 rounded-2xl bg-raise p-2 shadow-float",
									children: extra.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: tab.to,
										className: "flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "size-4 text-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block",
											children: tab.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs text-muted",
											children: tab.hint
										})] })]
									}, tab.to))
								}) : null]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "relative grid size-11 place-items-center rounded-full text-fg",
								"aria-label": unread ? `${unread} unread notices` : "Notices",
								onClick: () => setOpen((value) => !value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 size-2 rounded-full bg-teal" }) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/profile",
								className: "grid size-11 place-items-center rounded-full bg-surface font-medium text-teal",
								"aria-label": "Profile",
								children: initial
							})]
						}),
						open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass absolute right-4 top-16 hidden w-80 max-w-[calc(100vw-2rem)] rounded-2xl p-3 md:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between px-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: "Notices"
								}), unread > 0 && session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sm text-teal",
									onClick: () => {
										readNotices({ data: { idToken: session.idToken } }).then((next) => {
											setNotices(next);
											setUnread(0);
										});
									},
									children: "Mark read"
								}) : null]
							}), notices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-1 py-6 text-sm text-muted",
								children: "Referrals and payouts show up here."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "max-h-80 space-y-2 overflow-auto",
								children: notices.map((notice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: cn("rounded-xl px-3 py-2", notice.read ? "opacity-60" : "bg-surface"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: notice.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: notice.body
									})]
								}, notice.id))
							})]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SponsorBar, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "app-scroll",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Main",
				className: "z-20 grid shrink-0 grid-cols-5 border-t border-line bg-raise pb-[env(safe-area-inset-bottom)] md:hidden",
				children: bottomTabs.map((tab) => {
					const active = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.to,
						className: "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("grid h-8 w-14 place-items-center rounded-2xl", active ? "bg-teal/15 text-teal" : "text-muted"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, {
								className: "size-[22px]",
								strokeWidth: active ? 2.4 : 1.75
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: active ? "text-teal" : "text-muted",
							children: tab.label
						})]
					}, tab.to);
				})
			}),
			more ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close menu",
				className: "absolute inset-0 z-30 bg-black/55 md:hidden",
				onClick: () => setMore(false)
			}) : null,
			more ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 z-40 rounded-t-3xl bg-raise px-2 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 shadow-float md:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-2 h-1 w-10 rounded-full bg-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted",
						children: "More"
					}),
					extra.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.to,
						className: "flex min-h-14 items-center gap-3 rounded-2xl px-3 text-fg active:bg-surface",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 place-items-center rounded-full bg-surface text-teal",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium",
									children: tab.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs text-muted",
									children: tab.hint
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted" })
						]
					}, tab.to))
				]
			}) : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 top-14 z-40 max-h-[70dvh] overflow-auto border-b border-line bg-raise px-3 py-3 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Notices"
					}), unread > 0 && session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-teal",
						onClick: () => {
							readNotices({ data: { idToken: session.idToken } }).then((next) => {
								setNotices(next);
								setUnread(0);
							});
						},
						children: "Mark read"
					}) : null]
				}), notices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 py-6 text-sm text-muted",
					children: "Referrals and payouts show up here."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: notices.map((notice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("rounded-2xl px-3 py-3", notice.read ? "opacity-60" : "bg-surface"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: notice.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: notice.body
						})]
					}, notice.id))
				})]
			}) : null
		]
	});
}
function Ring({ value }) {
	const radius = 18;
	const circ = 2 * Math.PI * radius;
	const offset = circ - Math.max(0, Math.min(100, value)) / 100 * circ;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 44 44",
		className: "size-12 shrink-0",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "22",
			cy: "22",
			r: radius,
			className: "fill-none stroke-line",
			strokeWidth: "3"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "22",
			cy: "22",
			r: radius,
			className: "fill-none stroke-teal",
			strokeWidth: "3",
			strokeLinecap: "round",
			strokeDasharray: circ,
			strokeDashoffset: offset,
			transform: "rotate(-90 22 22)"
		})]
	});
}
function Countdown() {
	const [left, setLeft] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const tick = () => setLeft(secondsUntilManilaMidnight());
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "tabular-nums",
		children: left === null ? "--:--:--" : formatClock(left)
	});
}
function Dashboard() {
	const { session } = useConnect();
	const [desk, setDesk] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		let cancel = false;
		setLoading(true);
		getDesk({ data: { idToken: session.idToken } }).then((next) => {
			if (!cancel) setDesk(next);
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		}).finally(() => {
			if (!cancel) setLoading(false);
		});
		return () => {
			cancel = true;
		};
	}, [session]);
	(0, import_react.useEffect)(() => {
		if (!desk?.todayId) return;
		const key = "dc.seenPick";
		const prev = localStorage.getItem(key);
		if (prev && prev !== desk.todayId) {
			toast("A new daily pick is up.");
			if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification("Daily Connect", { body: "Today’s pick is ready." });
		}
		localStorage.setItem(key, desk.todayId);
	}, [desk?.todayId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-5xl px-5 py-8 text-sm text-muted",
		children: "Loading the desk…"
	});
	if (error || !desk) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-5 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: error || "Could not load the desk."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mt-4 text-teal",
			onClick: () => window.location.reload(),
			children: "Try again"
		})]
	});
	const today = new Map(desk.tutorials.map((tutorial) => [tutorial.id, tutorial])).get(desk.todayId) ?? desk.tutorials[0];
	if (!today) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-5 py-16 text-muted",
		children: "No lessons yet."
	});
	const finished = desk.progress.filter((row) => row.completed).length;
	const totalLessons = Math.max(desk.tutorials.length, 1);
	const percent = Math.round(finished / totalLessons * 100);
	const level = percent >= 70 ? "Advanced" : percent >= 30 ? "Learner" : "Beginner";
	const firstName = desk.profile.name?.split(" ")[0] || "there";
	const categories = [
		{
			label: "Prompting Basics",
			icon: MessageSquare,
			id: "projects"
		},
		{
			label: "AI for Work",
			icon: Briefcase,
			id: "cursor"
		},
		{
			label: "Content Creation",
			icon: Image,
			id: "product"
		},
		{
			label: "Automation",
			icon: Zap,
			id: "n8n"
		},
		{
			label: "Chatbots",
			icon: Bot,
			id: "ollama"
		},
		{
			label: "Best Tools",
			icon: Wrench,
			id: "evals"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-4 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-teal",
				children: "Welcome back!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					"Good to see you, ",
					firstName,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				className: "mt-4",
				onSubmit: (event) => {
					event.preventDefault();
					const data = new FormData(event.currentTarget);
					const q = String(data.get("q") ?? "").trim();
					window.location.assign(q ? `/learn?q=${encodeURIComponent(q)}` : "/learn");
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "q",
					placeholder: "Search lessons, tools, or topics...",
					className: "h-12 w-full rounded-2xl border border-line bg-raise px-4"
				})
			}),
			session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeUpload, {
				session,
				name: desk.profile.name || firstName
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/learn/$tutorialId",
				params: { tutorialId: today.id },
				className: "mt-5 block overflow-hidden rounded-3xl border border-line bg-raise",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[16/9]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: today.thumbnail,
							alt: "",
							className: "h-full w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "absolute left-3 top-3 text-[11px] font-medium tracking-wide text-teal",
							children: "FEATURED WALKTHROUGH"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-teal text-ink",
							children: "▶"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-3 left-3 right-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl text-white",
								children: today.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-white/80",
								children: [today.durationMin, ":00"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-3xl border border-line bg-raise p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-medium",
						children: "Your Progress"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-teal",
						children: ["Level: ", level]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, { value: percent }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-lg font-medium text-fg",
							children: [percent, "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block",
							children: [
								finished,
								" of ",
								totalLessons,
								" lessons completed"
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-medium",
						children: "Categories"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/learn",
						className: "text-sm text-teal",
						children: "See All"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-3 gap-2",
					children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/learn/$tutorialId",
						params: { tutorialId: item.id },
						className: "rounded-2xl border border-line bg-raise px-2 py-4 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "mx-auto size-5 text-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs",
							children: item.label
						})]
					}, item.label))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-medium",
						children: "Master Piece"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/csr",
						className: "text-sm text-teal",
						children: "Open"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/csr",
					className: "mt-3 block rounded-2xl border border-line bg-raise p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] text-teal",
							children: "Step by step"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-base font-medium",
							children: "Creating a CSR Agent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "A preset agent you can use, sell, or rent. You only fill the facts that belong to the business."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-center text-xs text-muted",
				children: ["Today’s pick swaps in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, {})]
			})
		]
	});
}
var SRC = "https://dailyconnect.grok.me/landing/mobile.mp4";
function IntroVideo({ onDone }) {
	const videoRef = (0, import_react.useRef)(null);
	const [muted, setMuted] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video) return;
		video.muted = true;
		video.play().catch(() => void 0);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh overflow-hidden bg-black",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				className: "h-full w-full object-cover",
				src: SRC,
				autoPlay: true,
				muted,
				playsInline: true,
				preload: "auto",
				onEnded: onDone
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onDone,
					className: "pointer-events-auto h-10 rounded-full bg-black/55 px-4 text-sm font-medium text-white",
					children: "Skip"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					const video = videoRef.current;
					if (!video) return;
					video.muted = false;
					setMuted(false);
					video.play().catch(() => void 0);
				},
				className: "absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 h-10 rounded-full bg-black/55 px-4 text-sm text-white",
				children: muted ? "Sound on" : "Playing"
			})
		]
	});
}
var Route$25 = createFileRoute("/")({ component: Home$1 });
function Home$1() {
	const { ready, session, profile } = useConnect();
	const [showIntro, setShowIntro] = (0, import_react.useState)(false);
	const [checked, setChecked] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setShowIntro(sessionStorage.getItem("dc.intro") !== "1");
		setChecked(true);
	}, []);
	if (!ready && !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!checked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (showIntro) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntroVideo, { onDone: () => {
		sessionStorage.setItem("dc.intro", "1");
		setShowIntro(false);
	} });
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/start" });
	if (profile.membershipStatus !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {}) });
}
var Route$24 = createFileRoute("/admin")({ component: AdminPage });
function when$1(ts) {
	if (!ts) return "";
	return new Intl.DateTimeFormat("en-PH", {
		timeZone: "Asia/Manila",
		dateStyle: "medium",
		timeStyle: "short"
	}).format(ts);
}
function AdminPage() {
	const { ready, session, signInEmail, adopt, signOut } = useConnect();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(null);
	const [gate, setGate] = (0, import_react.useState)(null);
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!session) {
			setGate(null);
			return;
		}
		let cancel = false;
		masterGate({ data: { idToken: session.idToken } }).then((next) => {
			if (!cancel) setGate(next);
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		});
		return () => {
			cancel = true;
		};
	}, [session]);
	(0, import_react.useEffect)(() => {
		if (!session || !gate?.allowed) return;
		let cancel = false;
		listPayouts({ data: { idToken: session.idToken } }).then((result) => {
			if (!cancel) setRows(result.requests);
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		});
		return () => {
			cancel = true;
		};
	}, [session, gate?.allowed]);
	if (!ready || session && !gate && !error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	async function onEmail(event) {
		event.preventDefault();
		setError("");
		setPending("email");
		try {
			await signInEmail(email, password);
		} catch (caught) {
			setError(errorText(caught));
		} finally {
			setPending(null);
		}
	}
	async function onGoogle() {
		setError("");
		setPending("google");
		try {
			const next = await signInWithGoogle();
			await adopt({
				idToken: next.idToken,
				refreshToken: next.refreshToken,
				uid: next.uid,
				email: next.email,
				expiresAt: next.expiresAt
			}, next.name);
		} catch (caught) {
			const code = caught && typeof caught === "object" && "code" in caught;
			setError(code ? googleError(caught) : errorText(caught));
		} finally {
			setPending(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-canvas",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-3xl items-center justify-between px-5 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-muted",
					onClick: () => void signOut(),
					children: "Log out"
				}) : null]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-3xl px-5 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-teal",
					children: "Payouts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl",
					children: "Admin"
				}),
				!session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 max-w-md space-y-3",
					onSubmit: onEmail,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Sign in with ",
								MASTER_EMAIL,
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							autoComplete: "username",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							placeholder: "Email",
							className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "password",
							autoComplete: "current-password",
							value: password,
							onChange: (event) => setPassword(event.target.value),
							placeholder: "Password",
							className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-teal",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending !== null,
							className: "h-12 w-full rounded-full bg-teal font-medium text-ink disabled:opacity-60",
							children: pending === "email" ? "Signing in…" : "Sign in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: pending !== null,
							onClick: () => void onGoogle(),
							className: "h-12 w-full rounded-full border border-line bg-raise font-medium disabled:opacity-60",
							children: pending === "google" ? "Opening Google…" : "Continue with Google"
						})
					]
				}) : !gate?.allowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-muted",
					children: [
						"Signed in as ",
						gate?.email || "another account",
						". Only ",
						MASTER_EMAIL,
						" can open this desk."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-teal",
						children: error
					}) : null,
					rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted",
						children: "No payout requests."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-3",
						children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl bg-raise px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: row.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: row.email
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl tabular-nums",
										children: peso(row.amount)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm",
									children: [
										row.method === "gcash" ? "GCash" : "Maya",
										" · ",
										row.accountName || "No name",
										" · ",
										row.account || "No account"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										"Requested ",
										when$1(row.createdAt),
										row.status === "paid" && row.paidAt ? ` · Paid ${when$1(row.paidAt)}` : " · Not paid"
									]
								}),
								row.status === "requested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: pending !== null,
									className: "mt-3 h-10 rounded-full bg-teal px-4 text-sm font-medium text-ink disabled:opacity-50",
									onClick: () => {
										if (!session) return;
										setPending(row.id);
										setError("");
										payPayout({ data: {
											idToken: session.idToken,
											requestId: row.id
										} }).then((result) => setRows(result.requests)).catch((caught) => setError(errorText(caught))).finally(() => setPending(null));
									},
									children: pending === row.id ? "Paying…" : "Mark paid"
								}) : null
							]
						}, row.id))
					})
				] })
			]
		})]
	});
}
var Route$23 = createFileRoute("/checkout")({ component: Checkout });
function Checkout() {
	const navigate = useNavigate();
	const { ready, session, profile, setProfile, signOut } = useConnect();
	const [code, setCode] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [sponsor, setSponsor] = (0, import_react.useState)(null);
	const [sponsorReady, setSponsorReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		let cancel = false;
		(async () => {
			try {
				const mine = await getMySponsor({ data: { idToken: session.idToken } });
				if (cancel) return;
				if (mine) {
					setSponsor(mine);
					return;
				}
			} catch {}
			const referral = captureReferralFromUrl();
			if (!referral) return;
			try {
				const card = await getSponsor({ data: { code: referral.code } });
				if (!cancel && card) setSponsor(card);
			} catch {}
		})().finally(() => {
			if (!cancel) setSponsorReady(true);
		});
		return () => {
			cancel = true;
		};
	}, [session]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/join",
			className: "text-teal",
			children: "Open your sponsor’s link"
		})
	});
	if (profile.membershipStatus === "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-canvas",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-10 border-b border-line bg-canvas/80 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-lg items-center justify-between px-5 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-muted",
						onClick: () => {
							signOut().then(() => navigate({ to: "/login" }));
						},
						children: "Log out"
					})]
				})
			}),
			sponsor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SponsorDetails, { card: sponsor }) : sponsorReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-line bg-raise px-5 py-4 text-sm text-muted",
				children: "Open the link your sponsor sent so their phone, Facebook, and WhatsApp show here."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-lg px-5 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: "Activate your account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-3",
					onSubmit: (event) => {
						event.preventDefault();
						setPending(true);
						setError("");
						redeemCode({ data: {
							idToken: session.idToken,
							code
						} }).then((next) => {
							setProfile(next);
							navigate({ to: "/" });
						}).catch((caught) => setError(errorText(caught))).finally(() => setPending(false));
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Enter activation code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: code,
								onChange: (event) => setCode(event.target.value.toUpperCase()),
								autoComplete: "one-time-code",
								className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 tracking-widest"
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-teal",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending,
							className: "h-12 w-full rounded-full bg-teal font-medium text-ink disabled:opacity-60",
							children: pending ? "Checking…" : "Activate"
						})
					]
				})]
			})
		]
	});
}
var Route$22 = createFileRoute("/community")({ component: CommunityPage });
function CommunityPage() {
	const { ready, session, profile } = useConnect();
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunityFeed, {
		session,
		name: profile.name || "Member"
	}) });
}
var token$1 = string().min(20);
var id = string().regex(/^[A-Za-z0-9_-]{4,40}$/);
var listFeed = createServerFn({ method: "POST" }).validator(object({ idToken: token$1 })).handler(createSsrRpc("3db129ac3bd7c0eeddbf83cd607a34cd31cd79ff6503a3bf9a30bae9a35275d6"));
var recordView = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	postId: id
})).handler(createSsrRpc("3ade3bc90052405024f936103e63e1d42ac4433c22149fdc2289ea4e3a8958ab"));
var submitPost = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
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
})).handler(createSsrRpc("deab5756f3dc38e185e65041a2bdc6c871c5b1db0266e6b2de0bdf597ca4909d"));
var revisePost = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	postId: id,
	title: string().trim().min(1).max(80),
	caption: string().trim().max(500)
})).handler(createSsrRpc("0a97294987222ad7a4ed7df30582c94f59e5efa154784ce61f15b44a3df7ddc0"));
var generateStudio = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	productCode: string().regex(/^[a-z0-9-]{2,40}$/),
	output: _enum([
		"image",
		"caption",
		"script"
	]),
	style: string().max(240)
})).handler(createSsrRpc("a7d1c31428ca4249a3dc8b1937852c1e906e2155a52b9f2af103cdf830e40e0f"));
var speakCaption = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	text: string().trim().min(1).max(400)
})).handler(createSsrRpc("373c98d347d041f29f5540670e0847f9dc124f399a6f846c50b1ac9d853eb4d3"));
var listProducts = createServerFn({ method: "POST" }).validator(object({ idToken: token$1 })).handler(createSsrRpc("a7647f7687f12d34447bc7c37ce939e89aabc14691132b4b74d62a9472b79e86"));
var loadCreator = createServerFn({ method: "POST" }).validator(object({ idToken: token$1 })).handler(createSsrRpc("eccf5d0f350b99145a401b8b762229401f13292e7e79416817dc3f680220c43e"));
var listLive = createServerFn({ method: "POST" }).validator(object({ idToken: token$1 })).handler(createSsrRpc("9e62663aaf357beadad5a3e56d39a7e6b00fad4f2b1601eb63dde4383ddfe718"));
var saveLive = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	title: string().trim().max(80),
	scheduledAt: number().min(0),
	productCodes: array(string().regex(/^[a-z0-9-]{2,40}$/)).max(6),
	script: string().max(2e3)
})).handler(createSsrRpc("9bff47c6c6b2844a55ebc1bd360a7f0a7efbd36ea62290c4920a2d23904ae1c9"));
var startLive = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	sessionId: id
})).handler(createSsrRpc("dec34bc29a76ece895e7b96d550def5774a2d282471b808a25adb97babf00892"));
var loadModeration = createServerFn({ method: "POST" }).validator(object({ idToken: token$1 })).handler(createSsrRpc("26f89283351c4f85977e2c4627d0764b51ebcf6ce7f8ee9740f899e6c9a1b15e"));
var moderatePost = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	postId: id,
	action: _enum([
		"approve",
		"reject",
		"changes"
	]),
	note: string().max(240)
})).handler(createSsrRpc("5b992e28ad99fbe07a6f9db973867d5a6b980cea23868573fed2bf5b12c85b9f"));
createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	postId: id,
	platform: _enum([
		"tiktok",
		"youtube",
		"facebook"
	])
})).handler(createSsrRpc("ce33efd19864a05e20b92b183c5b843a15fbaeac37ebb033fbe9b7b79d17d209"));
var confirmOrder = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	orderId: id,
	memberCode: string().regex(/^[A-Z0-9]{4,12}$/),
	productCode: string().regex(/^[a-z0-9-]{2,40}$/),
	salePesos: number().int().min(1).max(1e7),
	event: _enum([
		"confirmed",
		"refunded",
		"cancelled"
	])
})).handler(createSsrRpc("67fbc9469ebbbc697120f2caa6f236c352c4042d1ea4ee93b7332dd45bc67cc7"));
var recordRevenue = createServerFn({ method: "POST" }).validator(object({
	idToken: token$1,
	reportId: id,
	postId: id,
	gross: number().int().min(0).max(1e7),
	deductions: number().int().min(0).max(1e7),
	source: string().max(80),
	status: _enum(["estimated", "confirmed"])
})).handler(createSsrRpc("214ad44472567cb49c11a23e0e5a34949845dcb1283f9681bc6c9aadd84a9d6d"));
var recordClick = createServerFn({ method: "POST" }).validator(object({
	memberCode: string().regex(/^[A-Za-z0-9]{4,12}$/),
	productCode: string().regex(/^[A-Za-z0-9-]{2,40}$/)
})).handler(createSsrRpc("c8f5ae6173767a184510c5f857738bd376a06eaf8546b06b3b4d4132aac1129c"));
var loadAffiliateLanding = createServerFn({ method: "POST" }).validator(object({
	memberCode: string().regex(/^[A-Za-z0-9]{4,12}$/),
	productCode: string().regex(/^[A-Za-z0-9-]{2,40}$/)
})).handler(createSsrRpc("2c11d69d4db1c99e9c2bb911c773d1ea22ed1b76f35566e979594d91c51f0a0b"));
function CreatorView({ session }) {
	const [posts, setPosts] = (0, import_react.useState)([]);
	const [earnings, setEarnings] = (0, import_react.useState)([]);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [views, setViews] = (0, import_react.useState)({});
	const [clicks, setClicks] = (0, import_react.useState)(0);
	const [summary, setSummary] = (0, import_react.useState)({
		submitted: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
		estimated: 0,
		confirmed: 0
	});
	const [note, setNote] = (0, import_react.useState)("");
	const [edit, setEdit] = (0, import_react.useState)(null);
	function reload() {
		return loadCreator({ data: { idToken: session.idToken } }).then((result) => {
			setPosts(result.posts);
			setEarnings(result.earnings);
			setOrders(result.orders);
			setViews(result.views);
			setClicks(result.clicks);
			setSummary(result.summary);
		});
	}
	(0, import_react.useEffect)(() => {
		reload().catch((caught) => setNote(errorText(caught)));
	}, [session.idToken]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-teal",
				children: "Creator Studio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "What actually posted, and what actually paid"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Estimated share is not in the wallet. Confirmed share is half of net eligible revenue a moderator reconciled. Clicks are not sales."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-3",
				children: [
					["Submitted", String(summary.submitted)],
					["In review", String(summary.pending)],
					["Approved", String(summary.approved)],
					["Rejected", String(summary.rejected)],
					["Estimated", peso(summary.estimated)],
					["Confirmed", peso(summary.confirmed)],
					["Link clicks", String(clicks)],
					["Orders", String(orders.length)]
				].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-lg tabular-nums",
						children: value
					})]
				}, label))
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-display text-2xl",
				children: "Posts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 divide-y divide-line",
				children: [posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-3 text-sm text-muted",
					children: "No submissions yet."
				}) : null, posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: post.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								post.status,
								post.flags?.length ? ` · flagged: ${post.flags.join(", ")}` : "",
								" · ",
								views[post.id] ?? 0,
								" views"
							]
						}),
						post.moderatorNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: post.moderatorNote
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: Object.entries(post.destinations ?? {}).map(([name, dest]) => `${name}: ${dest.url ? "live link" : dest.status}`).join(" · ")
						}),
						post.status === "changes" || post.status === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 text-sm text-teal",
							onClick: () => setEdit(post),
							children: "Revise"
						}) : null
					]
				}, post.id))]
			}),
			edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 space-y-2",
				onSubmit: (event) => {
					event.preventDefault();
					revisePost({ data: {
						idToken: session.idToken,
						postId: edit.id,
						title: edit.title,
						caption: edit.caption
					} }).then(() => {
						setEdit(null);
						setNote("Back in the queue.");
						return reload();
					}).catch((caught) => setNote(errorText(caught)));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: edit.title,
						onChange: (event) => setEdit({
							...edit,
							title: event.target.value
						}),
						className: "h-11 w-full rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: edit.caption,
						onChange: (event) => setEdit({
							...edit,
							caption: event.target.value
						}),
						rows: 3,
						className: "w-full rounded-xl border border-line bg-raise px-3 py-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "h-11 rounded-full bg-teal px-5 text-sm font-medium text-ink",
						children: "Resubmit"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-display text-2xl",
				children: "Earnings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 divide-y divide-line",
				children: [earnings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-3 text-sm text-muted",
					children: "No reconciled revenue yet."
				}) : null, earnings.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						row.status === "estimated" ? "Estimated" : "Confirmed",
						" · ",
						row.source
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							row.period,
							" · net ",
							peso(row.net),
							" of ",
							peso(row.gross)
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tabular-nums",
						children: peso(row.share)
					})]
				}, row.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-display text-2xl",
				children: "Affiliate orders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 divide-y divide-line",
				children: [orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-3 text-sm text-muted",
					children: "No merchant-confirmed orders."
				}) : null, orders.map((order, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-3 text-sm",
					children: [
						order.productCode,
						" · ",
						order.status,
						" · ",
						peso(order.memberPesos ?? 0)
					]
				}, `${order.productCode}-${index}`))]
			})
		]
	});
}
function MemberGate({ children }) {
	const { ready, session, profile } = useConnect();
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	if (profile.membershipStatus !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: children(session, profile) });
}
var Route$21 = createFileRoute("/creator")({ component: function CreatorPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberGate, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreatorView, { session }) });
} });
var token = string().min(20);
var listCsr = createServerFn({ method: "POST" }).validator(object({ idToken: token })).handler(createSsrRpc("3e647e470b37b215feadb3207046de52f03763f93a089edd42aeb47e53f3811c"));
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
})).handler(createSsrRpc("37d5ab7b84bf0a06f1269c4ba00f5753aa8372c0b0f2403c17d47f1656f0507b"));
var readCsr = createServerFn({ method: "POST" }).validator(object({
	userId: string().min(6).max(40),
	slug: string().min(4).max(80)
})).handler(createSsrRpc("0cdfbf0f3a251b355d5807273b696f0115723a456ba5ee41d09527fd3f0ea081"));
var Route$20 = createFileRoute("/csr")({ component: CsrPage });
var steps = [
	{
		title: "What you are building",
		body: "A customer-service agent that already knows how to behave. You can use it for your own customers, sell the finished agent to one business, or rent the same link month to month."
	},
	{
		title: "What is already locked",
		body: "The call rules stay. You edit the name, the three messages, the voice, and the role prompt. They start as Mike at TechSolutions."
	},
	{
		title: "Only fill what changes",
		body: "Business name, what they sell, a phone or email, hours, language, and one refund sentence. Everything else is preset so two members do not ship two different personalities."
	},
	{
		title: "Publish the link",
		body: "Saving creates /your-id/csr/business-slug-agent-id. Send that link to customers, or to the business paying you to use it."
	}
];
function CsrPage() {
	const { ready, session, profile } = useConnect();
	const [step, setStep] = (0, import_react.useState)(0);
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [made, setMade] = (0, import_react.useState)(null);
	const [plan, setPlan] = (0, import_react.useState)("use");
	const [persona, setPersona] = (0, import_react.useState)(DEFAULT_NAME);
	const [firstMessage, setFirstMessage] = (0, import_react.useState)(DEFAULT_FIRST);
	const [voicemailMessage, setVoicemailMessage] = (0, import_react.useState)(DEFAULT_VOICEMAIL);
	const [endCallMessage, setEndCallMessage] = (0, import_react.useState)(DEFAULT_END);
	const [voiceId, setVoiceId] = (0, import_react.useState)(DEFAULT_VOICE_ID);
	const [systemPrompt, setSystemPrompt] = (0, import_react.useState)(DEFAULT_PROMPT);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		listCsr({ data: { idToken: session.idToken } }).then((result) => setAgents(result.agents)).catch(() => void 0);
	}, [session]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	if (profile.membershipStatus !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-teal",
				children: "Master Piece"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl",
				children: "Creating a CSR Agent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Step ",
					step + 1,
					" of ",
					steps.length,
					". Walk it in order. The brain is already written."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 flex gap-2",
				children: steps.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: `h-1.5 flex-1 rounded-full ${index <= step ? "bg-teal" : "bg-line"}` }, item.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-4 rounded-3xl border border-line bg-raise p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: ["Step ", step + 1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-lg font-medium",
						children: steps[step]?.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: steps[step]?.body
					})
				]
			}),
			step < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [step > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 rounded-full px-4 text-sm text-muted",
					onClick: () => setStep((value) => value - 1),
					children: "Back"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 flex-1 rounded-full bg-teal text-sm font-medium text-ink",
					onClick: () => setStep((value) => value + 1),
					children: "Next step"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 space-y-3",
				onSubmit: (event) => {
					event.preventDefault();
					const form = new FormData(event.currentTarget);
					setBusy(true);
					setError("");
					saveCsr({ data: {
						idToken: session.idToken,
						persona,
						business: String(form.get("business") ?? ""),
						offer: String(form.get("offer") ?? ""),
						contact: String(form.get("contact") ?? ""),
						hours: String(form.get("hours") ?? ""),
						languages: String(form.get("languages") ?? ""),
						refund: String(form.get("refund") ?? ""),
						firstMessage,
						voicemailMessage,
						endCallMessage,
						voiceId,
						systemPrompt,
						plan,
						price: String(form.get("price") ?? "")
					} }).then((agent) => {
						setMade(agent);
						setAgents((rows) => [agent, ...rows]);
					}).catch((caught) => setError(errorText(caught))).finally(() => setBusy(false));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Agent name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: persona,
							onChange: (event) => setPersona(event.target.value),
							className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Opening greeting", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: firstMessage,
							onChange: (event) => setFirstMessage(event.target.value),
							className: "mt-1 h-24 w-full rounded-xl border border-line bg-raise px-3 py-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Voicemail greeting", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: voicemailMessage,
							onChange: (event) => setVoicemailMessage(event.target.value),
							className: "mt-1 h-24 w-full rounded-xl border border-line bg-raise px-3 py-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Closing message", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: endCallMessage,
							onChange: (event) => setEndCallMessage(event.target.value),
							className: "mt-1 h-20 w-full rounded-xl border border-line bg-raise px-3 py-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Voice", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: voiceId,
							onChange: (event) => setVoiceId(event.target.value),
							className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3",
							children: VOICES.map((voice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: voice,
								children: voice
							}, voice))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Role and description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: systemPrompt,
							onChange: (event) => setSystemPrompt(event.target.value),
							className: "mt-1 h-56 w-full rounded-xl border border-line bg-raise px-3 py-2 text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "business",
						placeholder: "Business name, default TechSolutions",
						className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						name: "offer",
						placeholder: "What they sell or do, in two sentences",
						className: "h-24 w-full rounded-xl border border-line bg-raise px-3 py-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "contact",
						placeholder: "Phone or email to hand over",
						className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "hours",
						placeholder: "Hours, or leave blank",
						className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "languages",
						placeholder: "Languages, default English",
						className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "refund",
						placeholder: "One refund sentence, or leave the safe default",
						className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: [
							"use",
							"sell",
							"rent"
						].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPlan(option),
							className: `h-10 flex-1 rounded-full text-sm ${plan === option ? "bg-teal text-ink" : "bg-surface text-muted"}`,
							children: option === "use" ? "Use it" : option === "sell" ? "Sell it" : "Rent it"
						}, option))
					}),
					plan !== "use" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "price",
						placeholder: plan === "sell" ? "Sale price, optional" : "Monthly rent, optional",
						className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-teal",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "overflow-hidden rounded-[2rem] border border-[#3f3f3f] bg-[#141414] bg-[radial-gradient(280px_160px_at_50%_0%,rgba(212,175,55,0.35),transparent_70%)] px-6 py-8 text-center text-[#f3f3f3]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.16em] text-[#d4af37]",
								children: "Preview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-auto mt-4 grid size-20 place-items-center rounded-full bg-[#1e1e1e] text-[#f3e2a6] ring-1 ring-[#d4af37]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
									className: "size-9",
									strokeWidth: 1.5
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-[#a3a3a3]",
								children: "Calling"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-3xl font-medium",
								children: persona.trim() || "Mike"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mt-4 flex h-8 items-end gap-1",
								"aria-hidden": true,
								children: [
									8,
									14,
									20,
									16,
									10,
									18,
									12
								].map((height) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-1 rounded-full bg-[#d4af37]",
									style: { height }
								}, height))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-12 rounded-full px-4 text-sm text-muted",
							onClick: () => setStep(2),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy,
							className: "h-12 flex-1 rounded-full bg-teal font-medium text-ink disabled:opacity-50",
							children: busy ? "Saving…" : "Create the agent"
						})]
					})
				]
			}),
			made ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: made.path,
				target: "_blank",
				rel: "noreferrer",
				className: "mt-4 block break-all text-sm text-teal",
				children: ["Open full screen: ", made.path]
			}) : null,
			agents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-2",
				children: agents.map((agent) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: agent.path,
					target: "_blank",
					rel: "noreferrer",
					className: "block rounded-2xl border border-line bg-raise px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium",
						children: agent.persona ? `${agent.persona} · ${agent.business}` : agent.business
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 block text-xs text-muted",
						children: [
							agent.plan,
							" · ",
							agent.path
						]
					})]
				}) }, agent.id))
			}) : null
		]
	}) });
}
function Reel$1({ post, mine, onView }) {
	const videoRef = (0, import_react.useRef)(null);
	const seen = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video) return;
		const watcher = new IntersectionObserver(([entry]) => {
			if (!entry) return;
			if (entry.isIntersecting) {
				video.play().catch(() => void 0);
				if (!seen.current) {
					seen.current = true;
					onView();
				}
			} else video.pause();
		}, { threshold: .65 });
		watcher.observe(video);
		return () => watcher.disconnect();
	}, [onView]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "snap-start snap-always relative h-[78dvh] overflow-hidden bg-black",
		children: [post.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref: videoRef,
			src: post.mediaUrl,
			poster: post.posterUrl,
			playsInline: true,
			muted: true,
			loop: true,
			className: "h-full w-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: post.mediaUrl,
			alt: "",
			className: "h-full w-full object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-4 pt-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-white",
					children: post.creatorName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-lg text-white",
					children: post.title
				}),
				post.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-3 text-sm text-white/85",
					children: post.caption
				}) : null,
				mine && post.status !== "approved" && post.status !== "publishing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-teal",
					children: post.status === "queued" ? "In review" : post.status
				}) : null,
				post.affiliatePath ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: post.affiliatePath,
					className: "pointer-events-auto mt-3 inline-flex h-9 items-center rounded-full bg-white/15 px-3 text-sm text-white",
					children: "View product"
				}) : null
			]
		})]
	});
}
function DeckView({ session, profile }) {
	const [posts, setPosts] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [caption, setCaption] = (0, import_react.useState)("");
	const [productCode, setProductCode] = (0, import_react.useState)("");
	const [rights, setRights] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [fileName, setFileName] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	function reload() {
		return listFeed({ data: { idToken: session.idToken } }).then((result) => setPosts(result.posts));
	}
	(0, import_react.useEffect)(() => {
		let cancel = false;
		reload().catch((caught) => {
			if (!cancel) setError(errorText(caught));
		});
		return () => {
			cancel = true;
		};
	}, [session.idToken]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto h-full max-w-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "h-full snap-y snap-mandatory overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "sticky top-0 z-10 border-b border-line bg-canvas px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 shrink-0 place-items-center rounded-full bg-surface font-medium text-teal",
								children: (profile.name || "M").charAt(0).toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 flex-1 rounded-full bg-raise px-4 text-left text-sm text-muted",
								onClick: () => setOpen(true),
								children: "Post a video"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-full bg-teal px-4 text-sm font-medium text-ink",
								onClick: () => setOpen(true),
								children: "Post"
							})
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: error
					}) : null,
					note && !open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: note
					}) : null
				]
			}), posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-16 text-center text-sm text-muted",
				children: "No reels yet. Post the first video."
			}) : posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reel$1, {
				post,
				mine: post.creatorId === profile.uid,
				onView: () => {
					recordView({ data: {
						idToken: session.idToken,
						postId: post.id
					} }).catch(() => void 0);
				}
			}, post.id))]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-30 flex flex-col justify-end bg-canvas/70",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "max-h-[85%] space-y-3 overflow-y-auto rounded-t-3xl border border-line bg-raise px-4 py-5",
				onSubmit: (event) => {
					event.preventDefault();
					setNote("");
					setBusy(true);
					const file = fileRef.current?.files?.[0];
					(async () => {
						if (!file) throw new Error("Choose a video to upload.");
						const meta = await readVideoMeta(file);
						const mediaUrl = await uploadMemberMedia(session.idToken, file, `dailyConnect/${profile.uid}/${Date.now()}.mp4`);
						await submitPost({ data: {
							idToken: session.idToken,
							title,
							caption,
							hashtags: "#DailyConnect",
							kind: "video",
							mediaUrl,
							posterUrl: meta.posterUrl,
							durationSec: meta.durationSec,
							width: meta.width,
							height: meta.height,
							mime: file.type || "video/mp4",
							productCode,
							rightsConfirmed: rights
						} });
						setTitle("");
						setCaption("");
						setRights(false);
						setFileName("");
						if (fileRef.current) fileRef.current.value = "";
						setOpen(false);
						setNote("Video uploaded. It stays in review until a person approves it.");
						await reload();
					})().catch((caught) => setNote(errorText(caught))).finally(() => setBusy(false));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Upload video"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted",
							onClick: () => setOpen(false),
							children: "Close"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Portrait clips under 58 seconds. ",
							profile.name,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: title,
							onChange: (event) => setTitle(event.target.value),
							required: true,
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-canvas px-3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Caption", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: caption,
							onChange: (event) => setCaption(event.target.value),
							rows: 3,
							className: "mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Affiliate product, optional", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: productCode,
							onChange: (event) => setProductCode(event.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-canvas px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None"
							}), PRODUCT_CATALOG.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: product.code,
								children: product.name
							}, product.code))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						name: "clip",
						type: "file",
						accept: "video/mp4,video/webm,video/*",
						className: "sr-only",
						onChange: (event) => setFileName(event.target.files?.[0]?.name ?? "")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 w-full rounded-xl border border-line bg-canvas text-sm",
						onClick: () => fileRef.current?.click(),
						children: fileName || "Choose video"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: rights,
							onChange: (event) => setRights(event.target.checked),
							className: "mt-1 size-4 accent-teal",
							required: true
						}), "I have the rights to this footage and any music in it."]
					}),
					note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: note
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "h-12 w-full rounded-full bg-teal font-medium text-ink disabled:opacity-50",
						children: busy ? "Uploading…" : "Upload video"
					})
				]
			})
		}) : null]
	});
}
var Route$19 = createFileRoute("/deck")({ component: function DeckPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberGate, { children: (session, profile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeckView, {
		session,
		profile
	}) });
} });
function GoogleGlyph() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M12 11v2.4h6.6c-.3 1.6-1.8 4.6-6.6 4.6A7 7 0 1 1 12 5a6.7 6.7 0 0 1 4.7 1.8l1.8-1.8A9.8 9.8 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.6 0-1.1-.1-1.6H12z"
		})
	});
}
function AuthPanel({ mode }) {
	const navigate = useNavigate();
	const { signInEmail, signUpEmail, adopt } = useConnect();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		captureReferralFromUrl();
	}, []);
	function go(profile) {
		navigate({ to: profile.membershipStatus === "active" ? "/" : "/checkout" });
	}
	async function onEmail(event) {
		event.preventDefault();
		setError("");
		setPending("email");
		try {
			go(mode === "login" ? await signInEmail(email, password) : await signUpEmail({
				name,
				email,
				phone,
				password
			}));
		} catch (caught) {
			setError(errorText(caught));
		} finally {
			setPending(null);
		}
	}
	async function onGoogle() {
		setError("");
		if (mode === "join" && phone.replace(/\D/g, "").length < 10) {
			setError("Enter a mobile number with at least 10 digits.");
			return;
		}
		setPending("google");
		try {
			const session = await signInWithGoogle();
			go(await adopt({
				idToken: session.idToken,
				refreshToken: session.refreshToken,
				uid: session.uid,
				email: session.email,
				expiresAt: session.expiresAt
			}, session.name, mode === "join" ? phone : void 0));
		} catch (caught) {
			const code = caught && typeof caught === "object" && "code" in caught;
			setError(code ? googleError(caught) : errorText(caught));
		} finally {
			setPending(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-dvh flex-col bg-canvas px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] md:grid md:place-items-center md:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-md md:rounded-[1.75rem] md:bg-raise md:px-8 md:py-10 md:shadow-float",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					"aria-label": "Home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-8 font-display text-3xl md:text-4xl",
					children: mode === "join" ? "Create your account" : "Welcome back"
				}),
				mode === "join" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "Next you’ll see your sponsor. They give you the code that activates this account."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "Use the email or Google account you joined with."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onEmail,
					className: "mt-6 space-y-3",
					children: [
						mode === "join" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: name,
								onChange: (event) => setName(event.target.value),
								autoComplete: "name",
								className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 text-fg"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								value: email,
								onChange: (event) => setEmail(event.target.value),
								autoComplete: "email",
								className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 text-fg"
							})]
						}),
						mode === "join" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Mobile", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: phone,
								onChange: (event) => setPhone(event.target.value),
								autoComplete: "tel",
								inputMode: "tel",
								placeholder: "09…",
								className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 text-fg"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								minLength: 8,
								value: password,
								onChange: (event) => setPassword(event.target.value),
								autoComplete: mode === "join" ? "new-password" : "current-password",
								className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 text-fg"
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-teal",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending !== null,
							className: "h-12 w-full rounded-full bg-teal font-medium text-ink disabled:opacity-60",
							children: pending === "email" ? "Please wait…" : mode === "join" ? "Create account" : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-5 flex items-center gap-3 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
						"or",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: pending !== null,
					onClick: () => void onGoogle(),
					className: "flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-raise font-medium disabled:opacity-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleGlyph, {}), pending === "google" ? "Opening Google…" : "Continue with Google"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: mode === "join" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Already joined?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-teal",
							children: "Sign in"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"New here?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/join",
							className: "text-teal",
							children: "Create a desk"
						})
					] })
				})
			]
		})
	});
}
var Route$18 = createFileRoute("/join")({ component: Join });
function Join() {
	const { ready, session, profile } = useConnect();
	(0, import_react.useEffect)(() => {
		captureReferralFromUrl();
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (session && profile?.membershipStatus === "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	if (session && profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthPanel, { mode: "join" });
}
function LiveView({ session }) {
	const [products, setProducts] = (0, import_react.useState)([]);
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [when, setWhen] = (0, import_react.useState)("");
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [script, setScript] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	function reload() {
		return listLive({ data: { idToken: session.idToken } }).then((result) => {
			setProducts(result.products);
			setSessions(result.sessions);
		});
	}
	(0, import_react.useEffect)(() => {
		reload().catch((caught) => setNote(errorText(caught)));
	}, [session.idToken]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-teal",
				children: "Daily Connect Live"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Schedule the sell"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Each platform is its own destination. Stream keys never come to this page. If a destination is not connected, the others are still checked — none of them go live until an official account is eligible."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: (event) => {
					event.preventDefault();
					setBusy(true);
					saveLive({ data: {
						idToken: session.idToken,
						title,
						scheduledAt: when ? new Date(when).getTime() : Date.now(),
						productCodes: picked,
						script
					} }).then(() => reload()).then(() => setNote("Session saved. It is not live.")).catch((caught) => setNote(errorText(caught))).finally(() => setBusy(false));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: title,
							onChange: (event) => setTitle(event.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-raise px-3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["When", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: when,
							onChange: (event) => setWhen(event.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-raise px-3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-sm",
						children: "Products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 space-y-2",
						children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "size-4 accent-teal",
									checked: picked.includes(product.code),
									onChange: () => setPicked((current) => current.includes(product.code) ? current.filter((code) => code !== product.code) : [...current, product.code])
								}),
								product.name,
								" · ",
								peso(product.price)
							]
						}, product.code))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Script", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: script,
							onChange: (event) => setScript(event.target.value),
							rows: 5,
							className: "mt-1 w-full rounded-xl border border-line bg-raise px-3 py-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-full bg-surface px-4 text-sm",
							disabled: !picked[0] || busy,
							onClick: () => {
								const code = picked[0];
								if (!code) return;
								setBusy(true);
								generateStudio({ data: {
									idToken: session.idToken,
									productCode: code,
									output: "script",
									style: title || "calm host"
								} }).then((draft) => setScript(draft.text)).catch((caught) => setNote(errorText(caught))).finally(() => setBusy(false));
							},
							children: "Draft a script"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy,
							className: "h-11 rounded-full bg-teal px-5 font-medium text-ink disabled:opacity-50",
							children: "Save session"
						})]
					})
				]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-4",
				children: sessions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-3xl bg-raise p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								new Date(item.scheduledAt).toLocaleString(),
								" · ",
								item.status
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-wrap text-sm",
							children: item.script
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-1 text-sm",
							children: [
								"youtube",
								"facebook",
								"tiktok"
							].map((platform) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-teal",
									children: platform
								}),
								" · ",
								item.destinations[platform]?.status,
								" — ",
								item.destinations[platform]?.detail
							] }, platform))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-3 h-10 rounded-full bg-surface px-4 text-sm",
							onClick: () => {
								startLive({ data: {
									idToken: session.idToken,
									sessionId: item.id
								} }).then((next) => {
									setSessions((current) => current.map((row) => row.id === next.id ? next : row));
									setNote("Checked each destination. None are connected, so nothing is streaming.");
								}).catch((caught) => setNote(errorText(caught)));
							},
							children: "Check destinations"
						})
					]
				}, item.id))
			})
		]
	});
}
var Route$17 = createFileRoute("/live")({ component: function LivePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberGate, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveView, { session }) });
} });
var Route$16 = createFileRoute("/login")({ component: Login });
function Login() {
	const { ready, session, profile } = useConnect();
	if (!ready && !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (session && profile?.membershipStatus === "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	if (session && profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthPanel, { mode: "login" });
}
function MarketView({ session }) {
	const [products, setProducts] = (0, import_react.useState)([]);
	const [links, setLinks] = (0, import_react.useState)({});
	const [policy, setPolicy] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		listProducts({ data: { idToken: session.idToken } }).then((result) => {
			setProducts(result.products);
			setLinks(Object.fromEntries(result.links.map((link) => [link.productCode, link.path])));
			setPolicy(`Member share is ${result.policy.affiliateMemberShareBps / 100}% of the merchant commission. A click is not a sale. Confirmed orders are entered by a moderator from the merchant record.`);
		}).catch((caught) => setNote(errorText(caught)));
	}, [session.idToken]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-teal",
				children: "Affiliate marketplace"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Products we are allowed to sell"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: policy
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-4",
				children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid gap-4 rounded-3xl bg-raise p-4 sm:grid-cols-[8rem_minmax(0,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: "",
						className: "aspect-square w-full rounded-2xl object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: product.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 tabular-nums",
							children: [
								peso(product.price),
								" · ",
								product.commissionBps / 100,
								"% merchant commission · ",
								product.windowDays,
								"-day window"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: product.guidelines
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 break-all text-sm text-teal",
							children: links[product.code]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-3 h-10 rounded-full bg-teal px-4 text-sm font-medium text-ink",
							onClick: () => {
								const path = links[product.code];
								if (!path) return;
								const absolute = new URL(path, window.location.origin).toString();
								navigator.clipboard.writeText(absolute).then(() => setNote("Link copied."), () => setNote(absolute));
							},
							children: "Copy tracked link"
						})
					] })]
				}, product.code))
			})
		]
	});
}
var Route$15 = createFileRoute("/market")({ component: function MarketPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberGate, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketView, { session }) });
} });
function ModerateView({ session }) {
	const [allowed, setAllowed] = (0, import_react.useState)(true);
	const [posts, setPosts] = (0, import_react.useState)([]);
	const [products, setProducts] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	const [comment, setComment] = (0, import_react.useState)("");
	const [orderId, setOrderId] = (0, import_react.useState)("");
	const [memberCode, setMemberCode] = (0, import_react.useState)("");
	const [productCode, setProductCode] = (0, import_react.useState)("lamp");
	const [sale, setSale] = (0, import_react.useState)(1e3);
	const [reportId, setReportId] = (0, import_react.useState)("");
	const [postId, setPostId] = (0, import_react.useState)("");
	const [gross, setGross] = (0, import_react.useState)(0);
	const [deductions, setDeductions] = (0, import_react.useState)(0);
	const [earningStatus, setEarningStatus] = (0, import_react.useState)("estimated");
	function reload() {
		return loadModeration({ data: { idToken: session.idToken } }).then((result) => {
			setAllowed(result.allowed);
			setPosts(result.posts);
			setProducts(result.products);
		});
	}
	(0, import_react.useEffect)(() => {
		reload().catch((caught) => setNote(errorText(caught)));
	}, [session.idToken]);
	if (!allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-5 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Moderation is closed"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Another desk lead already holds this queue."
		})]
	});
	const queue = posts.filter((post) => post.status === "queued" || post.status === "changes");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-teal",
				children: "Moderation desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "A person decides"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Screening flags are not a legal clearance. Approving creates one publishing job per platform. Those jobs stay unsent until an official TikTok, YouTube, or Facebook account is connected on the server. If you are the only moderator, you may clear your own post; once a second lead exists, you cannot."
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-6 space-y-4",
				children: [queue.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Queue is clear."
				}) : null, queue.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-3xl bg-raise p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								post.creatorName,
								" · ",
								post.creatorCode,
								" · ",
								post.status,
								post.flags?.length ? ` · ${post.flags.join(", ")}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: post.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: post.caption
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								"approve",
								"changes",
								"reject"
							].map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-10 rounded-full bg-surface px-4 text-sm",
								onClick: () => {
									moderatePost({ data: {
										idToken: session.idToken,
										postId: post.id,
										action,
										note: comment
									} }).then(() => {
										setNote(action === "approve" ? "Approved. Platforms are still not connected." : "Decision saved.");
										return reload();
									}).catch((caught) => setNote(errorText(caught)));
								},
								children: action
							}, action))
						})
					]
				}, post.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block text-sm",
				children: ["Note for the creator", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: comment,
					onChange: (event) => setComment(event.target.value),
					className: "mt-1 h-11 w-full rounded-xl border border-line bg-raise px-3"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Merchant order"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Use the merchant’s order id. Sending the same id again does not pay twice."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 grid gap-3 sm:grid-cols-2",
				onSubmit: (event) => {
					event.preventDefault();
					const eventName = event.currentTarget.elements.namedItem("event").value;
					confirmOrder({ data: {
						idToken: session.idToken,
						orderId,
						memberCode: memberCode.toUpperCase(),
						productCode,
						salePesos: sale,
						event: eventName
					} }).then((result) => setNote(`Order ${result.action}. Member amount $${result.member}.`)).catch((caught) => setNote(errorText(caught)));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						placeholder: "Order id",
						value: orderId,
						onChange: (event) => setOrderId(event.target.value),
						className: "h-11 rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						placeholder: "Member code",
						value: memberCode,
						onChange: (event) => setMemberCode(event.target.value),
						className: "h-11 rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: productCode,
						onChange: (event) => setProductCode(event.target.value),
						className: "h-11 rounded-xl border border-line bg-raise px-3",
						children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: product.code,
							children: product.name
						}, product.code))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 1,
						value: sale,
						onChange: (event) => setSale(Number(event.target.value)),
						className: "h-11 rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						name: "event",
						className: "h-11 rounded-xl border border-line bg-raise px-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "confirmed",
								children: "confirmed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "refunded",
								children: "refunded"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cancelled",
								children: "cancelled"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "h-11 rounded-full bg-teal px-5 font-medium text-ink",
						children: "Record order"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Creator revenue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Confirmed posts half of net to the wallet. Estimated does not."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 grid gap-3 sm:grid-cols-2",
				onSubmit: (event) => {
					event.preventDefault();
					recordRevenue({ data: {
						idToken: session.idToken,
						reportId,
						postId,
						gross,
						deductions,
						source: "configured-revenue",
						status: earningStatus
					} }).then((result) => setNote(result.applied ? `${result.status} share $${result.share}.` : "That report id was already recorded.")).catch((caught) => setNote(errorText(caught)));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						placeholder: "Report id",
						value: reportId,
						onChange: (event) => setReportId(event.target.value),
						className: "h-11 rounded-xl border border-line bg-raise px-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: postId,
						onChange: (event) => setPostId(event.target.value),
						className: "h-11 rounded-xl border border-line bg-raise px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Post"
						}), posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: post.id,
							children: post.title
						}, post.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 0,
						value: gross,
						onChange: (event) => setGross(Number(event.target.value)),
						className: "h-11 rounded-xl border border-line bg-raise px-3",
						"aria-label": "Gross dollars"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 0,
						value: deductions,
						onChange: (event) => setDeductions(Number(event.target.value)),
						className: "h-11 rounded-xl border border-line bg-raise px-3",
						"aria-label": "Deductions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: earningStatus,
						onChange: (event) => setEarningStatus(event.target.value),
						className: "h-11 rounded-xl border border-line bg-raise px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "estimated",
							children: "estimated"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "confirmed",
							children: "confirmed"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "h-11 rounded-full bg-teal px-5 font-medium text-ink",
						children: "Record revenue"
					})
				]
			})
		]
	});
}
var Route$14 = createFileRoute("/moderate")({ component: function ModeratePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberGate, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModerateView, { session }) });
} });
var Route$13 = createFileRoute("/profile")({ component: ProfilePage });
function flatten(node, depth = 0) {
	return [{
		uid: node.uid,
		name: node.name,
		depth
	}, ...node.children.flatMap((child) => flatten(child, depth + 1))];
}
function Branch({ node }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			node.name,
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted",
				children: node.level === 0 ? "you" : `level ${node.level}`
			})
		] }), node.children.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "ml-4 border-l border-line pl-4",
			children: node.children.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Branch, { node: child }, child.uid))
		}) : null]
	});
}
function ProfilePage() {
	const { ready, session, profile, setProfile, signOut } = useConnect();
	const [network, setNetwork] = (0, import_react.useState)(null);
	const [wallet, setWallet] = (0, import_react.useState)(null);
	const [recruitUid, setRecruitUid] = (0, import_react.useState)("");
	const [parentUid, setParentUid] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [alerts, setAlerts] = (0, import_react.useState)("Alerts off");
	const [stock, setStock] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (typeof Notification !== "undefined") setAlerts(Notification.permission === "granted" ? "Alerts on" : "Alerts off");
	}, []);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		let cancel = false;
		getNetwork({ data: { idToken: session.idToken } }).then((next) => {
			if (cancel) return;
			setNetwork(next);
			setParentUid(next.profile.uid);
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		});
		return () => {
			cancel = true;
		};
	}, [session]);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		let cancel = false;
		getWallet({ data: { idToken: session.idToken } }).then((next) => {
			if (!cancel) setWallet(next);
		}).catch(() => void 0);
		return () => {
			cancel = true;
		};
	}, [session]);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		let cancel = false;
		listCodes({ data: { idToken: session.idToken } }).then((result) => {
			if (!cancel) setStock(result.codes);
		}).catch(() => void 0);
		return () => {
			cancel = true;
		};
	}, [session]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	if (profile.membershipStatus !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	const link = profile.referralCode ? `${window.location.origin}/join?ref=${profile.referralCode}` : "";
	const unplaced = (network?.recruits ?? []).filter((recruit) => recruit.membershipStatus === "active" && !recruit.placed);
	const parents = network ? flatten(network.tree) : [];
	const unilevelRows = (wallet?.transactions ?? []).filter((tx) => tx.type === "unilevel");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl border border-line bg-raise p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted",
								children: "Wallet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Total accumulated"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-4xl tabular-nums",
								children: wallet ? peso(wallet.accumulated) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-surface p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Available"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-lg tabular-nums",
										children: wallet ? peso(wallet.available) : "—"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-surface p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Requested"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-lg tabular-nums",
										children: wallet ? peso(wallet.pendingPayout) : "—"
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-3 rounded-3xl border border-line bg-raise p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-medium",
									children: "Unilevel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-teal",
									children: wallet ? peso(wallet.accruing) : "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									peso(LEVEL_BONUS),
									" per level, up to 10. Posts on the 1st. Line size ",
									wallet?.teamSize ?? 0,
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-surface p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Direct paid"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 tabular-nums",
										children: wallet?.directPaid ?? 0
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-surface p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Referral paid"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 tabular-nums",
										children: wallet ? peso(wallet.directBonus) : "—"
									})]
								})]
							}),
							unilevelRows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-line",
								children: unilevelRows.slice(0, 6).map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: tx.status === "scheduled" ? "Posts on the 1st" : tx.status
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: peso(tx.amount)
									})]
								}, tx.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-muted",
								children: [
									"No unilevel yet. Place a recruit to schedule ",
									peso(LEVEL_BONUS),
									"."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-3 rounded-3xl border border-line bg-raise p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-medium",
							children: "Downline genealogy"
						}), network ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Branch, { node: network.tree })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Loading the line…"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-4xl md:mt-0",
				children: profile.name || "Member"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted",
				children: profile.email
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm",
				children: [
					"Membership",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-teal",
						children: profile.membershipStatus === "active" ? "active" : "inactive"
					}),
					profile.phone ? ` · ${profile.phone}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3",
				onSubmit: (event) => {
					event.preventDefault();
					const form = new FormData(event.currentTarget);
					setPending(true);
					setError("");
					saveContact({ data: {
						idToken: session.idToken,
						phone: String(form.get("phone") ?? ""),
						facebook: String(form.get("facebook") ?? ""),
						whatsapp: String(form.get("whatsapp") ?? "")
					} }).then((next) => {
						setProfile(next);
						toast("Contact saved. New visitors from your link can reach you.");
					}).catch((caught) => setError(errorText(caught))).finally(() => setPending(false));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "How recruits reach you"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "These icons show on their activation page. Leave a field blank to hide that icon."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldIcon, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneIcon, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "phone",
							defaultValue: profile.phone,
							autoComplete: "tel",
							placeholder: "Mobile number",
							className: "h-11 w-full rounded-xl border border-line bg-raise px-3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldIcon, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#1877F2]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacebookIcon, {})
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "facebook",
							defaultValue: profile.facebook ?? "",
							placeholder: "facebook.com/your-name",
							className: "h-11 w-full rounded-xl border border-line bg-raise px-3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldIcon, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#25D366]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, {})
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "whatsapp",
							defaultValue: profile.whatsapp ?? "",
							placeholder: "WhatsApp number or link",
							className: "h-11 w-full rounded-xl border border-line bg-raise px-3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: pending,
						className: "h-11 w-fit rounded-full bg-teal px-4 font-medium text-ink disabled:opacity-50",
						children: "Save contact"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 overflow-hidden rounded-3xl border border-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SponsorDetails, { card: {
					name: profile.name,
					phone: profile.phone || "",
					facebook: profile.facebook || "",
					whatsapp: profile.whatsapp || ""
				} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 pb-4 text-sm text-muted",
					children: "This is what someone sees after they open this account’s link. Saving here does not change a different login."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Your link"
				}), profile.referralCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 break-all text-sm text-muted",
						children: link
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-3xl tracking-wide text-teal",
						children: profile.referralCode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-3 h-11 rounded-full bg-teal px-4 font-medium text-ink",
						onClick: () => {
							navigator.clipboard.writeText(link).then(() => toast("Link copied"));
						},
						children: "Copy link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "The first person to open this link keeps you as their sponsor for 1 month. They activate with a code from the admin. That code does not change their sponsor."
					}),
					stock.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm text-muted",
							children: "Older codes already in your stock"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: stock.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "font-display text-2xl tracking-widest text-teal",
								children: code
							}, code))
						})]
					}) : null
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Your code is minted when membership is active."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Place a recruit"
				}), unplaced.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "When someone active joins with your link, they show up here until you place them."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 space-y-3",
					onSubmit: (event) => {
						event.preventDefault();
						setPending(true);
						setError("");
						place({ data: {
							idToken: session.idToken,
							recruitUid,
							parentUid
						} }).then((next) => {
							setNetwork(next);
							setRecruitUid("");
							toast(`Placed. ${peso(LEVEL_BONUS)} is scheduled up to ten levels.`);
						}).catch((caught) => setError(errorText(caught))).finally(() => setPending(false));
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Who", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								required: true,
								value: recruitUid,
								onChange: (event) => setRecruitUid(event.target.value),
								className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select"
								}), unplaced.map((recruit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: recruit.uid,
									children: recruit.name
								}, recruit.uid))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Under", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								required: true,
								value: parentUid,
								onChange: (event) => setParentUid(event.target.value),
								className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3",
								children: parents.map((parent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: parent.uid,
									children: ["· ".repeat(parent.depth), parent.depth === 0 ? "Directly under me" : parent.name]
								}, parent.uid))
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-teal",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending,
							className: "h-12 rounded-full bg-teal px-5 font-medium text-ink disabled:opacity-50",
							children: pending ? "Placing…" : "Place"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 hidden md:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Your line"
				}), network ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Branch, { node: network.tree })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Loading the line…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 rounded-full bg-surface px-4",
					onClick: () => {
						if (typeof Notification === "undefined") return;
						Notification.requestPermission().then((permission) => {
							setAlerts(permission === "granted" ? "Alerts on" : "Alerts off");
						});
					},
					children: alerts
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 rounded-full px-4 text-muted",
					onClick: () => {
						signOut();
					},
					children: "Sign out"
				})]
			})
		]
	}) });
}
var Route$12 = createFileRoute("/roadmap")({ component: RoadmapPage });
function RoadmapPage() {
	const { ready, session, profile } = useConnect();
	const [items, setItems] = (0, import_react.useState)([]);
	const [progress, setProgress] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!session || profile?.membershipStatus !== "active") return;
		getDesk({ data: { idToken: session.idToken } }).then((desk) => {
			setItems(desk.tutorials);
			setProgress(desk.progress);
		}).catch((caught) => setError(errorText(caught)));
	}, [profile?.membershipStatus, session]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	if (profile.membershipStatus !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	const done = progress.filter((row) => row.completed).length;
	const total = Math.max(items.length, 1);
	const percent = Math.round(done / total * 100);
	const nextOpen = items.findIndex((item) => !progress.find((row) => row.tutorialId === item.id && row.completed));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-4 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Your AI Roadmap"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "A step-by-step path from beginner to advanced."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-3xl border border-line bg-raise p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-teal",
							children: [percent, "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-2 overflow-hidden rounded-full bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-teal",
							style: { width: `${percent}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted",
						children: [
							done,
							" of ",
							items.length,
							" steps completed"
						]
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-teal",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-5 space-y-3",
				children: items.map((item, index) => {
					const row = progress.find((entry) => entry.tutorialId === item.id);
					const complete = Boolean(row?.completed);
					const current = index === nextOpen;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/learn/$tutorialId",
						params: { tutorialId: item.id },
						className: "flex gap-3 rounded-2xl border border-line bg-raise p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid size-8 shrink-0 place-items-center rounded-full text-sm ${complete || current ? "bg-teal text-ink" : "bg-surface text-muted"}`,
							children: complete ? "✓" : index + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-sm font-medium",
							children: [
								index + 1,
								". ",
								item.title
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted",
							children: item.description
						})] })]
					}) }, item.id);
				})
			})
		]
	}) });
}
var points = [
	"Walkthroughs",
	"Short guides",
	"Real tools"
];
function GetStarted() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "start-bg relative flex min-h-dvh flex-col overflow-hidden px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.75rem,env(safe-area-inset-top))] text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-16 top-24 size-56 rounded-full bg-[#d4af37]/20 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-20 bottom-16 size-64 rounded-full bg-white/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex w-full max-w-md flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.28em] text-[#f3e2a6]",
								children: "Learn · Apply · Master"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-4 font-display text-5xl leading-[0.95] text-white",
								children: ["Use AI", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-[#f3e2a6]",
									children: "the right way."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-sm text-base leading-relaxed text-white/70",
								children: "A clear path from first prompt to real work. Videos, guides, and the tools that actually matter."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 flex flex-wrap gap-2",
						children: points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-sm text-white/80 backdrop-blur",
							children: point
						}, point))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto pt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/join",
							className: "flex h-14 w-full items-center justify-center rounded-full bg-teal text-base font-medium text-ink",
							children: "Get Started"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-center text-sm text-white/60",
							children: [
								"Already have an account?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "font-medium text-[#f3e2a6]",
									children: "Sign In"
								})
							]
						})]
					})
				]
			})
		]
	});
}
var Route$11 = createFileRoute("/start")({ component: StartPage });
function StartPage() {
	const { ready, session, profile } = useConnect();
	if (!ready && !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (session && profile?.membershipStatus === "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	if (session && profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GetStarted, {});
}
function StudioView({ session }) {
	const [products, setProducts] = (0, import_react.useState)([]);
	const [productCode, setProductCode] = (0, import_react.useState)("lamp");
	const [style, setStyle] = (0, import_react.useState)("morning light, quiet desk");
	const [output, setOutput] = (0, import_react.useState)("caption");
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	const [audio, setAudio] = (0, import_react.useState)("");
	const [rights, setRights] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		listProducts({ data: { idToken: session.idToken } }).then((result) => {
			setProducts(result.products);
			if (result.products[0]) setProductCode(result.products[0].code);
		}).catch((caught) => setNote(errorText(caught)));
	}, [session.idToken]);
	const product = products.find((item) => item.code === productCode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-teal",
				children: "AI Content Studio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Make the piece, then send it up"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Image, caption, or a live script from an approved product. Video is a desk draft plus your own portrait clip — this desk does not invent a finished commercial unless the image service is configured. Nothing publishes until a person approves it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: (event) => {
					event.preventDefault();
					setBusy(true);
					setNote("");
					setAudio("");
					generateStudio({ data: {
						idToken: session.idToken,
						productCode,
						output,
						style
					} }).then((next) => {
						setDraft(next);
						setText(next.text);
						setNote(next.source === "grok" ? "Generated. Edit it before you submit." : "AI provider is not configured. This is a desk draft you can edit.");
					}).catch((caught) => setNote(errorText(caught))).finally(() => setBusy(false));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Product", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: productCode,
							onChange: (event) => setProductCode(event.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-raise px-3",
							children: products.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: item.code,
								children: [
									item.name,
									" · ",
									peso(item.price)
								]
							}, item.code))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"caption",
							"image",
							"script"
						].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOutput(kind),
							className: kind === output ? "h-10 rounded-full bg-teal px-4 text-sm text-ink" : "h-10 rounded-full bg-surface px-4 text-sm text-muted",
							children: kind
						}, kind))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Style or prompt", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: style,
							onChange: (event) => setStyle(event.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-raise px-3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "h-11 rounded-full bg-teal px-5 font-medium text-ink disabled:opacity-50",
						children: busy ? "Working…" : "Generate"
					})
				]
			}),
			product ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: product.guidelines
			}) : null,
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: note
			}) : null,
			draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-3xl bg-raise p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: draft.imageUrl,
						alt: "",
						className: "aspect-[9/16] max-h-96 w-full rounded-2xl object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							draft.source,
							" · ",
							draft.affiliatePath
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-sm",
						children: ["Edit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: text,
							onChange: (event) => setText(event.target.value),
							rows: 5,
							className: "mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-full bg-surface px-4 text-sm",
							onClick: () => {
								setBusy(true);
								speakCaption({ data: {
									idToken: session.idToken,
									text
								} }).then((result) => setAudio(result.audio)).catch((caught) => setNote(errorText(caught))).finally(() => setBusy(false));
							},
							children: "Read caption"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: rights,
								onChange: (event) => setRights(event.target.checked),
								className: "size-4 accent-teal"
							}), "I can use this image and any audio."]
						})]
					}),
					audio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						controls: true,
						src: audio,
						className: "mt-3 w-full"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy || output === "script",
						className: "mt-4 h-11 rounded-full bg-teal px-5 font-medium text-ink disabled:opacity-50",
						onClick: () => {
							setBusy(true);
							submitPost({ data: {
								idToken: session.idToken,
								title: product?.name || "Product",
								caption: text,
								hashtags: "#DailyConnect",
								kind: "image",
								mediaUrl: draft.imageUrl,
								posterUrl: draft.imageUrl,
								durationSec: 0,
								width: 9,
								height: 16,
								mime: "image/jpeg",
								productCode: draft.productCode,
								rightsConfirmed: rights
							} }).then(() => setNote("Submitted to View Deck. It waits for a person.")).catch((caught) => setNote(errorText(caught))).finally(() => setBusy(false));
						},
						children: output === "script" ? "Scripts stay on the live desk" : "Submit to View Deck"
					})
				]
			}) : null
		]
	});
}
var Route$10 = createFileRoute("/studio")({ component: function StudioPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberGate, { children: (session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioView, { session }) });
} });
var Route$9 = createFileRoute("/tools")({ component: ToolsPage });
var groups = [
	{
		title: "Content Creation",
		items: [{
			name: "ChatGPT",
			detail: "Write, plan, and keep a project’s instructions in one place.",
			lesson: "projects"
		}, {
			name: "ChatGPT images",
			detail: "Describe one object and reject warped or stray results.",
			lesson: "product"
		}]
	},
	{
		title: "Productivity",
		items: [{
			name: "Cursor",
			detail: "Edit real code with one rule the editor can follow.",
			lesson: "cursor"
		}, {
			name: "NotebookLM",
			detail: "Ask only what your source files can answer.",
			lesson: "rag"
		}]
	},
	{
		title: "Automation",
		items: [{
			name: "n8n",
			detail: "Draft a reply, then wait for a person to send it.",
			lesson: "n8n"
		}, {
			name: "Ollama",
			detail: "Run a small local model for a script you control.",
			lesson: "ollama"
		}]
	}
];
function ToolsPage() {
	const { ready, session, profile } = useConnect();
	const [query, setQuery] = (0, import_react.useState)("");
	const [group, setGroup] = (0, import_react.useState)("All");
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	if (profile.membershipStatus !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	const needle = query.trim().toLowerCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-4 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Tools & Apps"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "The best AI tools, organized by use case, with a lesson for each."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "Search tools and apps...",
				className: "mt-4 h-12 w-full rounded-2xl border border-line bg-raise px-4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto",
				children: ["All", ...groups.map((item) => item.title)].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setGroup(label),
					className: group === label ? "h-9 shrink-0 rounded-full bg-teal px-3 text-sm text-ink" : "h-9 shrink-0 rounded-full border border-line px-3 text-sm text-muted",
					children: label === "Content Creation" ? "Content" : label
				}, label))
			}),
			groups.filter((section) => group === "All" || section.title === group).map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-teal",
					children: section.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: section.items.filter((item) => `${item.name} ${item.detail}`.toLowerCase().includes(needle)).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/learn/$tutorialId",
						params: { tutorialId: item.lesson },
						className: "block rounded-2xl border border-line bg-raise px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: item.detail
						})]
					}) }, item.name))
				})]
			}, section.title))
		]
	}) });
}
var Route$8 = createFileRoute("/wallet")({ component: WalletPage });
var labels = {
	referral_bonus: "Direct referral",
	unilevel: "Unilevel",
	payout: "Payout",
	creator_share: "Creator share",
	affiliate_commission: "Affiliate commission",
	adjustment: "Adjustment"
};
function WalletPage() {
	const { ready, session, profile, setProfile } = useConnect();
	const [view, setView] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)(PAYOUT_MIN);
	const [method, setMethod] = (0, import_react.useState)("gcash");
	const [account, setAccount] = (0, import_react.useState)("");
	const [accountName, setAccountName] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		let cancel = false;
		getWallet({ data: { idToken: session.idToken } }).then((next) => {
			if (cancel) return;
			setView(next);
			setProfile(next.profile);
			const saved = next.profile.payoutMethod;
			if (saved) {
				setMethod(saved.method);
				setAccount(saved.account);
				setAccountName(saved.accountName);
			}
			setAmount(next.available >= PAYOUT_MIN ? next.available : PAYOUT_MIN);
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		});
		return () => {
			cancel = true;
		};
	}, [session, setProfile]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	if (profile.membershipStatus !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Wallet"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-teal",
				children: error
			}) : null,
			view ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-raise p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Total accumulated income"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-4xl tabular-nums",
							children: peso(view.accumulated)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-raise p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Available for payout"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-4xl tabular-nums",
								children: peso(view.available)
							}),
							view.pendingPayout > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [peso(view.pendingPayout), " requested, not paid yet."]
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-4",
					children: [
						["Direct, paid", String(view.directPaid)],
						["Waiting to join", String(view.directPending)],
						["Referral paid", peso(view.directBonus)],
						["Accruing", peso(view.accruing)]
					].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-lg tabular-nums",
							children: value
						})]
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						peso(DIRECT_BONUS),
						" from a direct join is available immediately. ",
						peso(LEVEL_BONUS),
						" unilevel posts on the 1st (Manila). Line size: ",
						view.teamSize,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 space-y-3",
					onSubmit: (event) => {
						event.preventDefault();
						if (!session) return;
						setPending(true);
						setNote("");
						payout({ data: {
							idToken: session.idToken,
							amount,
							method,
							account,
							phone: account,
							accountName
						} }).then(() => getWallet({ data: { idToken: session.idToken } })).then((next) => {
							setView(next);
							setProfile(next.profile);
							setNote("Requested. The balance stays until the admin marks it paid.");
						}).catch((caught) => setNote(errorText(caught))).finally(() => setPending(false));
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "Payout account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: ["gcash", "maya"].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMethod(option),
								className: `h-11 rounded-full px-4 text-sm font-medium ${method === option ? "bg-teal text-ink" : "bg-raise text-fg"}`,
								children: option === "gcash" ? "GCash" : "Maya"
							}, option))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: account,
							onChange: (event) => setAccount(event.target.value),
							placeholder: method === "gcash" ? "GCash account number" : "Maya account number",
							className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: accountName,
							onChange: (event) => setAccountName(event.target.value),
							placeholder: method === "gcash" ? "GCash account name" : "Maya account name",
							className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Amount", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: PAYOUT_MIN,
								max: view.available,
								value: amount,
								onChange: (event) => setAmount(Number(event.target.value)),
								className: "mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 sm:w-40"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending || view.available < PAYOUT_MIN,
							className: "h-12 rounded-full bg-teal px-5 font-medium text-ink disabled:opacity-50",
							children: pending ? "Sending…" : "Request payout"
						})
					]
				}),
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: note
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-10 font-display text-2xl",
					children: "History"
				}),
				view.transactions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						"Share your link. ",
						peso(DIRECT_BONUS),
						" lands the moment they join."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-line",
					children: view.transactions.map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: labels[tx.type] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								tx.note,
								" · ",
								tx.status === "scheduled" ? "Posts on the 1st" : tx.status === "requested" ? "Waiting for admin" : tx.status
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "tabular-nums",
							children: [tx.type === "payout" && tx.status === "paid" ? "−" : tx.type === "payout" ? "" : "+", peso(Math.abs(tx.amount))]
						})]
					}, tx.id))
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted",
				children: "Loading wallet…"
			})
		]
	}) });
}
var Route$7 = createFileRoute("/api/media")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const idToken = request.headers.get("x-id-token") || "";
		const { loadProfile } = await import("./firebase.server-BC4SNhK7.mjs");
		await loadProfile(idToken);
		const { signVideoUpload } = await import("./cloudinary.server-CUCi8Jrl.mjs");
		return Response.json(signVideoUpload());
	} catch (error) {
		const message = error instanceof Error ? error.message : "Could not start the upload.";
		return new Response(message, {
			status: 400,
			headers: { "content-type": "text/plain; charset=utf-8" }
		});
	}
} } } });
var Route$6 = createFileRoute("/code/create")({ component: CreateCode });
function when(ts) {
	if (!ts) return "Not used";
	return new Intl.DateTimeFormat("en-PH", {
		timeZone: "Asia/Manila",
		dateStyle: "medium",
		timeStyle: "short"
	}).format(ts);
}
function CreateCode() {
	const { ready, session, signInEmail, adopt, signOut } = useConnect();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [issued, setIssued] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(null);
	const [gate, setGate] = (0, import_react.useState)(null);
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!session) {
			setGate(null);
			return;
		}
		let cancel = false;
		masterGate({ data: { idToken: session.idToken } }).then((next) => {
			if (!cancel) setGate(next);
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		});
		return () => {
			cancel = true;
		};
	}, [session]);
	(0, import_react.useEffect)(() => {
		if (!session || !gate?.allowed) return;
		let cancel = false;
		listIssued({ data: { idToken: session.idToken } }).then((result) => {
			if (!cancel) setRows(result.codes);
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		});
		return () => {
			cancel = true;
		};
	}, [
		session,
		gate?.allowed,
		issued
	]);
	if (!ready || session && !gate && !error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	async function onEmail(event) {
		event.preventDefault();
		setError("");
		setPending("email");
		try {
			await signInEmail(email, password);
		} catch (caught) {
			setError(errorText(caught));
		} finally {
			setPending(null);
		}
	}
	async function onGoogle() {
		setError("");
		setPending("google");
		try {
			const next = await signInWithGoogle();
			await adopt({
				idToken: next.idToken,
				refreshToken: next.refreshToken,
				uid: next.uid,
				email: next.email,
				expiresAt: next.expiresAt
			}, next.name);
		} catch (caught) {
			const code = caught && typeof caught === "object" && "code" in caught;
			setError(code ? googleError(caught) : errorText(caught));
		} finally {
			setPending(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-canvas",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-lg items-center justify-between px-5 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-muted",
					onClick: () => void signOut(),
					children: "Log out"
				}) : null]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-lg px-5 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-teal",
					children: "Activation codes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl",
					children: "Create a code"
				}),
				!session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-3",
					onSubmit: onEmail,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Sign in with ",
								MASTER_EMAIL,
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							autoComplete: "username",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							placeholder: "Email",
							className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "password",
							autoComplete: "current-password",
							value: password,
							onChange: (event) => setPassword(event.target.value),
							placeholder: "Password",
							className: "h-12 w-full rounded-xl border border-line bg-raise px-3"
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-teal",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending !== null,
							className: "h-12 w-full rounded-full bg-teal font-medium text-ink disabled:opacity-60",
							children: pending === "email" ? "Signing in…" : "Sign in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: pending !== null,
							onClick: () => void onGoogle(),
							className: "h-12 w-full rounded-full border border-line bg-raise font-medium disabled:opacity-60",
							children: pending === "google" ? "Opening Google…" : "Continue with Google"
						})
					]
				}) : !gate?.allowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-muted",
					children: [
						"Signed in as ",
						gate?.email || "another account",
						". Only ",
						MASTER_EMAIL,
						" can create a code."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-3",
					onSubmit: (event) => {
						event.preventDefault();
						if (!session) return;
						setPending("code");
						setError("");
						issueCode({ data: { idToken: session.idToken } }).then((result) => {
							setIssued(result.code);
						}).catch((caught) => setError(errorText(caught))).finally(() => setPending(null));
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Signed in as ",
								MASTER_EMAIL,
								". This code only activates a member. Their sponsor stays the one from the affiliate link."
							]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-teal",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending !== null,
							className: "h-12 w-full rounded-full bg-teal font-medium text-ink disabled:opacity-60",
							children: pending === "code" ? "Creating…" : "Create activation code"
						}),
						issued ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl tracking-widest text-teal",
							children: issued
						}) : null
					]
				}),
				gate?.allowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Code list"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Saved in Firebase. Status shows who created each code, where, and who used it."
						}),
						rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "No codes yet."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-3",
							children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-2xl bg-raise px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-2xl tracking-widest text-teal",
											children: row.code
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted",
											children: row.status === "used" ? "Used" : "Available"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-sm",
										children: [
											"Created ",
											when(row.createdAt),
											" by ",
											row.createdByName || row.createdByEmail,
											" at ",
											row.createdWhere || "/code/create"
										]
									}),
									row.sponsorName || row.sponsorCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted",
										children: [
											"Used under ",
											row.sponsorName || "sponsor",
											" · ",
											row.sponsorCode
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: "Sponsor is set by the affiliate link, not by this code."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: row.status === "used" ? `Used ${when(row.usedAt)} by ${row.usedByName || "member"}${row.usedByEmail ? ` · ${row.usedByEmail}` : ""}` : "Not used yet"
									})
								]
							}, row.code))
						})
					]
				}) : null
			]
		})]
	});
}
var Route$5 = createFileRoute("/learn/")({ component: Learn });
var filters = [
	"All",
	"Start",
	"Intermediate",
	"Advanced",
	"Community"
];
function Reel({ post }) {
	const videoRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video) return;
		const watcher = new IntersectionObserver(([entry]) => {
			if (!entry) return;
			if (entry.isIntersecting) video.play().catch(() => void 0);
			else video.pause();
		}, { threshold: .65 });
		watcher.observe(video);
		return () => watcher.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "overflow-hidden rounded-3xl bg-black",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref: videoRef,
			src: post.mediaUrl,
			playsInline: true,
			muted: true,
			loop: true,
			controls: true,
			className: "mx-auto max-h-[78dvh] w-full bg-black object-contain"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-raise px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: post.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 inline-flex rounded-full bg-teal/15 px-2 py-0.5 text-[11px] text-teal",
					children: "Content Author"
				}),
				post.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: post.caption
				}) : null
			]
		})]
	});
}
function Learn() {
	const { ready, session, profile } = useConnect();
	const [items, setItems] = (0, import_react.useState)([]);
	const [posts, setPosts] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [query, setQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const q = new URLSearchParams(window.location.search).get("q");
		if (q) setQuery(q);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!session || profile?.membershipStatus !== "active") return;
		let cancel = false;
		getDesk({ data: { idToken: session.idToken } }).then((desk) => {
			if (!cancel) setItems(desk.tutorials);
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		}).finally(() => {
			if (!cancel) setLoading(false);
		});
		listCommunity({ data: { idToken: session.idToken } }).then((result) => {
			if (!cancel) setPosts(result.posts);
		}).catch(() => void 0);
		return () => {
			cancel = true;
		};
	}, [profile?.membershipStatus, session]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	if (profile.membershipStatus !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	const community = filter === "Community";
	const needle = query.trim().toLowerCase();
	const shown = items.filter((tutorial) => {
		const matchesFilter = filter === "All" || tutorial.difficulty === filter;
		const hay = `${tutorial.title} ${tutorial.tags.join(" ")} ${tutorial.description}`.toLowerCase();
		return matchesFilter && hay.includes(needle);
	});
	const reels = posts.filter((post) => `${post.name} ${post.caption}`.toLowerCase().includes(needle));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-4 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: community ? "Community" : "Short Guides"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: community ? "Member videos, newest at the top." : "Quick, practical guides to learn and apply AI."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: community ? "Search videos..." : "Search guides...",
				className: "mt-4 h-12 w-full rounded-2xl border border-line bg-raise px-4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto",
				children: filters.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(item),
					className: filter === item ? "h-9 shrink-0 rounded-full bg-teal px-3 text-sm text-ink" : "h-9 shrink-0 rounded-full border border-line bg-raise px-3 text-sm text-muted",
					children: item === "Start" ? "Beginner" : item
				}, item))
			}),
			community ? reels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "No community videos yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: reels.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reel, { post }, post.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-muted",
					children: "Loading lessons…"
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-teal",
					children: error
				}) : null,
				!loading && shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-muted",
					children: "Nothing matches."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: shown.map((tutorial) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/learn/$tutorialId",
						params: { tutorialId: tutorial.id },
						className: "flex items-center gap-3 rounded-2xl border border-line bg-raise p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: tutorial.thumbnail,
							alt: "",
							className: "size-16 rounded-xl object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-medium",
								children: tutorial.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-xs text-teal",
								children: [
									tutorial.difficulty === "Start" ? "Beginner" : tutorial.difficulty,
									" · ",
									tutorial.durationMin,
									":00"
								]
							})]
						})]
					}) }, tutorial.id))
				})
			] })
		]
	}) });
}
function Player({ tutorial, initial, related }) {
	const { session } = useConnect();
	const videoRef = (0, import_react.useRef)(null);
	const total = tutorial.durationMin * 60;
	const seed = newer(initial, (0, import_react.useMemo)(() => readCache(session?.uid, tutorial.id), [session?.uid, tutorial.id]));
	const [position, setPosition] = (0, import_react.useState)(seed?.lastPositionSec ?? 0);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [exercises, setExercises] = (0, import_react.useState)(seed?.exercises ?? []);
	const [completed, setCompleted] = (0, import_react.useState)(Boolean(seed?.completed));
	const [syncNote, setSyncNote] = (0, import_react.useState)("");
	const spans = (0, import_react.useMemo)(() => {
		let cursor = 0;
		return tutorial.lesson.chapters.map((chapter) => {
			const start = cursor;
			const len = chapter.minutes * 60;
			cursor += len;
			return {
				...chapter,
				start,
				len
			};
		});
	}, [tutorial.lesson.chapters]);
	const chapter = [...spans].reverse().find((span) => position >= span.start) ?? spans[0];
	const percent = completed ? 100 : Math.min(100, Math.round(position / total * 100));
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video) return;
		video.src = tutorial.reel;
	}, [tutorial.id, tutorial.reel]);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video) return;
		if (playing) video.play().catch(() => void 0);
		else video.pause();
	}, [playing]);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const id = window.setInterval(() => {
			setPosition((value) => {
				const next = Math.min(total, value + 1);
				if (next >= total) setPlaying(false);
				return next;
			});
		}, 1e3);
		return () => window.clearInterval(id);
	}, [playing, total]);
	(0, import_react.useEffect)(() => {
		if (!session) return;
		const snapshot = {
			tutorialId: tutorial.id,
			progressPercent: percent,
			completed: completed || percent >= 100,
			lastPositionSec: position,
			exercises,
			updatedAt: Date.now()
		};
		writeCache(session.uid, snapshot);
		const handle = window.setTimeout(() => {
			saveProgress({ data: {
				idToken: session.idToken,
				tutorialId: tutorial.id,
				progressPercent: snapshot.progressPercent,
				lastPositionSec: snapshot.lastPositionSec,
				completed: snapshot.completed,
				exercises: snapshot.exercises
			} }).then(() => setSyncNote("")).catch(() => setSyncNote("Saved on this device. It will sync when you’re back."));
		}, 800);
		return () => window.clearTimeout(handle);
	}, [
		completed,
		exercises,
		percent,
		position,
		session,
		tutorial.id
	]);
	function toggleExercise(id) {
		setExercises((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-5xl gap-8 px-5 py-6 md:grid-cols-[minmax(0,1fr)_18rem] md:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					tutorial.difficulty,
					" · ",
					tutorial.durationMin,
					" min"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: tutorial.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-hidden rounded-3xl bg-raise",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					poster: tutorial.thumbnail,
					muted: true,
					loop: true,
					playsInline: true,
					className: "aspect-video w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-12 place-items-center rounded-full bg-teal text-ink",
					"aria-label": playing ? "Pause" : "Play",
					onClick: () => setPlaying((value) => !value),
					children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5 size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-1 flex-col gap-1 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Lesson position"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: total,
							value: position,
							onChange: (event) => setPosition(Number(event.target.value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [
								formatClock(position),
								" / ",
								formatClock(total),
								" · ",
								percent,
								"%"
							]
						})
					]
				})]
			}),
			chapter ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: chapter.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base leading-relaxed text-fg/90",
					children: chapter.body
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: spans.map((span) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPosition(span.start),
					className: span.id === chapter?.id ? "h-10 rounded-full bg-teal px-3 text-sm text-ink" : "h-10 rounded-full bg-surface px-3 text-sm text-muted",
					children: span.title
				}, span.id))
			}),
			syncNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: syncNote
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Drills"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: tutorial.lesson.exercises.map((exercise) => {
							const on = exercises.includes(exercise.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "glass rounded-2xl p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "mt-1 size-5 accent-teal",
										checked: on,
										onChange: () => toggleExercise(exercise.id)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block",
										children: exercise.prompt
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-sm text-muted",
										children: exercise.hint
									})] })]
								})
							}, exercise.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 h-12 rounded-full bg-teal px-5 font-medium text-ink disabled:opacity-50",
						disabled: completed,
						onClick: () => {
							setCompleted(true);
							setPosition(total);
							setPlaying(false);
						},
						children: completed ? "Marked complete" : "Continue Learning"
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm text-muted",
			children: "Also on the desk"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-3",
			children: related.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/learn/$tutorialId",
				params: { tutorialId: item.id },
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.thumbnail,
					alt: "",
					className: "aspect-[3/2] w-full rounded-2xl object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: item.title
				})]
			}) }, item.id))
		})] })]
	});
}
function readCache(uid, tutorialId) {
	if (!uid || typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(progressCacheKey(uid, tutorialId));
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function writeCache(uid, progress) {
	localStorage.setItem(progressCacheKey(uid, progress.tutorialId), JSON.stringify(progress));
}
function newer(server, local) {
	if (!server) return local;
	if (!local) return server;
	return local.updatedAt > server.updatedAt ? local : server;
}
var Route$4 = createFileRoute("/learn/$tutorialId")({ component: TutorialPage });
function TutorialPage() {
	const { tutorialId } = Route$4.useParams();
	const { ready, session, profile } = useConnect();
	const [tutorial, setTutorial] = (0, import_react.useState)(null);
	const [progress, setProgress] = (0, import_react.useState)(null);
	const [related, setRelated] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!session || profile?.membershipStatus !== "active") return;
		let cancel = false;
		setTutorial(null);
		setError("");
		Promise.all([getTutorial({ data: {
			idToken: session.idToken,
			tutorialId
		} }), getDesk({ data: { idToken: session.idToken } })]).then(([detail, desk]) => {
			if (cancel) return;
			setTutorial(detail.tutorial);
			setProgress(detail.progress);
			setRelated(desk.tutorials.filter((item) => item.id !== tutorialId).slice(0, 3));
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		});
		return () => {
			cancel = true;
		};
	}, [
		profile?.membershipStatus,
		session,
		tutorialId
	]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!session || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	if (profile.membershipStatus !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/checkout" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-5 py-16 text-muted",
			children: error
		}) : null,
		!error && !tutorial ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-5 py-16 text-sm text-muted",
			children: "Opening the lesson…"
		}) : null,
		tutorial ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {
			tutorial,
			initial: progress,
			related
		}) : null
	] });
}
var Route$3 = createFileRoute("/$userId/csr/$agentSlug")({ component: AgentPage });
function AgentPage() {
	const { userId, agentSlug } = Route$3.useParams();
	const [agent, setAgent] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("Ready");
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [live, setLive] = (0, import_react.useState)(false);
	const [level, setLevel] = (0, import_react.useState)(0);
	const [turns, setTurns] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	const line = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		readCsr({ data: {
			userId,
			slug: agentSlug
		} }).then((next) => {
			if (!next) setMissing(true);
			else setAgent(next);
		});
		return () => line.current?.stop();
	}, [agentSlug, userId]);
	function answer() {
		if (!agent || line.current) return;
		setStatus("Connecting");
		setNote("");
		setTurns([]);
		const name = agent.persona.trim() || "Mike";
		import("../_libs/vapi-ai__web.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())).then(({ default: Vapi }) => {
			const vapi = new Vapi(VAPI_PUBLIC_KEY);
			line.current = vapi;
			vapi.on("call-start", () => {
				setLive(true);
				setStatus("On the line");
			});
			vapi.on("call-end", () => {
				line.current = null;
				setLive(false);
				setLevel(0);
				setStatus("Call ended");
			});
			vapi.on("volume-level", (value) => setLevel(Math.max(0, Math.min(1, value))));
			vapi.on("local-volume-level", (value) => setLevel((current) => Math.max(current * .65, value)));
			vapi.on("message", (message) => {
				if (message.type !== "transcript" || message.transcriptType !== "final" || !message.transcript) return;
				const who = message.role === "user" ? "You" : name;
				setTurns((rows) => [...rows, {
					who,
					text: message.transcript
				}].slice(-8));
			});
			vapi.on("error", (error) => {
				const detail = typeof error === "string" ? error : error?.message;
				setNote(detail || "Allow the microphone, then tap Answer again.");
				setStatus("Could not connect");
			});
			const assistantId = agent.vapiAssistantId || "88f31830-5fa4-474f-b8ed-63e8406505bc";
			return vapi.start(assistantId, {
				firstMessage: agent.firstMessage,
				voice: {
					provider: "vapi",
					voiceId: agent.voiceId || "Elliot"
				},
				...agent.systemPrompt ? { model: {
					provider: "anthropic",
					model: "claude-sonnet-4-6",
					messages: [{
						role: "system",
						content: agent.systemPrompt
					}]
				} } : {}
			});
		}).catch(() => {
			setStatus("Could not connect");
			setNote("The call did not start.");
		});
	}
	function hangUp() {
		line.current?.stop();
		line.current = null;
		setLive(false);
		setLevel(0);
		setMuted(false);
		setStatus("Call ended");
	}
	if (!agent && !missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (missing || !agent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "fixed inset-0 z-50 grid place-items-center bg-[#141414] text-sm text-[#a3a3a3]",
		children: "That agent is not published."
	});
	const name = agent.persona.trim() || "Mike";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-[#141414] text-[#f3f3f3]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(640px_420px_at_50%_0%,rgba(212,175,55,0.28),transparent_58%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "relative px-6 pt-[max(1.25rem,env(safe-area-inset-top))] text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.22em] text-[#d4af37]",
					children: agent.business || "Customer support"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative mt-10 flex flex-col items-center px-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-28 place-items-center rounded-full bg-[#d4af37]/15 ring-1 ring-[#d4af37]/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-24 place-items-center rounded-full bg-[#1e1e1e] text-[#f3e2a6]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
								className: "size-12",
								strokeWidth: 1.5
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 font-display text-4xl tracking-tight",
						children: name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-[#a3a3a3]",
						children: status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex h-14 items-end gap-1.5",
						"aria-hidden": true,
						children: [
							.4,
							.65,
							.9,
							1,
							.75,
							.5,
							.85,
							.6,
							.95,
							.45
						].map((weight, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-1.5 rounded-full bg-[#d4af37]",
							style: {
								height: live ? 8 + level * weight * 44 : 8,
								transition: "height 80ms linear"
							}
						}, weight + index))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-sm text-sm leading-relaxed text-[#f3e2a6]",
						children: turns.at(-1)?.text || agent.firstMessage
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative mx-auto mt-6 w-full max-w-md flex-1 space-y-2 overflow-y-auto px-6",
				children: [turns.map((turn, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-2xl bg-[#1e1e1e] px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[#d4af37]",
						children: [turn.who, ". "]
					}), turn.text]
				}, `${turn.who}-${index}`)), note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-[#a3a3a3]",
					children: note
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "relative flex items-center justify-center gap-10 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-14 place-items-center rounded-full bg-[#2a2a2a] text-sm text-[#f3e2a6] ring-1 ring-[#3f3f3f]",
					"aria-label": muted ? "Unmute" : "Mute",
					onClick: () => {
						const next = !muted;
						setMuted(next);
						line.current?.setMuted(next);
					},
					children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" })
				}), live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "End call",
					onClick: hangUp,
					className: "grid size-16 place-items-center rounded-full bg-[#2a2a2a] text-[#f3f3f3] ring-1 ring-[#3f3f3f]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-6" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Answer",
					onClick: answer,
					className: "grid size-16 place-items-center rounded-full bg-[#d4af37] text-[#1a1a1a]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-6" })
				})]
			})
		]
	});
}
var Route$2 = createFileRoute("/api/media/$id")({ server: { handlers: { GET: async ({ params }) => {
	const { readUploadedVideo } = await import("./firebase.server-BC4SNhK7.mjs");
	const file = await readUploadedVideo(params.id);
	if (!file) return new Response("Not found", { status: 404 });
	const bytes = Uint8Array.from(Buffer.from(file.data, "base64"));
	return new Response(bytes, { headers: {
		"content-type": file.mime,
		"cache-control": "public, max-age=31536000"
	} });
} } } });
var Route$1 = createFileRoute("/r/$memberCode/$productCode")({ component: AffiliateLanding });
function AffiliateLanding() {
	const { memberCode, productCode } = Route$1.useParams();
	const [product, setProduct] = (0, import_react.useState)(null);
	const [memberName, setMemberName] = (0, import_react.useState)("");
	const [disclosure, setDisclosure] = (0, import_react.useState)("");
	const [windowDays, setWindowDays] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)("");
	const [recorded, setRecorded] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		loadAffiliateLanding({ data: {
			memberCode,
			productCode
		} }).then((result) => {
			if (cancel) return;
			setProduct(result.product);
			setMemberName(result.memberName);
			setDisclosure(result.disclosure);
			setWindowDays(result.windowDays);
		}).catch((caught) => {
			if (!cancel) setError(errorText(caught));
		});
		recordClick({ data: {
			memberCode,
			productCode
		} }).then((result) => {
			if (!cancel) setRecorded(result.recorded);
		}).catch(() => {
			if (!cancel) setRecorded(false);
		});
		return () => {
			cancel = true;
		};
	}, [memberCode, productCode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen max-w-lg flex-col px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SponsorBar, {}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-muted",
				children: error
			}) : null,
			product ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: "",
						className: "aspect-square w-full rounded-3xl object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-teal",
						children: ["Shared by ", memberName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted",
						children: product.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-2xl tabular-nums",
						children: peso(product.price)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm",
						children: disclosure
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							recorded ? "This click was recorded." : "Click noted.",
							" A sale counts only after the merchant confirms it, inside ",
							windowDays,
							" days."
						]
					})
				]
			}) : null
		]
	});
}
var IndexRoute = Route$25.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$26
});
var AdminRoute = Route$24.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$26
});
var CheckoutRoute = Route$23.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$26
});
var CommunityRoute = Route$22.update({
	id: "/community",
	path: "/community",
	getParentRoute: () => Route$26
});
var CreatorRoute = Route$21.update({
	id: "/creator",
	path: "/creator",
	getParentRoute: () => Route$26
});
var CsrRoute = Route$20.update({
	id: "/csr",
	path: "/csr",
	getParentRoute: () => Route$26
});
var DeckRoute = Route$19.update({
	id: "/deck",
	path: "/deck",
	getParentRoute: () => Route$26
});
var JoinRoute = Route$18.update({
	id: "/join",
	path: "/join",
	getParentRoute: () => Route$26
});
var LiveRoute = Route$17.update({
	id: "/live",
	path: "/live",
	getParentRoute: () => Route$26
});
var LoginRoute = Route$16.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$26
});
var MarketRoute = Route$15.update({
	id: "/market",
	path: "/market",
	getParentRoute: () => Route$26
});
var ModerateRoute = Route$14.update({
	id: "/moderate",
	path: "/moderate",
	getParentRoute: () => Route$26
});
var ProfileRoute = Route$13.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$26
});
var RoadmapRoute = Route$12.update({
	id: "/roadmap",
	path: "/roadmap",
	getParentRoute: () => Route$26
});
var StartRoute = Route$11.update({
	id: "/start",
	path: "/start",
	getParentRoute: () => Route$26
});
var StudioRoute = Route$10.update({
	id: "/studio",
	path: "/studio",
	getParentRoute: () => Route$26
});
var ToolsRoute = Route$9.update({
	id: "/tools",
	path: "/tools",
	getParentRoute: () => Route$26
});
var WalletRoute = Route$8.update({
	id: "/wallet",
	path: "/wallet",
	getParentRoute: () => Route$26
});
var ApiMediaRoute = Route$7.update({
	id: "/api/media",
	path: "/api/media",
	getParentRoute: () => Route$26
});
var CodeCreateRoute = Route$6.update({
	id: "/code/create",
	path: "/code/create",
	getParentRoute: () => Route$26
});
var LearnIndexRoute = Route$5.update({
	id: "/learn/",
	path: "/learn/",
	getParentRoute: () => Route$26
});
var LearnTutorialIdRoute = Route$4.update({
	id: "/learn/$tutorialId",
	path: "/learn/$tutorialId",
	getParentRoute: () => Route$26
});
var UserIdCsrAgentSlugRoute = Route$3.update({
	id: "/$userId/csr/$agentSlug",
	path: "/$userId/csr/$agentSlug",
	getParentRoute: () => Route$26
});
var ApiMediaIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiMediaRoute
});
var RMemberCodeProductCodeRoute = Route$1.update({
	id: "/r/$memberCode/$productCode",
	path: "/r/$memberCode/$productCode",
	getParentRoute: () => Route$26
});
var ApiMediaRouteChildren = { ApiMediaIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	CheckoutRoute,
	CommunityRoute,
	CreatorRoute,
	CsrRoute,
	DeckRoute,
	JoinRoute,
	LiveRoute,
	LoginRoute,
	MarketRoute,
	ModerateRoute,
	ProfileRoute,
	RoadmapRoute,
	StartRoute,
	StudioRoute,
	ToolsRoute,
	WalletRoute,
	ApiMediaRoute: ApiMediaRoute._addFileChildren(ApiMediaRouteChildren),
	CodeCreateRoute,
	LearnTutorialIdRoute,
	LearnIndexRoute,
	UserIdCsrAgentSlugRoute,
	RMemberCodeProductCodeRoute
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getRouter };
