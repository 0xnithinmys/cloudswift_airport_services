import { useSyncExternalStore } from "react";

// Startup choreography, so heavy work never runs at the same time as an animation:
//   intro    → the logo intro is playing; nothing else starts
//   prepare  → the intro is holding still; WebGL (the globe) initialises behind it
//   reveal   → the curtain lifts and the hero/nav entrance animations play
//   settled  → entrances are done; the 3D jet can load and warm up its shaders
const ORDER = ["intro", "prepare", "reveal", "settled"] as const;
export type Stage = (typeof ORDER)[number];

let current: Stage = "intro";
const listeners = new Set<() => void>();

export function advanceStage(next: Stage) {
  if (ORDER.indexOf(next) <= ORDER.indexOf(current)) return;
  current = next;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** True once startup has reached `stage` (always false during SSR). */
export function useStage(stage: Stage) {
  return useSyncExternalStore(
    subscribe,
    () => ORDER.indexOf(current) >= ORDER.indexOf(stage),
    () => false,
  );
}
