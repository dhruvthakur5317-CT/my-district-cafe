import Navbar from "@/components/Navbar";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Terms of <span className="text-red-500">Service</span></h1>

                <div className="glass p-8 rounded-3xl border border-red-900/20 space-y-6 text-gray-300">
                    <p>Last updated: October 2023</p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using the My District Cafe website and services, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Service Usage</h2>
                    <p>
                        Our 24x7 print, scan, and delivery services are subject to availability.
                        If you select "Home Delivery", ensure the address provided is within our district delivery radius. If the delivery fails due to an incorrect address, you are responsible for pickup from our store without a refund on delivery fees.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. File Uploads & Guidelines</h2>
                    <p>
                        You are solely responsible for the content of the files you upload for printing. My District Cafe will not print any illegal, offensive, or copyrighted materials without proper authorization. We reserve the right to cancel and refund any order violating these guidelines.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Payment & Refunds</h2>
                    <p>
                        Payments must be completed successfully before the printing process begins. If an error occurs during printing on our end, we will reprint the document at no additional cost. Refunds for customer errors (e.g., uploading the wrong file) are not supported once printing has commenced.
                    </p>
                </div>
            </div>
        </main>
    );
}
