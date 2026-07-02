"use client";

import React from "react";
import FadeIn from "../motion/FadeIn";
import StaggerContainer, { StaggerItem } from "../motion/StaggerContainer";
import { MessageSquareQuote } from "lucide-react";

export default function Testimonials({ testimonials }: { testimonials: any[] }) {
  // Only show approved testimonials
  const approved = testimonials?.filter(t => t.approved) || [];
  
  if (approved.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-blue-50 dark:bg-blue-950/20 border-y border-blue-100 dark:border-blue-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-16 text-center flex flex-col items-center">
            <MessageSquareQuote className="w-12 h-12 text-blue-600 mb-4 opacity-50" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
        </FadeIn>

        <StaggerContainer delayChildren={0.1} staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approved.map((t: any) => (
            <StaggerItem key={t.id} className="h-full">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col relative">
                <p className="text-gray-700 dark:text-gray-300 italic mb-8 flex-1 relative z-10 text-lg leading-relaxed">
                  "{t.message}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 object-cover rounded-full" />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-sm text-gray-500">
                      {t.role} {t.company && <span className="text-blue-600 dark:text-blue-400">@ {t.company}</span>}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
