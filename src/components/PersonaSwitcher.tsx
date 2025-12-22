"use client";

import { usePersona, PersonaType } from "@/context/PersonaContext";
import { Terminal, Lightbulb, Briefcase, Settings } from "lucide-react";
import clsx from "clsx";

export default function PersonaSwitcher({ className }: { className?: string }) {
    const { currentPersona, setPersona } = usePersona();

    const buttons = [
        { id: "hacker", icon: Terminal, label: "Hacker" },
        { id: "hipster", icon: Lightbulb, label: "Hipster" },
        { id: "hustler", icon: Briefcase, label: "Hustler" },
        { id: "maker", icon: Settings, label: "Maker" },
    ];

    return (
        <div className={clsx("flex gap-4 p-2 bg-gray-100 dark:bg-gray-900 rounded-full shadow-inner", className)}>
            {buttons.map((btn) => {
                const isActive = currentPersona === btn.id;
                return (
                    <button
                        key={btn.id}
                        onClick={() => setPersona(btn.id as PersonaType)}
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
