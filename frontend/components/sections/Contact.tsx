"use client";

import React, { useState } from "react";
import FadeIn from "../motion/FadeIn";
import { Send, CheckCircle2 } from "lucide-react";
import { apiSendMessage } from "../../lib/api";
import toast from "react-hot-toast";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      await apiSendMessage(data);
      setSuccess(true);
      toast.success("Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-16 text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              I'm always open to new opportunities, collaborations, or just a friendly chat. Send me a message and I'll get back to you as soon as possible.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thank you for reaching out. I'll respond to your email shortly.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Hello there, I'd like to talk about..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
