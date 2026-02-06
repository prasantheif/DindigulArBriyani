"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Store, ChefHat, Building2, Globe } from "lucide-react";
import { useProspectus } from "@/context/ProspectusContext";
import Image from "next/image";

const tierData = [
    {
        name: "Express Model",
        sub: "Urban Power house",
        // TIER 1: Porcelain Ivory
        // Very light, clean start
        theme: "bg-[#F9F5EA] text-brand-burgundy",
        accent: "text-brand-burgundy/60",
        button: "bg-brand-burgundy text-[#F9F5EA]",
        image: "/images/models/model-1.jpg",
        icon: <Store className="w-8 h-8" />,
        features: ["The Entry Level Model", "Take away and self service", "500-800 sq ft", "Seating 15-20 people", "ROI 8-10 months"],
    },
    {
        name: "Standard Model",
        sub: "The Heritage Suite",
        // TIER 2: Vintage Cream
        // A distinct step darker, warmer
        theme: "bg-[#EBE0C5] text-brand-burgundy",
        accent: "text-brand-burgundy",
        button: "bg-brand-burgundy text-[#EBE0C5]",
        image: "/images/models/model-2.jpg",
        icon: <ChefHat className="w-8 h-8" />,
        features: ["The Mid Range Model", "Mini Dine In", "800-1200 Sq.Ft", "Seating 20-30 people", "ROI 10-12 months"],
    },
    {
        name: "Signature Model",
        sub: "Imperial Landmark",
        // TIER 3: Dark Sand
        // The bridge between cream and gold
        //theme: "bg-[#DBCFA6] text-brand-burgundy",
        theme: "bg-[#DCC694] text-brand-burgundy",
        accent: "text-brand-burgundy",
        button: "bg-brand-burgundy text-[#DCC694]",
        image: "/images/models/model-3.jpg",
        icon: <Building2 className="w-8 h-8" />,
        features: ["The Elite Model", "Fine Dine In", "1200-2000 Sq.Ft", "Seating 35-50 people", "ROI 10-12 months"],
    },
    {
        name: "Premium Model",
        sub: "Global Flagship",
        // TIER 4: Sovereign Gold
        // The destination. Full Gold background.
        theme: "bg-[#C5A059] text-brand-burgundy",
        accent: "text-[#4A0404]", // Darker burgundy for contrast on gold
        button: "bg-brand-burgundy text-[#C5A059]",
        image: "/images/models/model-4.jpg",
        icon: <Globe className="w-8 h-8" />,
        features: ["The Large Scale Model", "Premium Dine In", "Above 2000 Sq.Ft", "Seating 60 + people", "ROI 16-18 months"],
    }
];

export const Tiers = () => {
    const { openProspectus } = useProspectus();

    return (
        <section id="tiers" className="py-20 px-8 md:px-16 bg-brand-ivory relative scroll-mt-24 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />

            <div className="container mx-auto max-w-full relative z-10">
                <div className="text-center mb-20">
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-burgundy mb-6 uppercase tracking-tight">Franchise Models</h2>
                    <div className="h-1 w-24 bg-brand-bronze mx-auto opacity-60"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tierData.map((tier, idx) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            // 4px BRONZE BORDER + PREVIOUS SIZE (rounded-xl)
                            className={`group relative flex flex-col h-full rounded-xl overflow-hidden border-4 border-brand-bronze/80 transition-all duration-700 hover:-translate-y-2 ${tier.theme} shadow-xl`}
                            style={{ boxShadow: "0 0 30px 5px rgba(153, 115, 43, 0.2)" }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 0 60px 10px rgba(153, 115, 43, 0.45), 0 40px 60px -15px rgba(0, 0, 0, 0.3)"
                            }}
                        >
                            {/* METALLIC GLINT ENGINE */}
                            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer opacity-0 group-hover:opacity-100" />
                            </div>

                            {/* Visual Asset */}
                            <div className="relative h-56 w-full">
                                <Image
                                    src={tier.image}
                                    alt={tier.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                                <div className={`absolute bottom-6 left-8 ${tier.accent}`}>
                                    {tier.icon}
                                </div>
                            </div>

                            <div className="p-8 flex-grow">
                                <h3 className="font-display text-3xl font-bold mb-1 tracking-tight uppercase">{tier.name}</h3>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mb-6 opacity-70`}>{tier.sub}</p>

                                <div className="space-y-4 mb-8">
                                    {tier.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <Check className={`w-4 h-4 flex-shrink-0 ${tier.accent}`} />
                                            <span className="text-sm font-sans font-medium opacity-90">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 pt-0">
    <button
        onClick={openProspectus}
        // Added 'hover:scale-105' for the expansion effect
        className={`w-full flex items-center justify-center gap-3 py-4 font-bold uppercase tracking-widest text-[10px] transition-all duration-500 rounded-lg shadow-lg ${tier.button} hover:bg-brand-gold hover:text-brand-burgundy hover:scale-105 active:scale-95`}
    >
        Inquire for {tier.name} <ArrowRight className="w-4 h-4" />
    </button>
</div>   

                            {/* Inner Specular Highlight */}
                            <div className="absolute inset-0 rounded-[0.7rem] border border-white/10 pointer-events-none z-20" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};