"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import PersonaSwitcher from "./PersonaSwitcher";

const links = [
    { name: "Sobre", href: "/#about" },
    { name: "Projetos", href: "/#projects" },
    { name: "Galeria", href: "/gallery" },
    { name: "Contato", href: "/#contact" },
    { name: "Agradecimentos", href: "/thanks" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-black/80 dark:border-gray-800">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center relative">
                    <Link href="/" className="text-2xl font-bold tracking-tighter">
                        Keven.
                    </Link>

                    {/* Centered Persona Switcher (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                        <PersonaSwitcher />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Nav Toggle */}
                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 p-6 shadow-lg flex flex-col gap-6"
                    >
                        <nav className="flex flex-col gap-4">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </header>

            {/* Mobile Fixed Persona Switcher - Outside Header to avoid stacking context issues */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <PersonaSwitcher className="bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-2xl border border-gray-200 dark:border-gray-800" />
            </div>
        </>
    );
}
