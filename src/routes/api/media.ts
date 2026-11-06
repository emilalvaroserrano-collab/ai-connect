import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/media")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const idToken = request.headers.get("x-id-token") || "";
          const { loadProfile } = await import("@/lib/firebase.server");
          await loadProfile(idToken);
          const { signVideoUpload } = await import("@/lib/cloudinary.server");
          return Response.json(signVideoUpload());
        } catch (error) {
          const message = error instanceof Error ? error.message : "Could not start the upload.";
          return new Response(message, { status: 400, headers: { "content-type": "text/plain; charset=utf-8" } });
        }
      },
    },
  },
});
