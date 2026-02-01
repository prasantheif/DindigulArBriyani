"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Crown, Sparkles, MapPin, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Shop {
    id: string;
    name: string;
    sub: string;
    status: string;
    image: string;
    zomato: string;
    mapsLink: string;
}

export const TasteUs = () => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "shops"));
                const rawData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Shop));

                // Sort: Operational first
                const sortedShops = rawData.sort((a, b) => {
                    if (a.status === "OPERATIONAL" && b.status !== "OPERATIONAL") return -1;
                    if (a.status !== "OPERATIONAL" && b.status === "OPERATIONAL") return 1;
                    return 0;
                });
                setShops(sortedShops);
            } catch (err) {
                console.error("TasteUs sync error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    return (
        <section id="TasteUs" className="bg-brand-burgundy overflow-hidden scroll-mt-20">
            {loading ? (
                <div className="py-32 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-brand-gold mb-4" />
                    <span className="text-brand-ivory/40 text-[10px] uppercase tracking-widest font-bold">
                        Preparing the Legacy...
                    </span>
                </div>
            ) : (
                <div className="py-24">
                    <div className="container mx-auto px-8 mb-12 flex justify-between items-end">
                        <div>
                            <span className="text-brand-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">
                                Regional Directory
                            </span>
                            <h2 className="font-display text-4xl md:text-5xl text-brand-ivory">
                                Taste <span className="italic text-brand-gold">Us</span>
                            </h2>
                        </div>
                        <div className="hidden md:flex items-center gap-3 text-brand-ivory/40 text-[10px] tracking-[0.2em] uppercase font-bold">
                            Swipe to Explore <ChevronRight size={14} className="animate-pulse" />
                        </div>
                    </div>

                    <div className="flex overflow-x-auto gap-6 px-8 md:px-32 no-scrollbar snap-x snap-mandatory pb-12">
                        {shops.map((shop, i) => {
                            const isOperational = shop.status === "OPERATIONAL";
                            return (
                                <motion.div
                                    key={shop.id || i}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className="min-w-[280px] md:min-w-[360px] snap-center bg-brand-ivory border border-brand-gold/10 overflow-hidden shadow-2xl flex flex-col group rounded-[2.5rem]"
                                >
                                    <div className="relative h-[200px] md:h-[260px] overflow-hidden bg-gray-100">
                                        {/* FIXED: Using standard img tag for Cloudinary compatibility */}
                                        <img
                                            src={shop.image || "https://placehold.co/600x400/800000/FFF?text=Dindigul+AR"}
                                            alt={shop.name}
                                            className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isOperational ? 'opacity-100' : 'opacity-40 grayscale'}`}
                                        />
                                        {!isOperational && (
                                            <div className="absolute inset-0 bg-brand-burgundy/60 backdrop-blur-sm flex items-center justify-center">
                                                <span className="bg-brand-gold text-brand-burgundy px-5 py-2 font-bold text-[9px] tracking-[0.3em] uppercase rounded-full">
                                                    Coming Soon
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow relative bg-brand-ivory">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-display text-2xl md:text-3xl text-brand-burgundy uppercase leading-none">{shop.name}</h3>
                                            {isOperational ? <Crown className="text-brand-gold" size={20} /> : <Sparkles className="text-brand-gold/30" size={20} />}
                                        </div>
                                        <p className="text-brand-burgundy/60 text-[10px] md:text-xs mb-8 font-serif italic uppercase tracking-widest">{shop.sub}</p>
                                        <div className="mt-auto flex flex-col gap-3">
                                            {isOperational ? (
                                                <>
                                                    {/* Linked to Zomato/Ordering URL */}
                                                    <a
                                                        href={shop.zomato || "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full flex items-center justify-center gap-2 py-4 bg-brand-burgundy text-brand-ivory text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 rounded-2xl hover:bg-brand-gold hover:text-brand-burgundy"
                                                    >
                                                        <ShoppingBag size={12} /> Order Now
                                                    </a>
                                                    {/* Linked to Google Maps URL */}
                                                    <a
                                                        href={shop.mapsLink || "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full flex items-center justify-center gap-2 py-3 bg-transparent border border-brand-burgundy/10 text-brand-burgundy/50 text-[8px] font-bold uppercase tracking-[0.2em] transition-all hover:border-brand-burgundy hover:text-brand-burgundy rounded-xl"
                                                    >
                                                        <MapPin size={10} /> View Location
                                                    </a>
                                                </>
                                            ) : (
                                                <div className="w-full py-4 bg-brand-burgundy/5 border border-brand-burgundy/5 text-brand-burgundy/30 text-[9px] font-bold uppercase tracking-[0.3em] text-center rounded-2xl cursor-not-allowed italic">
                                                    Seasoning the Hearth
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};