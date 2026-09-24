/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Users, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrganizationDetail() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Parallax Setup
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/profile/nayaka`).catch(() => null);
        
        let org = null;
        if (res && res.ok) {
          const profile = await res.json();
          org = profile.organizations?.find((o: any, i: number) => o.id === id || o._id === id || i.toString() === id);
        }
        
        // FALLBACK SEMENTARA JIKA DATABASE KOSONG / FETCH GAGAL
        if (!org) {
          const fallbackOrgs = [
            {
              id: "org3",
              name: "BINUS @Malang",
              role: "Freshman Leader",
              period: "August 2025 - September 2025",
              description: "Bertindak sebagai koordinator dan pendamping utama bagi mahasiswa baru. Membimbing, memotivasi, serta memastikan kelancaran seluruh rangkaian kegiatan orientasi agar para mahasiswa baru dapat beradaptasi dengan baik di lingkungan kampus yang baru.",
              logo: "/images/freshman-baru.jpeg"
            },
            {
              id: "org4",
              name: "HIMTI",
              role: "Content Division",
              period: "2024 - Present",
              description: "Mengembangkan, merencanakan, dan memproduksi berbagai konten kreatif serta edukatif untuk keperluan publikasi dan media sosial organisasi. Berkolaborasi secara aktif dalam membangun strategi komunikasi digital untuk meningkatkan engagement mahasiswa.",
              logo: "/images/himti.jpeg"
            }
          ];
          org = fallbackOrgs.find((o, i) => o.id === id || i.toString() === id);
        }
        
        if (org) setData(org);
      } catch {
        // Silently ignore
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-blue-base flex items-center justify-center text-white font-space animate-pulse">Loading Organization...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-[100dvh] bg-blue-base flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-white mb-4">Organization Not Found</h1>
        <p className="text-gray-400 mb-8">The organization data you are looking for is currently unavailable or doesn&apos;t exist.</p>
        <Link href="/#organizations" className="px-6 py-3 bg-blue-main hover:bg-blue-light text-white rounded-lg font-bold transition-all">Back to Organizations</Link>
      </div>
    );
  }

  // Placeholder floating photos for parallax
  const floatingPhotos = [
    data.logo || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80"
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-blue-base overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        <Link href="/#organizations" className="inline-flex items-center gap-2 text-blue-light hover:text-white transition-colors mb-8 font-medium z-20 relative">
          <ArrowLeft size={20} /> Back to Organizations
        </Link>

        {/* Animated Parallax Photo Gallery */}
        <div className="relative w-full h-[50vh] min-h-[400px] mb-16 flex items-center justify-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute z-30 text-center px-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white font-space mb-4 text-glow">
              {data.name}
            </h1>
            <p className="text-xl md:text-2xl text-blue-light font-medium">
              {data.role}
            </p>
          </motion.div>

          {/* Floating Parallax Images */}
          <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-10 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] opacity-60 border-2 border-blue-main/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={floatingPhotos[1]} className="w-full h-full object-cover" alt="Org Activity" />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0] }} 
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 right-10 w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden shadow-[0_0_40px_rgba(96,165,250,0.2)] opacity-80 border-4 border-blue-dark/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={floatingPhotos[0]} className="w-full h-full object-cover" alt="Org Main" />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, -30, 0] }} 
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-20 right-20 w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-2xl opacity-50 border border-blue-main/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={floatingPhotos[2]} className="w-full h-full object-cover" alt="Org Members" />
            </motion.div>
          </motion.div>
          
          <div className="absolute inset-0 bg-blue-base/60 backdrop-blur-sm z-20"></div>
        </div>

        {/* Content Section */}
        <div className="glassmorphism p-8 md:p-12 rounded-3xl relative overflow-hidden border border-blue-main/30 z-20 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-dark via-blue-main to-blue-light"></div>
          
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
            <span className="flex items-center gap-2 px-5 py-2.5 bg-blue-main/20 text-blue-100 rounded-xl border border-blue-main/40 font-medium">
              <Calendar size={18} className="text-blue-light" /> {data.period}
            </span>
            <span className="flex items-center gap-2 px-5 py-2.5 bg-blue-dark/40 text-blue-100 rounded-xl border border-blue-dark/50 font-medium">
              <Users size={18} className="text-blue-light" /> Leadership
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Award className="text-blue-main" size={28} /> About The Role
          </h3>
          
          <div className="prose prose-invert prose-blue max-w-none prose-p:text-gray-300 prose-p:text-lg prose-p:leading-relaxed">
            <p>{data.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
