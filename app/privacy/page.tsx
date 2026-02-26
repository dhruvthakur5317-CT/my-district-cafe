import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Privacy <span className="text-red-500">Policy</span></h1>

                <div className="glass p-8 rounded-3xl border border-red-900/20 space-y-6 text-gray-300">
                    <p>Last updated: October 2023</p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information Collection</h2>
                    <p>
                        We collect information directly from you when you place an order. This includes your Name, Email Address, Contact Number, and the Documents you upload for printing. We process payments securely via Razorpay and do not store your credit card information.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Use of Information</h2>
                    <p>
                        The information we collect is used solely to process your printing and delivery orders, communicate order statuses, and improve our customer service.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. File Data Privacy</h2>
                    <p>
                        Your uploaded files are processed automatically and stored securely. We do not access, read, or share your documents unless a physical verification is required during the printing process. Files are deleted from our servers periodically after your order is successfully delivered.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact our 24x7 support through the Contact Us page.
                    </p>
                </div>
            </div>
        </main>
    );
}
