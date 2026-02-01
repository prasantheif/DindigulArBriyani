"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Crown, Sparkles, ShoppingBag, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const TheFootprint = () => {
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "shops"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setShops(data);
            } catch (err) {
                console.error("Footprint sync error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const operatingShops = shops.filter(shop => shop.status === "OPERATIONAL");
    const upcomingShops = shops.filter(shop => shop.status !== "OPERATIONAL");

    const HorizontalRow = ({ title, data, type }: { title: string, data: any[], type: 'live' | 'next' }) => (
        <div className="mb-20">
            <div className="flex items-center justify-between mb-8 px-8 md:px-16">
                <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${type === 'live' ? 'bg-green-500 animate-pulse' : 'bg-brand-gold'}`} />
                    <h3 className="font-display text-2xl md:text-3xl text-brand-burgundy uppercase tracking-tight">
                        {title} <span className="text-brand-gold italic">({data.length})</span>
                    </h3>
                </div>
                <div className="flex items-center gap-2 text-brand-burgundy/30 text-[10px] font-bold uppercase tracking-widest">
                    Swipe <ChevronRight size={14} />
                </div>
            </div>

            <div className="flex overflow-x-auto gap-6 px-8 md:px-16 no-scrollbar snap-x snap-mandatory pb-4">
                {data.map((shop, idx) => (
                    <motion.div
                        key={shop.id || idx}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="min-w-[280px] md:min-w-[380px] snap-center group relative bg-white rounded-[2rem] overflow-hidden border border-brand-gold/10 hover:border-brand-gold/40 transition-all duration-500 shadow-xl"
                    >
                        {/* Visual Asset */}
                        <div className="relative h-56 w-full bg-gray-100">
                            {shop.image ? (
                                <img
                                    src={shop.image}
                                    alt={shop.name}
                                    className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${type === 'live' ? 'opacity-100' : 'opacity-40 grayscale'}`}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-brand-burgundy/5 text-brand-burgundy/20">
                                    <MapPin size={40} />
                                </div>
                            )}

                            {type === 'next' && (
                                <div className="absolute inset-0 bg-brand-burgundy/40 backdrop-blur-[2px] flex items-center justify-center">
                                    <Sparkles className="text-brand-gold animate-pulse" size={32} />
                                </div>
                            )}
                        </div>

                        {/* Content & Actions */}
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-display text-2xl text-brand-burgundy">{shop.name}</h4>
                                {type === 'live' ? <Crown className="text-brand-gold" size={18} /> : <div className="text-[9px] font-bold text-brand-gold uppercase tracking-widest mt-1">Coming Soon</div>}
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-brand-burgundy/40 mb-8">{shop.sub}</p>

                            <div className="flex gap-3">
                                {type === 'live' ? (
                                    <>
                                        <a
                                            href={shop.mapsLink || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-burgundy/5 text-brand-burgundy rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors"
                                        >
                                            <MapPin size={12} /> Directions
                                        </a>
                                        <a
                                            href={shop.zomato || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-burgundy text-brand-ivory rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-burgundy transition-colors"
                                        >
                                            <ShoppingBag size={12} /> Order
                                        </a>
                                    </>
                                ) : (
                                    <div className="w-full py-3 bg-brand-burgundy/5 text-center rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] text-brand-burgundy/20 italic">
                                        Preparing the Hearth
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return (
        <section id="footprint" className="pt-24 pb-0 bg-brand-ivory relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />

            <div className="container mx-auto relative z-10">
                <div className="mb-20 px-8 md:px-16">
                    <span className="text-brand-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Regional Presence</span>
                    <h2 className="font-display text-4xl md:text-6xl text-brand-burgundy uppercase">The <span className="italic text-brand-gold">Footprint</span></h2>
                </div>

                {loading ? (
                    <div className="px-16 flex gap-6 overflow-hidden">
                        {[1, 2, 3].map(n => <div key={n} className="min-w-[380px] h-96 bg-brand-burgundy/5 animate-pulse rounded-[2rem]" />)}
                    </div>
                ) : (
                    <>
                        {operatingShops.length > 0 && <HorizontalRow title="Operational" data={operatingShops} type="live" />}
                        {upcomingShops.length > 0 && <HorizontalRow title="Coming Soon" data={upcomingShops} type="next" />}

                        {shops.length === 0 && (
                            <div className="px-16 text-brand-burgundy/40 text-sm font-bold uppercase tracking-widest">
                                Network sync in progress... (Add shops via Admin)
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}; 