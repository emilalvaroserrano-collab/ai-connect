import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { VOICES } from "@/lib/vapi-preset";

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
      persona: z
        .string()
        .trim()
        .max(40)
        .optional()
        .transform((value) => value || "Mike"),
      business: z.string().trim().max(80).optional().transform((value) => value || "TechSolutions"),
      offer: z.string().trim().max(400).optional().transform((value) => value || ""),
      contact: z.string().trim().max(120).optional().transform((value) => value || ""),
      hours: z.string().max(80).optional().transform((value) => value || ""),
      languages: z.string().max(80).optional().transform((value) => value || ""),
      refund: z.string().max(240).optional().transform((value) => value || ""),
      firstMessage: z.string().trim().max(600).optional(),
      voicemailMessage: z.string().trim().max(600).optional(),
      endCallMessage: z.string().trim().max(600).optional(),
      voiceId: z.enum(VOICES).optional(),
      systemPrompt: z.string().trim().max(12000).optional(),
      plan: z.enum(["use", "sell", "rent"]),
      price: z.string().max(40).optional().transform((value) => value || ""),
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
