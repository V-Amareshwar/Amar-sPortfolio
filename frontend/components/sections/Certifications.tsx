"use client";

import React from "react";
import FadeIn from "../motion/FadeIn";
import StaggerContainer, { StaggerItem } from "../motion/StaggerContainer";
import { ExternalLink, Award } from "lucide-react";

export default function Certifications({ certifications }: { certifications: any[] }) {
  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              Certifications
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
        </FadeIn>

        <StaggerContainer delayChildren={0.1} staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert: any) => (
            <StaggerItem key={cert.id} className="h-full">
              <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} alt={cert.issuer} className="w-16 h-16 object-contain bg-white rounded-lg border border-gray-100 p-1" />
                  ) : (
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">
                      <Award className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight mb-1">{cert.title}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">{cert.issuer}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    Issued: {cert.issueDate || "N/A"}
                  </span>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                      Verify <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
