import { Link } from "@tanstack/react-router";
import { BookOpen, Clapperboard, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getDesk } from "@/lib/connect.functions";
import { useConnect } from "@/lib/connect";
import { errorText, formatClock, secondsUntilManilaMidnight } from "@/lib/manila";
import type { Desk, Progress, TutorialCard } from "@/lib/types";

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
  const progressOf = (id: string) => desk.progress.find((row) => row.tutorialId === id);
  const continueRows = desk.progress
    .filter((row) => row.progressPercent > 0 && !row.completed)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((row) => ({ row, tutorial: byId.get(row.tutorialId) }))
    .filter((item): item is { row: Progress; tutorial: TutorialCard } => Boolean(item.tutorial));
  const archive = desk.tutorials.filter((tutorial) => tutorial.id !== today?.id).slice(0, 4);
  const todayProgress = today ? progressOf(today.id) : undefined;

  if (!today) return <p className="px-5 py-16 text-muted">No lessons yet.</p>;

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 md:px-8">
      <p className="text-sm text-muted">Good morning{desk.profile.name ? `, ${desk.profile.name.split(" ")[0]}` : ""}.</p>
      <article className="mt-5 overflow-hidden rounded-[1.75rem] bg-raise shadow-float">
        <div className="relative aspect-[16/10] sm:aspect-[16/8]">
          <img src={today.thumbnail} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/30 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-canvas/80 px-3 py-1 text-xs text-teal">Today’s pick</div>
          <div className="absolute right-4 top-4 rounded-full bg-canvas/80 px-3 py-1 text-xs tabular-nums">
            Swaps in <Countdown />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-sm text-muted">
              {today.difficulty} · {today.durationMin} min
            </p>
            <h1 className="font-display text-3xl md:text-4xl">{today.title}</h1>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Ring value={todayProgress?.progressPercent ?? 0} />
            <p className="text-sm text-muted">
              <span className="tabular-nums text-fg">{todayProgress?.progressPercent ?? 0}%</span>
              {" · "}
              {today.description}
            </p>
          </div>
          <Link
            to="/learn/$tutorialId"
            params={{ tutorialId: today.id }}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-teal px-5 font-medium text-ink sm:ml-auto"
          >
            {todayProgress?.progressPercent ? "Resume" : "Start tutorial"}
          </Link>
        </div>
      </article>

      <section className="mt-5 overflow-hidden rounded-2xl bg-raise md:mt-6 md:grid md:grid-cols-3 md:gap-2 md:overflow-visible md:bg-transparent">
        {[
          { to: "/learn", label: "Learn", hint: "Today’s tool", icon: BookOpen },
          { to: "/deck", label: "Deck", hint: "Watch or upload", icon: Clapperboard },
          { to: "/studio", label: "Studio", hint: "Make a post", icon: Sparkles },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex min-h-14 items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 active:bg-surface md:block md:rounded-2xl md:border-0 md:bg-raise md:px-3 md:py-4 md:shadow-ring"
          >
            <item.icon className="size-5 text-teal" />
            <span className="min-w-0 flex-1 md:block">
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="block text-xs text-muted">{item.hint}</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Continue</h2>
        {continueRows.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Nothing in progress. Today’s pick is the door.</p>
        ) : (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {continueRows.map(({ row, tutorial }) => (
              <Link
                key={tutorial.id}
                to="/learn/$tutorialId"
                params={{ tutorialId: tutorial.id }}
                className="w-64 shrink-0 overflow-hidden rounded-2xl bg-raise shadow-float"
              >
                <img src={tutorial.thumbnail} alt="" className="aspect-[3/2] w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm">{tutorial.title}</p>
                  <p className="mt-1 text-xs tabular-nums text-muted">{row.progressPercent}%</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Archive</h2>
          <Link to="/learn" className="text-sm text-teal">
            All lessons
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {archive.map((tutorial) => (
            <Link key={tutorial.id} to="/learn/$tutorialId" params={{ tutorialId: tutorial.id }} className="block">
              <img src={tutorial.thumbnail} alt="" className="aspect-[3/2] w-full rounded-2xl object-cover" />
              <p className="mt-2 text-sm">{tutorial.title}</p>
              <p className="text-xs text-muted">
                {tutorial.difficulty} · {tutorial.durationMin} min
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
