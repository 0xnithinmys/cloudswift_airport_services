"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { globePoints } from "@/lib/site";

// Interactive WebGL globe with airport markers and flight arcs from the hub. Drag to spin.
export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; phi: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = 1; // the globe is large; 1x keeps it smooth on integrated GPUs
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    let width = canvas.offsetWidth;
    let phi = 4.6; // start facing the Middle East / India
    let velocity = 0;
    let raf = 0;
    const [hub, ...rest] = globePoints;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi,
      theta: 0.28,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 16000,
      mapBrightness: 5,
      mapBaseBrightness: 0.02,
      baseColor: [0.16, 0.2, 0.32],
      markerColor: [0.96, 0.79, 0.48],
      glowColor: [0.28, 0.38, 0.75],
      markers: globePoints.map((p, i) => ({ location: p.loc, size: i === 0 ? 0.08 : 0.035 })),
      arcs: rest.map((p) => ({ from: hub.loc, to: p.loc })),
      arcColor: [0.48, 0.65, 1],
      arcWidth: 0.4,
      arcHeight: 0.28,
      markerElevation: 0.01,
    });

    const onResize = () => {
      width = canvas.offsetWidth;
      globe.update({ width: width * dpr, height: width * dpr });
    };
    window.addEventListener("resize", onResize);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return; // skip WebGL work while offscreen
      if (!drag.current) {
        phi += (reduce ? 0 : 0.0028) + velocity;
        velocity *= 0.95;
      }
      globe.update({ phi });
    };
    loop();
    canvas.style.opacity = "1";

    const down = (e: PointerEvent) => {
      drag.current = { x: e.clientX, phi };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      const next = drag.current.phi + (e.clientX - drag.current.x) / 180;
      velocity = (next - phi) * 0.25;
      phi = next;
    };
    const up = () => {
      drag.current = null;
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      globe.destroy();
    };
  }, []);

  return (
    <div className={`relative aspect-square ${className}`}>
      <canvas
        ref={canvasRef}
        data-cursor
        className="h-full w-full cursor-grab opacity-0 transition-opacity duration-[1500ms]"
        style={{ touchAction: "pan-y" }}
      />
    </div>
  );
}
