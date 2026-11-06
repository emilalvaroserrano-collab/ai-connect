export function manilaDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function manilaPeriod(now = new Date()) {
  return manilaDate(now).slice(0, 7);
}

export function dayIndex(count: number, now = new Date()) {
  if (count <= 0) return 0;
  const [y, m, d] = manilaDate(now).split("-").map(Number);
  const days = Math.floor(Date.UTC(y, (m ?? 1) - 1, d ?? 1) / 86_400_000);
  return ((days % count) + count) % count;
}

export function secondsUntilManilaMidnight(now = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(now));
  const num = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  let hour = num("hour");
  if (hour === 24) hour = 0;
  return 86_400 - (hour * 3600 + num("minute") * 60 + num("second"));
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export function peso(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function errorText(error: unknown) {
  const raw = error instanceof Error && error.message ? error.message.replace(/^Error:\s*/, "") : "";
  if (raw.startsWith("[")) {
    try {
      const issues = JSON.parse(raw) as { path?: (string | number)[]; message?: string }[];
      const first = Array.isArray(issues) ? issues[0] : undefined;
      const field = first?.path?.[first.path.length - 1];
      if (field === "persona") return "Add a persona name.";
      if (field === "business") return "Add the business name.";
      if (field === "offer") return "Say what the business does.";
      if (field === "contact") return "Add a phone or email.";
      if (typeof first?.message === "string") return first.message;
    } catch {
      /* show the original text */
    }
  }
  return raw || "Something went wrong.";
}
