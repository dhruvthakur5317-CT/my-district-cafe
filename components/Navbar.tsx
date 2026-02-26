"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Printer, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 glass border-b border-red-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.6 }}
                            className="p-2 bg-red-600 rounded-lg group-hover:bg-red-500 transition-colors"
                        >
                            <Printer className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold tracking-wider text-white">
                            MY DISTRICT <span className="text-red-500">CAFE</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        <NavLink href="#services">Services</NavLink>
                        <NavLink href="#contact">Contact</NavLink>
                        <Link
                            href="/print"
                            className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transform hover:-translate-y-0.5"
                        >
                            Upload & Print
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden glass"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink href="#services" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
                        <MobileNavLink href="#contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
                        <Link
                            href="/print"
                            className="block px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white text-center mt-4"
                            onClick={() => setIsOpen(false)}
                        >
                            Upload & Print
                        </Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
        href={href}
        className="text-gray-300 hover:text-white font-medium transition-colors relative group py-2"
    >
        {children}
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
    </Link>
);

const MobileNavLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => (
    <Link
        href={href}
        onClick={onClick}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-red-900/30"
    >
        {children}
    </Link>
);
