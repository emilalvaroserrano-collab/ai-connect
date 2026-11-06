import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Clapperboard,
  Home,
  Layers,
  LineChart,
  Menu,
  Radio,
  Route,
  Shield,
  Sparkles,
  Store,
  UserRound,
  Wallet,
  X,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { getNotices, readNotices } from "@/lib/connect.functions";
import { useConnect } from "@/lib/connect";
import { cn } from "@/lib/cn";
import { SponsorBar } from "@/components/sponsor-bar";
import type { Notice } from "@/lib/types";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-fg">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#2a2a2a" stroke="#d4af37" strokeWidth="1.4" />
        <text x="16" y="21" textAnchor="middle" fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#f3e2a6">
          AI
        </text>
        <path d="M8 24c6-2 10-2 16 0" fill="none" stroke="#d4af37" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {compact ? null : (
        <span className="font-display text-lg leading-none">
          AI <span className="text-teal">Master Plan</span>
        </span>
      )}
    </span>
  );
}

export function Splash() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas">
      <Logo />
    </main>
  );
}

export function Paywall() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-5 py-16">
      <p className="text-sm text-teal">Membership</p>
      <h1 className="mt-2 font-display text-4xl">The desk is locked.</h1>
      <p className="mt-3 text-muted">
        Pay $8.73 directly to your sponsor. They give you a code. The app does not take the money.
      </p>
      <Link
        to="/checkout"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-teal px-6 font-medium text-ink"
      >
        Enter activation code
      </Link>
    </section>
  );
}

const primary = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/learn", label: "Lessons", icon: BookOpen, exact: false },
  { to: "/tools", label: "Tools", icon: Layers, exact: false },
  { to: "/roadmap", label: "Roadmap", icon: Route, exact: true },
] as const;

const profileTab = { to: "/profile", label: "Profile", icon: UserRound, exact: false } as const;

const extra = [
  { to: "/community", label: "Community", hint: "Member videos", icon: Clapperboard, exact: false },
  { to: "/deck", label: "Deck", hint: "Watch or upload a reel", icon: Clapperboard, exact: false },
  { to: "/studio", label: "Studio", hint: "Make a post", icon: Sparkles, exact: false },
  { to: "/live", label: "Live", hint: "Schedule a selling stream", icon: Radio, exact: false },
  { to: "/market", label: "Market", hint: "Products you can share", icon: Store, exact: false },
  { to: "/creator", label: "Creator", hint: "Views and earnings", icon: LineChart, exact: false },
  { to: "/wallet", label: "Wallet", hint: "Balance and payouts", icon: Wallet, exact: false },
  { to: "/moderate", label: "Moderate", hint: "Review the queue", icon: Shield, exact: false },
] as const;

const bottomTabs = [...primary, profileTab];

function screenTitle(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/learn")) return "Lessons";
  if (pathname.startsWith("/tools")) return "Tools";
  if (pathname.startsWith("/roadmap")) return "Roadmap";
  if (pathname.startsWith("/csr") || pathname.includes("/csr/")) return "CSR Agent";
  if (pathname.startsWith("/deck")) return "Deck";
  if (pathname.startsWith("/studio")) return "Studio";
  if (pathname.startsWith("/live")) return "Live";
  if (pathname.startsWith("/market")) return "Market";
  if (pathname.startsWith("/creator")) return "Creator";
  if (pathname.startsWith("/wallet")) return "Wallet";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/moderate")) return "Moderate";
  return "Daily Connect";
}

export function Shell({ children }: { children: ReactNode }) {
  const { session, profile } = useConnect();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!session) return;
    let cancel = false;
    void getNotices({ data: { idToken: session.idToken } })
      .then((result) => {
        if (cancel) return;
        setNotices(result.notifications);
        setUnread(result.unread);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [pathname, session]);

  const initial = (profile?.name || profile?.email || "M").charAt(0).toUpperCase();
  const title = screenTitle(pathname);
  const moreActive = extra.some((tab) => (tab.exact ? pathname === tab.to : pathname.startsWith(tab.to)));

  useEffect(() => {
    setMore(false);
  }, [pathname]);

  return (
    <div className="app-frame relative text-fg">
      <header className="relative z-20 flex shrink-0 flex-col border-b border-line bg-canvas pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-3 md:h-auto md:gap-4 md:px-8 md:py-3 md:pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Link to="/" aria-label="Home" className="shrink-0 md:hidden">
          <Logo compact />
        </Link>
        <p className="min-w-0 flex-1 truncate text-center text-base font-medium md:hidden">{title}</p>
        <Link to="/" aria-label="Home" className="hidden shrink-0 md:inline-flex">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex">
          {bottomTabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.exact }}
              className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-muted hover:bg-surface hover:text-fg"
              activeProps={{ className: "inline-flex h-10 items-center gap-2 rounded-full bg-surface px-3 text-sm text-teal" }}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm",
                moreActive || more ? "bg-surface text-teal" : "text-muted",
              )}
              aria-expanded={more}
              aria-label="More"
              onClick={() => setMore((value) => !value)}
            >
              {more ? <X className="size-4" /> : <Menu className="size-4" />}
              More
            </button>
            {more ? (
              <div className="absolute right-0 top-12 z-30 w-72 rounded-2xl bg-raise p-2 shadow-float">
                {extra.map((tab) => (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-fg"
                  >
                    <tab.icon className="size-4 text-teal" />
                    <span>
                      <span className="block">{tab.label}</span>
                      <span className="block text-xs text-muted">{tab.hint}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="relative grid size-11 place-items-center rounded-full text-fg"
            aria-label={unread ? `${unread} unread notices` : "Notices"}
            onClick={() => setOpen((value) => !value)}
          >
            <Bell className="size-5" />
            {unread > 0 ? <span className="absolute right-2 top-2 size-2 rounded-full bg-teal" /> : null}
          </button>
          <Link
            to="/profile"
            className="grid size-11 place-items-center rounded-full bg-surface font-medium text-teal"
            aria-label="Profile"
          >
            {initial}
          </Link>
        </div>
        {open ? (
          <div className="glass absolute right-4 top-16 hidden w-80 max-w-[calc(100vw-2rem)] rounded-2xl p-3 md:block">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm">Notices</p>
              {unread > 0 && session ? (
                <button
                  type="button"
                  className="text-sm text-teal"
                  onClick={() => {
                    void readNotices({ data: { idToken: session.idToken } }).then((next) => {
                      setNotices(next);
                      setUnread(0);
                    });
                  }}
                >
                  Mark read
                </button>
              ) : null}
            </div>
            {notices.length === 0 ? (
              <p className="px-1 py-6 text-sm text-muted">Referrals and payouts show up here.</p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-auto">
                {notices.map((notice) => (
                  <li key={notice.id} className={cn("rounded-xl px-3 py-2", notice.read ? "opacity-60" : "bg-surface")}>
                    <p className="text-sm">{notice.title}</p>
                    <p className="text-sm text-muted">{notice.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
        </div>
        <SponsorBar />
      </header>
      <div className="app-scroll">{children}</div>
      <nav aria-label="Main" className="z-20 grid shrink-0 grid-cols-5 border-t border-line bg-raise pb-[env(safe-area-inset-bottom)] md:hidden">
        {bottomTabs.map((tab) => {
          const active = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
            >
              <span className={cn("grid h-8 w-14 place-items-center rounded-2xl", active ? "bg-teal/15 text-teal" : "text-muted")}>
                <tab.icon className="size-[22px]" strokeWidth={active ? 2.4 : 1.75} />
              </span>
              <span className={active ? "text-teal" : "text-muted"}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
      {more ? (
        <button type="button" aria-label="Close menu" className="absolute inset-0 z-30 bg-black/55 md:hidden" onClick={() => setMore(false)} />
      ) : null}
      {more ? (
        <div className="absolute inset-x-0 bottom-0 z-40 rounded-t-3xl bg-raise px-2 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 shadow-float md:hidden">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-line" />
          <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted">More</p>
          {extra.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex min-h-14 items-center gap-3 rounded-2xl px-3 text-fg active:bg-surface"
            >
              <span className="grid size-10 place-items-center rounded-full bg-surface text-teal">
                <tab.icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{tab.label}</span>
                <span className="block truncate text-xs text-muted">{tab.hint}</span>
              </span>
              <ChevronRight className="size-4 text-muted" />
            </Link>
          ))}
        </div>
      ) : null}
      {open ? (
        <div className="absolute inset-x-0 top-14 z-40 max-h-[70dvh] overflow-auto border-b border-line bg-raise px-3 py-3 md:hidden">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-sm font-medium">Notices</p>
            {unread > 0 && session ? (
              <button
                type="button"
                className="text-sm text-teal"
                onClick={() => {
                  void readNotices({ data: { idToken: session.idToken } }).then((next) => {
                    setNotices(next);
                    setUnread(0);
                  });
                }}
              >
                Mark read
              </button>
            ) : null}
          </div>
          {notices.length === 0 ? (
            <p className="px-1 py-6 text-sm text-muted">Referrals and payouts show up here.</p>
          ) : (
            <ul className="space-y-2">
              {notices.map((notice) => (
                <li key={notice.id} className={cn("rounded-2xl px-3 py-3", notice.read ? "opacity-60" : "bg-surface")}>
                  <p className="text-sm font-medium">{notice.title}</p>
                  <p className="text-sm text-muted">{notice.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
