"use client";

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/database.types";
import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Upload } from "lucide-react";
import Image from "next/image";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const supabase = createClient() as any;

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        setLoading(true);
        const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
        if (data) setProjects(data as Project[]);
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        await supabase.from("projects").delete().eq("id", id);
        fetchProjects();
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!editingProject) return;

        if (editingProject.id) {
            await supabase.from("projects").update(editingProject as any).eq("id", editingProject.id);
        } else {
            await supabase.from("projects").insert(editingProject as any);
        }

        setIsModalOpen(false);
        setEditingProject(null);
        fetchProjects();
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(filePath, file);

        if (uploadError) {
            alert("Erro ao enviar imagem");
            console.error(uploadError);
        } else {
            const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
            setEditingProject(prev => ({ ...prev, image_url: data.publicUrl }));
        }
        setUploading(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Projetos</h2>
                <button
                    onClick={() => { setEditingProject({}); setIsModalOpen(true); }}
                    className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={20} /> Novo Projeto
                </button>
            </div>

            {loading ? (
                <div>Carregando...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                            {project.image_url && (
                                <div className="relative h-48 w-full">
                                    <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-bold text-lg dark:text-white">{project.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mt-1">{project.description}</p>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">{editingProject?.id ? 'Editar' : 'Novo'} Projeto</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Título</label>
                                <input
                                    required
                                    className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700"
                                    value={editingProject?.title || ""}
                                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Descrição</label>
                                <textarea
                                    className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700"
                                    rows={3}
                                    value={editingProject?.description || ""}
                                    onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Imagem / GIF</label>
                                <div className="flex items-center gap-4">
                                    {editingProject?.image_url && (
                                        <div className="w-16 h-16 relative rounded overflow-hidden">
                                            <Image src={editingProject.image_url} fill alt="Preview" className="object-cover" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <Upload size={16} />
                                        {uploading ? "Enviando..." : "Upload"}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Personas</label>
                                <div className="flex flex-wrap gap-3">
                                    {["hacker", "hipster", "hustler", "maker"].map(persona => (
                                        <label key={persona} className="flex items-center gap-2 cursor-pointer dark:text-gray-200">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                                checked={editingProject?.personas?.includes(persona) || false}
                                                onChange={(e) => {
                                                    const current = editingProject?.personas || [];
                                                    if (e.target.checked) {
                                                        setEditingProject({ ...editingProject, personas: [...current, persona] });
                                                    } else {
                                                        setEditingProject({ ...editingProject, personas: current.filter(p => p !== persona) });
                                                    }
                                                }}
                                            />
                                            <span className="capitalize">{persona}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Demo Link</label>
                                    <input
                                        className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700"
                                        value={editingProject?.demo_link || ""}
                                        onChange={e => setEditingProject({ ...editingProject, demo_link: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Repo Link</label>
                                    <input
                                        className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700"
                                        value={editingProject?.repo_link || ""}
                                        onChange={e => setEditingProject({ ...editingProject, repo_link: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
