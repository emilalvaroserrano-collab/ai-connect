import { Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/shell";
import { useConnect } from "@/lib/connect";
import { googleError, signInWithGoogle } from "@/lib/firebase-client";
import { errorText } from "@/lib/manila";
import { captureReferralFromUrl } from "@/lib/referral-cookie";
import type { UserPublic } from "@/lib/types";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="currentColor"
        d="M12 11v2.4h6.6c-.3 1.6-1.8 4.6-6.6 4.6A7 7 0 1 1 12 5a6.7 6.7 0 0 1 4.7 1.8l1.8-1.8A9.8 9.8 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.6 0-1.1-.1-1.6H12z"
      />
    </svg>
  );
}

export function AuthPanel({ mode }: { mode: "login" | "join" }) {
  const navigate = useNavigate();
  const { signInEmail, signUpEmail, adopt } = useConnect();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"email" | "google" | null>(null);

  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  function go(profile: UserPublic) {
    void navigate({ to: profile.membershipStatus === "active" ? "/" : "/checkout" });
  }

  async function onEmail(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending("email");
    try {
      const profile =
        mode === "login"
          ? await signInEmail(email, password)
          : await signUpEmail({ name, email, phone, password });
      go(profile);
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setPending(null);
    }
  }

  async function onGoogle() {
    setError("");
    if (mode === "join" && phone.replace(/\D/g, "").length < 10) {
      setError("Enter a mobile number with at least 10 digits.");
      return;
    }
    setPending("google");
    try {
      const session = await signInWithGoogle();
      const profile = await adopt(
        {
          idToken: session.idToken,
          refreshToken: session.refreshToken,
          uid: session.uid,
          email: session.email,
          expiresAt: session.expiresAt,
        },
        session.name,
        mode === "join" ? phone : undefined,
      );
      go(profile);
    } catch (caught) {
      const code = caught && typeof caught === "object" && "code" in caught;
      setError(code ? googleError(caught) : errorText(caught));
    } finally {
      setPending(null);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-canvas px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] md:grid md:place-items-center md:py-16">
      <div className="mx-auto w-full max-w-md md:rounded-[1.75rem] md:bg-raise md:px-8 md:py-10 md:shadow-float">
        <Link to="/" aria-label="Home">
          <Logo />
        </Link>
        <h1 className="mt-8 font-display text-3xl md:text-4xl">{mode === "join" ? "Create your account" : "Welcome back"}</h1>
        {mode === "join" ? (
          <p className="mt-4 text-sm text-muted">
            Next you’ll see your sponsor. They give you the code that activates this account.
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted">Use the email or Google account you joined with.</p>
        )}
        <form onSubmit={onEmail} className="mt-6 space-y-3">
          {mode === "join" ? (
            <label className="block text-sm">
              Name
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 text-fg"
              />
            </label>
          ) : null}
          <label className="block text-sm">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 text-fg"
            />
          </label>
          {mode === "join" ? (
            <label className="block text-sm">
              Mobile
              <input
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="09…"
                className="mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 text-fg"
              />
            </label>
          ) : null}
          <label className="block text-sm">
            Password
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "join" ? "new-password" : "current-password"}
              className="mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 text-fg"
            />
          </label>
          {error ? <p className="text-sm text-teal">{error}</p> : null}
          <button
            type="submit"
            disabled={pending !== null}
            className="h-12 w-full rounded-full bg-teal font-medium text-ink disabled:opacity-60"
          >
            {pending === "email" ? "Please wait…" : mode === "join" ? "Create account" : "Sign in"}
          </button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" />
          or
          <span className="h-px flex-1 bg-line" />
        </div>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => void onGoogle()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-raise font-medium disabled:opacity-60"
        >
          <GoogleGlyph />
          {pending === "google" ? "Opening Google…" : "Continue with Google"}
        </button>
        <p className="mt-6 text-sm text-muted">
          {mode === "join" ? (
            <>
              Already joined?{" "}
              <Link to="/login" className="text-teal">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link to="/join" className="text-teal">
                Create a desk
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
