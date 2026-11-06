import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/shell";

const points = ["Walkthroughs", "Short guides", "Real tools"];

export function GetStarted() {
  return (
    <main className="start-bg relative flex min-h-dvh flex-col overflow-hidden px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.75rem,env(safe-area-inset-top))] text-fg">
      <div className="pointer-events-none absolute -left-16 top-24 size-56 rounded-full bg-[#d4af37]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 size-64 rounded-full bg-white/10 blur-3xl" />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col">
        <Logo />
        <div className="mt-16">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#f3e2a6]">Learn · Apply · Master</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] text-white">
            Use AI
            <span className="mt-1 block text-[#f3e2a6]">the right way.</span>
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/70">
            A clear path from first prompt to real work. Videos, guides, and the tools that actually matter.
          </p>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2">
          {points.map((point) => (
            <li key={point} className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-sm text-white/80 backdrop-blur">
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-10">
          <Link to="/join" className="flex h-14 w-full items-center justify-center rounded-full bg-teal text-base font-medium text-ink">
            Get Started
          </Link>
          <p className="mt-4 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#f3e2a6]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
