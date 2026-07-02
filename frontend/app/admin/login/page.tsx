"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back, Admin!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-30 dark:opacity-20"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, #3b82f6 0deg, transparent 60deg, transparent 300deg, #8b5cf6 360deg)'
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten filter" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten filter" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800">
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 transform rotate-12"
            >
              <div className="transform -rotate-12">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Admin Gateway</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Secure access to your portfolio dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                  placeholder="Admin Email" 
                />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" 
                  placeholder="Password" 
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Amar's Portfolio. Authorized personnel only.
        </p>
      </motion.div>
    </div>
  );
}
