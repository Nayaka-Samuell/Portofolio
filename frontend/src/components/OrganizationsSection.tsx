"use client";

import { motion } from "framer-motion";
import { organizations as staticOrganizations } from "@/data/organizations";
import { Users } from "lucide-react";

export default function OrganizationsSection({ organizations: dynamicOrganizations }: { organizations?: any[] }) {
  const data = dynamicOrganizations && dynamicOrganizations.length > 0 ? dynamicOrganizations : staticOrganizations;

  return (
    <section id="organizations" className="py-20 bg-blue-base/50 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-space mb-4">Organizational <span className="text-blue-main">Experience</span></h2>
          <div className="w-20 h-1 bg-blue-main mx-auto rounded-full"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-blue-dark/50 transform md:-translate-x-1/2"></div>

          {data.map((org, index) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-start mb-12 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-blue-base border-4 border-blue-main rounded-full transform -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <Users size={16} className="text-blue-light" />
              </div>

              <div className={`ml-12 md:ml-0 w-full md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"} pt-2 md:pt-0`}>
                <div className="glassmorphism p-6 rounded-xl hover:-translate-y-1 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 bg-blue-dark/50 text-blue-light text-xs font-bold rounded-full mb-3">
                    {org.period}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1">{org.name}</h3>
                  <p className="text-blue-main font-medium mb-4">{org.role}</p>
                  {org.logo && (
                    <img src={org.logo} alt={org.name} className="w-full h-40 object-cover rounded-lg mb-4 border border-blue-main/30" />
                  )}
                  <p className="text-sm text-gray-400 leading-relaxed">{org.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
