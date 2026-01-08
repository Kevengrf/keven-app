"use client";

import { Shield } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function Footer() {
    return (
        <footer className="py-12 border-t border-gray-200 dark:border-gray-800 transition-colors duration-500 bg-opacity-50">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">

                {/* Persona Switcher moved to Header */}

                <div className="flex justify-between w-full items-end mt-8">
                    <p className="text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} Keven. All rights reserved.
                    </p>

                    {/* Discrete Admin Button */}
                    {/* Discrete Admin Button */}
                    <Link href="/admin/login" className="p-2 text-gray-400 hover:text-red-500 transition-colors" aria-label="Admin Login">
                        <Shield size={16} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
