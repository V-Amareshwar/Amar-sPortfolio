"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "../../../components/admin/ProtectedRoute";
import { 
  LayoutDashboard, 
  FolderGit2, 
  LogOut, 
  User, 
  Code2, 
  Trophy, 
  Award, 
  BookOpen, 
  MessageSquareQuote,
  Mail,
  Menu,
  X
} from "lucide-react";
import { auth } from "../../../lib/firebase";
import { signOut } from "firebase/auth";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { name: "Skills", href: "/admin/skills", icon: Code2 },
    { name: "Achievements", href: "/admin/achievements", icon: Trophy },
    { name: "Certifications", href: "/admin/certifications", icon: Award },
    { name: "Blog", href: "/admin/blog", icon: BookOpen },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    { name: "Messages", href: "/admin/messages", icon: Mail },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative">
        
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 flex items-center justify-between px-4">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Admin Panel</span>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`
            fixed md:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col 
            bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Admin Panel</span>
            <button 
              onClick={closeMobileMenu}
              className="md:hidden p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden min-w-0 pt-16 md:pt-0 bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
