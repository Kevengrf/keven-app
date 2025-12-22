"use client";

import { motion } from "framer-motion";

interface AboutProps {
    aboutText?: string | null;
    skills?: string[] | null;
    personas?: any;
}

const defaultSkills = [
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL", "Git"
];

import { usePersona } from "@/context/PersonaContext";
import clsx from "clsx";

// ...

export default function About({ aboutText, skills, personas }: AboutProps) {
    const { currentPersona, theme } = usePersona();

    // Get skills for current persona, falling back to global skills or defaults
    const personaSkills = personas?.[currentPersona]?.skills;
    const displaySkills = (personaSkills && personaSkills.length > 0)
        ? personaSkills
        : (skills && skills.length > 0 ? skills : defaultSkills);

    return (
        <section id="about" className={clsx("py-20 transition-colors duration-500",
            (currentPersona === 'hacker' || currentPersona === 'hustler') ? 'bg-transparent' : 'bg-gray-50 dark:bg-gray-900'
        )}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className={clsx("text-3xl font-bold mb-8", theme.text)}>Sobre Mim</h2>
                    <p className={clsx("text-lg mb-8 leading-relaxed whitespace-pre-wrap",
                        currentPersona === 'hacker' ? theme.text : "text-gray-600 dark:text-gray-300"
                    )}>
                        {aboutText || "Sou um desenvolvedor apaixonado por tecnologia e inovação. Gosto de criar aplicações que não apenas funcionam, mas que proporcionam uma ótima experiência ao usuário."}
                    </p>

                    <div className="flex flex-wrap justify-center gap-3">
                        {displaySkills.map((skill, index) => (
                            <span
                                key={index}
                                className={clsx("px-4 py-2 rounded-lg shadow-sm font-medium border",
                                    currentPersona === 'hacker'
                                        ? "bg-black/50 border-green-800 text-green-400"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-gray-700"
                                )}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
