"use client";

import { motion } from "framer-motion";

export default function WorldMapBackground() {
    return (
        <div className="fixed inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none overflow-hidden">
            {/* 
                Accurate World Map SVG Dotted/Tech Style 
                Using a standard Miller projection or similar simplified outline.
             */}
            <svg
                viewBox="0 0 1009.6727 665.96301"
                fill="currentColor"
                className="w-full h-full max-w-6xl text-slate-800 dark:text-slate-200 opacity-60"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g transform="translate(-104.30908,-158.32837)">
                    {/* North America */}
                    <path d="m 206.5,230.7 -10.9,13.6 7.6,18.5 -9.8,24.5 -22.3,7.6 -2.7,21.8 17.5,13.1 9.8,24 16.9,8.7 13.6,-9.3 12,6 16.4,-9.8 4.4,-15.8 46.4,-3.8 7.1,-19.1 12,-4.9 1.6,-13.6 -10.9,-16.9 -29.5,-4.4 -3.8,-15.3 -19.6,-8.7 -16.9,5.5 -12,-9.3 z" />
                    <path d="m 262.1,162.9 -2.2,20.7 12,25.1 27.8,2.7 13.6,13.1 39.3,-18 0,-15.8 -10.4,-6.5 -11.5,1.1 -14.2,-10.9 -18.5,-1.6 z" />
                    {/* South America */}
                    <path d="m 334.8,474.7 -5.5,20.2 -16.4,7.6 -18,33.8 6.5,31.7 11.5,7.6 15.3,-9.3 12,-21.8 25.1,-14.2 12,-25.1 21.3,-19.1 19.6,-26.2 3.3,-21.3 -14.2,-12 -33.3,4.4 -10.4,14.7 -18.5,4.9 z" />
                    {/* Europe */}
                    <path d="m 558.1,235.1 -1.1,13.1 -12,3.3 -12,-8.2 -22.9,9.8 -9.3,-8.2 -2.2,-14.7 9.3,-14.7 18.5,-5.5 13.6,8.2 14.7,0.5 z" />
                    <path d="m 573.9,191.9 -10.9,7.6 -6,-6.5 0,-16.9 8.2,-10.4 12,3.3 -3.3,13.6 z" />
                    {/* Africa */}
                    <path d="m 538.5,319.2 -15.3,14.7 -20.2,-2.7 -14.2,8.7 -0.5,18.5 25.1,19.6 4.9,14.7 30,12 18,25.6 15.8,7.6 17.5,-7.6 2.7,-18.5 -11.5,-30 -8.7,-8.7 6.3,-25 -10.4,-20.9 -14.7,-4.9 -16.3,6.8 z" />
                    <path d="m 625.3,466 2.7,18 -13.6,14.2 -15.3,-7.1 -9.3,-19.1 7.2,-13.4 z" />
                    {/* Asia */}
                    <path d="m 604.5,214.9 33.3,1.1 14.7,13.6 18,-11.5 35.5,0.5 7.6,-13.1 40.9,-4.9 14.2,9.3 15.3,-4.4 7.6,13.1 -2.7,19.6 14.2,16.4 -8.2,12.5 -22.9,13.1 -13.1,-5.5 -17.5,15.8 -21.8,-1.1 -27.8,-18.3 -5.2,-18.8 -2.7,-12.3 -9.8,-7.4 -17.5,7.9 -14.2,-6 -7.1,-12.8 z" />
                    <path d="m 849.2,279.4 -2.7,19.1 13.1,12 18.5,-4.4 7.6,-15.8 -4.9,-16.4 -14.7,0.5 z" />
                    <path d="m 898.3,313.2 4.4,16.4 19.6,4.4 20.2,-10.9 -3.8,-16.4 -21.8,-3.8 z" />
                    <path d="m 813.2,357.5 7.1,12 18.5,2.7 8.2,-9.3 -6,-10.9 -16.4,-3.8 z" />
                    {/* Australia */}
                    <path d="m 937.1,529.3 -4.4,18 20.2,10.4 26.2,-4.9 14.2,-16.9 -2.7,-20.2 -16.4,-9.3 -21.3,7.6 z" />
                    {/* Greenland */}
                    <path d="m 383.9,173.3 -7.6,13.1 6.5,15.8 28.9,3.8 20.2,-16.4 -3.8,-21.3 -20.2,-7.1 z" />
                </g>

                {/* Connection Lines (Network Effect) */}
                <path d="M250,250 Q450,150 580,240" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="opacity-30" />
                <path d="M350,500 Q500,400 550,350" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="opacity-30" />
                <path d="M550,350 Q750,300 850,290" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="opacity-30" />
                <path d="M850,290 Q900,400 950,530" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="opacity-30" />

                {/* Active Nodes (Pulsing dots) */}
                <circle cx="250" cy="220" r="4" className="text-blue-600 dark:text-blue-400 animate-pulse" />
                <circle cx="580" cy="240" r="4" className="text-blue-600 dark:text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="350" cy="500" r="4" className="text-blue-600 dark:text-blue-400 animate-pulse" style={{ animationDelay: '1s' }} />
                <circle cx="850" cy="290" r="4" className="text-blue-600 dark:text-blue-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
                <circle cx="950" cy="530" r="4" className="text-blue-600 dark:text-blue-400 animate-pulse" style={{ animationDelay: '0.2s' }} />

            </svg>

            {/* Fine Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>
    );
}
