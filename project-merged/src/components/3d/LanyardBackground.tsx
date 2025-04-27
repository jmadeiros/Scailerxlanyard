'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Lightformer, Environment } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import LanyardCard from './LanyardCard';
import dynamic from 'next/dynamic';

// CanvasWrapper needs pointer events auto to capture 3D interaction
const CanvasWrapper = dynamic(() => Promise.resolve(({ children }: { children: React.ReactNode }) => (
  <Canvas 
    camera={{ position: [0, 0, 13], fov: 25 }} 
    gl={{ alpha: true }} // Request alpha buffer
    style={{ background: 'transparent', pointerEvents: 'auto' }} 
    // Explicitly set clear alpha on creation
    onCreated={({ gl }) => {
      gl.setClearAlpha(0);
    }}
    flat // Add flat prop for better transparency compositing
  >
    {children}
  </Canvas>
)), { ssr: false });

interface LanyardBackgroundProps {
  zIndex?: number;
  transparent?: boolean; // Controls whether background is transparent
  showDebug?: boolean; // Controls whether to show debug indicator
  cardSettings?: {
    position1?: [number, number, number];
    position2?: [number, number, number];
  };
}

export default function LanyardBackground({ 
  zIndex = 0, // Default zIndex for elements within the section
  transparent = true,
  showDebug = false,
  cardSettings = {
    position1: [-4, 0.5, 0],
    position2: [4, 0.5, 0]
  }
}: LanyardBackgroundProps) {
  // Debug message to confirm the component is rendering
  if (showDebug) console.log("LanyardBackground rendering");
  
  return (
    // Use absolute positioning to fill parent, not fixed
    <div className="absolute inset-0 w-full h-full" style={{ 
      zIndex, 
      pointerEvents: 'none', // Wrapper allows pass-through
      background: 'transparent'
    }}>
      {/* Debug indicator - only shown when showDebug is true */}
      {showDebug && (
        <div className="absolute top-0 right-0 z-50 bg-black bg-opacity-50 text-white p-2 text-sm pointer-events-auto">
          3D Cards Active
        </div>
      )}
      
      {/* CanvasWrapper will handle its own pointer events for 3D interaction */}
      <CanvasWrapper>
        {/* Reduced Ambient Light */}
        <ambientLight intensity={1.0} /> 
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Physics interpolate gravity={[0, -10, 0]} timeStep={1 / 60}>
          <LanyardCard 
            position={cardSettings.position1} 
            frontImage="/assets/1729360719180.jpg"
            backImage="/assets/Screenshot 2025-04-25 200507.png"
          />
          <LanyardCard 
            position={cardSettings.position2} 
            frontImage="/assets/WhatsApp Image 2025-04-25 at 16.17.59_8c138974.jpg"
            backImage="/assets/Screenshot 2025-04-25 200507.png"
          />
        </Physics>

        <Environment preset="city" blur={0.5}> 
          {/* Keep lightformers if needed for reflections */}
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </CanvasWrapper>
    </div>
  );
} 