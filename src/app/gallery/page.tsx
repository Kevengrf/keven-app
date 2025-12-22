import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/database.types";
import Header from "@/components/Header";
import Image from "next/image";

export default async function GalleryPage() {
    const supabase = await createClient();

    const { data: posts } = await supabase
        .from("gallery_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<Database["public"]["Tables"]["gallery_posts"]["Row"][]>();

    return (
        <main className="bg-white dark:bg-black min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Minha Galeria
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Um pouco mais sobre minha vida, hobbies e momentos especiais.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts?.map((post) => (
                        <div key={post.id} className="group relative break-inside-avoid">
                            <div className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                <Image
                                    src={post.image_url}
                                    alt={post.description}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="mt-4">
                                {post.title && (
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {post.title}
                                    </h3>
                                )}
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {post.description}
                                </p>
                            </div>
                        </div>
                    ))}

                    {(!posts || posts.length === 0) && (
                        <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                            Nenhuma foto publicada ainda.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
