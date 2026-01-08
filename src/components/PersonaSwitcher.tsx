"use client";

import { usePersona, PersonaType } from "@/context/PersonaContext";
import { Terminal, Lightbulb, Briefcase, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface PersonaSwitcherProps {
    className?: string;
    tooltipSide?: "top" | "bottom";
}

export default function PersonaSwitcher({ className, tooltipSide = "bottom" }: PersonaSwitcherProps) {
    const { currentPersona, setPersona } = usePersona();

    const buttons = [
        { id: "hacker", icon: Terminal, label: "Hacker" },
        { id: "hipster", icon: Lightbulb, label: "Hipster" },
        { id: "hustler", icon: Briefcase, label: "Hustler" },
        { id: "maker", icon: Settings, label: "Maker" },
    ];

    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem("hasSeenPersonaOnboarding");
        if (!hasSeen) {
            // Delay slightly to appear after load
            const timer = setTimeout(() => setShowTooltip(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSwitch = (id: PersonaType) => {
        setPersona(id);
        if (showTooltip) {
            setShowTooltip(false);
            localStorage.setItem("hasSeenPersonaOnboarding", "true");
        }
    };

    return (
        <div className={clsx("relative flex gap-4 p-2 bg-gray-100 dark:bg-gray-900 rounded-full shadow-inner", className)}>
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: tooltipSide === "top" ? 10 : -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={clsx(
                            "absolute left-1/2 -translate-x-1/2 w-48 text-center bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-2 px-3 rounded-lg shadow-xl z-50 pointer-events-none",
                            tooltipSide === "top" ? "bottom-full mb-4" : "top-full mt-4"
                        )}
                    >
                        {/* Arrow */}
                        <div className={clsx(
                            "absolute left-1/2 -translate-x-1/2 border-8 border-transparent",
                            tooltipSide === "top"
                                ? "bottom-[-16px] border-t-black dark:border-t-white"
                                : "top-[-16px] border-b-black dark:border-b-white"
                        )} />

                        Explore meus diferentes perfis!
                        <span className="block font-normal opacity-80 mt-1 text-[10px]">Clique para mudar</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {buttons.map((btn) => {
                const isActive = currentPersona === btn.id;
                return (
                    <button
                        key={btn.id}
                        onClick={() => handleSwitch(btn.id as PersonaType)}
                        className={clsx(
                            "p-3 rounded-full transition-all duration-300 relative group",
                            isActive
                                ? "bg-black text-white dark:bg-white dark:text-black scale-110 shadow-lg"
                                : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                        )}
                        title={btn.label}
                    >
                        <btn.icon size={20} />
                        <span className="sr-only">{btn.label}</span>

                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded pointer-events-none">
                            {btn.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
