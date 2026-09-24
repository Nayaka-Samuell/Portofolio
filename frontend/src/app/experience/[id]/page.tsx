/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, Calendar, Building } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ExperienceDetail() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Dummy gallery for the "Animated Photo Gallery" requirement
  const gallery = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/profile/nayaka`).catch(() => null);
        
        let exp = null;
        if (res && res.ok) {
          const profile = await res.json();
          // Match by id or index if dummy id is used
          exp = profile.experiences?.find((e: any, i: number) => e.id === id || e._id === id || i.toString() === id);
        }
        
        // FALLBACK SEMENTARA JIKA DATABASE KOSONG ATAU FETCH GAGAL
        if (!exp) {
          const fallbackExps = [
            {
              id: "exp1",
              role: "Operational Manager",
              company: "Indieast Coffee",
              period: "2025 - 2026",
              description: "Memimpin dan mengelola operasional harian kafe guna memastikan efisiensi bisnis dan standar kualitas layanan yang prima. Bertanggung jawab penuh dalam pendelegasian tugas tim, manajemen inventaris, penyusunan strategi operasional, serta menjaga konsistensi Standard Operating Procedure (SOP) demi kepuasan pelanggan secara optimal.",
              technologies: ["Operations Management", "Team Leadership", "Quality Control", "Customer Service", "Inventory Management"]
            },
            {
              id: "exp2",
              role: "Event Staff",
              company: "Premier Plus Wedding Organizer (Malang)",
              period: "2025 - 2026",
              description: "Berperan krusial dalam mengorkestrasi kelancaran seluruh rangkaian acara dari persiapan hingga penutupan. Menerapkan manajemen waktu yang ketat, koordinasi lintas divisi, dan kemampuan problem-solving yang cepat serta tepat di lapangan untuk memitigasi risiko secara real-time, memastikan setiap detail rundown berjalan dengan sempurna.",
              technologies: ["Event Management", "Time Management", "Problem Solving", "Communication", "Coordination"]
            }
          ];
          exp = fallbackExps.find((e, i) => e.id === id || i.toString() === id);
        }
        
        if (exp) setData(exp);
      } catch {
        // Silently ignore
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    // Auto sliding carousel for Animated Photo Gallery
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gallery.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [gallery.length]);

  if (loading) {
    return <div className="min-h-screen bg-blue-base flex items-center justify-center text-white font-space animate-pulse">Loading Experience...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-[100dvh] bg-blue-base flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-white mb-4">Experience Not Found</h1>
        <p className="text-gray-400 mb-8">The work experience you are looking for is currently unavailable or doesn&apos;t exist.</p>
        <Link href="/#experience" className="px-6 py-3 bg-blue-main hover:bg-blue-light text-white rounded-lg font-bold transition-all">Back to Experiences</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-blue-base">
      <div className="max-w-4xl mx-auto">
        <Link href="/#experience" className="inline-flex items-center gap-2 text-blue-light hover:text-white transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Back to Experiences
        </Link>

        {/* Animated Photo Gallery - Framer Motion */}
        <div className="relative w-full h-64 md:h-[400px] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-blue-main/20 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={gallery[currentIndex]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Experience Gallery"
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-blue-base via-transparent to-transparent opacity-80"></div>
          
          {/* Gallery Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-blue-main" : "bg-white/50 hover:bg-white"}`}
              />
            ))}
          </div>
        </div>

        <div className="glassmorphism p-8 md:p-12 rounded-3xl relative overflow-hidden border border-blue-main/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-main/10 rounded-full blur-[100px] -z-10"></div>
          
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
            <span className="flex items-center gap-2 px-4 py-2 bg-blue-dark/40 rounded-full border border-blue-main/30">
              <Calendar size={16} className="text-blue-light" /> {data.period}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-blue-dark/40 rounded-full border border-blue-main/30">
              <Building size={16} className="text-blue-light" /> {data.company}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white font-space mb-6">
            {data.role}
          </h1>
          
          <div className="prose prose-invert prose-blue max-w-none prose-p:text-gray-300 prose-p:leading-relaxed text-lg">
            <p>{data.description}</p>
          </div>

          {data.technologies && data.technologies.length > 0 && (
            <div className="mt-12 pt-8 border-t border-blue-main/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-main" /> Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.technologies.map((tech: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-blue-main/10 text-blue-light rounded-lg text-sm border border-blue-main/20 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
