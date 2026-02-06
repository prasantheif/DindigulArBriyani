"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useProspectus } from "@/context/ProspectusContext";
import { ChevronDown, History } from "lucide-react";
import { SpiceNebula } from "@/components/SpiceNebula";

export const Hero = () => {
    const { openProspectus } = useProspectus();
    const [showSpices, setShowSpices] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSpices(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#1A0505] pt-28 md:pt-20">

            {/* === SPICE NEBULA LAYER === 
            <motion.div 
                className="absolute inset-0 z-[1] pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: showSpices ? 1 : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            >
                <SpiceNebula />
            </motion.div>*\}
            

            {/* === BACKGROUND LAYER === */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-[1.05] opacity-60"
                >
                    <source src="/images/background_video.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-[#2A0A0A]/25 mix-blend-multiply" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1A0505]/50 to-[#1A0505]" />
            </div>

            {/* === CONTENT LAYER === */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
            >
                {/* 1. CENTER BADGE LOGO */}
                <div className="relative mb-6 md:mb-8">
                    <div className="absolute inset-0 bg-[#C5A059]/20 blur-[50px] rounded-full" />
                    <img
                        src="/logo.png"
                        alt="AR Biryani Seal"
                        // Changed w-28 h-28 -> w-40 h-40 (mobile)
                        // Changed md:w-56 md:h-56 -> md:w-80 md:h-80 (desktop)
                        className="relative w-40 h-40 md:w-80 md:h-80 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    />
                </div>

                {/* 2. ESTABLISHED TAGLINE */}
                <div className="flex items-center justify-center gap-3 mb-3 md:mb-4 opacity-90">
                    <div className="h-[1px] w-6 md:w-16 bg-[#C5A059]" />
                    <span className="font-sans text-[#C5A059] font-bold uppercase text-[9px] md:text-xs tracking-[0.25em] md:tracking-[0.3em]">
                        Est • 2008 • The Legacy of Dindigul
                    </span>
                    <div className="h-[1px] w-6 md:w-16 bg-[#C5A059]" />
                </div>

                {/* 3. MAIN HEADING */}
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4 text-[#C5A059] uppercase tracking-tight drop-shadow-2xl leading-none">
                    Dindigul AR Biriyani
                </h1>

                {/* 4. SUBHEADING */}
                <p className="font-serif text-sm sm:text-base md:text-3xl text-[#C5A059] uppercase tracking-[0.15em] font-light mb-4 md:mb-6 max-w-xs md:max-w-none mx-auto">
                    Authentic Dindigul Seeraga Samba Biriyani
                </p>

                {/* 5. ITALIC QUOTE */}
                <p className="font-serif text-sm md:text-xl text-[#C5A059] italic mb-8 md:mb-10 max-w-[85%] md:max-w-3xl mx-auto leading-relaxed opacity-90">
                    &quot;Where catering precision meets the secret spice blend of the South.&quot;
                </p>

                {/* 6. BUTTONS */}
                {/* MODIFIED: Increased padding-bottom (pb-48 md:pb-64) to clear the mist */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full pb-48 md:pb-64">
                    <Link href="#tiers" className="w-full md:w-auto flex justify-center">
                        <button
                            className="w-64 md:min-w-[220px] px-8 py-3.5 md:py-4 bg-[#C5A059] text-[#2A0A0A] text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase rounded-full shadow-lg hover:bg-[#E5C079] transition-all duration-300"
                        >
                            Explore Franchise
                        </button>
                    </Link>

                    <Link href="/about" className="w-full md:w-auto flex justify-center">
                        <button className="w-64 md:min-w-[220px] px-8 py-3.5 md:py-4 bg-[#C5A059] text-[#2A0A0A] text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase rounded-full hover:bg-[#E5C079] transition-all duration-300 flex items-center justify-center gap-2">
                            <History size={14} /> The AR Legacy
                        </button>
                    </Link>
                </div>

            </motion.div>

            {/* === MIST FADE LAYER === */}
            {/* Placed here to cover the bottom of the video, creating the seamless merge */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-brand-ivory via-brand-ivory/80 to-transparent z-20 pointer-events-none" />

            {/* === SCROLL INDICATOR === */}
            {/* Z-index increased to 30 to sit ON TOP of the mist */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-burgundy/60 z-30 pointer-events-none"
            >
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
                <ChevronDown size={18} className="animate-bounce" />
            </motion.div>

        </section>
    );
};