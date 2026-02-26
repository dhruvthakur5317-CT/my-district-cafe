"use client";

import { useState } from "react";
import axios from "axios";
import { Search, Loader2, Package, Clock, IndianRupee, Printer, Truck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackOrderPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const { data } = await axios.post("/api/orders/track", { query: searchQuery });
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            alert("Failed to track orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Printing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Ready': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'Delivered': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
            default: return 'text-white bg-white/10 border-white/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending': return <Clock className="w-5 h-5" />;
            case 'Printing': return <Printer className="w-5 h-5" />;
            case 'Ready': return <CheckCircle className="w-5 h-5" />;
            case 'Delivered': return <Truck className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 relative">
            <div className="max-w-3xl mx-auto">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-gradient">
                        Track <span className="text-white">Order</span>
                    </h1>
                    <p className="text-gray-400">Enter your 10-digit Phone Number or your Order ID to see your order history and live status.</p>
                </div>

                <div className="glass-dark p-6 rounded-3xl border border-white/10 mb-10 shadow-[0_0_30px_rgba(139,0,0,0.1)]">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Phone Number / Order ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none text-white font-medium"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !searchQuery.trim()}
                            className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center transition-all glow-red"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Track"}
                        </button>
                    </form>
                </div>

                <AnimatePresence mode="popLayout">
                    {hasSearched && !loading && orders.length === 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-12 glass border border-white/5 rounded-3xl">
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
                            <h3 className="text-xl font-black mb-2 uppercase tracking-widest text-white">No Orders Found</h3>
                            <p className="text-gray-400 text-sm">We couldn't find any orders matching that ID or Phone Number.</p>
                        </motion.div>
                    )}

                    {orders.map((order, i) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-dark border border-white/10 p-6 rounded-3xl mb-4 hover:border-primary/30 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                <div>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-xl font-black text-white">#{order._id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${getStatusColor(order.orderStatus)}`}>
                                        {getStatusIcon(order.orderStatus)}
                                        <span className="font-black uppercase tracking-widest text-sm">{order.orderStatus}</span>
                                    </div>
                                    {order.paymentStatus === "Paid" ? (
                                        <span className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1">
                                            <CheckCircle size={10} /> Paid via {order.razorpayPaymentId?.startsWith("UPI") ? "UPI" : "Online"}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-yellow-500 uppercase">
                                            Pay at Store
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-2">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Specs</p>
                                    <p className="text-sm font-bold text-gray-300">{order.printType} • {order.paperSize}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Delivery</p>
                                    <p className="text-sm font-bold text-gray-300">{order.deliveryOption}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Amount</p>
                                    <p className="text-sm font-bold text-primary-light flex items-center">
                                        <IndianRupee className="w-3 h-3" /> {order.totalPrice || order.amount / 100}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

            </div>
        </div>
    );
}
