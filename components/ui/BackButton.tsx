"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function BackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) return null;

    // Don't show the back button on the homepage or admin dashboard main screen
    if (pathname === "/" || pathname === "/admin/dashboard") return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => router.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed top-24 left-4 md:left-8 z-[60] flex items-center justify-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 hover:border-primary/50 transition-all font-bold text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(139,0,0,0.3)] group"
            >
                <ArrowLeft className="w-4 h-4 text-primary group-hover:text-primary-light transition-colors" />
                <span className="hidden sm:inline">Back</span>
            </motion.button>
        </AnimatePresence>
    );
}
