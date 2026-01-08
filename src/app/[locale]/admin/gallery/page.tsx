"use client";

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/database.types";
import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";

type GalleryPost = Database["public"]["Tables"]["gallery_posts"]["Row"];

export default function AdminGallery() {
    const [posts, setPosts] = useState<GalleryPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<Partial<GalleryPost> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const supabase = createClient() as any;

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        setLoading(true);
        const { data } = await supabase.from("gallery_posts").select("*").order("created_at", { ascending: false });
        if (data) setPosts(data as GalleryPost[]);
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        await supabase.from("gallery_posts").delete().eq("id", id);
        fetchPosts();
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!editingPost) return;

        if (editingPost.id) {
            await supabase.from("gallery_posts").update(editingPost as any).eq("id", editingPost.id);
        } else {
            await supabase.from("gallery_posts").insert(editingPost as any);
        }

        setIsModalOpen(false);
        setEditingPost(null);
        fetchPosts();
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(filePath, file);

        if (uploadError) {
            alert("Erro ao enviar imagem");
            console.error(uploadError);
        } else {
            const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
            setEditingPost(prev => ({ ...prev, image_url: data.publicUrl }));
        }
        setUploading(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Galeria</h2>
                <button
                    onClick={() => { setEditingPost({}); setIsModalOpen(true); }}
                    className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    <Plus size={20} />
                    Nova Foto
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 dark:text-gray-400">Carregando...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={post.image_url}
                                    alt={post.title || "Gallery Image"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 dark:text-white">{post.title || "Sem título"}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{post.description}</p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => { setEditingPost(post); setIsModalOpen(true); }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:hover:bg-gray-800"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full dark:hover:bg-gray-800"
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
                        <h3 className="text-xl font-bold mb-4 dark:text-white">{editingPost?.id ? 'Editar' : 'Nova'} Foto</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Título (Opcional)</label>
                                <input
                                    className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    value={editingPost?.title || ""}
                                    onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Descrição</label>
                                <textarea
                                    required
                                    className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    rows={3}
                                    value={editingPost?.description || ""}
                                    onChange={e => setEditingPost({ ...editingPost, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Imagem</label>
                                <div className="flex items-center gap-4">
                                    {editingPost?.image_url && (
                                        <div className="w-16 h-16 relative rounded overflow-hidden">
                                            <Image src={editingPost.image_url} fill alt="Preview" className="object-cover" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white">
                                        <Upload size={16} />
                                        {uploading ? "Enviando..." : "Upload"}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
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
