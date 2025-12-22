"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Instagram } from "lucide-react";

import { usePersona } from "@/context/PersonaContext";
import clsx from "clsx";

export default function Contact() {
    const { currentPersona, theme } = usePersona();

    return (
        <section id="contact" className={clsx("py-20 transition-colors duration-500",
            (currentPersona === 'hacker' || currentPersona === 'hustler') ? 'bg-transparent' : 'bg-black text-white'
        )}>
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className={clsx("text-3xl font-bold mb-6", theme.text)}>Vamos Conversar?</h2>
                    <p className={clsx("mb-12 max-w-xl mx-auto",
                        currentPersona === 'hacker' ? theme.text : "text-gray-400"
                    )}>
                        Estou sempre aberto a novos projetos e oportunidades.
                        Sinta-se à vontade para entrar em contato ou apenas dar um oi.
                    </p>

                    <div className="flex justify-center gap-8 mb-12">
                        <a href="mailto:kevenwilliam2304@gmail.com" className={clsx("hover:text-gray-300 transition-colors p-4 rounded-full",
                            currentPersona === 'hacker' ? "bg-black/50 border border-green-800 text-green-500" : "bg-white/10"
                        )} title="Email">
                            <Mail size={24} />
                        </a>
                        <a href="https://github.com/Kevengrf" target="_blank" rel="noopener noreferrer" className={clsx("hover:text-gray-300 transition-colors p-4 rounded-full",
                            currentPersona === 'hacker' ? "bg-black/50 border border-green-800 text-green-500" : "bg-white/10"
                        )} title="GitHub">
                            <Github size={24} />
                        </a>
                        <a href="https://www.linkedin.com/in/kwsr/" target="_blank" rel="noopener noreferrer" className={clsx("hover:text-gray-300 transition-colors p-4 rounded-full",
                            currentPersona === 'hacker' ? "bg-black/50 border border-green-800 text-green-500" : "bg-white/10"
                        )} title="LinkedIn">
                            <Linkedin size={24} />
                        </a>
                        <a href="https://www.instagram.com/kven.will/" target="_blank" rel="noopener noreferrer" className={clsx("hover:text-gray-300 transition-colors p-4 rounded-full",
                            currentPersona === 'hacker' ? "bg-black/50 border border-green-800 text-green-500" : "bg-white/10"
                        )} title="Instagram">
                            <Instagram size={24} />
                        </a>
                    </div>

                    <div className={clsx("text-sm", currentPersona === 'hacker' ? "text-green-800" : "text-gray-500")}>
                        © {new Date().getFullYear()} Keven William. Todos os direitos reservados.
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
