"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MagneticButton from "./MagneticButton";

export default function HeroSection({ name, headline, bio }: { name?: string, headline?: string, bio?: string }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const lineVariants = {
    hidden: { y: "110%", opacity: 0, rotate: 2 },
    visible: { y: "0%", opacity: 1, rotate: 0, transition: { type: "spring" as const, damping: 20, stiffness: 100 } },
  };

  return (
    <section id="hero" className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden pt-24 pb-16">
      {/* Background Blob Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-main/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-dark/30 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="overflow-hidden pb-2">
            <motion.h1
              variants={lineVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold font-space tracking-tight leading-[1.1]"
            >
              Hi, I&apos;m
            </motion.h1>
          </div>
          <div className="overflow-hidden pb-2">
            <motion.h1
              variants={lineVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold font-space tracking-tight leading-[1.1]"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-light to-blue-main">{name || "Nayaka Samuel Andrean"}</span>
            </motion.h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring", damping: 25, stiffness: 120 }}
          className="overflow-hidden mb-10"
        >
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
            {headline || "Computer Science Student & Full-Stack Developer."} {bio || "I build scalable web applications and robust architectures to solve real-world problems."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", damping: 20, stiffness: 100 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton>
            <Link href="#projects" className="w-full sm:w-auto px-8 py-4 bg-blue-main hover:bg-blue-light text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] flex items-center justify-center gap-2 transform hover:-translate-y-1">
              View Projects <ArrowRight size={20} />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="#contact" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-blue-main/30 hover:border-blue-main hover:bg-blue-main/10 text-white rounded-xl font-bold transition-all flex items-center justify-center">
              Contact Me
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
