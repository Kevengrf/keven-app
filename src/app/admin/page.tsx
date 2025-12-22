"use client";

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/database.types";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Save, Upload, X, Check } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

type Profile = Database["public"]["Tables"]["profile"]["Row"];

export default function AdminProfile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState<Partial<Profile>>({});
    const [activeTab, setActiveTab] = useState("maker");

    // Cropper State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const supabase = createClient() as any;
    const personas = ["maker", "hacker", "hipster", "hustler"];

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const { data, error } = await supabase.from("profile").select("*").single();

            if (data) {
                if (!data.personas) data.personas = {};
                setProfile(data as Profile);
            }
            if (error && error.code !== 'PGRST116') console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const { data: existing } = await supabase.from("profile").select("id").single();
            const payload = profile as unknown as any;
            if (existing) {
                const { error } = await supabase.from("profile").update(payload).eq("id", existing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("profile").insert(payload);
                if (error) throw error;
            }
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            alert("Erro ao salvar perfil");
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    const getValue = (field: keyof Profile | string) => {
        if (activeTab === 'maker') return (profile as any)[field];
        return (profile.personas as any)?.[activeTab]?.[field] || "";
    };

    const setValue = (field: string, value: string) => {
        if (activeTab === 'maker') {
            setProfile({ ...profile, [field]: value });
        } else {
            const currentPersonas = (profile.personas as any) || {};
            const updatedPersona = { ...(currentPersonas[activeTab] || {}), [field]: value };
            setProfile({
                ...profile,
                personas: { ...currentPersonas, [activeTab]: updatedPersona }
            });
        }
    };

    // 1. User selects file -> Set Image Src for Cropper
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl as string);
        }
    };

    const readFile = (file: File) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // 2. User clicks Save Crop -> Generate Blob -> Upload
    const performCropAndUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setUploading(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedImageBlob) throw new Error("Could not create cropped image");

            const fileName = `profile/${activeTab}-${Math.random()}.jpg`;

            const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(fileName, croppedImageBlob);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(fileName);
            setValue('photo_url', data.publicUrl);

            // Clean up
            setImageSrc(null);
            setZoom(1);

        } catch (e) {
            console.error(e);
            alert("Erro ao cortar/enviar imagem");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 relative">
            <div className="mb-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Gerenciar Perfil</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Edite as informações para cada persona.</p>
            </div>

            {/* Persona Tabs */}
            <div className="flex space-x-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                {personas.map(p => (
                    <button
                        key={p}
                        onClick={() => setActiveTab(p)}
                        className={clsx(
                            "px-4 py-2 rounded-md capitalize font-medium transition-colors",
                            activeTab === p
                                ? "bg-black text-white dark:bg-white dark:text-black"
                                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        )}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Cropper Modal */}
            {imageSrc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl h-[600px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold dark:text-white">Ajustar Recorte</h3>
                            <button onClick={() => setImageSrc(null)} className="text-gray-500 hover:text-red-500">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="relative flex-1 bg-gray-100 rounded overflow-hidden mb-4">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // Square aspect ratio for profile
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-sm dark:text-gray-300">Zoom:</span>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setImageSrc(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                                Cancelar
                            </button>
                            <button
                                onClick={performCropAndUpload}
                                disabled={uploading}
                                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                            >
                                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                Salvar Recorte
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800 mb-6">
                        <h4 className="font-bold mb-4 capitalize text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Edição: {activeTab}</h4>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                            {/* Photo Upload */}
                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foto do Perfil ({activeTab})</label>
                                <div className="flex items-center gap-6">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                        {getValue('photo_url') ? (
                                            <Image
                                                src={getValue('photo_url')}
                                                alt="Profile Preview"
                                                fill
                                                className="object-cover"
                                                style={{ objectPosition: getValue('photo_position') || 'center' }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-gray-400">Sem foto</div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Carregar Imagem / Recortar
                                                <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                                            </label>
                                            <p className="mt-2 text-xs text-gray-500">A imagem será aberta para recorte antes do envio.</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Ajuste Fino (CSS)</label>
                                            <select
                                                className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 p-2 border dark:text-white"
                                                value={getValue('photo_position') || 'center'}
                                                onChange={e => setValue('photo_position', e.target.value)}
                                            >
                                                <option value="center">Centro</option>
                                                <option value="top">Topo</option>
                                                <option value="bottom">Baixo</option>
                                                <option value="left">Esquerda</option>
                                                <option value="right">Direita</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título Hero</label>
                                <input
                                    type="text"
                                    value={getValue('hero_title') || ""}
                                    onChange={e => setValue('hero_title', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 font-normal p-2 border dark:text-white"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtítulo Hero</label>
                                <input
                                    type="text"
                                    value={getValue('hero_subtitle') || ""}
                                    onChange={e => setValue('hero_subtitle', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 font-normal p-2 border dark:text-white"
                                />
                            </div>

                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição Hero</label>
                                <textarea
                                    rows={3}
                                    value={getValue('hero_description') || ""}
                                    onChange={e => setValue('hero_description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 font-normal p-2 border dark:text-white"
                                />
                            </div>

                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sobre Mim (Texto)</label>
                                <p className="text-xs text-gray-400 mb-1">Apenas o modo Maker define o texto base global.</p>
                                <textarea
                                    disabled={activeTab !== 'maker'}
                                    rows={5}
                                    value={profile.about_text || ""}
                                    onChange={e => setProfile({ ...profile, about_text: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 font-normal p-2 border dark:text-white disabled:opacity-50"
                                />
                            </div>

                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stacks / Habilidades</label>
                                <p className="text-xs text-gray-400 mb-1">Separe por vírgula (ex: React, Node.js, AWS)</p>
                                <input
                                    type="text"
                                    value={(getValue('skills') || []).join(', ')}
                                    onChange={e => {
                                        const val = e.target.value;
                                        // Split by comma, map to trim whitespace, filter empty
                                        const skillsArray = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
                                        setValue('skills', skillsArray as any);
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 font-normal p-2 border dark:text-white"
                                    placeholder="Ex: React, TypeScript, Tailwind..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
