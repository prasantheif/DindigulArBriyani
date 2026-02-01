"use client";

import React from "react";
import { Header } from "@/components/Header";
import { SpiceNebula } from "@/components/SpiceNebula";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { VideoShowcase } from "@/components/VideoShowcase";
import { Footer } from "@/components/Footer";
import { useProspectus } from "@/context/ProspectusContext";
import { StorytellingSection } from "@/components/StorytellingSection";
import { PressHero } from "@/components/PressHero";
import { TasteUs } from "@/components/TasteUs"; // NAMED IMPORT FIXED HERE

const AboutPage = () => {
    const { openProspectus } = useProspectus();

    return (
        <main className="relative min-h-screen bg-brand-ivory selection:bg-brand-gold selection:text-brand-burgundy">
            <SpiceNebula speed={0.5} />
            <Header />
            <PressHero />
            <StorytellingSection />

            {/* TasteUs Section */}
            <div id="TasteUs" className="scroll-mt-20">
                <TasteUs />
            </div>

            {/* JOIN THE LEGACY SECTION */}
            <section className="py-32 bg-gradient-to-b from-brand-ivory to-brand-gold/5 text-center border-t border-brand-gold/10">
                <div className="container mx-auto px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto p-12 bg-white/80 backdrop-blur-md border-4 border-brand-bronze/60 rounded-[3rem] shadow-sovereign"
                    >
                        <h3 className="font-display text-4xl md:text-5xl font-bold mb-8 text-brand-burgundy uppercase tracking-tight">
                            Join the <span className="text-brand-gold italic">Legacy</span>
                        </h3>

                        <p className="font-serif text-xl text-brand-burgundy/80 italic max-w-2xl mx-auto mb-10 leading-relaxed">
                            &quot;The AR story is just getting started. Own a piece of Dindigul&apos;s pride and
                            bring the sovereign taste to your city.&quot;
                        </p>

                        <button
                            onClick={openProspectus}
                            className="group flex items-center gap-4 mx-auto px-12 py-5 bg-brand-burgundy text-brand-ivory text-[10px] font-bold uppercase tracking-[0.5em] rounded-full hover:bg-brand-bronze transition-all duration-500 shadow-xl"
                        >
                            Enquire Now
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            <VideoShowcase />
            <Footer />
        </main>
    );
};

export default AboutPage;