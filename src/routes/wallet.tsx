import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Splash } from "@/components/shell";
import { getWallet, payout } from "@/lib/connect.functions";
import { useConnect } from "@/lib/connect";
import { DIRECT_BONUS, LEVEL_BONUS, PAYOUT_MIN } from "@/lib/firebase-config";
import { errorText, peso } from "@/lib/manila";
import type { WalletView } from "@/lib/types";

export const Route = createFileRoute("/wallet")({ component: WalletPage });

const labels: Record<string, string> = {
  referral_bonus: "Direct referral",
  unilevel: "Unilevel",
  payout: "Payout",
  creator_share: "Creator share",
  affiliate_commission: "Affiliate commission",
  adjustment: "Adjustment",
};

function WalletPage() {
  const { ready, session, profile, setProfile } = useConnect();
  const [view, setView] = useState<WalletView | null>(null);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(PAYOUT_MIN);
  const [method, setMethod] = useState<"gcash" | "maya">("gcash");
  const [account, setAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!session) return;
    let cancel = false;
    void getWallet({ data: { idToken: session.idToken } })
      .then((next) => {
        if (cancel) return;
        setView(next);
        setProfile(next.profile);
        const saved = next.profile.payoutMethod;
        if (saved) {
          setMethod(saved.method);
          setAccount(saved.account);
          setAccountName(saved.accountName);
        }
        setAmount(next.available >= PAYOUT_MIN ? next.available : PAYOUT_MIN);
      })
      .catch((caught) => {
        if (!cancel) setError(errorText(caught));
      });
    return () => {
      cancel = true;
    };
  }, [session, setProfile]);

  if (!ready) return <Splash />;
  if (!session || !profile) return <Navigate to="/login" />;
  if (profile.membershipStatus !== "active") return <Navigate to="/checkout" />;

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-5 py-6 md:px-8">
        <h1 className="font-display text-4xl">Wallet</h1>
        {error ? <p className="mt-4 text-sm text-teal">{error}</p> : null}
        {view ? (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-raise p-4">
                <p className="text-sm text-muted">Total accumulated income</p>
                <p className="font-display text-4xl tabular-nums">{peso(view.accumulated)}</p>
              </div>
              <div className="rounded-3xl bg-raise p-4">
                <p className="text-sm text-muted">Available for payout</p>
                <p className="font-display text-4xl tabular-nums">{peso(view.available)}</p>
                {view.pendingPayout > 0 ? (
                  <p className="mt-1 text-sm text-muted">{peso(view.pendingPayout)} requested, not paid yet.</p>
                ) : null}
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Direct, paid", String(view.directPaid)],
                ["Waiting to join", String(view.directPending)],
                ["Referral paid", peso(view.directBonus)],
                ["Accruing", peso(view.accruing)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-surface p-3">
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="mt-1 text-lg tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted">
              {peso(DIRECT_BONUS)} from a direct join is available immediately. {peso(LEVEL_BONUS)} unilevel posts on the 1st (Manila). Line size: {view.teamSize}.
            </p>
            <form
              className="mt-8 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (!session) return;
                setPending(true);
                setNote("");
                void payout({
                  data: {
                    idToken: session.idToken,
                    amount,
                    method,
                    account,
                    phone: account,
                    accountName,
                  },
                })
                  .then(() => getWallet({ data: { idToken: session.idToken } }))
                  .then((next) => {
                    setView(next);
                    setProfile(next.profile);
                    setNote("Requested. The balance stays until the admin marks it paid.");
                  })
                  .catch((caught) => setNote(errorText(caught)))
                  .finally(() => setPending(false));
              }}
            >
              <p className="text-sm">Payout account</p>
              <div className="flex gap-2">
                {(["gcash", "maya"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMethod(option)}
                    className={`h-11 rounded-full px-4 text-sm font-medium ${method === option ? "bg-teal text-ink" : "bg-raise text-fg"}`}
                  >
                    {option === "gcash" ? "GCash" : "Maya"}
                  </button>
                ))}
              </div>
              <input
                required
                value={account}
                onChange={(event) => setAccount(event.target.value)}
                placeholder={method === "gcash" ? "GCash account number" : "Maya account number"}
                className="h-12 w-full rounded-xl border border-line bg-raise px-3"
              />
              <input
                required
                value={accountName}
                onChange={(event) => setAccountName(event.target.value)}
                placeholder={method === "gcash" ? "GCash account name" : "Maya account name"}
                className="h-12 w-full rounded-xl border border-line bg-raise px-3"
              />
              <label className="block text-sm">
                Amount
                <input
                  type="number"
                  min={PAYOUT_MIN}
                  max={view.available}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3 sm:w-40"
                />
              </label>
              <button
                type="submit"
                disabled={pending || view.available < PAYOUT_MIN}
                className="h-12 rounded-full bg-teal px-5 font-medium text-ink disabled:opacity-50"
              >
                {pending ? "Sending…" : "Request payout"}
              </button>
            </form>
            {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
            <h2 className="mt-10 font-display text-2xl">History</h2>
            {view.transactions.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Share your link. {peso(DIRECT_BONUS)} lands the moment they join.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {view.transactions.map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between py-3">
                    <div>
                      <p>{labels[tx.type]}</p>
                      <p className="text-sm text-muted">
                        {tx.note} · {tx.status === "scheduled" ? "Posts on the 1st" : tx.status === "requested" ? "Waiting for admin" : tx.status}
                      </p>
                    </div>
                    <p className="tabular-nums">
                      {tx.type === "payout" && tx.status === "paid" ? "−" : tx.type === "payout" ? "" : "+"}
                      {peso(Math.abs(tx.amount))}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="mt-6 text-sm text-muted">Loading wallet…</p>
        )}
      </div>
    </Shell>
  );
}
