"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { requestFlyby } from "@/lib/flyby";
import { useStage } from "@/lib/stage";

// three.js is client-only and heavy, so load the 3D jet lazily without SSR
const Plane3D = dynamic(() => import("./Plane3D"), { ssr: false });

// sections that earn a flyby when they scroll into view
const TRIGGERS = ["services", "how", "airports", "book", "contact"];

export default function FlightLayer() {
  // three.js is parsed and its WebGL scene built only after the intro and hero entrance have finished,
  // in an idle moment, so none of that work lands on top of an animation
  const settled = useStage("settled");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!settled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ric = "requestIdleCallback" in window;
    const id = ric ? window.requestIdleCallback(() => setLoad(true), { timeout: 2000 }) : window.setTimeout(() => setLoad(true), 300);
    return () => (ric ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, [settled]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY;
    let dir: 1 | -1 = 1;
    const onScroll = () => {
      dir = window.scrollY >= lastY ? 1 : -1;
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // fly through when a new section arrives: left-to-right scrolling down, right-to-left scrolling up
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && requestFlyby(dir)),
      // fires when a section crosses the middle band of the screen (works for sections of any height)
      { rootMargin: "-45% 0px -45% 0px" },
    );
    TRIGGERS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return load ? <Plane3D /> : null;
}
