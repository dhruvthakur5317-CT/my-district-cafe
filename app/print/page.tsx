"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, Trash2, Printer, CheckCircle, IndianRupee, MapPin, Phone, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const PRICING = {
    "B&W": { A4: 2, A3: 5, Legal: 3 },
    Color: { A4: 10, A3: 20, Legal: 15 },
};

export default function PrintPage() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<{ orderId: string, dbOrderId: string } | null>(null);
    const [siteSettings, setSiteSettings] = useState<any>({ upiId: "" });
    const [utrNumber, setUtrNumber] = useState("");
    const [upiName, setUpiName] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CASH" | null>(null);

    const [orderDetails, setOrderDetails] = useState({
        printType: "B&W" as "B&W" | "Color",
        paperSize: "A4" as "A4" | "A3" | "Legal",
        numCopies: 1,
        totalPages: 1, // User estimates this for now, verify later
        customInstructions: "",
        deliveryOption: "Pickup" as "Pickup" | "Home Delivery",
    });

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStep(2);
        }
    }, []);

    useEffect(() => {
        axios.get("/api/settings").then(res => {
            if (res.data.success) {
                setSiteSettings(res.data.settings);
            }
        }).catch(err => console.error(err));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
        },
        maxFiles: 1,
    });

    const calculatePrice = () => {
        const basePrice = PRICING[orderDetails.printType][orderDetails.paperSize];
        const subtotal = basePrice * orderDetails.totalPages * orderDetails.numCopies;
        const deliveryCharge = orderDetails.deliveryOption === "Home Delivery" ? 50 : 0;
        return subtotal + deliveryCharge;
    };

    const totalPrice = calculatePrice();

    const handlePaymentInit = async () => {
        setLoading(true);
        try {
            // Mock Cloudinary Upload Simulation
            const fakeUploadedUrl = "https://res.cloudinary.com/demo/image/upload/v1550000000/sample.jpg";

            // Create Order on Backend (Mocked in memory)
            const createRes = await axios.post("/api/order/create", {
                customerName: customer.name,
                phoneNumber: customer.phone,
                email: customer.email,
                fileUrl: fakeUploadedUrl,
                fileName: file?.name,
                fileType: file?.type,
                printType: orderDetails.printType,
                paperSize: orderDetails.paperSize,
                numCopies: orderDetails.numCopies,
                totalPages: orderDetails.totalPages,
                customInstructions: orderDetails.customInstructions,
                deliveryOption: orderDetails.deliveryOption,
                totalPrice: totalPrice,
            });

            setCurrentOrderId({ orderId: createRes.data.orderId, dbOrderId: createRes.data.dbOrderId });
            setShowPaymentModal(true); // Open the custom payment modal
        } catch (error) {
            console.error(error);
            alert("Something went wrong during checkout initialization.");
        } finally {
            setLoading(false);
        }
    };

    const handleSimulatedPayment = async (method: "UPI" | "CASH") => {
        if (method === "UPI" && (utrNumber.length < 6 || upiName.trim().length === 0)) {
            alert("Please enter both your UPI Sender Name and a valid UTR Reference Number.");
            return;
        }

        setLoading(true);
        try {
            await new Promise(res => setTimeout(res, 1500));

            const verifyRes = await axios.post("/api/order/verify", {
                razorpay_payment_id: method === "CASH" ? "CASH_COUNTER" : `UPI_${utrNumber}`,
                upiName: method === "UPI" ? upiName.trim() : undefined,
                razorpay_order_id: currentOrderId?.orderId,
                razorpay_signature: "mock_signature_for_demo",
                dbOrderId: currentOrderId?.dbOrderId,
            });

            if (verifyRes.data.success) {
                setShowPaymentModal(false);
                setStep(4);
            } else {
                alert("Order Confirmation Failed!");
            }
        } catch (err) {
            alert("Verification Failed. Check Console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 relative">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-gradient">Fast & Secure <span className="text-white">Printing</span></h1>
                    <p className="text-gray-400">Upload your documents and get them printed with premium quality.</p>
                </div>

                {/* Stepper */}
                <div className="flex justify-center items-center mb-12 hidden md:flex">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? "bg-primary text-white shadow-[0_0_15px_rgba(139,0,0,0.5)]" : "glass text-gray-500"}`}>
                                {s}
                            </div>
                            {s < 4 && <div className={`w-20 h-1 mx-2 rounded ${step > s ? "bg-primary" : "bg-white/10"}`} />}
                        </div>
                    ))}
                </div>

                <div className="glass-dark p-8 md:p-12 rounded-[40px] border border-white/5 relative overflow-hidden">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: UPLOAD */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-tight">Upload Document</h2>
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-[30px] p-12 text-center cursor-pointer transition-all ${isDragActive ? "border-primary bg-primary/10" : "border-white/20 hover:border-primary/50 hover:bg-white/5"}`}
                                >
                                    <input {...getInputProps()} />
                                    <UploadCloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <p className="text-lg font-bold mb-2">Drag & drop your file here</p>
                                    <p className="text-sm text-gray-500">Supports PDF, DOCX, JPG, PNG (Max 50MB)</p>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: PRINT OPTIONS */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                                    <h2 className="text-2xl font-bold uppercase tracking-tight">Print Configurations</h2>
                                    <div className="flex gap-4">
                                        <button onClick={() => file && window.open(URL.createObjectURL(file))} className="text-sm font-bold text-primary-light hover:text-white transition-colors uppercase tracking-widest">Preview</button>
                                        <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Change File</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Left Col - Settings */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Print Type</label>
                                            <select
                                                value={orderDetails.printType}
                                                onChange={(e) => setOrderDetails(prev => ({ ...prev, printType: e.target.value as "B&W" | "Color" }))}
                                                className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 focus:border-primary outline-none"
                                            >
                                                <option value="B&W">Black & White (₹2 - ₹5)</option>
                                                <option value="Color">Color (₹10 - ₹20)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paper Size</label>
                                            <select
                                                value={orderDetails.paperSize}
                                                onChange={(e) => setOrderDetails(prev => ({ ...prev, paperSize: e.target.value as "A4" | "A3" | "Legal" }))}
                                                className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 focus:border-primary outline-none"
                                            >
                                                <option value="A4">A4 Standard</option>
                                                <option value="A3">A3 Large</option>
                                                <option value="Legal">Legal Size</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="space-y-2 flex-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pages</label>
                                                <input type="number" min="1" value={orderDetails.totalPages} onChange={(e) => setOrderDetails(prev => ({ ...prev, totalPages: parseInt(e.target.value) || 1 }))} className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 focus:border-primary outline-none" />
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Copies</label>
                                                <input type="number" min="1" value={orderDetails.numCopies} onChange={(e) => setOrderDetails(prev => ({ ...prev, numCopies: parseInt(e.target.value) || 1 }))} className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 focus:border-primary outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Col - Summary */}
                                    <div className="bg-black/50 p-6 rounded-2xl border border-white/5 h-fit text-sm">
                                        <h3 className="font-bold text-lg mb-4 uppercase tracking-tighter">Order Summary</h3>
                                        <div className="space-y-3 text-gray-400 mb-6 font-medium">
                                            <div className="flex justify-between">
                                                <span>File Name</span>
                                                <span className="text-white truncate max-w-[150px]">{file?.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Base Cost</span>
                                                <span className="text-white">₹{PRICING[orderDetails.printType][orderDetails.paperSize]} / page</span>
                                            </div>
                                            <div className="flex justify-between border-t border-white/10 pt-3">
                                                <span className="font-bold text-white uppercase tracking-widest">Subtotal</span>
                                                <span className="font-bold text-xl text-primary-light">₹{totalPrice}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setStep(3)}
                                            className="w-full py-4 bg-primary hover:bg-primary-light text-white rounded-xl font-bold transition-all shadow-lg glow-red"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: CUSTOMER & PAYMENT */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                                    <h2 className="text-2xl font-bold uppercase tracking-tight">Delivery & Payment</h2>
                                    <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-white transition-colors">Back</button>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                                            <input value={customer.name} onChange={e => setCustomer(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 focus:border-primary outline-none" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                                            <input
                                                value={customer.phone}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                                    if (val.length <= 10) setCustomer(prev => ({ ...prev, phone: val }));
                                                }}
                                                className={`w-full bg-black border rounded-xl py-4 px-4 focus:border-primary outline-none ${customer.phone && customer.phone.length !== 10 ? 'border-red-500' : 'border-white/10'}`}
                                                placeholder="9876543210"
                                            />
                                            {customer.phone && customer.phone.length !== 10 && <p className="text-red-500 text-xs mt-1">Must be exactly 10 digits</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                                        <input value={customer.email} onChange={e => setCustomer(prev => ({ ...prev, email: e.target.value }))} type="email" className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 focus:border-primary outline-none" placeholder="john@example.com" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Method</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setOrderDetails(p => ({ ...p, deliveryOption: "Pickup" }))}
                                                className={`py-4 rounded-xl border transition-all text-sm font-bold uppercase tracking-widest ${orderDetails.deliveryOption === 'Pickup' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-black border-white/10 text-gray-400 hover:border-white/30'}`}
                                            >
                                                Store Pickup
                                            </button>
                                            <button
                                                onClick={() => setOrderDetails(p => ({ ...p, deliveryOption: "Home Delivery" }))}
                                                className={`py-4 rounded-xl border transition-all text-sm font-bold uppercase tracking-widest flex items-center justify-center flex-col ${orderDetails.deliveryOption === 'Home Delivery' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-black border-white/10 text-gray-400 hover:border-white/30'}`}
                                            >
                                                <span>Home Delivery</span>
                                                <span className="text-[10px] mt-1 opacity-70">+ ₹50 Charge</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-primary/10 border border-primary/20 rounded-2xl">
                                    <div className="mb-4 md:mb-0">
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount Payable</p>
                                        <p className="text-4xl font-black text-white flex items-center gap-1">
                                            <IndianRupee className="w-8 h-8 text-primary" /> {totalPrice}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <button
                                            onClick={handlePaymentInit}
                                            disabled={loading || !customer.name || customer.phone.length !== 10}
                                            className="w-full md:w-auto px-10 py-5 bg-primary hover:bg-primary-light disabled:opacity-50 text-white rounded-xl font-black text-lg transition-all shadow-xl glow-red flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : "PAY SECURELY"}
                                        </button>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-3">
                                            <span>✓ UPI (GPay/PhonePe)</span>
                                            <span>✓ Cards</span>
                                            <span>✓ 100% Secure</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: SUCCESS */}
                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white">Order Confirmed!</h2>

                                <div className="glass p-6 rounded-2xl inline-block mb-8 border border-primary/20 bg-primary/5 min-w-[300px]">
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Your Order ID:</p>
                                    <p className="text-4xl font-black text-primary-light tracking-widest">#{currentOrderId?.dbOrderId?.slice(-6).toUpperCase()}</p>
                                    <p className="text-[10px] text-gray-500 mt-3 uppercase tracking-widest font-bold">Use this ID or your phone number to track your order.</p>
                                </div>

                                <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm hidden">
                                    Your print order has been successfully placed. You will receive an email confirmation shortly.
                                </p>
                                <button
                                    onClick={() => { setStep(1); setFile(null); }}
                                    className="px-8 py-4 border border-white/20 hover:bg-white/10 text-white rounded-full font-bold transition-all"
                                >
                                    Print Another Document
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            {/* CUSTOM PAYMENT GATEWAY MODAL FOR DEMONSTRATION */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-zinc-950 border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(139,0,0,0.3)]"
                    >
                        <h3 className="text-xl font-black mb-2 uppercase tracking-tight text-white">Select Payment Mode</h3>
                        <p className="text-sm text-gray-400 mb-6">Amount to pay: <span className="text-primary-light font-bold">₹{totalPrice}</span></p>

                        {loading ? (
                            <div className="py-8 flex flex-col items-center">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">Processing Payment...</p>
                            </div>
                        ) : paymentMethod === "UPI" ? (
                            <div className="space-y-4 text-left">
                                <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl rounded-full"></div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Send ₹{totalPrice} exactly to UPI ID:</p>
                                    <p className="text-lg font-black text-white select-all">{siteSettings?.upiId || "mydistrictcafe@upi"}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sender Name (from UPI App)</label>
                                    <input
                                        value={upiName}
                                        onChange={(e) => setUpiName(e.target.value)}
                                        placeholder="e.g. John Doe (Required)"
                                        className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none text-white text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enter UTR / Ref Number</label>
                                    <input
                                        value={utrNumber}
                                        onChange={(e) => setUtrNumber(e.target.value)}
                                        placeholder="e.g. 123456789012"
                                        className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none text-white text-sm"
                                    />
                                </div>
                                <button
                                    onClick={() => handleSimulatedPayment("UPI")}
                                    className="w-full py-4 bg-primary hover:bg-primary-light text-white rounded-xl font-bold uppercase tracking-widest transition-all glow-red mt-2"
                                >
                                    Verify Payment & Continue
                                </button>
                                <button onClick={() => setPaymentMethod(null)} className="w-full text-xs text-gray-500 hover:text-white uppercase font-bold tracking-widest pt-2">Back to Payment Options</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={() => setPaymentMethod("UPI")}
                                    className="w-full p-4 rounded-xl border border-white/10 bg-black hover:border-primary/50 flex flex-col justify-center items-center group transition-colors gap-2"
                                >
                                    <span className="font-bold text-white group-hover:text-primary text-lg">Pay via UPI</span>
                                    <span className="text-xs font-bold text-gray-500">Google Pay, PhonePe, Paytm</span>
                                </button>

                                <button
                                    onClick={() => handleSimulatedPayment("CASH")}
                                    className="w-full p-4 rounded-xl border border-white/10 bg-black hover:border-green-500/50 flex flex-col justify-center items-center group transition-colors gap-2"
                                >
                                    <span className="font-bold text-white group-hover:text-green-500 text-lg">Pay with Cash</span>
                                    <span className="text-xs font-bold text-gray-500">Pay directly at the store counter</span>
                                </button>

                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="mt-4 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest pt-4 block w-full border-t border-white/5"
                                >
                                    Cancel & Return
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
