"use client";

import React from "react";
import FadeIn from "../motion/FadeIn";
import StaggerContainer, { StaggerItem } from "../motion/StaggerContainer";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Projects({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Some of the things I've built recently.</p>
          </div>
        </FadeIn>

        <StaggerContainer delayChildren={0.1} staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  const [expandedDesc, setExpandedDesc] = React.useState(false);
  const [expandedTech, setExpandedTech] = React.useState(false);

  // A heuristic: if description is more than ~150 chars, it's likely clamped
  const isLongDesc = project.description?.length > 150;
  const hasManyTech = project.techStack?.length > 4;

  return (
    <StaggerItem className="group h-full flex">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col w-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-blue-900/20">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {project.featured && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
          
          <div className="mb-6 flex-1">
            <p className={`text-gray-600 dark:text-gray-400 text-sm ${expandedDesc ? "" : "line-clamp-3"}`}>
              {project.description}
            </p>
            {isLongDesc && (
              <button 
                onClick={() => setExpandedDesc(!expandedDesc)}
                className="text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 text-xs font-semibold mt-1"
              >
                {expandedDesc ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
          
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            {(expandedTech ? project.techStack : project.techStack?.slice(0, 4))?.map((tech: string) => (
              <span key={tech} className="text-xs font-medium px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300">
                {tech}
              </span>
            ))}
            {hasManyTech && (
              <button 
                onClick={() => setExpandedTech(!expandedTech)}
                className="text-xs font-medium px-2.5 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
              >
                {expandedTech ? "Show Less" : `+${project.techStack.length - 4} more`}
              </button>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                <FaGithub className="w-4 h-4" /> Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 text-sm font-medium transition-colors">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}
