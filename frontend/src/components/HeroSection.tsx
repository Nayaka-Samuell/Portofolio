"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection({ name, headline, bio }: { name?: string, headline?: string, bio?: string }) {
  return (
    <section id="hero" className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Background Blob Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-main/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-dark/30 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full glassmorphism text-blue-light text-sm font-medium"
        >
          Welcome to my portfolio
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-space mb-6 tracking-tight"
        >
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-light to-blue-main">{name || "Nayaka Samuel Andrean"}</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl text-gray-400 font-medium mb-8"
        >
          {headline || "Computer Science Student & Full-Stack Developer"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto text-gray-400 mb-10 leading-relaxed"
        >
          {bio || "I build scalable web applications, robust backend architectures, and elegant user interfaces. Always learning and exploring new technologies."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="#projects" className="w-full sm:w-auto px-8 py-3 bg-blue-main hover:bg-blue-light text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] flex items-center justify-center gap-2">
            View Projects <ArrowRight size={20} />
          </Link>
          <Link href="#contact" className="w-full sm:w-auto px-8 py-3 glassmorphism hover:bg-blue-800/30 text-white rounded-lg font-medium transition-all">
            Contact Me
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
