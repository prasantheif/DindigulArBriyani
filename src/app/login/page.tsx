"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log("Attempting login for:", email);

            // 1. Authenticate with Firebase
            await signInWithEmailAndPassword(auth, email, password);

            console.log("Login successful. Force navigating to /admin...");

            // 2. FORCE NAVIGATION (The Fix)
            // This forces the browser to load the Admin page fresh
            window.location.href = "/admin";

        } catch (err: any) {
            console.error("Login Error:", err);

            // Readable Error Messages
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError("Invalid Email or Password.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many attempts. Please wait.");
            } else {
                setError("Access Denied. Please try again.");
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-burgundy flex items-center justify-center p-4 relative overflow-hidden">

            {/* Subtle Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

            {/* Login Card */}
            <div className="bg-brand-ivory p-8 md:p-12 rounded-[2.5rem] w-full max-w-md shadow-2xl border border-brand-gold/20 relative z-10">

                {/* Top Decoration Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-brand-gold rounded-b-full shadow-[0_0_15px_rgba(255,215,0,0.5)]" />

                <div className="text-center mb-10 mt-2">
                    <div className="w-20 h-20 bg-brand-burgundy/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-brand-burgundy/10">
                        <Lock className="text-brand-burgundy" size={28} />
                    </div>
                    <h1 className="font-display text-4xl text-brand-burgundy uppercase tracking-tight leading-none">
                        Executive <span className="text-brand-gold italic">Suite</span>
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-brand-burgundy/40 mt-3 font-bold">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-brand-burgundy/60 ml-1">Identifier</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white p-4 rounded-2xl border border-brand-gold/10 focus:border-brand-burgundy outline-none text-brand-burgundy font-bold transition-all shadow-sm placeholder:text-gray-300 focus:shadow-md"
                            placeholder="admin@dindigul.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-brand-burgundy/60 ml-1">Passkey</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white p-4 rounded-2xl border border-brand-gold/10 focus:border-brand-burgundy outline-none text-brand-burgundy font-bold transition-all shadow-sm placeholder:text-gray-300 focus:shadow-md"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center border border-red-100 flex items-center justify-center gap-2 animate-pulse">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-brand-burgundy text-brand-ivory font-bold uppercase tracking-[0.25em] rounded-2xl hover:bg-brand-gold hover:text-brand-burgundy transition-all duration-300 flex justify-center items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4 group"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} /> Verifying...
                            </>
                        ) : (
                            <>
                                Authenticate <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}