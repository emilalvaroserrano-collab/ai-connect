import { createRootRoute, HeadContent, Navigate, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AuthProvider } from "@/lib/auth/provider";
import { ConnectProvider, useConnect } from "@/lib/connect";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" },
      { title: "AI Master Plan" },
      { name: "description", content: "One AI tool, taught every morning. $8.73 once." },
      { name: "theme-color", content: "#141414" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="bg-canvas font-sans text-fg">
        <LockZoom />
        <PreviewHostBridge />
        <AuthProvider>
          <ConnectProvider>
            <HoldInactive />
            <Outlet />
          </ConnectProvider>
        </AuthProvider>
        <Toaster theme="dark" position="top-center" />
        <Scripts />
      </body>
    </html>
  ),
});

function HoldInactive() {
  const { ready, session, profile } = useConnect();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (!ready || !session || !profile) return null;
  if (profile.membershipStatus === "active") return null;
  if (pathname === "/checkout" || pathname === "/login" || pathname === "/join" || pathname === "/start" || pathname === "/community" || pathname.includes("/csr/") || pathname === "/code/create" || pathname === "/admin") return null;
  return <Navigate to="/checkout" />;
}

function LockZoom() {
  useEffect(() => {
    const blockGesture = (event: Event) => event.preventDefault();
    const blockPinch = (event: WheelEvent) => {
      if (event.ctrlKey) event.preventDefault();
    };
    document.addEventListener("gesturestart", blockGesture, { passive: false });
    document.addEventListener("gesturechange", blockGesture, { passive: false });
    window.addEventListener("wheel", blockPinch, { passive: false });
    return () => {
      document.removeEventListener("gesturestart", blockGesture);
      document.removeEventListener("gesturechange", blockGesture);
      window.removeEventListener("wheel", blockPinch);
    };
  }, []);
  return null;
}
