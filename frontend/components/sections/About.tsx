import React from "react";
import FadeIn from "../motion/FadeIn";
import { Code2, Trophy, BrainCircuit } from "lucide-react";

export default function About({ profile }: { profile: any }) {
  if (!profile || !profile.bio) return null;

  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Bio Text */}
          <div className="md:col-span-7 lg:col-span-8">
            <FadeIn delay={0.1}>
              <div className="prose dark:prose-invert max-w-none text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </div>
            </FadeIn>
          </div>

          {/* Quick Stats / Info */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            <FadeIn delay={0.2}>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Currently Learning</h3>
                  <p className="text-gray-600 dark:text-gray-400">{profile.currentlyLearning || "Exploring new technologies"}</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Full-Stack Focus</h3>
                  <p className="text-gray-600 dark:text-gray-400">Specializing in modern web technologies and scalable backends.</p>
                </div>
              </div>
            </FadeIn>
            
            {/* Simple Timeline / Journey */}
            <FadeIn delay={0.4}>
               <div className="mt-8">
                 <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                   My Journey
                 </h3>
                 <div className="space-y-6 border-l-2 border-blue-100 dark:border-blue-900/50 ml-3 pl-5 relative">
                   <div className="relative">
                     <div className="absolute -left-[27px] top-1 w-3 h-3 bg-blue-600 rounded-full border-4 border-white dark:border-gray-950"></div>
                     <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Present</p>
                     <h4 className="font-semibold text-gray-900 dark:text-white">B.Tech Computer Science</h4>
                     <p className="text-sm text-gray-500">Building full-stack apps & solving problems.</p>
                   </div>
                   <div className="relative">
                     <div className="absolute -left-[27px] top-1 w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-950"></div>
                     <p className="text-sm font-medium text-gray-500 mb-1">Earlier</p>
                     <h4 className="font-semibold text-gray-900 dark:text-white">Started Coding</h4>
                     <p className="text-sm text-gray-500">Wrote my first line of code and fell in love with tech.</p>
                   </div>
                 </div>
               </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
