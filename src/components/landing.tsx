import { Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/shell";
import { captureReferralFromUrl } from "@/lib/referral-cookie";

function useDesktop() {
  const [desktop, setDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return desktop;
}

export function Landing() {
  const desktop = useDesktop();
  const [toEntry, setToEntry] = useState(false);
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (!ref) return;
    captureReferralFromUrl();
    setToEntry(true);
  }, []);
  if (toEntry) return <Navigate to="/join" />;
  const src = desktop === null ? undefined : desktop ? "/landing/pc.mp4" : "/landing/mobile.mp4";
  return (
    <main className="flex min-h-dvh flex-col bg-canvas text-fg">
      <header className="sticky top-0 z-10 hidden border-b border-line bg-canvas md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/login" className="inline-flex h-11 items-center rounded-full px-3 text-sm text-muted hover:text-fg">
              Sign in
            </Link>
            <Link to="/join" className="inline-flex h-11 items-center rounded-full bg-teal px-5 text-sm font-medium text-ink">
              Join
            </Link>
          </div>
        </div>
      </header>
      <header className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden">
        <Logo compact />
        <Link to="/login" className="text-sm font-medium text-teal">
          Sign in
        </Link>
      </header>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-0 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:items-center md:px-8 md:py-14 md:pb-14">
        <div className="w-full md:max-w-5xl md:overflow-hidden md:rounded-[1.75rem] md:bg-canvas md:shadow-float">
          <div className="relative aspect-[9/16] w-full md:aspect-video">
            <video
              key={src}
              className="absolute inset-0 h-full w-full bg-canvas object-cover md:object-contain"
              src={src}
              controls
              playsInline
              preload="metadata"
            >
              Your browser cannot play this video.
            </video>
          </div>
        </div>
        <div className="mt-6 max-w-xl px-5 text-left md:mt-10 md:px-0 md:text-center">
          <p className="text-sm font-medium text-teal">One tool. Every morning.</p>
          <h1 className="mt-2 font-display text-3xl leading-tight md:text-6xl">A new AI tool, taught before lunch.</h1>
          <p className="mt-3 text-sm text-muted md:mt-4 md:text-base">Watch the film, then open a desk.</p>
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-raise px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <Link to="/join" className="flex h-12 items-center justify-center rounded-full bg-teal font-medium text-ink">
          Create your desk
        </Link>
      </div>
    </main>
  );
}
