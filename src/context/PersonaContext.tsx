"use client";

import React, { createContext, useContext, useState } from "react";
import MatrixRain from "@/components/effects/MatrixRain";
import WorldMapBackground from "@/components/effects/WorldMapBackground";

export type PersonaType = "maker" | "hacker" | "hipster" | "hustler";

interface PersonaContextType {
    currentPersona: PersonaType;
    setPersona: (persona: PersonaType) => void;
    theme: {
        bg: string;
        text: string;
        primary: string;
        accent: string;
        font: string;
    };
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

// Theme Definitions
const themeMap = {
    maker: {
        bg: "bg-white dark:bg-black",
        text: "text-gray-900 dark:text-gray-100",
        primary: "bg-black dark:bg-white",
        accent: "decoration-blue-500",
        font: "font-sans",
    },
    hacker: {
        bg: "bg-transparent", // Transparent so Matrix Rain shows through sections
        text: "text-green-500",
        primary: "bg-green-600",
        accent: "decoration-green-700",
        font: "font-mono",
    },
    hipster: {
        bg: "bg-[#fdf6e3] dark:bg-[#1a1a1a]", // Solarized Light-ish / Dark
        text: "text-[#657b83] dark:text-[#E0E0E0]",
        primary: "bg-[#d33682]", // Magenta
        accent: "decoration-pink-500",
        font: "font-serif",
    },
    hustler: {
        bg: "bg-transparent", // Transparent for World Map
        text: "text-slate-800 dark:text-slate-200",
        primary: "bg-blue-700",
        accent: "decoration-amber-500",
        font: "font-sans",
    },
};

export function PersonaProvider({ children }: { children: React.ReactNode }) {
    const [currentPersona, setCurrentPersona] = useState<PersonaType>("maker");

    const setPersona = (persona: PersonaType) => {
        setCurrentPersona(persona);
        // Persist to local storage if desired, keeping simple for now
    };

    // Auto-switch personas with idle detection
    React.useEffect(() => {
        let rotationInterval: NodeJS.Timeout;
        let idleTimeout: NodeJS.Timeout;

        // Function to start rotation
        const startRotation = () => {
            if (rotationInterval) clearInterval(rotationInterval);

            const personas: PersonaType[] = ["maker", "hacker", "hipster", "hustler"];
            rotationInterval = setInterval(() => {
                setCurrentPersona(prev => {
                    const currentIndex = personas.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % personas.length;
                    return personas[nextIndex];
                });
            }, 5000); // Rotate every 5 seconds
        };

        // Function to stop rotation
        const stopRotation = () => {
            if (rotationInterval) clearInterval(rotationInterval);
        };

        // Interaction handler
        const handleInteraction = () => {
            stopRotation(); // Stop immediately on interaction

            if (idleTimeout) clearTimeout(idleTimeout);

            // Restart rotation after 10 seconds of inactivity
            idleTimeout = setTimeout(() => {
                startRotation();
            }, 10000);
        };

        // Add listeners
        const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
        events.forEach(event => window.addEventListener(event, handleInteraction));

        // Initial start (assume idle or wait? Let's start immediately for "wow" factor, or wait 10s?
        // User asked: "if stop using, 10s passes, then it switches".
        // Let's start the idle timer initially.
        handleInteraction();

        return () => {
            if (rotationInterval) clearInterval(rotationInterval);
            if (idleTimeout) clearTimeout(idleTimeout);
            events.forEach(event => window.removeEventListener(event, handleInteraction));
        };
    }, []);

    const getBaseBg = () => {
        if (currentPersona === 'hacker') return 'bg-black';
        if (currentPersona === 'hustler') return 'bg-slate-50 dark:bg-slate-900';
        return '';
    };

    return (
        <PersonaContext.Provider value={{ currentPersona, setPersona, theme: themeMap[currentPersona] }}>
            {/* Dynamic Global Backgrounds */}
            <div className={`${themeMap[currentPersona].font} min-h-screen transition-colors duration-500 ${getBaseBg()}`}>
                {currentPersona === 'hacker' && (
                    <MatrixRain />
                )}
                {currentPersona === 'hustler' && (
                    <WorldMapBackground />
                )}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </PersonaContext.Provider>
    );
}

export function usePersona() {
    const context = useContext(PersonaContext);
    if (!context) {
        throw new Error("usePersona must be used within a PersonaProvider");
    }
    return context;
}
