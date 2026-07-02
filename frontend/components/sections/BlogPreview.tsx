"use client";

import React from "react";
import FadeIn from "../motion/FadeIn";
import StaggerContainer, { StaggerItem } from "../motion/StaggerContainer";
import { BookOpen, ArrowRight } from "lucide-react";

export default function BlogPreview({ posts }: { posts: any[] }) {
  // Only show published posts
  const published = posts?.filter(p => p.published) || [];
  
  if (published.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Dev Notes
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">My thoughts, learnings, and technical deep dives.</p>
          </div>
        </FadeIn>

        <StaggerContainer delayChildren={0.1} staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {published.map((post: any) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: any }) {
  const [expandedContent, setExpandedContent] = React.useState(false);
  const isLongContent = post.content?.length > 200;

  return (
    <StaggerItem className="h-full">
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 h-full overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer">
        {post.coverImage && (
          <div className="w-full h-40 overflow-hidden shrink-0">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
              {post.tags ? post.tags[0] : "Article"}
            </span>
            <span>{post.publishedAt || "Recently"}</span>
          </div>
          
          <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <div className="flex-1">
            <div 
              className={`text-gray-600 dark:text-gray-400 text-sm mb-2 prose-sm dark:prose-invert ${expandedContent ? "" : "line-clamp-3"}`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            {isLongContent && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedContent(!expandedContent);
                }}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs font-semibold mb-6 block"
              >
                {expandedContent ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
            Read Article <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}
