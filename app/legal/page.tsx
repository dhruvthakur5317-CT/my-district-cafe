"use client";

export default function LegalPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto glass-dark p-10 md:p-16 rounded-[40px] border border-white/5">
                <h1 className="text-4xl md:text-5xl font-black mb-12 tracking-tighter uppercase text-gradient">Terms & Privacy <span className="text-white">Policy</span></h1>

                <div className="space-y-12 text-gray-400">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">1. Services</h2>
                        <p className="leading-relaxed">
                            My District Cafe provide digital printing, scanning, and stationery services. Orders placed via the website are subject to fulfillment based on shop operating hours and equipment availability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">2. File Data & Security</h2>
                        <p className="leading-relaxed mb-4">
                            We take your privacy seriously. Files uploaded for printing are temporarily stored on our secure servers and are automatically deleted 48 hours after the order is marked as 'Delivered' or 'Cancelled'.
                        </p>
                        <p className="leading-relaxed">
                            We do not share your documents or personal information with any third parties except for the purpose of essential payment processing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">3. Payments & Refunds</h2>
                        <p className="leading-relaxed">
                            Payments are processed securely via Razorpay. Due to the custom nature of printing, refunds are only issued if the service fails to be delivered (e.g., technical failure at the shop). Once a document is printed, no refunds will be provided.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">4. Delivery & Pickup</h2>
                        <p className="leading-relaxed">
                            'Pickup' orders must be collected within 7 days of the 'Ready' status. 'Home Delivery' is subject to geographic limitations and delivery charges as specified at the time of checkout.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">5. Contact Support</h2>
                        <p className="leading-relaxed">
                            For any queries regarding your data or orders, please contact us at +91 98765 43210 or visit us at our main location.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 text-center text-sm text-gray-600 uppercase font-bold tracking-widest">
                    Last Updated: February 2026
                </div>
            </div>
        </div>
    );
}
