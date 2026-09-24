/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Code, Database, Layout, Server, Download } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.012 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 30, rotate: 2 },
  visible: { opacity: 1, y: 0, rotate: 0, transition: { ease: [0.16, 1, 0.3, 1] as any, duration: 0.8 } },
};

const AnimatedText = ({ text }: { text: string }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="flex flex-wrap gap-x-[0.25em] gap-y-1 mb-6"
  >
    {text.split(" ").map((word, i) => (
      <span key={i} className="overflow-hidden inline-flex pt-1">
        <motion.span variants={wordVariants}>{word}</motion.span>
      </span>
    ))}
  </motion.div>
);

export default function AboutSection({ bio, cvUrl }: { bio?: string, cvUrl?: string }) {
  const skills = [
    { name: "Frontend", icon: <Layout className="text-blue-light" />, tech: "React, Next.js, Tailwind CSS" },
    { name: "Backend", icon: <Server className="text-blue-main" />, tech: "Node.js, Express, NestJS" },
    { name: "Database", icon: <Database className="text-blue-accent" />, tech: "PostgreSQL, MongoDB, Redis" },
    { name: "Languages", icon: <Code className="text-blue-light" />, tech: "TypeScript, Python, Java" },
  ];

  const text1 = bio || "Hello! I'm an enthusiastic Computer Science student at BINUS University with a profound passion for Full-Stack Development. I thrive at the intersection of robust backend architectures and highly interactive, user-centric frontend designs, always striving to build impactful software solutions that solve real-world problems.";
  const text2 = !bio ? "Beyond writing clean and scalable code, I am deeply invested in fostering collaborative environments. Through various organizational roles and technical leadership positions, I have cultivated the ability to lead development teams effectively. I take pride in mentoring peers, bridging communication between different divisions, and orchestrating complex projects from conceptualization to deployment. Whether I'm designing microservices or crafting beautiful user interfaces, my goal is to deliver excellence while continuously learning in this fast-paced tech landscape." : null;

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-space mb-4">About <span className="text-blue-main">Me</span></h2>
          <div className="w-20 h-1 bg-blue-main mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
            <AnimatedText text={text1} />
            {text2 && <AnimatedText text={text2} />}
            
            <div className="glassmorphism p-6 rounded-xl border-l-4 border-l-blue-main mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Education</h3>
              <p className="text-blue-light font-medium">B.Sc. in Computer Science</p>
              <p className="text-sm">BINUS University (2024 - 2028)</p>
            </div>
            
            <a 
              href={cvUrl || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/export-cv`} 
              target={cvUrl ? "_blank" : "_self"}
              rel="noopener noreferrer"
              download={!cvUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-main hover:bg-blue-light text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(96,165,250,0.5)] transform hover:-translate-y-1"
            >
              <Download size={20} /> Download CV
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glassmorphism p-6 rounded-xl glassmorphism-hover group"
              >
                <div className="mb-4 p-3 bg-blue-dark/30 rounded-lg inline-block group-hover:bg-blue-main/30 transition-colors">
                  {skill.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
                <p className="text-sm text-gray-400">{skill.tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
