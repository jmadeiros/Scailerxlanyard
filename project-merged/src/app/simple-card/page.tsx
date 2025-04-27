'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

export default function SimpleCardPage() {
  return (
    <div className="w-full h-screen">
      <h1 className="text-3xl font-bold p-4 fixed top-0 left-0 z-50 text-white">Simple 3D Demo</h1>
      
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Box position={[0, 0, 0]} args={[2, 3, 0.1]}>
          <meshStandardMaterial color="hotpink" />
        </Box>
        
        <OrbitControls />
      </Canvas>
    </div>
  );
} 