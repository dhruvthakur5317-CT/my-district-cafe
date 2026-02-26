"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Printer, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/#services" },
        { name: "Upload & Print", href: "/print" },
        { name: "Track Order", href: "/orders" },
        { name: "Contact", href: "/contact" },
        { name: "Legal", href: "/legal" },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass shadow-lg py-3" : "bg-transparent py-5"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform glow-red">
                            <Printer className="text-white w-6 h-6" />
                        </div>
                        <span className="font-black text-xl tracking-tighter uppercase text-foreground">
                            My District <span className="text-primary-light">Cafe</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/admin/login"
                            className="px-6 py-2 rounded-full border border-primary/50 text-primary-light text-sm font-bold tracking-widest uppercase hover:bg-primary/10 transition-all"
                        >
                            Admin
                        </Link>
                        
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-full glass border border-white/10 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button and theme toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                            >
                                {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 dark:text-gray-300 hover:text-primary p-2"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-dark absolute top-full left-0 w-full border-t border-white/10">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-4 text-base font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl uppercase tracking-widest"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/admin/login"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-4 text-primary-light font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 rounded-xl"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
