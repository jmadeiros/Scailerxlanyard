"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HAL900MessageAnimation from "./HAL900-MessageAnimation";
import HAL900AuditForm from "./HAL900-AuditForm";
import dynamic from "next/dynamic";

// Dynamically import the 3D background
const LanyardCardsSection = dynamic(
  () => import("@/components/3d/LanyardBackground"),
  { ssr: false }
);

export default function HAL900ScaleWithPrecision() {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Add relative positioning and ensure dark background with inline style and z-index
    <section 
      className="relative py-24 md:py-32 overflow-hidden" 
      style={{ backgroundColor: '#1a1a1a', zIndex: 1 }} // Force dark background (#1a1a1a is scailer-dark) & base z-index
    >
      {/* 3D Background Layer - Positioned behind, NO pointer events */}
      {/* Ensure this container fills the parent section */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <LanyardCardsSection 
          zIndex={0} 
          transparent={true} // Canvas itself is transparent
          cardSettings={{
            position1: [-5.5, 0, 0], 
            position2: [5.5, -1, 0]  
          }}
        />
      </div>

      {/* Original Content Layer - On top */}
      {/* Ensure this content has a higher z-index */}
      <div id="scale-content-inner" className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">Scale with Precision</h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 md:gap-12 items-start max-w-5xl mx-auto">
          <div className="w-full">
            <HAL900AuditForm />
          </div>
          <div className="w-full">
            <HAL900MessageAnimation />
          </div>
        </div>
      </div>
    </section>
  );
} 