import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const token = z.string().min(20);
const postId = z.string().regex(/^com_[A-Za-z0-9]{8,20}$/);

export const listCommunity = createServerFn({ method: "POST" })
  .validator(z.object({ idToken: token }))
  .handler(async ({ data }) => {
    const { listCommunity: run } = await import("./community.server");
    return run(data.idToken);
  });

export const submitCommunity = createServerFn({ method: "POST" })
  .validator(z.object({ idToken: token, caption: z.string().max(500), mediaUrl: z.string().url().max(500) }))
  .handler(async ({ data }) => {
    const { submitCommunity: run } = await import("./community.server");
    return run(data);
  });

export const likeCommunity = createServerFn({ method: "POST" })
  .validator(z.object({ idToken: token, postId }))
  .handler(async ({ data }) => {
    const { likeCommunity: run } = await import("./community.server");
    return run(data);
  });

export const deleteCommunity = createServerFn({ method: "POST" })
  .validator(z.object({ idToken: token, postId }))
  .handler(async ({ data }) => {
    const { deleteCommunity: run } = await import("./community.server");
    return run(data);
  });

export const editCommunity = createServerFn({ method: "POST" })
  .validator(z.object({ idToken: token, postId, caption: z.string().trim().min(1).max(500) }))
  .handler(async ({ data }) => {
    const { editCommunity: run } = await import("./community.server");
    return run(data);
  });

export const commentCommunity = createServerFn({ method: "POST" })
  .validator(z.object({ idToken: token, postId, text: z.string().trim().min(1).max(280) }))
  .handler(async ({ data }) => {
    const { commentCommunity: run } = await import("./community.server");
    return run(data);
  });
