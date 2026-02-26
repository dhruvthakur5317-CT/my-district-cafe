"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await axios.post("/api/admin/login", { username, password });
            if (data.success) {
                router.push("/admin/dashboard");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-black pt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-dark p-10 rounded-[40px] border border-white/5 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30">
                        <Lock className="text-primary w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Admin <span className="text-primary">Login</span></h1>
                    <p className="text-gray-500 text-sm mt-2">Access the District Cafe control center</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary outline-none transition-all text-white"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                required
                                type="password"
                                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary outline-none transition-all text-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-primary text-sm font-bold text-center bg-primary/10 py-3 rounded-xl border border-primary/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary hover:bg-primary-light text-white rounded-2xl font-black text-lg transition-all shadow-xl glow-red flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "SIGN IN"}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-xs mt-10 uppercase font-black tracking-widest">
                    Authorized Personnel Only
                </p>
            </motion.div>
        </div>
    );
}
