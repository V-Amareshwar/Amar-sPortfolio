"use client";

import React from "react";
import FadeIn from "../motion/FadeIn";
import StaggerContainer, { StaggerItem } from "../motion/StaggerContainer";
import { motion } from "framer-motion";

export default function Skills({ skills }: { skills: any[] }) {
  if (!skills || skills.length === 0) return null;

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, any[]>);

  const categories = ["Languages", "Frameworks", "Tools", "Soft Skills"];

  return (
    <section id="skills" className="py-24 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Arsenal</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Tools and technologies I use to build things.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {categories.map((category, idx) => {
            const categorySkills = groupedSkills[category];
            if (!categorySkills || categorySkills.length === 0) return null;

            return (
              <div key={category}>
                <FadeIn delay={idx * 0.1}>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <div className="w-8 h-px bg-blue-600"></div>
                    {category}
                  </h3>
                </FadeIn>
                
                <StaggerContainer delayChildren={0.2} staggerChildren={0.1} className="space-y-6">
                  {categorySkills.map((skill: any) => (
                    <StaggerItem key={skill.id}>
                      <div className="flex justify-between items-end mb-3">
                        <div className="flex flex-wrap gap-2 pr-4">
                          {skill.name.split(',').map((nameItem: string, i: number) => {
                            const trimmed = nameItem.trim();
                            if (!trimmed) return null;
                            return (
                              <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg shadow-sm">
                                {trimmed}
                              </span>
                            );
                          })}
                        </div>
                        {skill.showPercentage !== false && (
                          <span className="text-sm text-gray-500 font-medium shrink-0 pb-1">{skill.proficiency}%</span>
                        )}
                      </div>
                      
                      {skill.showPercentage !== false && (
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden mt-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full"
                          />
                        </div>
                      )}
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
