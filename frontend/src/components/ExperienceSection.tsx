/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";
import { experiences as staticExperiences } from "@/data/experience";
import Link from "next/link";

export default function ExperienceSection({ experiences: dynamicExperiences }: { experiences?: any[] }) {
  const data = dynamicExperiences && dynamicExperiences.length > 0 ? dynamicExperiences : staticExperiences;

  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-space mb-4">
            Working <span className="text-blue-main">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-blue-main mx-auto rounded-full"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-main/30"></div>

          <div className="space-y-12">
            {data.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center justify-between w-full ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="w-full md:w-5/12"></div>
                
                {/* Timeline Icon */}
                <div className="hidden md:flex z-10 w-12 h-12 rounded-full glassmorphism items-center justify-center border-2 border-blue-main text-blue-light shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <Briefcase size={20} />
                </div>

                <div className="w-full md:w-5/12 mt-6 md:mt-0">
                  <Link href={`/experience/${exp.id || index}`} className="block">
                    <div className="glassmorphism p-6 rounded-xl glassmorphism-hover group relative overflow-hidden h-full">
                      {/* Decorative Blob */}
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-main/10 rounded-full blur-2xl group-hover:bg-blue-main/20 transition-all"></div>
                      
                      <div className="flex justify-between items-start mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-blue-light bg-blue-main/10 rounded-full border border-blue-main/20">
                          {exp.period}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-blue-main/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                          <ArrowRight size={16} className="text-blue-light" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white font-space mb-1">
                        {exp.role}
                      </h3>
                      <h4 className="text-blue-main font-medium mb-4">
                        {exp.company}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {exp.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {(exp.technologies || exp.skills || []).map((tech: string, i: number) => (
                          <span 
                            key={i} 
                            className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-dark/40 text-blue-100 border border-blue-light/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
