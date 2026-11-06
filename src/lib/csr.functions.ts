import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const token = z.string().min(20);

export const listCsr = createServerFn({ method: "POST" })
  .validator(z.object({ idToken: token }))
  .handler(async ({ data }) => {
    const { listCsr: run } = await import("./csr.server");
    return run(data.idToken);
  });

export const saveCsr = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idToken: token,
      persona: z.string().trim().min(1).max(40),
      business: z.string().trim().min(1).max(80),
      offer: z.string().trim().min(1).max(400),
      contact: z.string().trim().min(1).max(120),
      hours: z.string().max(80),
      languages: z.string().max(80),
      refund: z.string().max(240),
      plan: z.enum(["use", "sell", "rent"]),
      price: z.string().max(40),
    }),
  )
  .handler(async ({ data }) => {
    const { saveCsr: run } = await import("./csr.server");
    return run(data);
  });

export const readCsr = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.string().min(6).max(40), slug: z.string().min(4).max(80) }))
  .handler(async ({ data }) => {
    const { readCsr: run } = await import("./csr.server");
    return run(data.userId, data.slug);
  });
