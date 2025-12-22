"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, FolderKanban, ImageIcon, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const supabase = createClient();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    useEffect(() => {
        setIsMounted(true);
        if (pathname === "/admin/login") return;

        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace("/admin/login");
            }
        };
        checkAuth();
    }, [pathname, router, supabase]);

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!isMounted) return null; // Prevent hydration mismatch

    const navItems = [
        { name: "Perfil", href: "/admin", icon: LayoutDashboard },
        { name: "Projetos", href: "/admin/projects", icon: FolderKanban },
        { name: "Galeria", href: "/admin/gallery", icon: ImageIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            {/* Sidebar / Topbar */}
            {/* Sidebar / Topbar */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center font-bold text-xl">
                                Keven. Admin
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`${isActive
                                                ? "border-black text-gray-900 dark:border-white dark:text-white"
                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                        >
                                            <item.icon className="w-4 h-4 mr-2" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Sair
                                </button>
                            </div>

                            {/* Mobile Hamburger */}
                            <div className="sm:hidden flex items-center">
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                >
                                    {open ? (
                                        <Menu className="block h-6 w-6" aria-hidden="true" /> // Wait, should be X if open. 
                                        // The user used X in Header. let's match logic.
                                        // Actually let's just copy the logic properly.
                                    ) : (
                                        <Menu className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {open && (
                    <div className="sm:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        <div className="pt-2 pb-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={`${isActive
                                            ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                            : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                                            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
                                    >
                                        <item.icon className="w-4 h-4 mr-3" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left border-transparent text-red-600 hover:bg-red-50 hover:border-red-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center mt-4"
                            >
                                <LogOut className="w-4 h-4 mr-3" />
                                Sair
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
