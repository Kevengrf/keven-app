"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trash2, Upload, Plus } from "lucide-react";
import Image from "next/image";

interface Sponsor {
    id: string;
    logo_url: string;
    name: string;
}

export default function AdminSponsors() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchSponsors();
    }, []);

    async function fetchSponsors() {
        try {
            const { data, error } = await supabase.from("sponsors").select("*").order("created_at", { ascending: false });
            if (error) throw error;
            setSponsors(data || []);
        } catch (error) {
            console.error(error);
            alert("Erro ao buscar patrocinadores");
        } finally {
            setLoading(false);
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `sponsors/${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(fileName);
            const logo_url = data.publicUrl;

            // Optional: Ask for name or default to filename
            const name = prompt("Nome da empresa (opcional):") || file.name;

            const { error: dbError } = await supabase.from("sponsors").insert({ logo_url, name } as any);
            if (dbError) throw dbError;

            fetchSponsors();
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar logo");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, url: string) => {
        if (!confirm("Tem certeza que deseja remover este patrocinador?")) return;
        try {
            const { error } = await supabase.from("sponsors").delete().eq("id", id);
            if (error) throw error;

            // Try/Catch delete image from storage if possible, but not strictly modifying table here
            setSponsors(sponsors.filter(s => s.id !== id));
        } catch (error) {
            console.error(error);
            alert("Erro ao remover");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gerenciar Agrandecimentos</h2>
                    <p className="text-sm text-gray-500">Adicione logomarcas de empresas parceiras.</p>
                </div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50">
                    {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    Adicionar Logo
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {sponsors.length === 0 && (
                        <p className="col-span-full text-center text-gray-500 py-12">Nenhum patrocinador cadastrado.</p>
                    )}
                    {sponsors.map(sponsor => (
                        <div key={sponsor.id} className="relative group bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center border border-gray-200 dark:border-gray-700 aspect-video">
                            <div className="relative w-full h-full">
                                <Image
                                    src={sponsor.logo_url}
                                    alt={sponsor.name || "Sponsor"}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <button
                                onClick={() => handleDelete(sponsor.id, sponsor.logo_url)}
                                className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                                title="Remover"
                            >
                                <Trash2 size={14} />
                            </button>
                            {sponsor.name && (
                                <span className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity truncate px-2">{sponsor.name}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
