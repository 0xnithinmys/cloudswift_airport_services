"use client";

import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { ReactLenis } from "lenis/react";
import Cursor from "./Cursor";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: { offset: -90 } }}>
      <MotionConfig reducedMotion="user">
        <motion.div
          style={{ scaleX: progress }}
          className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-sky via-violet to-gold"
        />
        <Cursor />
        {children}
      </MotionConfig>
    </ReactLenis>
  );
}
