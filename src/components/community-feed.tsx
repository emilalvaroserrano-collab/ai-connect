import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, ThumbsUp, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { commentCommunity, likeCommunity, listCommunity, submitCommunity } from "@/lib/community.functions";
import { errorText } from "@/lib/manila";
import { uploadMemberMedia } from "@/lib/upload-media";
import type { Session } from "@/lib/types";

type Comment = { id: string; name: string; text: string; at: number };
type Post = {
  id: string;
  name: string;
  caption: string;
  mediaUrl: string;
  createdAt: number;
  likes: number;
  liked: boolean;
  mine: boolean;
  comments: Comment[];
};

function ago(at: number) {
  const mins = Math.max(0, Math.round((Date.now() - at) / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export function CommunityComposer({
  session,
  name,
  onPosted,
}: {
  session: Session;
  name: string;
  onPosted?: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="rounded-2xl border border-line bg-raise p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (!file) {
          setError("Choose a video first.");
          return;
        }
        setBusy(true);
        setError("");
        void (async () => {
          const mediaUrl = await uploadMemberMedia(session.idToken, file, `community/${Date.now()}.mp4`);
          await submitCommunity({ data: { idToken: session.idToken, caption, mediaUrl } });
          setCaption("");
          setFileName("");
          if (fileRef.current) fileRef.current.value = "";
          onPosted?.();
        })()
          .catch((caught) => setError(errorText(caught)))
          .finally(() => setBusy(false));
      }}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-sm font-medium text-teal">
          {(name || "M").charAt(0).toUpperCase()}
        </span>
        <input
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="What's on your mind?"
          className="h-11 flex-1 rounded-full border border-line bg-surface px-4"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-teal" onClick={() => fileRef.current?.click()}>
          <Video className="size-4" />
          Upload Video
        </button>
        <button type="submit" disabled={busy} className="h-10 rounded-full bg-teal px-4 text-sm font-medium text-ink disabled:opacity-50">
          {busy ? "Posting…" : "Post"}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="sr-only"
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
      />
      {fileName ? <p className="mt-2 truncate text-xs text-muted">{fileName}</p> : null}
      {error ? <p className="mt-2 text-sm text-teal">{error}</p> : null}
    </form>
  );
}

export function CommunityFeed({ session, name }: { session: Session; name: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function reload() {
    return listCommunity({ data: { idToken: session.idToken } }).then((result) => setPosts(result.posts as Post[]));
  }

  useEffect(() => {
    void reload().catch((caught) => setError(errorText(caught)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.idToken]);

  return (
    <div className="mx-auto max-w-xl px-3 py-4">
      <h1 className="px-1 font-display text-3xl">Community Contents</h1>
      <p className="mt-1 px-1 text-sm text-muted">Videos from members, newest first.</p>
      <div className="mt-4">
        <CommunityComposer
          session={session}
          name={name}
          onPosted={() => {
            void reload().catch((caught) => setError(errorText(caught)));
          }}
        />
      </div>
      {error ? <p className="mt-3 text-sm text-teal">{error}</p> : null}
      <div className="mt-4 space-y-3">
        {posts.length === 0 ? <p className="py-10 text-center text-sm text-muted">No videos yet. Upload the first one.</p> : null}
        {posts.map((post) => (
          <article key={post.id} className="overflow-hidden rounded-2xl border border-line bg-raise">
            <header className="flex items-center gap-3 px-4 py-3">
              <span className="grid size-10 place-items-center rounded-full bg-surface text-sm font-medium text-teal">
                {(post.name || "M").charAt(0).toUpperCase()}
              </span>
              <span>
                <span className="block text-sm font-medium">{post.name}</span>
                <span className="block text-xs text-muted">{ago(post.createdAt)}</span>
              </span>
            </header>
            <p className="px-4 pb-3 text-sm">{post.caption}</p>
            <video src={post.mediaUrl} controls playsInline className="max-h-[70dvh] w-full bg-black" />
            <p className="px-4 pt-2 text-xs text-muted">{post.likes} {post.likes === 1 ? "like" : "likes"} · {post.comments.length} comments</p>
            <div className="mt-1 grid grid-cols-2 border-y border-line">
              <button
                type="button"
                className={`flex h-11 items-center justify-center gap-2 text-sm ${post.liked ? "text-teal" : "text-muted"}`}
                onClick={() => {
                  void likeCommunity({ data: { idToken: session.idToken, postId: post.id } })
                    .then((next) => {
                      setPosts((rows) => rows.map((row) => (row.id === post.id ? { ...row, likes: next.likes, liked: next.liked } : row)));
                    })
                    .catch((caught) => setError(errorText(caught)));
                }}
              >
                <ThumbsUp className="size-4" /> Like
              </button>
              <button type="button" className="flex h-11 items-center justify-center gap-2 text-sm text-muted" onClick={() => document.getElementById(`c-${post.id}`)?.focus()}>
                <MessageCircle className="size-4" /> Comment
              </button>
            </div>
            <ul className="space-y-2 px-4 py-3">
              {post.comments.map((comment) => (
                <li key={comment.id} className="rounded-2xl bg-surface px-3 py-2 text-sm">
                  <span className="font-medium">{comment.name}</span> {comment.text}
                </li>
              ))}
            </ul>
            <form
              className="flex gap-2 px-4 pb-4"
              onSubmit={(event) => {
                event.preventDefault();
                const text = drafts[post.id]?.trim() ?? "";
                if (!text) return;
                void commentCommunity({ data: { idToken: session.idToken, postId: post.id, text } })
                  .then((next) => {
                    setPosts((rows) => rows.map((row) => (row.id === post.id ? { ...row, comments: next.comments } : row)));
                    setDrafts((current) => ({ ...current, [post.id]: "" }));
                  })
                  .catch((caught) => setError(errorText(caught)));
              }}
            >
              <input
                id={`c-${post.id}`}
                value={drafts[post.id] ?? ""}
                onChange={(event) => setDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                placeholder="Write a comment…"
                className="h-10 flex-1 rounded-full border border-line bg-surface px-4 text-sm"
              />
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}

export function HomeUpload({ session, name }: { session: Session; name: string }) {
  const navigate = useNavigate();
  return (
    <section className="mt-4">
      <CommunityComposer session={session} name={name} onPosted={() => void navigate({ to: "/community" })} />
    </section>
  );
}
