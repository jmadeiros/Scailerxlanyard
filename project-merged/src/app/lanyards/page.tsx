'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the card component to avoid SSR issues
const DynamicLanyardCard = dynamic(
  () => import('@/components/3d/LanyardCard'),
  { ssr: false }
);

// Import the full background
const DynamicLanyardBackground = dynamic(
  () => import('@/components/3d/LanyardBackground'),
  { ssr: false }
);

type Position3D = [number, number, number];

export default function LanyardsPage() {
  const [interactMode, setInteractMode] = useState(true);
  const [cardPositions, setCardPositions] = useState<{
    position1: Position3D;
    position2: Position3D;
  }>({
    position1: [-4, 2, 0] as Position3D,
    position2: [4, 2, 0] as Position3D
  });
  
  const adjustCardPositions = (direction: string) => {
    switch(direction) {
      case 'closer':
        setCardPositions({
          position1: [-3, 2, 0] as Position3D,
          position2: [3, 2, 0] as Position3D
        });
        break;
      case 'further':
        setCardPositions({
          position1: [-6, 2, 0] as Position3D,
          position2: [6, 2, 0] as Position3D
        });
        break;
      case 'higher':
        setCardPositions({
          position1: [-4, 4, 0] as Position3D,
          position2: [4, 4, 0] as Position3D
        });
        break;
      case 'lower':
        setCardPositions({
          position1: [-4, 0, 0] as Position3D,
          position2: [4, 0, 0] as Position3D
        });
        break;
      default:
        setCardPositions({
          position1: [-4, 2, 0] as Position3D,
          position2: [4, 2, 0] as Position3D
        });
    }
  };
  
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-70 p-4 rounded">
        <h1 className="text-xl font-bold mb-2">Lanyard Cards</h1>
        <p className="text-sm mb-4">Interactive 3D cards with physics simulation</p>
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setInteractMode(!interactMode)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {interactMode ? 'Disable' : 'Enable'} Interaction
          </button>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">
            Back to Home
          </Link>
        </div>
        
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-2">Position Controls:</h2>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => adjustCardPositions('closer')}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
            >
              Move Closer
            </button>
            <button 
              onClick={() => adjustCardPositions('further')}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
            >
              Move Further
            </button>
            <button 
              onClick={() => adjustCardPositions('higher')}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
            >
              Move Higher
            </button>
            <button 
              onClick={() => adjustCardPositions('lower')}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs"
            >
              Move Lower
            </button>
            <button 
              onClick={() => adjustCardPositions('reset')}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs col-span-2"
            >
              Reset Position
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <DynamicLanyardBackground 
          showDebug={true}
          transparent={false}
          cardSettings={cardPositions}
        />
        
        {!interactMode && (
          <div className="absolute inset-0 z-10">
            <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
              <OrbitControls />
            </Canvas>
          </div>
        )}
      </div>
    </div>
  );
} 