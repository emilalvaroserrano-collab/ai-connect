import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/dashboard";
import { IntroVideo } from "@/components/intro-video";
import { Shell, Splash } from "@/components/shell";
import { useConnect } from "@/lib/connect";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { ready, session, profile } = useConnect();
  const [showIntro, setShowIntro] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setShowIntro(sessionStorage.getItem("dc.intro") !== "1");
    setChecked(true);
  }, []);

  if (!ready && !profile) return <Splash />;
  if (!checked) return <Splash />;
  if (showIntro) {
    return (
      <IntroVideo
        onDone={() => {
          sessionStorage.setItem("dc.intro", "1");
          setShowIntro(false);
        }}
      />
    );
  }
  if (!session || !profile) return <Navigate to="/start" />;
  if (profile.membershipStatus !== "active") return <Navigate to="/checkout" />;
  return (
    <Shell>
      <Dashboard />
    </Shell>
  );
}
