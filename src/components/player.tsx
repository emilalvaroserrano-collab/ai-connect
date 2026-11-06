import { Link } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { saveProgress } from "@/lib/connect.functions";
import { useConnect } from "@/lib/connect";
import { formatClock } from "@/lib/manila";
import { progressCacheKey } from "@/lib/session";
import type { Progress, TutorialDetail } from "@/lib/types";

export function Player({
  tutorial,
  initial,
  related,
}: {
  tutorial: TutorialDetail;
  initial: Progress | null;
  related: { id: string; title: string; thumbnail: string }[];
}) {
  const { session } = useConnect();
  const videoRef = useRef<HTMLVideoElement>(null);
  const total = tutorial.durationMin * 60;
  const cached = useMemo(() => readCache(session?.uid, tutorial.id), [session?.uid, tutorial.id]);
  const seed = newer(initial, cached);
  const [position, setPosition] = useState(seed?.lastPositionSec ?? 0);
  const [playing, setPlaying] = useState(false);
  const [exercises, setExercises] = useState<string[]>(seed?.exercises ?? []);
  const [completed, setCompleted] = useState(Boolean(seed?.completed));
  const [syncNote, setSyncNote] = useState("");

  const spans = useMemo(() => {
    let cursor = 0;
    return tutorial.lesson.chapters.map((chapter) => {
      const start = cursor;
      const len = chapter.minutes * 60;
      cursor += len;
      return { ...chapter, start, len };
    });
  }, [tutorial.lesson.chapters]);
  const chapter = [...spans].reverse().find((span) => position >= span.start) ?? spans[0];
  const percent = completed ? 100 : Math.min(100, Math.round((position / total) * 100));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = tutorial.reel;
  }, [tutorial.id, tutorial.reel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) void video.play().catch(() => undefined);
    else video.pause();
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setPosition((value) => {
        const next = Math.min(total, value + 1);
        if (next >= total) setPlaying(false);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, total]);

  useEffect(() => {
    if (!session) return;
    const snapshot: Progress = {
      tutorialId: tutorial.id,
      progressPercent: percent,
      completed: completed || percent >= 100,
      lastPositionSec: position,
      exercises,
      updatedAt: Date.now(),
    };
    writeCache(session.uid, snapshot);
    const handle = window.setTimeout(() => {
      void saveProgress({
        data: {
          idToken: session.idToken,
          tutorialId: tutorial.id,
          progressPercent: snapshot.progressPercent,
          lastPositionSec: snapshot.lastPositionSec,
          completed: snapshot.completed,
          exercises: snapshot.exercises,
        },
      })
        .then(() => setSyncNote(""))
        .catch(() => setSyncNote("Saved on this device. It will sync when you’re back."));
    }, 800);
    return () => window.clearTimeout(handle);
  }, [completed, exercises, percent, position, session, tutorial.id]);

  function toggleExercise(id: string) {
    setExercises((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-5 py-6 md:grid-cols-[minmax(0,1fr)_18rem] md:px-8">
      <div>
        <p className="text-sm text-muted">
          {tutorial.difficulty} · {tutorial.durationMin} min
        </p>
        <h1 className="mt-1 font-display text-4xl">{tutorial.title}</h1>
        <div className="mt-4 overflow-hidden rounded-3xl bg-raise">
          <video
            ref={videoRef}
            poster={tutorial.thumbnail}
            muted
            loop
            playsInline
            className="aspect-video w-full object-cover"
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className="grid size-12 place-items-center rounded-full bg-teal text-ink"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <Pause className="size-5" /> : <Play className="ml-0.5 size-5" />}
          </button>
          <label className="flex flex-1 flex-col gap-1 text-xs text-muted">
            <span className="sr-only">Lesson position</span>
            <input
              type="range"
              min={0}
              max={total}
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
            />
            <span className="tabular-nums">
              {formatClock(position)} / {formatClock(total)} · {percent}%
            </span>
          </label>
        </div>
        {chapter ? (
          <article className="mt-6">
            <h2 className="font-display text-2xl">{chapter.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-fg/90">{chapter.body}</p>
          </article>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {spans.map((span) => (
            <button
              key={span.id}
              type="button"
              onClick={() => setPosition(span.start)}
              className={
                span.id === chapter?.id
                  ? "h-10 rounded-full bg-teal px-3 text-sm text-ink"
                  : "h-10 rounded-full bg-surface px-3 text-sm text-muted"
              }
            >
              {span.title}
            </button>
          ))}
        </div>
        {syncNote ? <p className="mt-3 text-sm text-muted">{syncNote}</p> : null}
        <section className="mt-10">
          <h2 className="font-display text-2xl">Drills</h2>
          <ul className="mt-4 space-y-3">
            {tutorial.lesson.exercises.map((exercise) => {
              const on = exercises.includes(exercise.id);
              return (
                <li key={exercise.id} className="glass rounded-2xl p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 size-5 accent-teal"
                      checked={on}
                      onChange={() => toggleExercise(exercise.id)}
                    />
                    <span>
                      <span className="block">{exercise.prompt}</span>
                      <span className="mt-1 block text-sm text-muted">{exercise.hint}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="mt-4 h-12 rounded-full bg-teal px-5 font-medium text-ink disabled:opacity-50"
            disabled={completed}
            onClick={() => {
              setCompleted(true);
              setPosition(total);
              setPlaying(false);
            }}
          >
            {completed ? "Marked complete" : "Continue Learning"}
          </button>
        </section>
      </div>
      <aside>
        <h2 className="text-sm text-muted">Also on the desk</h2>
        <ul className="mt-3 space-y-3">
          {related.map((item) => (
            <li key={item.id}>
              <Link to="/learn/$tutorialId" params={{ tutorialId: item.id }} className="block">
                <img src={item.thumbnail} alt="" className="aspect-[3/2] w-full rounded-2xl object-cover" />
                <p className="mt-2 text-sm">{item.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function readCache(uid: string | undefined, tutorialId: string): Progress | null {
  if (!uid || typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(progressCacheKey(uid, tutorialId));
    return raw ? (JSON.parse(raw) as Progress) : null;
  } catch {
    return null;
  }
}

function writeCache(uid: string, progress: Progress) {
  localStorage.setItem(progressCacheKey(uid, progress.tutorialId), JSON.stringify(progress));
}

function newer(server: Progress | null, local: Progress | null) {
  if (!server) return local;
  if (!local) return server;
  return local.updatedAt > server.updatedAt ? local : server;
}
