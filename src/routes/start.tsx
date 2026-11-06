import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GetStarted } from "@/components/get-started";
import { Splash } from "@/components/shell";
import { useConnect } from "@/lib/connect";

export const Route = createFileRoute("/start")({ component: StartPage });

function StartPage() {
  const { ready, session, profile } = useConnect();
  if (!ready && !profile) return <Splash />;
  if (session && profile?.membershipStatus === "active") return <Navigate to="/" />;
  if (session && profile) return <Navigate to="/checkout" />;
  return <GetStarted />;
}
