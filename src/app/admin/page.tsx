"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save, Plus, Trash2, RefreshCw, Upload,
    Loader2, MapPin, Globe,
    Film, Play, MonitorPlay, LogOut
} from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// --- ☁️ CLOUDINARY KEYS ---
const CLOUD_NAME = "drifdkued";
const UPLOAD_PRESET = "dv80wc0d";
// -------------------------

/* --- Types & Interfaces --- */
type AdminTab = "LOCATIONS" | "GALLERY" | "VIDEOS";

interface Shop {
    id: string; name: string; sub: string; status: string;
    image: string; zomato: string; mapsLink: string;
}

interface GalleryItem {
    id: string; url: string; category: "FOOD" | "AMBIENCE" | "LEGACY"; caption: string;
}

interface VideoItem {
    id: string; title: string; url: string;
}

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>("LOCATIONS");

    // Data States
    const [shops, setShops] = useState<Shop[]>([]);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);

    // UI States
    const [loadingData, setLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingIdx, setUploadingIdx] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // 1. Auth & Data Sync
    useEffect(() => {
        if (!authLoading && !user) {
            window.location.href = "/login";
        } else if (user) {
            loadRegistry();
        }
    }, [user, authLoading]);

    const loadRegistry = async () => {
        try {
            // Fetch Shops
            const shopSnap = await getDocs(collection(db, "shops"));
            setShops(shopSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Shop)));

            // Fetch Gallery
            const gallerySnap = await getDocs(collection(db, "gallery"));
            // Filter images vs videos if needed, or store them in separate collections.
            // For now, assuming "gallery" collection holds both or mixed.
            const allMedia = gallerySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Split into Gallery (Images) and Videos if your logic requires, 
            // OR fetch from a separate "videos" collection if you made one. 
            // Assuming simplified: Gallery holds images.
            setGallery(allMedia.filter((m: any) => m.type !== 'video') as GalleryItem[]);

            // If you have a separate video collection, fetch it:
            // const videoSnap = await getDocs(collection(db, "videos"));
            // setVideos(videoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoItem)));

        } catch (_err) {
            showNotification('error', 'Registry unreachable');
        } finally {
            setLoadingData(false);
        }
    };

    const showNotification = (type: 'success' | 'error', msg: string) => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 3000);
    };

    // 2. Cloudinary Uploader
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string, type: 'shop' | 'gallery' | 'video') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIdx(id);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        const resourceType = file.type.includes("video") ? "video" : "image";

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, { method: "POST", body: formData });
            const data = await res.json();

            if (data.secure_url) {
                const url = data.secure_url;

                // Update Local State
                if (type === 'shop') {
                    setShops(prev => prev.map(s => s.id === id ? { ...s, image: url } : s));
                    if (!id.startsWith("temp-")) await updateDoc(doc(db, "shops", id), { image: url });
                }
                else if (type === 'gallery') {
                    setGallery(prev => prev.map(g => g.id === id ? { ...g, url: url } : g));
                    if (!id.startsWith("temp-")) await updateDoc(doc(db, "gallery", id), { url: url });
                }
                else if (type === 'video') {
                    setVideos(prev => prev.map(v => v.id === id ? { ...v, url: url } : v));
                    // Assuming you might store videos in 'gallery' or separate 'videos'
                    if (!id.startsWith("temp-")) await updateDoc(doc(db, "gallery", id), { url: url, type: 'video' });
                }

                showNotification('success', 'Asset secured');
            }
        } catch (_err) {
            showNotification('error', 'Upload failed');
        } finally {
            setUploadingIdx(null);
        }
    };

    // 3. Save Logic (Sync to Firebase)
    const commitChanges = async () => {
        setIsSaving(true);
        try {
            // Save Shops
            if (activeTab === "LOCATIONS") {
                for (const shop of shops) {
                    if (shop.id.startsWith("temp-")) {
                        const { id, ...data } = shop;
                        const ref = await addDoc(collection(db, "shops"), data);
                        shop.id = ref.id; // Update temp ID to real ID
                    } else {
                        const { id, ...data } = shop;
                        await updateDoc(doc(db, "shops", id), { ...data });
                    }
                }
            }
            // Save Gallery
            else if (activeTab === "GALLERY") {
                for (const item of gallery) {
                    if (item.id.startsWith("temp-")) {
                        const { id, ...data } = item;
                        // Force type 'image' for gallery tab
                        await addDoc(collection(db, "gallery"), { ...data, type: 'image' });
                    } else {
                        const { id, ...data } = item;
                        await updateDoc(doc(db, "gallery", id), { ...data });
                    }
                }
            }
            // Save Videos
            else if (activeTab === "VIDEOS") {
                for (const vid of videos) {
                    // For now, saving videos to 'gallery' collection with type='video' 
                    // or use a separate collection if you prefer.
                    if (vid.id.startsWith("temp-")) {
                        const { id, ...data } = vid;
                        await addDoc(collection(db, "gallery"), { ...data, type: 'video', category: 'CINEMA' });
                    } else {
                        const { id, ...data } = vid;
                        await updateDoc(doc(db, "gallery", id), { ...data });
                    }
                }
            }

            showNotification('success', 'Registry Synchronized');
            // Reload to get clean IDs
            loadRegistry();
        } catch (_err) {
            console.error(_err);
            showNotification('error', 'Sync Failed');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteItem = async (id: string, col: string) => {
        if (!confirm("Delete this asset?")) return;
        try {
            if (!id.startsWith("temp-")) await deleteDoc(doc(db, col, id));

            if (col === "shops") setShops(prev => prev.filter(s => s.id !== id));
            else if (col === "gallery") setGallery(prev => prev.filter(g => g.id !== id));

            showNotification('success', 'Asset Deleted');
        } catch (e) { showNotification('error', 'Delete Failed'); }
    };

    if (authLoading || loadingData) return <div className="min-h-screen bg-brand-ivory flex items-center justify-center font-display text-brand-burgundy uppercase tracking-widest"><Loader2 className="animate-spin mr-2" /> Waking Registry...</div>;
    if (!user) return null;

    return (
        <main className="bg-brand-ivory min-h-screen pt-32 pb-20">
            <Header />

            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                        className={`fixed top-12 left-1/2 -translate-x-1/2 z-[100] px-8 py-3 rounded-full shadow-2xl border ${notification.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'}`}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{notification.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-8 max-w-6xl">
                {/* Header Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="font-display text-5xl text-brand-burgundy uppercase tracking-tight leading-none">
                                Executive <span className="text-brand-gold italic">Suite</span>
                            </h1>
                            <div className="flex gap-2 mt-6 p-1 bg-brand-burgundy/5 rounded-2xl border border-brand-gold/10">
                                {(["LOCATIONS", "GALLERY", "VIDEOS"] as AdminTab[]).map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "bg-brand-burgundy text-brand-ivory shadow-xl" : "text-brand-burgundy/40"}`}>{tab}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => signOut(auth)} className="p-3 bg-brand-burgundy/5 rounded-2xl text-brand-burgundy/40 hover:text-red-600 transition-colors mt-12"><LogOut size={20} /></button>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => {
                            const id = `temp-${Date.now()}`;
                            if (activeTab === "LOCATIONS") setShops([{ id, name: "New Location", sub: "District", status: "COMING SOON", image: "", zomato: "", mapsLink: "" }, ...shops]);
                            else if (activeTab === "GALLERY") setGallery([{ id, url: "", category: "FOOD", caption: "Photo Title" }, ...gallery]);
                            else setVideos([{ id, title: "Cinema Reel", url: "" }, ...videos]);
                        }} className="px-6 py-4 bg-white border border-brand-gold/30 text-brand-burgundy font-bold uppercase text-[10px] tracking-widest hover:bg-brand-gold rounded-2xl transition-all"><Plus size={16} className="inline mr-2" /> Add Asset</button>
                        <button onClick={commitChanges} disabled={isSaving} className="px-8 py-4 bg-brand-burgundy text-brand-ivory font-bold uppercase text-[10px] tracking-widest hover:bg-brand-gold transition-all rounded-2xl shadow-xl flex items-center gap-2">
                            {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />} Sync Database
                        </button>
                    </div>
                </div>

                {/* --- CONTENT: LOCATIONS --- */}
                {activeTab === "LOCATIONS" && (
                    <div className="space-y-6">
                        {shops.map((shop, idx) => (
                            <motion.div layout key={shop.id} className="bg-white rounded-[2.5rem] p-8 border border-brand-gold/10 flex flex-col lg:flex-row gap-8 items-center group">
                                {/* IMAGE UPLOADER */}
                                <div className="relative w-40 h-32 rounded-2xl overflow-hidden bg-brand-burgundy/5 flex-shrink-0 border border-brand-gold/10">
                                    {shop.image ? <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-brand-burgundy/20"><Upload size={24} /></div>}
                                    <label className="absolute inset-0 bg-brand-burgundy/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        {uploadingIdx === shop.id ? <Loader2 className="animate-spin text-white" /> : <Upload size={20} className="text-white" />}
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, shop.id, 'shop')} />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow w-full">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[9px] font-bold text-brand-gold uppercase tracking-widest">Identity</label>
                                        <input value={shop.name} onChange={(e) => { const n = [...shops]; n[idx].name = e.target.value; setShops(n); }} className="bg-transparent border-b border-brand-gold/20 py-1 outline-none font-display text-2xl text-brand-burgundy" placeholder="Branch Name" />
                                        <input value={shop.sub} onChange={(e) => { const n = [...shops]; n[idx].sub = e.target.value; setShops(n); }} className="bg-transparent text-[10px] text-brand-burgundy/40 uppercase tracking-widest outline-none" placeholder="Sub-district / Area" />
                                    </div>

                                    {/* --- MAP & ORDER LINKS ARE HERE --- */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[9px] font-bold text-brand-gold uppercase tracking-widest">Infrastructure</label>
                                        <div className="flex items-center gap-2 border-b border-brand-gold/10 pb-1">
                                            <MapPin size={12} className="text-brand-gold" />
                                            <input value={shop.mapsLink} placeholder="Paste Google Maps URL" onChange={(e) => { const n = [...shops]; n[idx].mapsLink = e.target.value; setShops(n); }} className="w-full bg-transparent outline-none text-[10px] text-brand-burgundy/60" />
                                        </div>
                                        <div className="flex items-center gap-2 border-b border-brand-gold/10 pb-1">
                                            <Globe size={12} className="text-brand-gold" />
                                            <input value={shop.zomato} placeholder="Paste Zomato/Swiggy URL" onChange={(e) => { const n = [...shops]; n[idx].zomato = e.target.value; setShops(n); }} className="w-full bg-transparent outline-none text-[10px] text-brand-burgundy/60" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col gap-4">
                                    <button onClick={() => { const n = [...shops]; n[idx].status = n[idx].status === "OPERATIONAL" ? "COMING SOON" : "OPERATIONAL"; setShops(n); }} className={`px-6 py-3 rounded-full text-[9px] font-bold tracking-widest uppercase border ${shop.status === "OPERATIONAL" ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>{shop.status}</button>
                                    <button onClick={() => deleteItem(shop.id, "shops")} className="text-red-200 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* --- CONTENT: GALLERY --- */}
                {activeTab === "GALLERY" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gallery.map((item, idx) => (
                            <motion.div layout key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-brand-gold/10 flex gap-6 items-center group">
                                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-brand-burgundy/5 flex-shrink-0 border border-brand-gold/10">
                                    {item.url ? <img src={item.url} alt={item.caption} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-brand-burgundy/20"><Upload size={20} /></div>}
                                    <label className="absolute inset-0 bg-brand-burgundy/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        {uploadingIdx === item.id ? <Loader2 className="animate-spin text-white" /> : <Upload size={20} className="text-white" />}
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, item.id, 'gallery')} />
                                    </label>
                                </div>
                                <div className="flex-grow space-y-4">
                                    <input value={item.caption} placeholder="Caption" onChange={(e) => { const n = [...gallery]; n[idx].caption = e.target.value; setGallery(n); }} className="w-full bg-transparent border-b border-brand-gold/20 py-1 outline-none text-sm font-serif italic text-brand-burgundy" />
                                    <select value={item.category} onChange={(e) => { const n = [...gallery]; n[idx].category = e.target.value as any; setGallery(n); }} className="bg-transparent border-b border-brand-gold/20 py-1 outline-none text-[10px] font-bold text-brand-burgundy/60 uppercase">
                                        <option value="FOOD">FOOD</option><option value="AMBIENCE">AMBIENCE</option><option value="LEGACY">LEGACY</option>
                                    </select>
                                </div>
                                <button onClick={() => deleteItem(item.id, "gallery")} className="text-red-200 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* --- CONTENT: VIDEOS --- */}
                {activeTab === "VIDEOS" && (
                    <div className="space-y-6">
                        {videos.map((video, idx) => (
                            <AdminVideoItem key={video.id} video={video} idx={idx} videos={videos} setVideos={setVideos} handleFileUpload={handleFileUpload} uploadingIdx={uploadingIdx} onDelete={() => deleteItem(video.id, "gallery")} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

const AdminVideoItem = ({ video, idx, videos, setVideos, handleFileUpload, uploadingIdx, onDelete }: any) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    return (
        <motion.div layout className="bg-white rounded-[2.5rem] p-8 border border-brand-gold/10 flex flex-col lg:flex-row gap-8 items-center group">
            <div className="relative w-48 h-28 rounded-2xl overflow-hidden bg-brand-burgundy/5 flex-shrink-0 border border-brand-gold/10 flex items-center justify-center"
                onMouseEnter={() => videoRef.current?.play()} onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}>
                {video.url ? <video ref={videoRef} src={video.url} muted className="w-full h-full object-cover" /> : <Film className="text-brand-gold/20" size={32} />}
                <label className="absolute inset-0 bg-brand-burgundy/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {uploadingIdx === video.id ? <Loader2 className="animate-spin text-white" /> : <Upload size={20} className="text-white" />}
                    <span className="text-[8px] text-white uppercase font-bold tracking-tighter mt-1">Select MP4</span>
                    <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, video.id, 'video')} />
                </label>
                <div className="absolute top-2 left-2 bg-brand-burgundy/80 p-1.5 rounded-lg text-white"><MonitorPlay size={14} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow w-full">
                <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold text-brand-gold uppercase tracking-widest">Title</label>
                    <input value={video.title} onChange={(e) => { const n = [...videos]; n[idx].title = e.target.value; setVideos(n); }} className="bg-transparent border-b border-brand-gold/20 py-1 outline-none font-display text-2xl text-brand-burgundy" placeholder="Video Title" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold text-brand-gold uppercase tracking-widest">Source</label>
                    <div className="flex items-center gap-2 border-b border-brand-gold/10 pb-1">
                        <Film size={12} className="text-brand-gold" /><input value={video.url} placeholder="Upload video to generate URL" readOnly className="w-full bg-transparent outline-none text-[10px] text-brand-burgundy/60 italic" />
                    </div>
                </div>
            </div>
            <div className="flex lg:flex-col gap-4">
                <button onClick={() => window.open(video.url, '_blank')} className="p-3 bg-brand-ivory rounded-2xl text-brand-burgundy/40 hover:text-brand-gold transition-colors shadow-sm"><Play size={20} /></button>
                <button onClick={onDelete} className="text-red-200 hover:text-red-500 p-2"><Trash2 size={20} /></button>
            </div>
        </motion.div>
    );
};