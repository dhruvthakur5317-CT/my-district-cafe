"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get("/api/settings");
                if (data.success) setSettings(data.settings);
            } catch (error) {
                console.error("Failed to fetch settings");
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-gradient">Get In <span className="text-white">Touch</span></h1>
                        <p className="text-gray-400 max-w-md">Have a bulk order or a specific printing requirement? Reach out to us directly or visit our cafe.</p>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-8 h-full shadow-[0_0_30px_rgba(139,0,0,0.05)]">
                        <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-6">Contact Info</h3>
                        
                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary-light group-hover:bg-primary group-hover:text-white transition-colors">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Visit Us</p>
                                <p className="font-medium text-white">{settings?.address || "Loading..."}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary-light group-hover:bg-primary group-hover:text-white transition-colors">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                                <p className="font-medium text-white">{settings?.phone || "Loading..."}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary-light group-hover:bg-primary group-hover:text-white transition-colors">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                                <p className="font-medium text-white">{settings?.email || "Loading..."}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Message Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-dark p-8 md:p-10 rounded-[40px] border border-white/5"
                >
                    <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">Send a <span className="text-primary">Message</span></h2>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for the message! We'll reply soon."); }}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                            <input required className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-4 focus:border-primary outline-none transition-all text-white" placeholder="John Doe" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email / Phone</label>
                            <input required className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-4 focus:border-primary outline-none transition-all text-white" placeholder="john@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                            <textarea required rows={4} className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-4 focus:border-primary outline-none transition-all text-white resize-none" placeholder="How can we help?" />
                        </div>

                        <button type="submit" className="w-full py-5 bg-primary hover:bg-primary-light text-white rounded-2xl font-black text-lg transition-all shadow-xl glow-red flex items-center justify-center gap-3 mt-4">
                            SEND NOW <Send size={20} />
                        </button>
                    </form>
                </motion.div>

            </div>
        </div>
    );
}
