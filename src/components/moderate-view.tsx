import { useEffect, useState } from "react";
import { confirmOrder, loadModeration, moderatePost, recordRevenue } from "@/lib/studio.functions";
import { errorText } from "@/lib/manila";
import type { StudioProduct } from "@/lib/studio/catalog";
import type { Session } from "@/lib/types";

type Post = {
  id: string;
  title: string;
  creatorName: string;
  status: string;
  flags: string[];
  caption: string;
  creatorCode: string;
};

export function ModerateView({ session }: { session: Session }) {
  const [allowed, setAllowed] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<StudioProduct[]>([]);
  const [note, setNote] = useState("");
  const [comment, setComment] = useState("");
  const [orderId, setOrderId] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [productCode, setProductCode] = useState("lamp");
  const [sale, setSale] = useState(1000);
  const [reportId, setReportId] = useState("");
  const [postId, setPostId] = useState("");
  const [gross, setGross] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [earningStatus, setEarningStatus] = useState<"estimated" | "confirmed">("estimated");

  function reload() {
    return loadModeration({ data: { idToken: session.idToken } }).then((result) => {
      setAllowed(result.allowed);
      setPosts(result.posts as Post[]);
      setProducts(result.products);
    });
  }

  useEffect(() => {
    void reload().catch((caught) => setNote(errorText(caught)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.idToken]);

  if (!allowed) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <h1 className="font-display text-4xl">Moderation is closed</h1>
        <p className="mt-2 text-sm text-muted">Another desk lead already holds this queue.</p>
      </div>
    );
  }

  const queue = posts.filter((post) => post.status === "queued" || post.status === "changes");

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 md:px-8">
      <p className="text-sm text-teal">Moderation desk</p>
      <h1 className="font-display text-4xl">A person decides</h1>
      <p className="mt-2 text-sm text-muted">
        Screening flags are not a legal clearance. Approving creates one publishing job per platform. Those jobs stay unsent until an official TikTok, YouTube, or Facebook account is connected on the server. If you are the only moderator, you may clear your own post; once a second lead exists, you cannot.
      </p>
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
      <ul className="mt-6 space-y-4">
        {queue.length === 0 ? <li className="text-sm text-muted">Queue is clear.</li> : null}
        {queue.map((post) => (
          <li key={post.id} className="rounded-3xl bg-raise p-4">
            <p className="text-xs text-muted">
              {post.creatorName} · {post.creatorCode} · {post.status}
              {post.flags?.length ? ` · ${post.flags.join(", ")}` : ""}
            </p>
            <h2 className="font-display text-2xl">{post.title}</h2>
            <p className="mt-2 text-sm">{post.caption}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["approve", "changes", "reject"] as const).map((action) => (
                <button
                  key={action}
                  type="button"
                  className="h-10 rounded-full bg-surface px-4 text-sm"
                  onClick={() => {
                    void moderatePost({ data: { idToken: session.idToken, postId: post.id, action, note: comment } })
                      .then(() => {
                        setNote(action === "approve" ? "Approved. Platforms are still not connected." : "Decision saved.");
                        return reload();
                      })
                      .catch((caught) => setNote(errorText(caught)));
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <label className="mt-4 block text-sm">
        Note for the creator
        <input value={comment} onChange={(event) => setComment(event.target.value)} className="mt-1 h-11 w-full rounded-xl border border-line bg-raise px-3" />
      </label>

      <h2 className="mt-10 font-display text-2xl">Merchant order</h2>
      <p className="mt-1 text-sm text-muted">Use the merchant’s order id. Sending the same id again does not pay twice.</p>
      <form
        className="mt-3 grid gap-3 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const eventName = (form.elements.namedItem("event") as HTMLSelectElement).value as "confirmed" | "refunded" | "cancelled";
          void confirmOrder({
            data: {
              idToken: session.idToken,
              orderId,
              memberCode: memberCode.toUpperCase(),
              productCode,
              salePesos: sale,
              event: eventName,
            },
          })
            .then((result) => setNote(`Order ${result.action}. Member amount $${result.member}.`))
            .catch((caught) => setNote(errorText(caught)));
        }}
      >
        <input required placeholder="Order id" value={orderId} onChange={(event) => setOrderId(event.target.value)} className="h-11 rounded-xl border border-line bg-raise px-3" />
        <input required placeholder="Member code" value={memberCode} onChange={(event) => setMemberCode(event.target.value)} className="h-11 rounded-xl border border-line bg-raise px-3" />
        <select value={productCode} onChange={(event) => setProductCode(event.target.value)} className="h-11 rounded-xl border border-line bg-raise px-3">
          {products.map((product) => (
            <option key={product.code} value={product.code}>
              {product.name}
            </option>
          ))}
        </select>
        <input type="number" min={1} value={sale} onChange={(event) => setSale(Number(event.target.value))} className="h-11 rounded-xl border border-line bg-raise px-3" />
        <select name="event" className="h-11 rounded-xl border border-line bg-raise px-3">
          <option value="confirmed">confirmed</option>
          <option value="refunded">refunded</option>
          <option value="cancelled">cancelled</option>
        </select>
        <button type="submit" className="h-11 rounded-full bg-teal px-5 font-medium text-ink">
          Record order
        </button>
      </form>

      <h2 className="mt-10 font-display text-2xl">Creator revenue</h2>
      <p className="mt-1 text-sm text-muted">Confirmed posts half of net to the wallet. Estimated does not.</p>
      <form
        className="mt-3 grid gap-3 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void recordRevenue({
            data: {
              idToken: session.idToken,
              reportId,
              postId,
              gross,
              deductions,
              source: "configured-revenue",
              status: earningStatus,
            },
          })
            .then((result) => setNote(result.applied ? `${result.status} share $${result.share}.` : "That report id was already recorded."))
            .catch((caught) => setNote(errorText(caught)));
        }}
      >
        <input required placeholder="Report id" value={reportId} onChange={(event) => setReportId(event.target.value)} className="h-11 rounded-xl border border-line bg-raise px-3" />
        <select value={postId} onChange={(event) => setPostId(event.target.value)} className="h-11 rounded-xl border border-line bg-raise px-3">
          <option value="">Post</option>
          {posts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>
        <input type="number" min={0} value={gross} onChange={(event) => setGross(Number(event.target.value))} className="h-11 rounded-xl border border-line bg-raise px-3" aria-label="Gross dollars" />
        <input type="number" min={0} value={deductions} onChange={(event) => setDeductions(Number(event.target.value))} className="h-11 rounded-xl border border-line bg-raise px-3" aria-label="Deductions" />
        <select value={earningStatus} onChange={(event) => setEarningStatus(event.target.value as "estimated" | "confirmed")} className="h-11 rounded-xl border border-line bg-raise px-3">
          <option value="estimated">estimated</option>
          <option value="confirmed">confirmed</option>
        </select>
        <button type="submit" className="h-11 rounded-full bg-teal px-5 font-medium text-ink">
          Record revenue
        </button>
      </form>
    </div>
  );
}
