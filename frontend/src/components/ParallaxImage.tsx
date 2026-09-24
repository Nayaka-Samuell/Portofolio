"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function ParallaxImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scale up slightly and translate Y for parallax
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  if (reduce) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div ref={ref} className={`overflow-hidden relative w-full h-full`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.15 }} // Scaled up so there are no empty gaps when panning
        className={`${className} absolute top-0 left-0 origin-center`}
      />
    </div>
  );
}
