"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { Database } from "@/lib/database.types";
import { usePersona } from "@/context/PersonaContext";
import clsx from "clsx";

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface ProjectsProps {
    projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
    const { currentPersona, theme } = usePersona();

    const filteredProjects = projects.filter(project => {
        // If no personas tag, show only for 'maker' (default) or handle as global
        if (!project.personas || project.personas.length === 0) return true;
        return project.personas.includes(currentPersona);
    });

    return (
        <section id="projects" className={clsx("py-20 transition-colors duration-500", theme.bg)}>
            <div className="container mx-auto px-6">
                <motion.div
                    key={currentPersona}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className={clsx("text-3xl font-bold", theme.text)}>Meus Projetos</h2>
                    <p className={clsx("mt-4 text-opacity-80", theme.text)}>
                        Alguns dos trabalhos que desenvolvi ({currentPersona})
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={clsx(
                                "rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow group flex flex-col",
                                currentPersona === 'hacker' ? "bg-black border-green-800 shadow-green-900/20" :
                                    "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
                            )}
                        >
                            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                {project.image_url ? (
                                    <Image
                                        src={project.image_url}
                                        alt={project.title}
                                        fill
                                        className={clsx("object-cover transition-transform duration-300 group-hover:scale-105",
                                            currentPersona === 'hacker' && "grayscale contrast-125 hover:grayscale-0"
                                        )}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                                        <span className="text-4xl font-bold opacity-10">{index + 1}</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className={clsx("text-xl font-bold mb-2 transition-colors", currentPersona === 'hacker' ? "text-green-500" : "group-hover:text-blue-600 dark:text-white")}>
                                    {project.title}
                                </h3>
                                <p className={clsx("text-sm mb-4 line-clamp-3 flex-1", currentPersona === 'hacker' ? "text-green-700 font-mono" : "text-gray-600 dark:text-gray-400")}>
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags?.map(tag => (
                                        <span key={tag} className={clsx("text-xs font-medium px-2 py-1 rounded",
                                            currentPersona === 'hacker' ? "bg-green-900/30 text-green-400 border border-green-800" :
                                                "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                        )}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-auto">
                                    {project.repo_link && (
                                        <a href={project.repo_link} target="_blank" rel="noopener noreferrer" className={clsx("flex items-center gap-2 text-sm font-medium hover:underline", theme.text)}>
                                            <Github size={16} /> Code
                                        </a>
                                    )}
                                    {project.demo_link && (
                                        <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className={clsx("flex items-center gap-2 text-sm font-medium", currentPersona === 'hacker' ? "text-green-400" : "text-blue-600")}>
                                            <ExternalLink size={16} /> Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className={clsx("col-span-full text-center py-20", theme.text)}>
                            <p>Nenhum projeto encontrado para esta persona ({currentPersona}).</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
