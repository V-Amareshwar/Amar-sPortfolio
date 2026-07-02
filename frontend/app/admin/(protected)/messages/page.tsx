"use client";

import React, { useState, useEffect } from "react";
import { apiGetMessages, apiUpdate, apiDelete } from "../../../../lib/api";
import { Mail, Trash2, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await apiGetMessages();
      // Sort by newest first
      data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMessages(data);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, currentReadStatus: boolean) => {
    try {
      await apiUpdate("messages", id, { read: !currentReadStatus });
      setMessages(messages.map(m => m.id === id ? { ...m, read: !currentReadStatus } : m));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await apiDelete("messages", id);
      setMessages(messages.filter(m => m.id !== id));
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  if (loading) return <div className="p-8">Loading messages...</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-gray-500 mt-2">Manage contact form submissions</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No messages yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-6 transition-colors ${message.read ? 'bg-white' : 'bg-blue-50/30'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-bold text-lg ${message.read ? 'text-gray-900' : 'text-blue-900'}`}>
                        {message.name}
                      </h3>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                      {!message.read && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <a href={`mailto:${message.email}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                      {message.email}
                    </a>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 whitespace-pre-wrap">
                      {message.message}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => markAsRead(message.id, message.read)}
                      className={`p-2 rounded-lg transition-colors ${message.read ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
                      title={message.read ? "Mark as unread" : "Mark as read"}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(message.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
