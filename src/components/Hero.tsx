"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, FileText } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import clsx from "clsx";

interface HeroProps {
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    photoUrl?: string | null;
    resumeUrl?: string | null;
    personas?: any; // JSON from Supabase
}

export default function Hero({ title, subtitle, description, photoUrl, resumeUrl, personas }: HeroProps) {
    const { currentPersona, theme } = usePersona();

    // Determine content based on persona overrides, falling back to default props
    const personaData = personas?.[currentPersona] || {};

    const displayTitle = personaData.hero_title || title || "Keven William";
    const displaySubtitle = personaData.hero_subtitle || subtitle || "Olá, eu sou";
    const displayDescription = personaData.hero_description || description || "Desenvolvedor apaixonado por criar experiências digitais únicas.";
    const displayPhoto = personaData.photo_url || photoUrl || "/profile.jpg";

    return (
        <section className={clsx("min-h-screen flex items-center justify-center pt-20 px-6 transition-colors duration-500", theme.bg)}>
            <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">

                <motion.div
                    key={currentPersona} // Re-animate on persona change
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="order-2 md:order-1 space-y-6"
                >
                    <h2 className={clsx("text-xl font-medium", theme.text)}>
                        {displaySubtitle}
                    </h2>
                    <h1 className={clsx("text-5xl md:text-7xl font-bold tracking-tight", theme.text)}>
                        {displayTitle}
                    </h1>
                    <p className={clsx("text-xl max-w-lg leading-relaxed mix-blend-difference", theme.text)}>
                        {displayDescription}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <a
                            href="#projects"
                            className={clsx(
                                "px-8 py-3 rounded-full font-medium transition-colors border",
                                theme.primary === "bg-black dark:bg-white"
                                    ? "bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-transparent"
                                    : `text-white border-transparent ${theme.primary} brightness-110`
                            )}
                        >
                            Ver Projetos
                        </a>
                        <a
                            href={resumeUrl || "/resume.pdf"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={clsx(
                                "px-8 py-3 border rounded-full font-medium transition-colors flex items-center gap-2",
                                theme.text,
                                "border-current hover:opacity-70"
                            )}
                        >
                            <FileText size={20} />
                            Currículo
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    key={`photo-${currentPersona}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="order-1 md:order-2 flex justify-center"
                >
                    <div className={clsx("relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500",
                        currentPersona === 'hacker' ? 'border-green-500' :
                            currentPersona === 'hipster' ? 'border-pink-500 rotate-3' :
                                currentPersona === 'hustler' ? 'border-blue-700' :
                                    "border-gray-100 dark:border-gray-800"
                    )}>
                        <Image
                            src={displayPhoto}
                            alt={displayTitle}
                            fill
                            className="object-cover"
                            style={{ objectPosition: personaData.photo_position || 'center' }}
                            priority
                        />
                    </div>
                </motion.div>

            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className={clsx("absolute bottom-8 left-1/2 -translate-x-1/2", theme.text)}
            >
                <ArrowDown size={24} />
            </motion.div>
        </section>
    );
}
