"use client";

import React, { useState } from "react";
import { Mail, FileText, ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import FadeIn from "../motion/FadeIn";
import ResumeModal from "./ResumeModal";

export default function Hero({ profile }: { profile: any }) {
  const [resumeOpen, setResumeOpen] = useState(false);

  if (!profile) return null;

  return (
    <>
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col md:flex-row items-center gap-12 md:gap-24">

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                {profile.availabilityStatus || "Open to Work"}
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{profile.name?.split(" ")[0]}</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium mb-8 max-w-2xl">
                {profile.tagline}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-8">
                <a
                  href="#projects"
                  className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-blue-500/20"
                >
                  View My Work <ArrowRight className="w-4 h-4" />
                </a>

                {profile.resumeUrl && (
                  <button
                    onClick={() => setResumeOpen(true)}
                    className="px-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    View Resume <FileText className="w-4 h-4" />
                  </button>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex items-center justify-center md:justify-start gap-6">
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition">
                    <FaGithub className="w-6 h-6" />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition">
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                )}
                {profile.twitterUrl && (
                  <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition">
                    <FaTwitter className="w-6 h-6" />
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="text-gray-500 hover:text-red-500 transition">
                    <Mail className="w-6 h-6" />
                  </a>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Photo */}
          {profile.photoUrl && (
            <div className="flex-1 flex justify-center md:justify-end">
              <FadeIn direction="left" delay={0.2}>
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-tr from-blue-600 to-purple-600 shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                    <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </FadeIn>
            </div>
          )}
        </div>
      </section>

      {/* Resume Modal */}
      {profile.resumeUrl && (
        <ResumeModal
          isOpen={resumeOpen}
          onClose={() => setResumeOpen(false)}
          resumeUrl={profile.resumeUrl}
        />
      )}
    </>
  );
}
