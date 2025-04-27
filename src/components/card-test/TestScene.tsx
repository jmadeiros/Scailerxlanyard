'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';

export default function TestScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Physics debug>
          <RigidBody position={[0, 2, 0]}>
            <Box args={[1, 1.5, 0.1]}>
              <meshStandardMaterial color="hotpink" />
            </Box>
          </RigidBody>
          
          <RigidBody type="fixed" position={[0, 0, 0]}>
            <Box args={[10, 0.5, 10]} position={[0, -0.25, 0]}>
              <meshStandardMaterial color="lightblue" />
            </Box>
          </RigidBody>
        </Physics>
        
        <OrbitControls />
      </Canvas>
    </div>
  );
} 