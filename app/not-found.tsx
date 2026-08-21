import Link from "next/link";
import { Compass, Home } from "lucide-react";
import "./globals.css";

export default function RootNotFound() {
    return (
        <html lang="uz">
            <body className="antialiased">
                <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
                    <img
                        src="/images/404-bg.gif"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-[#12182A]/85 via-[#12182A]/70 to-[#12182A]/90" />

                    <div className="relative z-10 text-center max-w-md">
                        <span className="text-7xl md:text-8xl font-bold text-white">404</span>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Sahifa topilmadi
                        </h1>
                        <p className="text-white/70 mt-3">
                            Siz qidirayotgan sahifa mavjud emas yoki manzil o&apos;zgargan bo&apos;lishi mumkin. Ammo sayohat davom etadi.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-full bg-white text-[#1B3A6B] px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors w-full sm:w-auto justify-center"
                            >
                                <Home className="h-4 w-4" />
                                Bosh sahifa
                            </Link>
                            <Link
                                href="/tours"
                                className="inline-flex items-center gap-2 rounded-full bg-[#C98A2C] text-[#1E2430] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
                            >
                                <Compass className="h-4 w-4" />
                                Turlarni ko&apos;rish
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}