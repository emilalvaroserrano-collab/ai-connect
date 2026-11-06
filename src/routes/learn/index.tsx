import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Shell, Splash } from "@/components/shell";
import { listCommunity } from "@/lib/community.functions";
import { getDesk } from "@/lib/connect.functions";
import { useConnect } from "@/lib/connect";
import { errorText } from "@/lib/manila";
import type { TutorialCard } from "@/lib/types";

export const Route = createFileRoute("/learn/")({ component: Learn });

const filters = ["All", "Start", "Intermediate", "Advanced", "Community"] as const;

type CommunityPost = {
  id: string;
  name: string;
  caption: string;
  mediaUrl: string;
  createdAt: number;
};

function Reel({ post }: { post: CommunityPost }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.65 },
    );
    watcher.observe(video);
    return () => watcher.disconnect();
  }, []);

  return (
    <article className="overflow-hidden rounded-3xl bg-black">
      <video ref={videoRef} src={post.mediaUrl} playsInline muted loop controls className="mx-auto max-h-[78dvh] w-full bg-black object-contain" />
      <div className="bg-raise px-4 py-3">
        <p className="text-sm font-medium">{post.name}</p>
        <p className="mt-1 inline-flex rounded-full bg-teal/15 px-2 py-0.5 text-[11px] text-teal">Content Author</p>
        {post.caption ? <p className="mt-2 text-sm text-muted">{post.caption}</p> : null}
      </div>
    </article>
  );
}

function Learn() {
  const { ready, session, profile } = useConnect();
  const [items, setItems] = useState<TutorialCard[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  useEffect(() => {
    if (!session || profile?.membershipStatus !== "active") return;
    let cancel = false;
    void getDesk({ data: { idToken: session.idToken } })
      .then((desk) => {
        if (!cancel) setItems(desk.tutorials);
      })
      .catch((caught) => {
        if (!cancel) setError(errorText(caught));
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    void listCommunity({ data: { idToken: session.idToken } })
      .then((result) => {
        if (!cancel) setPosts(result.posts as CommunityPost[]);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [profile?.membershipStatus, session]);

  if (!ready) return <Splash />;
  if (!session || !profile) return <Navigate to="/login" />;
  if (profile.membershipStatus !== "active") return <Navigate to="/checkout" />;

  const community = filter === "Community";
  const needle = query.trim().toLowerCase();
  const shown = items.filter((tutorial) => {
    const matchesFilter = filter === "All" || tutorial.difficulty === filter;
    const hay = `${tutorial.title} ${tutorial.tags.join(" ")} ${tutorial.description}`.toLowerCase();
    return matchesFilter && hay.includes(needle);
  });
  const reels = posts.filter((post) => `${post.name} ${post.caption}`.toLowerCase().includes(needle));

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-4 md:px-8">
        <h1 className="font-display text-3xl">{community ? "Community" : "Short Guides"}</h1>
        <p className="mt-1 text-sm text-muted">
          {community ? "Member videos, newest at the top." : "Quick, practical guides to learn and apply AI."}
        </p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={community ? "Search videos..." : "Search guides..."}
          className="mt-4 h-12 w-full rounded-2xl border border-line bg-raise px-4"
        />
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={
                filter === item
                  ? "h-9 shrink-0 rounded-full bg-teal px-3 text-sm text-ink"
                  : "h-9 shrink-0 rounded-full border border-line bg-raise px-3 text-sm text-muted"
              }
            >
              {item === "Start" ? "Beginner" : item}
            </button>
          ))}
        </div>
        {community ? (
          reels.length === 0 ? (
            <p className="mt-8 text-sm text-muted">No community videos yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {reels.map((post) => (
                <Reel key={post.id} post={post} />
              ))}
            </div>
          )
        ) : (
          <>
            {loading ? <p className="mt-8 text-sm text-muted">Loading lessons…</p> : null}
            {error ? <p className="mt-8 text-sm text-teal">{error}</p> : null}
            {!loading && shown.length === 0 ? <p className="mt-8 text-sm text-muted">Nothing matches.</p> : null}
            <ul className="mt-4 space-y-3">
              {shown.map((tutorial) => (
                <li key={tutorial.id}>
                  <Link to="/learn/$tutorialId" params={{ tutorialId: tutorial.id }} className="flex items-center gap-3 rounded-2xl border border-line bg-raise p-3">
                    <img src={tutorial.thumbnail} alt="" className="size-16 rounded-xl object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{tutorial.title}</span>
                      <span className="mt-1 block text-xs text-teal">
                        {tutorial.difficulty === "Start" ? "Beginner" : tutorial.difficulty} · {tutorial.durationMin}:00
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Shell>
  );
}
