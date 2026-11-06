import { createFileRoute, Navigate } from "@tanstack/react-router";
import { CommunityFeed } from "@/components/community-feed";
import { Shell, Splash } from "@/components/shell";
import { useConnect } from "@/lib/connect";

export const Route = createFileRoute("/community")({ component: CommunityPage });

function CommunityPage() {
  const { ready, session, profile } = useConnect();
  if (!ready) return <Splash />;
  if (!session || !profile) return <Navigate to="/login" />;
  return (
    <Shell>
      <CommunityFeed session={session} name={profile.name || "Member"} />
    </Shell>
  );
}
