import { Link } from "@tanstack/react-router";

export function GetStarted() {
  return (
    <main className="flex min-h-dvh flex-col bg-canvas px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] text-fg">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center text-center">
        <span className="grid size-20 place-items-center rounded-3xl border border-teal bg-[#2a2a2a] shadow-[0_0_40px_rgba(212,175,55,0.25)]">
          <span className="font-display text-3xl text-teal">AI</span>
        </span>
        <h1 className="mt-8 font-display text-4xl">AI Master Plan</h1>
        <p className="mt-3 max-w-xs text-sm text-muted">Your complete guide to using AI effectively.</p>
        <div className="relative mt-10 w-full overflow-hidden rounded-[2rem] border border-line bg-raise px-6 py-8">
          <svg viewBox="0 0 240 180" className="mx-auto h-44 w-full" aria-hidden>
            <ellipse cx="120" cy="150" rx="70" ry="12" fill="#d4af37" opacity="0.18" />
            <rect x="78" y="48" width="84" height="64" rx="28" fill="#2a2a2a" stroke="#d4af37" strokeWidth="3" />
            <circle cx="104" cy="74" r="6" fill="#f3e2a6" />
            <circle cx="136" cy="74" r="6" fill="#f3e2a6" />
            <path d="M108 92c8 8 16 8 24 0" fill="none" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
            <rect x="108" y="112" width="24" height="10" rx="4" fill="#d4af37" />
            <rect x="36" y="118" width="70" height="42" rx="6" fill="#1e1e1e" stroke="#d4af37" />
            <rect x="44" y="126" width="54" height="26" rx="3" fill="#d4af37" opacity="0.25" />
          </svg>
          <p className="text-sm text-muted">Walkthrough videos, short guides, and the tools to use AI properly.</p>
        </div>
        <Link to="/join" className="mt-auto flex h-14 w-full items-center justify-center rounded-full bg-teal text-base font-medium text-ink">
          Get Started
        </Link>
        <p className="mt-4 text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-teal">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
