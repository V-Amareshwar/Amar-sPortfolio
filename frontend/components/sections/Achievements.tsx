"use client";

import React from "react";
import FadeIn from "../motion/FadeIn";
import StaggerContainer, { StaggerItem } from "../motion/StaggerContainer";
import { Trophy } from "lucide-react";

export default function Achievements({ achievements }: { achievements: any[] }) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Achievements
            </h2>
            <div className="w-20 h-1.5 bg-yellow-500 rounded-full"></div>
          </div>
        </FadeIn>

        <StaggerContainer delayChildren={0.1} staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement: any) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function AchievementCard({ achievement }: { achievement: any }) {
  const [expandedDesc, setExpandedDesc] = React.useState(false);
  const isLongDesc = achievement.description?.length > 150;

  return (
    <StaggerItem className="h-full">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow group">
        {achievement.imageUrl && (
          <div className="w-full h-40 overflow-hidden shrink-0">
            <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-xs font-semibold rounded-full">
              {achievement.type}
            </span>
            <span className="text-sm text-gray-500 font-medium">{achievement.date}</span>
          </div>
          <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
          
          <div className="flex-1">
            <p className={`text-gray-600 dark:text-gray-400 text-sm ${expandedDesc ? "" : "line-clamp-3"}`}>
              {achievement.description}
            </p>
            {isLongDesc && (
              <button 
                onClick={() => setExpandedDesc(!expandedDesc)}
                className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400 text-xs font-semibold mt-1"
              >
                {expandedDesc ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}
