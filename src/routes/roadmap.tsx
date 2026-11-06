import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Splash } from "@/components/shell";
import { getDesk } from "@/lib/connect.functions";
import { useConnect } from "@/lib/connect";
import { errorText } from "@/lib/manila";
import type { Progress, TutorialCard } from "@/lib/types";

export const Route = createFileRoute("/roadmap")({ component: RoadmapPage });

function RoadmapPage() {
  const { ready, session, profile } = useConnect();
  const [items, setItems] = useState<TutorialCard[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session || profile?.membershipStatus !== "active") return;
    void getDesk({ data: { idToken: session.idToken } })
      .then((desk) => {
        setItems(desk.tutorials);
        setProgress(desk.progress);
      })
      .catch((caught) => setError(errorText(caught)));
  }, [profile?.membershipStatus, session]);

  if (!ready) return <Splash />;
  if (!session || !profile) return <Navigate to="/login" />;
  if (profile.membershipStatus !== "active") return <Navigate to="/checkout" />;

  const done = progress.filter((row) => row.completed).length;
  const total = Math.max(items.length, 1);
  const percent = Math.round((done / total) * 100);
  const nextOpen = items.findIndex((item) => !progress.find((row) => row.tutorialId === item.id && row.completed));

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-4 md:px-8">
        <h1 className="font-display text-3xl">Your AI Roadmap</h1>
        <p className="mt-1 text-sm text-muted">A step-by-step path from beginner to advanced.</p>
        <section className="mt-4 rounded-3xl border border-line bg-raise p-4">
          <div className="flex items-center justify-between text-sm">
            <p>Your Progress</p>
            <p className="text-teal">{percent}%</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-teal" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">{done} of {items.length} steps completed</p>
        </section>
        {error ? <p className="mt-4 text-sm text-teal">{error}</p> : null}
        <ol className="mt-5 space-y-3">
          {items.map((item, index) => {
            const row = progress.find((entry) => entry.tutorialId === item.id);
            const complete = Boolean(row?.completed);
            const current = index === nextOpen;
            return (
              <li key={item.id}>
                <Link to="/learn/$tutorialId" params={{ tutorialId: item.id }} className="flex gap-3 rounded-2xl border border-line bg-raise p-3">
                  <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm ${complete || current ? "bg-teal text-ink" : "bg-surface text-muted"}`}>
                    {complete ? "✓" : index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{index + 1}. {item.title}</span>
                    <span className="mt-1 block text-xs text-muted">{item.description}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </Shell>
  );
}
