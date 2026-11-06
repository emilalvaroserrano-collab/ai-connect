import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FieldIcon, FacebookIcon, PhoneIcon, SponsorDetails, WhatsAppIcon } from "@/components/contact-icons";
import { Shell, Splash } from "@/components/shell";
import { getNetwork, getWallet, listCodes, place, saveContact } from "@/lib/connect.functions";
import { useConnect } from "@/lib/connect";
import { DIRECT_BONUS, LEVEL_BONUS } from "@/lib/firebase-config";
import { errorText, peso } from "@/lib/manila";
import type { NetworkView, TreeNode, WalletView } from "@/lib/types";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function flatten(node: TreeNode, depth = 0): { uid: string; name: string; depth: number }[] {
  return [{ uid: node.uid, name: node.name, depth }, ...node.children.flatMap((child) => flatten(child, depth + 1))];
}

function Branch({ node }: { node: TreeNode }) {
  return (
    <li className="mt-3">
      <p>
        {node.name}{" "}
        <span className="text-sm text-muted">{node.level === 0 ? "you" : `level ${node.level}`}</span>
      </p>
      {node.children.length > 0 ? (
        <ul className="ml-4 border-l border-line pl-4">
          {node.children.map((child) => (
            <Branch key={child.uid} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function ProfilePage() {
  const { ready, session, profile, setProfile, signOut } = useConnect();
  const [network, setNetwork] = useState<NetworkView | null>(null);
  const [wallet, setWallet] = useState<WalletView | null>(null);
  const [recruitUid, setRecruitUid] = useState("");
  const [parentUid, setParentUid] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [alerts, setAlerts] = useState("Alerts off");
  const [stock, setStock] = useState<string[]>([]);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setAlerts(Notification.permission === "granted" ? "Alerts on" : "Alerts off");
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancel = false;
    void getNetwork({ data: { idToken: session.idToken } })
      .then((next) => {
        if (cancel) return;
        setNetwork(next);
        setParentUid(next.profile.uid);
      })
      .catch((caught) => {
        if (!cancel) setError(errorText(caught));
      });
    return () => {
      cancel = true;
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;
    let cancel = false;
    void getWallet({ data: { idToken: session.idToken } })
      .then((next) => {
        if (!cancel) setWallet(next);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;
    let cancel = false;
    void listCodes({ data: { idToken: session.idToken } })
      .then((result) => {
        if (!cancel) setStock(result.codes);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [session]);

  if (!ready) return <Splash />;
  if (!session || !profile) return <Navigate to="/" />;
  if (profile.membershipStatus !== "active") return <Navigate to="/checkout" />;

  const link = profile.referralCode ? `${window.location.origin}/join?ref=${profile.referralCode}` : "";
  const unplaced = (network?.recruits ?? []).filter(
    (recruit) => recruit.membershipStatus === "active" && !recruit.placed,
  );
  const parents = network ? flatten(network.tree) : [];

  const unilevelRows = (wallet?.transactions ?? []).filter((tx) => tx.type === "unilevel");

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-5 py-6 md:px-8">
        <div className="md:hidden">
          <section className="rounded-3xl border border-line bg-raise p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Wallet</p>
            <p className="mt-2 text-sm text-muted">Total accumulated</p>
            <p className="font-display text-4xl tabular-nums">{wallet ? peso(wallet.accumulated) : "—"}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-surface p-3">
                <p className="text-xs text-muted">Available</p>
                <p className="mt-1 text-lg tabular-nums">{wallet ? peso(wallet.available) : "—"}</p>
              </div>
              <div className="rounded-2xl bg-surface p-3">
                <p className="text-xs text-muted">Requested</p>
                <p className="mt-1 text-lg tabular-nums">{wallet ? peso(wallet.pendingPayout) : "—"}</p>
              </div>
            </div>
          </section>
          <section className="mt-3 rounded-3xl border border-line bg-raise p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-medium">Unilevel</h2>
              <p className="text-sm text-teal">{wallet ? peso(wallet.accruing) : "—"}</p>
            </div>
            <p className="mt-1 text-xs text-muted">{peso(LEVEL_BONUS)} per level, up to 10. Posts on the 1st. Line size {wallet?.teamSize ?? 0}.</p>
            <dl className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-surface p-3">
                <dt className="text-xs text-muted">Direct paid</dt>
                <dd className="mt-1 tabular-nums">{wallet?.directPaid ?? 0}</dd>
              </div>
              <div className="rounded-2xl bg-surface p-3">
                <dt className="text-xs text-muted">Referral paid</dt>
                <dd className="mt-1 tabular-nums">{wallet ? peso(wallet.directBonus) : "—"}</dd>
              </div>
            </dl>
            {unilevelRows.length > 0 ? (
              <ul className="mt-3 divide-y divide-line">
                {unilevelRows.slice(0, 6).map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-muted">{tx.status === "scheduled" ? "Posts on the 1st" : tx.status}</span>
                    <span className="tabular-nums">{peso(tx.amount)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">No unilevel yet. Place a recruit to schedule {peso(LEVEL_BONUS)}.</p>
            )}
          </section>
          <section className="mt-3 rounded-3xl border border-line bg-raise p-4">
            <h2 className="text-base font-medium">Downline genealogy</h2>
            {network ? (
              <ul className="mt-2">
                <Branch node={network.tree} />
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">Loading the line…</p>
            )}
          </section>
        </div>
        <h1 className="mt-6 font-display text-4xl md:mt-0">{profile.name || "Member"}</h1>
        <p className="mt-1 text-muted">{profile.email}</p>
        <p className="mt-4 text-sm">
          Membership{" "}
          <span className="text-teal">{profile.membershipStatus === "active" ? "active" : "inactive"}</span>
          {profile.phone ? ` · ${profile.phone}` : ""}
        </p>
        <form
          className="mt-6 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            setPending(true);
            setError("");
            void saveContact({
              data: {
                idToken: session.idToken,
                phone: String(form.get("phone") ?? ""),
                facebook: String(form.get("facebook") ?? ""),
                whatsapp: String(form.get("whatsapp") ?? ""),
              },
            })
              .then((next) => {
                setProfile(next);
                toast("Contact saved. New visitors from your link can reach you.");
              })
              .catch((caught) => setError(errorText(caught)))
              .finally(() => setPending(false));
          }}
        >
          <h2 className="font-display text-2xl">How recruits reach you</h2>
          <p className="text-sm text-muted">These icons show on their activation page. Leave a field blank to hide that icon.</p>
          <label className="flex items-center gap-3 text-sm">
            <FieldIcon><PhoneIcon /></FieldIcon>
            <input name="phone" defaultValue={profile.phone} autoComplete="tel" placeholder="Mobile number" className="h-11 w-full rounded-xl border border-line bg-raise px-3" />
          </label>
          <label className="flex items-center gap-3 text-sm">
            <FieldIcon><span className="text-[#1877F2]"><FacebookIcon /></span></FieldIcon>
            <input name="facebook" defaultValue={profile.facebook ?? ""} placeholder="facebook.com/your-name" className="h-11 w-full rounded-xl border border-line bg-raise px-3" />
          </label>
          <label className="flex items-center gap-3 text-sm">
            <FieldIcon><span className="text-[#25D366]"><WhatsAppIcon /></span></FieldIcon>
            <input name="whatsapp" defaultValue={profile.whatsapp ?? ""} placeholder="WhatsApp number or link" className="h-11 w-full rounded-xl border border-line bg-raise px-3" />
          </label>
          <button type="submit" disabled={pending} className="h-11 w-fit rounded-full bg-teal px-4 font-medium text-ink disabled:opacity-50">
            Save contact
          </button>
        </form>
        <div className="mt-4 overflow-hidden rounded-3xl border border-line">
          <SponsorDetails
            card={{
              name: profile.name,
              phone: profile.phone || "",
              facebook: profile.facebook || "",
              whatsapp: profile.whatsapp || "",
            }}
          />
          <p className="px-5 pb-4 text-sm text-muted">This is what someone sees after they open this account’s link. Saving here does not change a different login.</p>
        </div>
        <section className="mt-8">
          <h2 className="font-display text-2xl">Your link</h2>
          {profile.referralCode ? (
            <>
              <p className="mt-2 break-all text-sm text-muted">{link}</p>
              <p className="mt-1 font-display text-3xl tracking-wide text-teal">{profile.referralCode}</p>
              <button
                type="button"
                className="mt-3 h-11 rounded-full bg-teal px-4 font-medium text-ink"
                onClick={() => {
                  void navigator.clipboard.writeText(link).then(() => toast("Link copied"));
                }}
              >
                Copy link
              </button>
              <p className="mt-3 text-sm text-muted">
                The first person to open this link keeps you as their sponsor for 1 month. They activate with a code from the admin. That code does not change their sponsor.
              </p>
              {stock.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-sm text-muted">Older codes already in your stock</h3>
                  <ul className="mt-2 space-y-2">
                    {stock.map((code) => (
                      <li key={code} className="font-display text-2xl tracking-widest text-teal">
                        {code}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">Your code is minted when membership is active.</p>
          )}
        </section>
        <section className="mt-10">
          <h2 className="font-display text-2xl">Place a recruit</h2>
          {unplaced.length === 0 ? (
            <p className="mt-2 text-sm text-muted">When someone active joins with your link, they show up here until you place them.</p>
          ) : (
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setPending(true);
                setError("");
                void place({ data: { idToken: session.idToken, recruitUid, parentUid } })
                  .then((next) => {
                    setNetwork(next);
                    setRecruitUid("");
                    toast(`Placed. ${peso(LEVEL_BONUS)} is scheduled up to ten levels.`);
                  })
                  .catch((caught) => setError(errorText(caught)))
                  .finally(() => setPending(false));
              }}
            >
              <label className="block text-sm">
                Who
                <select
                  required
                  value={recruitUid}
                  onChange={(event) => setRecruitUid(event.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3"
                >
                  <option value="">Select</option>
                  {unplaced.map((recruit) => (
                    <option key={recruit.uid} value={recruit.uid}>
                      {recruit.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Under
                <select
                  required
                  value={parentUid}
                  onChange={(event) => setParentUid(event.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-line bg-raise px-3"
                >
                  {parents.map((parent) => (
                    <option key={parent.uid} value={parent.uid}>
                      {"· ".repeat(parent.depth)}
                      {parent.depth === 0 ? "Directly under me" : parent.name}
                    </option>
                  ))}
                </select>
              </label>
              {error ? <p className="text-sm text-teal">{error}</p> : null}
              <button
                type="submit"
                disabled={pending}
                className="h-12 rounded-full bg-teal px-5 font-medium text-ink disabled:opacity-50"
              >
                {pending ? "Placing…" : "Place"}
              </button>
            </form>
          )}
        </section>
        <section className="mt-10 hidden md:block">
          <h2 className="font-display text-2xl">Your line</h2>
          {network ? (
            <ul className="mt-2">
              <Branch node={network.tree} />
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Loading the line…</p>
          )}
        </section>
        <section className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            className="h-11 rounded-full bg-surface px-4"
            onClick={() => {
              if (typeof Notification === "undefined") return;
              void Notification.requestPermission().then((permission) => {
                setAlerts(permission === "granted" ? "Alerts on" : "Alerts off");
              });
            }}
          >
            {alerts}
          </button>
          <button
            type="button"
            className="h-11 rounded-full px-4 text-muted"
            onClick={() => {
              void signOut();
            }}
          >
            Sign out
          </button>
        </section>
      </div>
    </Shell>
  );
}
