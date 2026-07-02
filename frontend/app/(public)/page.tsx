import React from "react";
import { getDocument, getCollection } from "../../lib/firestore";
import Hero from "../../components/sections/Hero";
import About from "../../components/sections/About";
import Skills from "../../components/sections/Skills";
import Projects from "../../components/sections/Projects";
import Achievements from "../../components/sections/Achievements";
import Certifications from "../../components/sections/Certifications";
import BlogPreview from "../../components/sections/BlogPreview";
import Testimonials from "../../components/sections/Testimonials";
import Contact from "../../components/sections/Contact";

import { Metadata } from "next";

export const revalidate = 60; // Revalidate cache every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const profile: any = await getDocument("profile", "main").catch(() => null);
  
  if (!profile) return { title: "Portfolio" };

  return {
    title: `${profile.name} | ${profile.tagline || 'Portfolio'}`,
    description: profile.bio ? profile.bio.substring(0, 160) : "Student Portfolio",
    openGraph: {
      title: `${profile.name} | Portfolio`,
      description: profile.bio ? profile.bio.substring(0, 160) : "Student Portfolio",
      images: profile.photoUrl ? [profile.photoUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} | Portfolio`,
      description: profile.bio ? profile.bio.substring(0, 160) : "Student Portfolio",
      images: profile.photoUrl ? [profile.photoUrl] : [],
    }
  };
}

export default async function HomePage() {
  // Parallel fetching of all required data from Firestore
  const [profile, skills, projects, achievements, certifications, blog, testimonials] = await Promise.all([
    getDocument("profile", "main").catch(() => null),
    getCollection("skills").catch(() => []),
    getCollection("projects").catch(() => []),
    getCollection("achievements").catch(() => []),
    getCollection("certifications").catch(() => []),
    getCollection("blog").catch(() => []),
    getCollection("testimonials").catch(() => []),
  ]);

  // Sort projects: Featured first, then order if exists
  const sortedProjects = [...projects].sort((a: any, b: any) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <main className="w-full overflow-x-hidden">
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={sortedProjects} />
      <Achievements achievements={achievements} />
      <Certifications certifications={certifications} />
      <BlogPreview posts={blog} />
      <Testimonials testimonials={testimonials} />
      <Contact />
    </main>
  );
}
