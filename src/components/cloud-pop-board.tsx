"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles, Volume2 } from "lucide-react";

const BUBBLE_COUNT = 56;
const DEFAULT_BUBBLE = "#E9ECEF";
const PASTEL_FLASHES = ["#D7F5E8", "#FADBC9", "#E7DDF8"];

type BubbleProps = {
  id: number;
  onPop: () => void;
  playPop: () => void;
};

function randomPastel() {
  return PASTEL_FLASHES[Math.floor(Math.random() * PASTEL_FLASHES.length)];
}

function Bubble({ id, onPop, playPop }: BubbleProps) {
  // Each bubble owns its own state so beginners can see a small useState example in isolation.
  const [isPopped, setIsPopped] = useState(false);
  const [flashColor, setFlashColor] = useState(DEFAULT_BUBBLE);

  const handleClick = () => {
    if (isPopped) {
      return;
    }

    setFlashColor(randomPastel());
    setIsPopped(true);
    onPop();
    playPop();
  };

  return (
    <motion.button
      type="button"
      aria-label={`Pop bubble ${id + 1}`}
      onClick={handleClick}
      whileTap={isPopped ? undefined : { scale: 0.96 }}
      animate={
        isPopped
          ? {
              scale: [1, 1.08, 0.05],
              opacity: [1, 1, 0],
              backgroundColor: [DEFAULT_BUBBLE, flashColor, flashColor],
            }
          : {
              scale: [0.88, 1],
              opacity: [0, 1],
              backgroundColor: DEFAULT_BUBBLE,
            }
      }
      transition={
        isPopped
          ? {
              duration: 0.28,
              ease: "easeOut",
              times: [0, 0.42, 1],
            }
          : {
              duration: 0.36,
              ease: "easeOut",
            }
      }
      className="relative aspect-square w-full overflow-hidden rounded-full border border-slate-300/70 shadow-[inset_0_2px_0_rgba(255,255,255,0.85),0_18px_30px_-20px_rgba(15,23,42,0.45)]"
      style={{ pointerEvents: isPopped ? "none" : "auto" }}
    >
      <span className="pointer-events-none absolute inset-x-[20%] top-[16%] h-[28%] rounded-full bg-white/70 blur-[1px]" />
      <span className="pointer-events-none absolute inset-[18%] rounded-full border border-white/60" />
    </motion.button>
  );
}

export function CloudPopBoard() {
  const [poppedCount, setPoppedCount] = useState(0);
  const [resetToken, setResetToken] = useState(0);

  useEffect(() => {
    if (poppedCount !== BUBBLE_COUNT) {
      return;
    }

    const timer = window.setTimeout(() => {
      setPoppedCount(0);
      setResetToken((current) => current + 1);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [poppedCount]);

  const playPop = () => {
    // Use the requested pop.mp3 file from /public.
    const audio = new Audio("/pop.mp3");
    audio.volume = 0.18;
    void audio.play().catch(() => {
      // Some browsers block autoplay until the first gesture; clicks here usually satisfy that requirement.
    });
  };

  const handlePop = () => {
    setPoppedCount((current) => current + 1);
  };

  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-4rem] h-52 w-52 rounded-full bg-[#D7F5E8]/70 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 h-48 w-48 rounded-full bg-[#FADBC9]/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#E7DDF8]/55 blur-3xl" />
      </div>

      <header className="rounded-[2rem] border border-slate-300/70 bg-white/80 px-5 py-5 shadow-[0_24px_50px_-32px_rgba(15,23,42,0.45)] backdrop-blur sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-[var(--font-mono)] text-[11px] tracking-[0.24em] text-slate-500">CLOUD POP</p>
            <h1 className="mt-2 font-[var(--font-heading)] text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl">
              Digital Bubble Wrap for a quiet break.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Tap every bubble, watch it flash mint, peach, or lavender, then let the whole board bloom back in.
            </p>
          </div>

          <div className="grid min-w-[220px] gap-3 rounded-[1.5rem] border border-slate-200 bg-[#F8F9FA] p-4 text-sm text-slate-600">
            <div className="flex items-center gap-2 text-slate-900">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Pastel flash on every pop</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900">
              <Volume2 className="h-4 w-4" />
              <span className="font-medium">Audio object playback</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900">
              <RefreshCw className="h-4 w-4" />
              <span className="font-medium">Auto reset after 1.5s</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1.5">Popped {poppedCount} / {BUBBLE_COUNT}</span>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1.5">Touch-friendly grid for Chromebook screens</span>
        </div>
      </header>

      <div className="mt-6 rounded-[2rem] border border-slate-300/70 bg-white/65 p-3 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.45)] backdrop-blur sm:p-4">
        <div
          className="grid gap-3 sm:gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
          }}
        >
          {Array.from({ length: BUBBLE_COUNT }, (_, id) => (
            <Bubble key={`${resetToken}-${id}`} id={id} onPop={handlePop} playPop={playPop} />
          ))}
        </div>
      </div>
    </section>
  );
}