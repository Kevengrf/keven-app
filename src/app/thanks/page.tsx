"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Sponsor {
    id: string;
    logo_url: string;
    name: string;
}

export default function ThankYouPage() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [stars, setStars] = useState<{ top: string; left: string; width: string; height: string; opacity: number }[]>([]);

    useEffect(() => {
        const generatedStars = [...Array(100)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() < 0.5 ? '1px' : '2px',
            height: Math.random() < 0.5 ? '1px' : '2px',
            opacity: Math.random() * 0.7 + 0.3,
        }));
        setStars(generatedStars);
    }, []);

    useEffect(() => {
        async function fetchSponsors() {
            const { data } = await supabase.from("sponsors").select("*");
            if (data) setSponsors(data);
        }
        fetchSponsors();
    }, []);

    // Star Wars Crawl Effect
    const displaySponsors = sponsors.length > 0 ? [...sponsors, ...sponsors, ...sponsors] : [];

    return (
        <main className="min-h-screen bg-black overflow-hidden relative flex flex-col items-center justify-center font-sans">

            {/* Realistic Starfield Background */}
            <div className="absolute inset-0 bg-black z-0">
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.width,
                            height: star.height,
                            opacity: star.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Nebula / Galaxy Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-blue-900/10 via-purple-900/10 to-transparent mix-blend-screen pointer-events-none"></div>

            {/* Fade Overlay (Top) */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>

            {/* 3D Perspective Container */}
            <div className="relative w-full h-[100vh] flex justify-center overflow-hidden" style={{ perspective: '400px' }}>
                <motion.div
                    className="relative w-[300%] md:w-[60%] text-center text-yellow-400 font-bold tracking-widest uppercase"
                    style={{
                        transformOrigin: '50% 100%',
                        transform: 'rotateX(25deg)',
                        top: '100%'
                    }}
                    animate={{
                        top: '-300%'
                    }}
                    transition={{
                        duration: Math.max(30, sponsors.length * 5),
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="flex flex-col items-center gap-32 pb-[100vh]">
                        {/* Title inside the crawl */}
                        <div className="mb-12">
                            <h1 className="text-6xl md:text-8xl mb-4">Agradecimentos</h1>
                            <p className="text-2xl">Empresas parceiras</p>
                        </div>

                        {sponsors.length > 0 ? (
                            displaySponsors.map((partner, index) => (
                                <div key={`${partner.id}-${index}`} className="flex flex-col items-center gap-8 transform-style-3d">
                                    <div className="relative w-64 h-32 md:w-96 md:h-48 bg-black/50 border-4 border-yellow-400/30 rounded-lg p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={partner.logo_url}
                                                alt={partner.name || "Sponsor"}
                                                fill
                                                className="object-contain drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                            />
                                        </div>
                                    </div>
                                    {partner.name && <span className="text-3xl drop-shadow-md">{partner.name}</span>}
                                </div>
                            ))
                        ) : (
                            <div className="text-4xl text-yellow-600">Em uma galáxia distante...</div>
                        )}
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 z-30"
            >
                <Link
                    href="/"
                    className="flex items-center gap-2 text-yellow-400/70 hover:text-yellow-400 transition-colors uppercase tracking-widest text-sm border border-yellow-400/30 px-6 py-3 rounded-full hover:bg-yellow-400/10 hover:border-yellow-400"
                >
                    <ArrowLeft size={16} /> Voltar ao Início
                </Link>
            </motion.div>
        </main>
    );
}
