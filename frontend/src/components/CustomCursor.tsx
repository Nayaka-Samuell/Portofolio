"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const size = useMotionValue(16);
  
  const reduce = useReducedMotion();

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const smoothSize = useSpring(size, { damping: 20, stiffness: 200 });

  useEffect(() => {
    // Disable on reduced motion or mobile devices
    if (reduce || window.innerWidth < 768) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      // Membesar saat hover elemen interaktif
      if (target && target.closest('a, button, input, textarea')) {
        size.set(56);
      } else {
        size.set(16);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY, size, reduce]);

  if (reduce) return null;

  return (
    <motion.div
      className="hidden md:block fixed top-0 left-0 rounded-full bg-white mix-blend-difference pointer-events-none z-[9999]"
      style={{
        x: smoothX,
        y: smoothY,
        width: smoothSize,
        height: smoothSize,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}
