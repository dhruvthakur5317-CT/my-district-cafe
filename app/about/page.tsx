import Navbar from "@/components/Navbar";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">About <span className="text-red-500">My District Cafe</span></h1>

                <div className="glass p-8 md:p-12 rounded-3xl border border-red-900/20 text-left space-y-6">
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Welcome to <strong>My District Cafe</strong>, your one-stop solution for all professional printing, scanning, and stationery needs. Located at the heart of the district, we are committed to providing premium, fast, and reliable services to students, professionals, and businesses alike.
                    </p>

                    <p className="text-lg text-gray-300 leading-relaxed">
                        Understanding the urgent needs of our community, we operate <strong>24x7</strong>. Whether it's a late-night assignment printout, urgent legal documents, or stocking up on essential stationery for the next morning, our doors (and online uploading systems) are always open for you.
                    </p>

                    <div className="mt-8 pt-6 border-t border-red-900/30">
                        <h2 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h2>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div> 24x7 Availability</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Premium Quality Prints (B&W and Color)</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Hassle-free Online Upload & Order Tracking</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Doorstep Delivery within the district</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
