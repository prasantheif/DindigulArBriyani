"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Loader2, Play, X, Image as ImageIcon } from "lucide-react";
// 1. IMPORT FIREBASE
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const categories = ["ALL", "FOOD", "AMBIENCE", "LEGACY", "CINEMA"];

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [media, setMedia] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 2. FETCH FROM CLOUD
                const querySnapshot = await getDocs(collection(db, "gallery"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMedia(data);
            } catch (err) {
                console.error("Gallery sync error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredMedia = selectedCategory === "ALL"
        ? media
        : media.filter(item => item.category === selectedCategory);

    return (
        <main className="relative min-h-screen bg-brand-burgundy overflow-hidden">
            <Header />
            <div className="container mx-auto px-8 relative z-10 pt-32 pb-20">
                <div className="text-center mb-20">
                    <span className="text-brand-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Archive</span>
                    <h1 className="font-display text-5xl md:text-8xl text-brand-ivory uppercase leading-none">
                        Cherished   <span className="italic text-brand-gold">Moments</span>
                    </h1>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-20">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`relative text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 pb-2 ${selectedCategory === cat ? "text-brand-gold" : "text-brand-ivory/30 hover:text-brand-ivory"}`}>
                            {cat}
                            {selectedCategory === cat && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-px bg-brand-gold" />}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-40">
                        <Loader2 className="animate-spin text-brand-gold mb-4" />
                        <span className="text-brand-ivory/40 text-[10px] uppercase tracking-widest font-bold">Loading Archive...</span>
                    </div>
                ) : (
                    <>
                        {filteredMedia.length > 0 ? (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                                {filteredMedia.map((item) => (
                                    <GalleryItem key={item.id} item={item} onOpenVideo={setActiveVideo} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-brand-ivory/20 font-display text-2xl uppercase">
                                No memories found in this category.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-2xl">
                        <button onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 text-brand-gold hover:rotate-90 transition-transform"><X size={40} /></button>
                        <video src={activeVideo} controls autoPlay className="max-w-6xl w-full aspect-video rounded-3xl border border-brand-gold/30 shadow-2xl" />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

/* ---------------------- GalleryItem ---------------------- */

const GalleryItem = ({ item, onOpenVideo }: { item: any, onOpenVideo: (url: string) => void }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => item.type === 'video' ? onOpenVideo(item.url) : null}
            className="relative group break-inside-avoid rounded-[2rem] overflow-hidden border border-brand-gold/20 bg-brand-burgundy/20 backdrop-blur-sm cursor-pointer mb-8"
        >
            {item.type === 'image' ? (
                <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                />
            ) : (
                <div className="relative aspect-video w-full">
                    {/* VIDEO AS PREVIEW: Muted, Autoplay, Looping */}
                    <video
                        src={item.url}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Overlay Play Indicator */}
                    <div className="absolute top-6 right-6 w-10 h-10 bg-brand-gold/80 rounded-full flex items-center justify-center shadow-2xl z-20 group-hover:scale-110 transition-transform">
                        <Play size={16} className="text-brand-burgundy fill-brand-burgundy ml-0.5" />
                    </div>
                </div>
            )}

            {/* Global Hover Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <span className="text-brand-gold text-[9px] font-bold uppercase tracking-[0.3em] mb-2">{item.category}</span>
                <h3 className="text-brand-ivory font-display text-2xl uppercase leading-tight">{item.caption || "Untitled Moment"}</h3>
            </div>
        </motion.div>
    );
};