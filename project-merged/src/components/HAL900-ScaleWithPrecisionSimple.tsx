"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { User, Zap, Globe, Target } from "lucide-react";

// Dynamically import the 3D background
const LanyardCardsSection = dynamic(
  () => import("@/components/3d/LanyardBackground"),
  { ssr: false }
);

const TeamMember = ({ name, role, description, links }: { 
  name: string; 
  role: string; 
  description: string;
  links: { type: 'github' | 'linkedin', url: string }[];
}) => (
  <div className="w-full bg-scailer-light/5 rounded-xl p-6 md:p-8 min-h-[300px] md:min-h-[400px] flex flex-col">
    <div className="flex flex-col h-full">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{name}</h3>
      <div className="flex items-center gap-2 mb-4">
        {role === "AI Engineer" ? (
          <Zap className="w-5 h-5 text-[#25D366]" />
        ) : (
          <Target className="w-5 h-5 text-[#25D366]" />
        )}
        <span className="text-[#25D366] font-medium">{role}</span>
      </div>
      <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">{description}</p>
      <div className="flex gap-4 mt-auto">
        {links.map((link) => (
          <a 
            key={link.type}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
          >
            {link.type === 'github' ? (
              <Globe className="w-6 h-6" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default function HAL900ScaleWithPrecisionSimple() {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className="relative py-24 md:py-32 overflow-hidden min-h-[800px]" 
      style={{ backgroundColor: '#1a1a1a', zIndex: 1 }}
    >
      {/* 3D Background Layer - Positioned behind, NO pointer events */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <LanyardCardsSection 
          zIndex={0} 
          transparent={true}
          cardSettings={{
            position1: [-5.5, 0, 0], 
            position2: [5.5, -1, 0]  
          }}
        />
      </div>

      {/* Original Content Layer - On top */}
      <div id="scale-content-inner" className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">Meet the Team</h2>
        </motion.div>
        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-start max-w-5xl mx-auto">
          <TeamMember 
            name="Madeline"
            role="AI Engineer"
            description="Specializing in AI/ML systems and automation, with a focus on creating scalable solutions that bridge human expertise with artificial intelligence."
            links={[
              { type: 'github', url: 'https://github.com/madelineyounes' },
              { type: 'linkedin', url: 'https://linkedin.com/in/madelineyounes' }
            ]}
          />
          <TeamMember 
            name="George"
            role="Full Stack Developer"
            description="Expert in building robust, scalable applications with a passion for creating elegant solutions to complex problems using modern technologies."
            links={[
              { type: 'github', url: 'https://github.com/georgeyounes' },
              { type: 'linkedin', url: 'https://linkedin.com/in/georgeyounes' }
            ]}
          />
        </div>
      </div>
    </section>
  );
} 