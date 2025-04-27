'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import LanyardCard from './LanyardCard';
import dynamic from 'next/dynamic';

// Create a client-side-only wrapper component for the Canvas
const CanvasWrapper = dynamic(() => Promise.resolve(({ children }: { children: React.ReactNode }) => (
  <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>{children}</Canvas>
)), { ssr: false });

interface LanyardBackgroundProps {
  zIndex?: number;
}

export default function LanyardBackground({ zIndex = -1 }: LanyardBackgroundProps) {
  return (
    <div className="fixed inset-0" style={{ 
      zIndex, 
      pointerEvents: 'auto',
      background: 'rgba(0, 0, 0, 0.5)' // Semi-transparent background to make cards more visible
    }}>
      <div className="absolute top-0 left-0 z-50 bg-black bg-opacity-50 text-white p-2">
        3D Cards Background Active
      </div>
      <CanvasWrapper>
        <ambientLight intensity={Math.PI} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        
        <Physics interpolate gravity={[0, -10, 0]} timeStep={1 / 60} debug>
          <LanyardCard 
            position={[-3, 2, 0]} 
            frontImage="/assets/1729360719180.jpg"
            backImage="/assets/Screenshot 2025-04-25 200507.png"
          />
          <LanyardCard 
            position={[3, 2, 0]} 
            frontImage="/assets/WhatsApp Image 2025-04-25 at 16.17.59_8c138974.jpg"
            backImage="/assets/Screenshot 2025-04-25 200507.png"
          />
        </Physics>

        <Environment background blur={0.5}>
          <color attach="background" args={['black']} />
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </CanvasWrapper>
    </div>
  );
} 