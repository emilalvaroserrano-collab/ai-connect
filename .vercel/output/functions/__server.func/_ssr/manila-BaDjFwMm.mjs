//#region node_modules/.nitro/vite/services/ssr/assets/manila-BaDjFwMm.js
/** Public Firebase web config (the client key is not a server secret). */
var firebaseConfig = {
	apiKey: "AIzaSyC8k-Urv_CEQSuJFSEojh_aU9ur3LijXOA",
	authDomain: "masterplan-1cd65.firebaseapp.com",
	databaseURL: "https://masterplan-1cd65-default-rtdb.firebaseio.com",
	projectId: "masterplan-1cd65",
	storageBucket: "masterplan-1cd65.firebasestorage.app",
	messagingSenderId: "737894267682",
	appId: "1:737894267682:web:26d96704580c32222d037b",
	measurementId: "G-F8G60GBV0S"
};
function phpToUsd(php) {
	return Math.round(php * 100 / 63) / 100;
}
var MEMBERSHIP_FEE = phpToUsd(550);
var DIRECT_BONUS = phpToUsd(50);
var LEVEL_BONUS = phpToUsd(10);
var PAYOUT_MIN = phpToUsd(100);
var MASTER_EMAIL = "master@dailyconnect.tech";
function isMasterEmail(email) {
	return (email ?? "").trim().toLowerCase() === MASTER_EMAIL;
}
function manilaDate(now = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Manila",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(now);
}
function manilaPeriod(now = /* @__PURE__ */ new Date()) {
	return manilaDate(now).slice(0, 7);
}
function dayIndex(count, now = /* @__PURE__ */ new Date()) {
	if (count <= 0) return 0;
	const [y, m, d] = manilaDate(now).split("-").map(Number);
	return (Math.floor(Date.UTC(y, (m ?? 1) - 1, d ?? 1) / 864e5) % count + count) % count;
}
function secondsUntilManilaMidnight(now = Date.now()) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Manila",
		hourCycle: "h23",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}).formatToParts(new Date(now));
	const num = (type) => Number(parts.find((p) => p.type === type)?.value ?? "0");
	let hour = num("hour");
	if (hour === 24) hour = 0;
	return 86400 - (hour * 3600 + num("minute") * 60 + num("second"));
}
function formatClock(totalSeconds) {
	const s = Math.max(0, Math.floor(totalSeconds));
	return [
		Math.floor(s / 3600),
		Math.floor(s % 3600 / 60),
		s % 60
	].map((n) => String(n).padStart(2, "0")).join(":");
}
function peso(amount) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}
function errorText(error) {
	const raw = error instanceof Error && error.message ? error.message.replace(/^Error:\s*/, "") : "";
	if (raw.startsWith("[")) try {
		const issues = JSON.parse(raw);
		const first = Array.isArray(issues) ? issues[0] : void 0;
		const field = first?.path?.[first.path.length - 1];
		if (field === "persona") return "Add a persona name.";
		if (field === "business") return "Add the business name.";
		if (field === "offer") return "Say what the business does.";
		if (field === "contact") return "Add a phone or email.";
		if (typeof first?.message === "string") return first.message;
	} catch {}
	return raw || "Something went wrong.";
}
//#endregion
export { PAYOUT_MIN as a, firebaseConfig as c, manilaPeriod as d, peso as f, MEMBERSHIP_FEE as i, formatClock as l, secondsUntilManilaMidnight as m, LEVEL_BONUS as n, dayIndex as o, phpToUsd as p, MASTER_EMAIL as r, errorText as s, DIRECT_BONUS as t, isMasterEmail as u };
