"use client";

import { motion } from "framer-motion";
import { Mail, Link as Linkedin, Code as Github, Send } from "lucide-react";

export default function ContactSection({ sosmed }: { sosmed?: { github?: string, linkedin?: string, email?: string, instagram?: string } }) {
  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-main/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-space mb-4">Get In <span className="text-blue-main">Touch</span></h2>
          <div className="w-20 h-1 bg-blue-main mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Connect with me</h3>
            
            <a href={sosmed?.email ? `mailto:${sosmed.email}` : "mailto:hello@example.com"} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full glassmorphism flex items-center justify-center group-hover:bg-blue-main/20 group-hover:scale-110 transition-all">
                <Mail className="text-blue-light group-hover:text-blue-main" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium group-hover:text-blue-light transition-colors">{sosmed?.email || "hello@example.com"}</p>
              </div>
            </a>
            
            <a href={sosmed?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full glassmorphism flex items-center justify-center group-hover:bg-blue-main/20 group-hover:scale-110 transition-all">
                <Linkedin className="text-blue-light group-hover:text-blue-main" />
              </div>
              <div>
                <p className="text-sm text-gray-400">LinkedIn</p>
                <p className="text-white font-medium group-hover:text-blue-light transition-colors">
                  {sosmed?.linkedin ? sosmed.linkedin.replace('https://', '') : "linkedin.com/in/username"}
                </p>
              </div>
            </a>
            
            <a href={sosmed?.github || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full glassmorphism flex items-center justify-center group-hover:bg-blue-main/20 group-hover:scale-110 transition-all">
                <Github className="text-blue-light group-hover:text-blue-main" />
              </div>
              <div>
                <p className="text-sm text-gray-400">GitHub</p>
                <p className="text-white font-medium group-hover:text-blue-light transition-colors">
                  {sosmed?.github ? sosmed.github.replace('https://', '') : "github.com/username"}
                </p>
              </div>
            </a>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glassmorphism p-8 rounded-2xl flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input type="text" id="name" className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light focus:ring-1 focus:ring-blue-light transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input type="email" id="email" className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light focus:ring-1 focus:ring-blue-light transition-colors" placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea id="message" rows={4} className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-light focus:ring-1 focus:ring-blue-light transition-colors resize-none" placeholder="Your message..."></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-blue-main hover:bg-blue-light text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(96,165,250,0.6)] flex items-center justify-center gap-2">
              Send Message <Send size={18} />
            </button>
            <a href="http://localhost:5000/api/vcard" download className="w-full py-3 bg-blue-dark/50 hover:bg-blue-main/40 border border-blue-main/30 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 mt-4">
              Save Contact (vCard)
            </a>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
