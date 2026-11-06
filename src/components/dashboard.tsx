import { Link } from "@tanstack/react-router";
import { Bot, Briefcase, ImageIcon, MessageSquare, Wrench, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getDesk } from "@/lib/connect.functions";
import { useConnect } from "@/lib/connect";
import { errorText, formatClock, secondsUntilManilaMidnight } from "@/lib/manila";
import type { Desk } from "@/lib/types";

function Ring({ value }: { value: number }) {
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.max(0, Math.min(100, value)) / 100) * circ;
  return (
    <svg viewBox="0 0 44 44" className="size-12 shrink-0" aria-hidden>
      <circle cx="22" cy="22" r={radius} className="fill-none stroke-line" strokeWidth="3" />
      <circle
        cx="22"
        cy="22"
        r={radius}
        className="fill-none stroke-teal"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 22 22)"
      />
    </svg>
  );
}

function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(secondsUntilManilaMidnight());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{left === null ? "--:--:--" : formatClock(left)}</span>;
}

export function Dashboard() {
  const { session } = useConnect();
  const [desk, setDesk] = useState<Desk | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    let cancel = false;
    setLoading(true);
    void getDesk({ data: { idToken: session.idToken } })
      .then((next) => {
        if (!cancel) setDesk(next);
      })
      .catch((caught) => {
        if (!cancel) setError(errorText(caught));
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [session]);

  useEffect(() => {
    if (!desk?.todayId) return;
    const key = "dc.seenPick";
    const prev = localStorage.getItem(key);
    if (prev && prev !== desk.todayId) {
      toast("A new daily pick is up.");
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("Daily Connect", { body: "Today’s pick is ready." });
      }
    }
    localStorage.setItem(key, desk.todayId);
  }, [desk?.todayId]);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-muted">Loading the desk…</div>;
  }
  if (error || !desk) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <p className="text-muted">{error || "Could not load the desk."}</p>
        <button type="button" className="mt-4 text-teal" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  const byId = new Map(desk.tutorials.map((tutorial) => [tutorial.id, tutorial]));
  const today = byId.get(desk.todayId) ?? desk.tutorials[0];

  if (!today) return <p className="px-5 py-16 text-muted">No lessons yet.</p>;

  const finished = desk.progress.filter((row) => row.completed).length;
  const totalLessons = Math.max(desk.tutorials.length, 1);
  const percent = Math.round((finished / totalLessons) * 100);
  const level = percent >= 70 ? "Advanced" : percent >= 30 ? "Learner" : "Beginner";
  const firstName = desk.profile.name?.split(" ")[0] || "there";
  const categories = [
    { label: "Prompting Basics", icon: MessageSquare, id: "projects" },
    { label: "AI for Work", icon: Briefcase, id: "cursor" },
    { label: "Content Creation", icon: ImageIcon, id: "product" },
    { label: "Automation", icon: Zap, id: "n8n" },
    { label: "Chatbots", icon: Bot, id: "ollama" },
    { label: "Best Tools", icon: Wrench, id: "evals" },
  ];
  const recommended = desk.tutorials.find((item) => item.id !== today.id) ?? today;

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 md:px-8">
      <p className="text-sm text-teal">Welcome back!</p>
      <h1 className="font-display text-3xl">AI Master Plan</h1>
      <p className="mt-1 text-sm text-muted">Good to see you, {firstName}.</p>
      <form
        className="mt-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const q = String(data.get("q") ?? "").trim();
          window.location.assign(q ? `/learn?q=${encodeURIComponent(q)}` : "/learn");
        }}
      >
        <input name="q" placeholder="Search lessons, tools, or topics..." className="h-12 w-full rounded-2xl border border-line bg-raise px-4" />
      </form>

      <Link to="/learn/$tutorialId" params={{ tutorialId: today.id }} className="mt-5 block overflow-hidden rounded-3xl border border-line bg-raise">
        <div className="relative aspect-[16/9]">
          <img src={today.thumbnail} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <p className="absolute left-3 top-3 text-[11px] font-medium tracking-wide text-teal">FEATURED WALKTHROUGH</p>
          <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-teal text-ink">▶</span>
          <div className="absolute bottom-3 left-3 right-3">
            <h2 className="font-display text-2xl text-white">{today.title}</h2>
            <p className="text-xs text-white/80">{today.durationMin}:00</p>
          </div>
        </div>
      </Link>

      <section className="mt-5 rounded-3xl border border-line bg-raise p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Your Progress</h2>
          <p className="text-sm text-teal">Level: {level}</p>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Ring value={percent} />
          <p className="text-sm text-muted">
            <span className="text-lg font-medium text-fg">{percent}%</span>
            <span className="mt-1 block">{finished} of {totalLessons} lessons completed</span>
          </p>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Categories</h2>
          <Link to="/learn" className="text-sm text-teal">See All</Link>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {categories.map((item) => (
            <Link key={item.label} to="/learn/$tutorialId" params={{ tutorialId: item.id }} className="rounded-2xl border border-line bg-raise px-2 py-4 text-center">
              <item.icon className="mx-auto size-5 text-teal" />
              <p className="mt-2 text-xs">{item.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Recommended for You</h2>
          <Link to="/roadmap" className="text-sm text-teal">See All</Link>
        </div>
        <Link to="/learn/$tutorialId" params={{ tutorialId: recommended.id }} className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-raise p-3">
          <img src={recommended.thumbnail} alt="" className="size-16 rounded-xl object-cover" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">{recommended.title}</span>
            <span className="mt-1 block text-xs text-muted">{recommended.difficulty} · {recommended.durationMin}:00</span>
          </span>
        </Link>
      </section>
      <p className="mt-4 text-center text-xs text-muted">Today’s pick swaps in <Countdown /></p>
    </div>
  );
}
