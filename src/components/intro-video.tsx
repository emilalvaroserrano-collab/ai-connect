import { useEffect, useRef, useState } from "react";

const SRC = "https://dailyconnect.grok.me/landing/mobile.mp4";

export function IntroVideo({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, []);

  return (
    <main className="relative h-dvh overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={SRC}
        autoPlay
        muted={muted}
        playsInline
        preload="auto"
        onEnded={onDone}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between px-4">
        <p className="text-sm font-medium text-white">AI Master Plan</p>
        <button
          type="button"
          onClick={onDone}
          className="pointer-events-auto h-10 rounded-full bg-black/55 px-4 text-sm font-medium text-white"
        >
          Skip
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          const video = videoRef.current;
          if (!video) return;
          video.muted = false;
          setMuted(false);
          void video.play().catch(() => undefined);
        }}
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 h-10 rounded-full bg-black/55 px-4 text-sm text-white"
      >
        {muted ? "Sound on" : "Playing"}
      </button>
    </main>
  );
}
