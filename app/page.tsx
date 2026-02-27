"use client";

import { ArrowRight, Printer, ShieldCheck, Zap, Scan, BookOpen, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const iconMap: Record<string, any> = {
  Printer, Scan, BookOpen, FileText, Zap, ShieldCheck
};

export default function Home() {
  const [settings, setSettings] = useState<any>({ services: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/api/settings");
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* Flash Banner */}
      {!loading && settings?.flashMessage?.isActive && new Date(settings.flashMessage.activeUntil) > new Date() && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-0 w-full z-40 bg-gradient-to-r from-red-900/90 via-primary/90 to-red-900/90 backdrop-blur-md text-white py-3 px-4 text-center text-sm font-bold shadow-[0_4px_30px_rgba(139,0,0,0.3)] flex justify-center items-center gap-3 border-b border-white/20 uppercase tracking-widest"
        >
          <Zap className="w-5 h-5 animate-pulse text-yellow-400" />
          <p>{settings.flashMessage.text}</p>
          <Zap className="w-5 h-5 animate-pulse text-yellow-400" />
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-tight">
            Your One Stop <br />
            <span className="text-gradient">Cyber & Print</span> <br />
            Solution
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Experience premium digital printing, scanning, and stationery
            services with seamless online ordering and tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/print"
              className="px-8 py-4 bg-primary hover:bg-primary-light text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(139,0,0,0.5)] flex items-center gap-2 group"
            >
              Upload & Print Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 glass text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Services Showcase */}
      <section id="services" className="py-24 px-4 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">
              Our <span className="text-primary-light">Services</span>
            </h2>
            <p className="text-gray-400 font-medium">Professional digital solutions for all your needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="glass p-8 rounded-3xl h-64 animate-pulse bg-white/5 border border-white/5"></div>
              ))
            ) : (
              settings.services.map((service: any, i: number) => {
                const IconComponent = iconMap[service.icon] || Zap;
                return (
                  <div
                    key={service.id || i}
                    className="glass p-8 rounded-3xl group hover:bg-white/5 transition-all border border-white/5 hover:border-primary/30 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-all"></div>
                    <IconComponent className="w-12 h-12 text-primary-light mb-6 group-hover:scale-110 transition-transform relative z-10" />
                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-widest relative z-10">{service.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                      {service.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
