"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";

// Placeholder data - User can replace these with real company logos later
const partners = [
    { name: "Company Alpha", logo: "https://placehold.co/200x100/111/FFF?text=Alpha" },
    { name: "Studio Beta", logo: "https://placehold.co/200x100/222/FFF?text=Beta" },
    { name: "Gamma Corp", logo: "https://placehold.co/200x100/333/FFF?text=Gamma" },
    { name: "Delta Inc", logo: "https://placehold.co/200x100/444/FFF?text=Delta" },
    { name: "Epsilon Tech", logo: "https://placehold.co/200x100/555/FFF?text=Epsilon" },
    { name: "Zeta Systems", logo: "https://placehold.co/200x100/666/FFF?text=Zeta" },
];

// Duplicate list for seamless loop
const allPartners = [...partners, ...partners, ...partners];

export default function ThankYouPage() {
    return (
        <main className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col items-center justify-center">

            {/* Background Noise/Grain Overlay (Optional mainly for cinematic feel) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="z-10 text-center mb-12 relative flex-shrink-0 pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400 fill-yellow-400" />
                    <h1 className="text-4xl md:text-6xl font-bold tracking-widest uppercase mb-2">Agradecimentos</h1>
                    <p className="text-gray-400 text-lg uppercase tracking-widest">Empresas que fizeram parte da jornada</p>
                </motion.div>
            </div>

            {/* Credit Roll Container */}
            <div className="relative w-full max-w-md h-[50vh] overflow-hidden mask-vertical-fade">
                {/* 
                   Mask for fading out top and bottom:
                   We can use CSS mask-image or a simple overlay gradient.
                   Let's use absolute gradients for simplicity.
                */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20"></div>

                <motion.div
                    className="flex flex-col items-center gap-16 py-8"
                    animate={{
                        y: ["0%", "-50%"]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {allPartners.map((partner, index) => (
                        <div key={`${partner.name}-${index}`} className="flex flex-col items-center gap-4">
                            <div className="w-48 h-24 relative grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 mix-blend-screen bg-white/5 rounded-lg flex items-center justify-center">
                                {/* Using simple text fallback if image fails, or next/image */}
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-w-full max-h-full object-contain p-4"
                                />
                            </div>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">{partner.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="mt-12 mb-12 z-20"
            >
                <Link
                    href="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-sm border border-gray-800 px-6 py-3 rounded-full hover:bg-white/10"
                >
                    <ArrowLeft size={16} /> Voltar ao Início
                </Link>
            </motion.div>
        </main>
    );
}
