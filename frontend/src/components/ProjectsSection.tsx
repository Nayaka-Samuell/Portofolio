"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code as Github } from "lucide-react";
import { projects as staticProjects } from "@/data/projects";
import Image from "next/image";

export default function ProjectsSection({ portfolios }: { portfolios?: any[] }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Web", "Backend", "Mobile", "AI/ML"];

  // Use dynamic portfolios if available, fallback to static
  const data = portfolios && portfolios.length > 0 ? portfolios : staticProjects;

  const filteredProjects = filter === "All" 
    ? data 
    : data.filter((p: any) => p.category === filter || (p.category == null && filter === "All"));

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-space mb-4">Featured <span className="text-blue-main">Projects</span></h2>
          <div className="w-20 h-1 bg-blue-main mx-auto rounded-full mb-8"></div>

          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat 
                    ? "bg-blue-main text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                    : "glassmorphism text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="glassmorphism rounded-xl overflow-hidden group hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-blue-main/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    src={project.thumbnail || project.image || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <span className="text-blue-light text-xs font-bold uppercase tracking-wider mb-2">{project.category || 'Project'}</span>
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-sm text-gray-400 mb-6 flex-grow">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(project.techStack || project.technologies || []).map((tech: string) => (
                      <span key={tech} className="text-xs px-2 py-1 bg-blue-dark/40 text-blue-100 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-auto">
                    <a href={`/project/${project.id || project._id}`} className="flex-1 text-center py-2 bg-blue-main/20 hover:bg-blue-main text-blue-light hover:text-white rounded-lg transition-colors text-sm font-bold border border-blue-main/30">
                      Read Case Study
                    </a>
                    
                    <div className="flex gap-4 w-full justify-between mt-2">
                      {(project.githubUrl || project.github) && (
                        <a href={project.githubUrl || project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:text-glow transition-all flex items-center gap-2 text-sm font-medium">
                          <Github size={18} /> Code
                        </a>
                      )}
                      {(project.demoUrl || project.link) && (
                        <a href={project.demoUrl || project.link} target="_blank" rel="noopener noreferrer" className="text-blue-main hover:text-blue-light hover:text-glow transition-all flex items-center gap-2 text-sm font-medium">
                          <ExternalLink size={18} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
