'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import the 3D scene dynamically with no SSR
const Scene = dynamic(() => import('@/components/card-test/TestScene'), { 
  ssr: false,
  loading: () => <div className="loading">Loading 3D Scene...</div>
});

export default function CardTestPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 relative z-10">3D Card Test Page</h1>
      <div className="w-full flex-1">
        <Scene />
      </div>
    </div>
  );
} 