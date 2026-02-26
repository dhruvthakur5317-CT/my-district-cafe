"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    ClipboardList,
    Download,
    Search,
    Filter,
    RefreshCcw,
    CheckCircle,
    Clock,
    Printer,
    Truck,
    ExternalLink,
    LogOut,
    Loader2,
    Trash2,
    Settings as SettingsIcon,
    X,
    Plus,
    Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [siteSettings, setSiteSettings] = useState<any>(null);
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [newOrderToast, setNewOrderToast] = useState(false);
    const [viewingRecycleBin, setViewingRecycleBin] = useState(false);
    const [deletedOrders, setDeletedOrders] = useState<any[]>([]);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post("/api/admin/logout");
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            window.location.href = "/admin/login";
        }
    };

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get("/api/settings");
            if (data.success) setSiteSettings(data.settings);
        } catch (error) {
            console.error("Failed to fetch settings");
        }
    };

    const saveSettings = async () => {
        setSettingsSaving(true);
        try {
            const { data } = await axios.post("/api/settings", siteSettings);
            if (data.success) {
                setSiteSettings(data.settings);
                setShowSettingsModal(false);
            }
        } catch (error) {
            alert("Failed to save settings");
        } finally {
            setSettingsSaving(false);
        }
    };

    const knownOrderIdsRef = useRef<Set<string>>(new Set());

    const playNotificationSound = () => {
        setNewOrderToast(true);
        setTimeout(() => setNewOrderToast(false), 5000);
        if (!audioEnabled) return;
        try {
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play().catch(e => console.log("Audio play blocked", e));

            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, 3000);
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    const fetchOrders = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const { data } = await axios.get("/api/admin/orders");
            if (data.success) {
                const fetchedOrders = data.orders;
                setOrders(fetchedOrders);

                // Alert for any new order that was either paid online or marked as Cash
                // We keep validOrders filtered for sound alerts so we don't ring repeatedly for failed orders.
                const validOrders = fetchedOrders.filter((o: any) =>
                    o.paymentStatus === 'Paid' || o.paymentStatus === 'Pending Cash'
                );

                let hasNewOrder = false;

                validOrders.forEach((o: any) => {
                    if (!knownOrderIdsRef.current.has(o._id)) {
                        if (knownOrderIdsRef.current.size > 0) { // Don't ring on very first load
                            hasNewOrder = true;
                        }
                        knownOrderIdsRef.current.add(o._id);
                    }
                });

                if (hasNewOrder) {
                    playNotificationSound();
                }
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchSettings();

        // Poll for new orders every 10 seconds
        const intelvalId = setInterval(() => {
            fetchOrders(true);
        }, 10000);

        return () => clearInterval(intelvalId);
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            await axios.patch(`/api/admin/orders/${orderId}`, { orderStatus: newStatus });
            fetchOrders(true); // Refresh list in background
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const updatePaymentStatus = async (orderId: string, newStatus: string) => {
        try {
            await axios.patch(`/api/admin/orders/${orderId}`, { paymentStatus: newStatus });
            fetchOrders(true);
        } catch (error) {
            alert("Failed to update payment status");
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to move this specific order to the Recycle Bin?")) return;
        
        // Optimistic UI Update
        const targetOrder = orders.find(o => o._id === orderId);
        setOrders(prev => prev.filter(o => o._id !== orderId));
        
        try {
            await axios.delete(`/api/admin/orders/${orderId}`);
            if (targetOrder) setDeletedOrders(prev => [targetOrder, ...prev]);
        } catch (error) {
            alert("Failed to delete order");
            fetchOrders(); // Revert back if it fails
        }
    };

    const clearHistory = async () => {
        if (!confirm("Are you sure you want to clear all active order history? This cannot be undone.")) return;
        setLoading(true);
        try {
            const { data } = await axios.delete("/api/admin/orders/clear");
            if (data.success) {
                setOrders([]);
            }
        } catch (error) {
            alert("Failed to clear history");
        } finally {
            setLoading(false);
        }
    };

    const fetchDeletedOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/admin/recycle-bin");
            if (data.success) {
                setDeletedOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch deleted orders");
        } finally {
            setLoading(false);
        }
    };

    const restoreOrder = async (orderId: string) => {
        try {
            await axios.post(`/api/admin/recycle-bin/${orderId}`);
            setDeletedOrders(prev => prev.filter(o => o._id !== orderId));
            fetchOrders(true);
        } catch (error) {
            alert("Failed to restore order");
        }
    };

    const clearRecycleBin = async () => {
        if (!confirm("Are you sure you want to permanently delete ALL items in the Recycle Bin?")) return;
        setLoading(true);
        try {
            await axios.delete("/api/admin/recycle-bin");
            setDeletedOrders([]);
        } catch (error) {
            alert("Failed to clear recycle bin");
        } finally {
            setLoading(false);
        }
    };

    const handleDirectPrint = (url: string) => {
        const win = window.open(url, '_blank');
        if (win) {
            win.onload = () => {
                setTimeout(() => {
                    win.print();
                }, 500);
            };
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.phoneNumber.includes(searchTerm) ||
            o._id.includes(searchTerm);
        const matchesFilter = filterStatus === "All" || o.orderStatus === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const displayableList = viewingRecycleBin ? deletedOrders : filteredOrders;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Printing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Ready': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'Delivered': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
            default: return 'text-white bg-white/10 border-white/20';
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-black">
            <div className="max-w-7xl mx-auto">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <ClipboardList className="text-primary w-8 h-8" />
                            Admin <span className="text-primary-light">Dashboard</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-gray-500">Manage your cyber cafe print orders</p>
                            {!audioEnabled && (
                                <button
                                    onClick={() => setAudioEnabled(true)}
                                    className="bg-primary/20 text-primary-light text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest hover:bg-primary transition-colors hover:text-white border border-primary/50 animate-pulse hidden md:block"
                                >
                                    Enable Audio Alerts
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                        <button
                            onClick={() => {
                                setViewingRecycleBin(!viewingRecycleBin);
                                if (!viewingRecycleBin) fetchDeletedOrders();
                            }}
                            className={`flex items-center gap-2 px-6 py-3 glass-dark border rounded-xl transition-all text-sm font-bold ${viewingRecycleBin ? 'border-primary text-primary bg-primary/10' : 'border-white/5 text-gray-300 hover:bg-white/10'}`}
                        >
                            <Trash2 size={18} /> {viewingRecycleBin ? "BACK TO ORDERS" : "RECYCLE BIN"}
                        </button>
                        
                        {!viewingRecycleBin && (
                            <>
                            <button
                                onClick={() => setShowSettingsModal(true)}
                                className="flex items-center gap-2 px-6 py-3 glass-dark border border-white/5 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-gray-300"
                            >
                                <SettingsIcon size={18} /> SETTINGS
                            </button>
                            <button
                                onClick={clearHistory}
                                className="flex items-center gap-2 px-6 py-3 glass-dark border border-red-500/20 rounded-xl hover:bg-red-500/10 hover:border-red-500/50 transition-all text-sm font-bold text-red-500 hover:text-red-400"
                            >
                                <Trash2 size={18} /> CLEAR HISTORY
                            </button>
                            </>
                        )}

                        {viewingRecycleBin && (
                            <button
                                onClick={clearRecycleBin}
                                className="flex items-center gap-2 px-6 py-3 glass-dark border border-red-500/20 bg-red-500/10 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 transition-all text-sm font-bold text-red-500"
                            >
                                <Trash2 size={18} /> EMPTY BIN
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 glass-dark border border-white/5 rounded-xl hover:bg-primary/10 hover:border-primary/20 transition-all text-sm font-bold text-gray-400 hover:text-primary"
                        >
                            <LogOut size={18} /> LOGOUT
                        </button>
                        <button
                            onClick={() => fetchOrders(false)}
                            className="p-3 glass rounded-xl hover:bg-white/10 transition-all"
                        >
                            <RefreshCcw className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </header>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Orders", value: orders.filter(o => o.paymentStatus === 'Paid').length, icon: ClipboardList, color: "text-white" },
                        { label: "Printing Queue", value: orders.filter(o => o.orderStatus === 'Printing').length, icon: Printer, color: "text-blue-500" },
                        { label: "Ready for Pickup", value: orders.filter(o => o.orderStatus === 'Ready').length, icon: CheckCircle, color: "text-green-500" },
                        { label: "Home Deliveries", value: orders.filter(o => o.orderStatus === 'Ready' && o.deliveryOption === 'Home Delivery').length, icon: Truck, color: "text-primary" },
                    ].map((stat, i) => (
                        <div key={i} className="glass dark p-6 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-2xl font-black">{stat.value}</span>
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by Name, Phone, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none text-sm"
                        />
                    </div>
                    <div className="relative w-full md:w-64">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-primary outline-none appearance-none text-sm font-bold uppercase tracking-widest"
                        >
                            {["All", "Pending", "Printing", "Ready", "Delivered"].map(s => (
                                <option key={s} value={s}>{s} Status</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="glass-dark rounded-2xl border border-white/5 overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p className="font-bold uppercase tracking-widest">Loading Orders...</p>
                        </div>
                    ) : displayableList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-gray-500">
                            <ClipboardList className="w-12 h-12 mb-4 opacity-50" />
                            <p className="font-bold uppercase tracking-widest text-sm">
                                {viewingRecycleBin ? "Recycle bin is empty." : "No valid orders found."}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs text-gray-400 uppercase tracking-widest border-b border-white/10 bg-black/50">
                                <tr>
                                    <th className="px-6 py-4">Order ID & Date</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Print Specs</th>
                                    <th className="px-6 py-4">Document</th>
                                    <th className="px-6 py-4">Delivery</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 border-l border-white/5">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayableList.map((order, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={order._id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white mb-1">#{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                                <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded w-fit">
                                                {order.razorpayPaymentId === "CASH_COUNTER" ? "Cash at Store" : order.razorpayPaymentId?.startsWith("UPI") ? `UPI Ref: ${order.razorpayPaymentId.replace("UPI_", "")} (from ${order.upiName || "Unknown Sender"})` : order.razorpayPaymentId ? "Online / Card" : "Unpaid"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white capitalize">{order.customerName}</p>
                                            <p className="text-xs text-gray-400">{order.phoneNumber}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white font-medium">{order.printType} • {order.paperSize}</p>
                                            <p className="text-xs text-gray-400">{order.totalPages} pages × {order.numCopies} copies</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <a
                                                    href={order.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors w-full font-bold text-xs uppercase tracking-widest"
                                                >
                                                    <Download size={14} /> Download
                                                </a>
                                                <button
                                                    onClick={() => handleDirectPrint(order.fileUrl)}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors w-full font-bold text-xs uppercase tracking-widest"
                                                >
                                                    <Printer size={14} /> Print
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-xs uppercase tracking-widest text-gray-300">
                                                {order.deliveryOption}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-l border-white/5">
                                            {viewingRecycleBin ? (
                                                <button 
                                                    onClick={() => restoreOrder(order._id)}
                                                    className="p-3 w-full border border-green-500/30 rounded-lg text-green-500 hover:bg-green-500/10 hover:border-green-500/60 transition-colors flex items-center justify-center gap-2"
                                                    title="Restore Order"
                                                >
                                                    <RefreshCcw size={14} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Restore</span>
                                                </button>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                        className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-primary text-gray-300 hover:text-white"
                                                    >
                                                        {["Pending", "Printing", "Ready", "Delivered"].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={order.paymentStatus}
                                                        onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                                                        className="bg-black border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-green-500 text-gray-400 hover:text-white"
                                                    >
                                                        {["Pending Cash", "Paid", "Refunded", "Failed"].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                    <button 
                                                        onClick={() => deleteOrder(order._id)}
                                                        className="p-2 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-colors flex items-center justify-center gap-2"
                                                        title="Trash Order"
                                                    >
                                                        <Trash2 size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Trash</span>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* SETTINGS MODAL */}
            {showSettingsModal && siteSettings && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-zinc-950 border border-white/10 p-8 rounded-3xl max-w-2xl w-full shadow-[0_0_50px_rgba(139,0,0,0.1)] my-8 relative"
                    >
                        <button onClick={() => setShowSettingsModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                            <SettingsIcon className="text-primary" /> Admin Settings
                        </h2>

                        <div className="space-y-6">
                            {/* Audio Alerts */}
                            <div className="p-4 rounded-2xl glass border border-white/5 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-white">Audio Notifications</h3>
                                    <p className="text-xs text-gray-400">Play a chime when new paid orders arrive.</p>
                                </div>
                                <button
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    className={`w-14 h-8 rounded-full transition-colors relative ${audioEnabled ? 'bg-primary' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${audioEnabled ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-primary-light uppercase tracking-widest border-b border-white/10 pb-2">Business Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                                        <input
                                            value={siteSettings.phone}
                                            onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
                                        <input
                                            value={siteSettings.email}
                                            onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shop Address</label>
                                    <textarea
                                        value={siteSettings.address}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none min-h-[80px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">Receiving UPI ID <span className="bg-green-500/20 text-green-500 text-[9px] px-2 py-0.5 rounded-full">Primary</span></label>
                                    <input
                                        value={siteSettings.upiId || ""}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, upiId: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-green-500 outline-none text-green-400 font-medium tracking-wide"
                                        placeholder="e.g. yourname@ybl"
                                    />
                                    <p className="text-[10px] text-gray-500">Customers will send payments directly to this UPI handle.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Username</label>
                                        <input
                                            value={siteSettings.adminUsername || ""}
                                            onChange={(e) => setSiteSettings({ ...siteSettings, adminUsername: e.target.value })}
                                            className="w-full bg-black border border-red-500/20 rounded-xl py-3 px-4 focus:border-red-500 outline-none"
                                            placeholder="ADMIN"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Password</label>
                                        <input
                                            type="text"
                                            value={siteSettings.adminPassword || ""}
                                            onChange={(e) => setSiteSettings({ ...siteSettings, adminPassword: e.target.value })}
                                            className="w-full bg-black border border-red-500/20 rounded-xl py-3 px-4 focus:border-red-500 outline-none"
                                            placeholder="admin123"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Services Editor */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <h3 className="font-bold text-lg text-primary-light uppercase tracking-widest">Services Offered</h3>
                                    <button
                                        onClick={() => setSiteSettings({ ...siteSettings, services: [...siteSettings.services, { id: Date.now().toString(), title: "New Service", description: "Description here", icon: "Star" }] })}
                                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded font-bold flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={14} /> Add Service
                                    </button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                                    {siteSettings.services.map((service: any, index: number) => (
                                        <div key={service.id} className="p-4 glass-dark rounded-xl border border-white/5 relative group">
                                            <button
                                                onClick={() => {
                                                    const newServices = [...siteSettings.services];
                                                    newServices.splice(index, 1);
                                                    setSiteSettings({ ...siteSettings, services: newServices });
                                                }}
                                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="mb-3">
                                                <input
                                                    value={service.title}
                                                    onChange={(e) => {
                                                        const newServices = [...siteSettings.services];
                                                        newServices[index].title = e.target.value;
                                                        setSiteSettings({ ...siteSettings, services: newServices });
                                                    }}
                                                    className="w-full bg-transparent font-bold text-white outline-none border-b border-white/10 focus:border-primary pb-1"
                                                    placeholder="Service Title"
                                                />
                                            </div>
                                            <div>
                                                <textarea
                                                    value={service.description}
                                                    onChange={(e) => {
                                                        const newServices = [...siteSettings.services];
                                                        newServices[index].description = e.target.value;
                                                        setSiteSettings({ ...siteSettings, services: newServices });
                                                    }}
                                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-400 outline-none focus:border-primary min-h-[60px]"
                                                    placeholder="Service Description"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={saveSettings}
                                disabled={settingsSaving}
                                className="w-full py-4 bg-primary hover:bg-primary-light text-white rounded-xl font-bold uppercase tracking-widest transition-all glow-red flex justify-center items-center gap-2 mt-4"
                            >
                                {settingsSaving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* INCOMING ORDER TOAST */}
            <AnimatePresence>
                {newOrderToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-black px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.5)] font-black uppercase tracking-widest flex items-center gap-3 border-2 border-green-400"
                    >
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                        New Order Received!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
