"use client";

import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { usePathname } from "next/navigation";

export default function TrackButton() {
    const pathname = usePathname();

    // Hide the button if we are already on the orders page or in the admin panel
    if (pathname === "/orders" || pathname.startsWith("/admin")) return null;

    return (
        <Link
            href="/orders"
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-primary hover:bg-primary-light text-white p-4 md:px-6 md:py-4 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] hover:scale-110 transition-all glow-red group"
            title="Track Order / Order History"
        >
            <PackageSearch size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="font-black uppercase tracking-widest text-sm hidden md:block">Track Order</span>
        </Link>
    );
}
