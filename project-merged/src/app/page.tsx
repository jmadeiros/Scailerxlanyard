"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HAL900Header = dynamic(() => import("@/components/HAL900-Header"), {
  ssr: true,
});

const HAL900Hero = dynamic(() => import("@/components/HAL900-Hero"), {
  ssr: true,
});

const HAL900OperationsService = dynamic(() => import("@/components/HAL900-OperationsService"), {
  ssr: true,
});

const HAL900ScaleWithPrecisionSimple = dynamic(
  () => import("@/components/HAL900-ScaleWithPrecisionSimple"),
  { ssr: true }
);

const HAL900ScaleWithPrecision = dynamic(
  () => import("@/components/HAL900-ScaleWithPrecision"),
  { ssr: true } 
);

const HAL900FrameworkDiagram = dynamic(
  () => import("@/components/HAL900-FrameworkDiagram"),
  { ssr: true }
);

const HAL900BookingInterface = dynamic(
  () => import("@/components/HAL900-BookingInterface"),
  { ssr: true }
);

const LanyardCardsSection = dynamic(
  () => import("@/components/3d/LanyardBackground"),
  { ssr: false }
);

export default function Home() {
  const [allowScroll, setAllowScroll] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    setAllowScroll(true);
  }, []);

  const handleLearnMore = () => {
    const element = document.getElementById("framework-diagram");
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="min-h-screen bg-scailer-dark">
      <HAL900Header />
      <HAL900Hero onLearnMore={handleLearnMore} />
      <div className={`transition-opacity duration-500 ${allowScroll ? 'opacity-100' : 'opacity-0'}`}>
        <HAL900OperationsService />
        <HAL900ScaleWithPrecisionSimple />
        <HAL900ScaleWithPrecision />
        <div id="framework-diagram">
          <HAL900FrameworkDiagram />
        </div>
        <HAL900BookingInterface />
      </div>
      
      <div className="fixed bottom-4 right-4 z-50">
        <a 
          href="/lanyards" 
          className="bg-scailer-green text-black px-4 py-2 rounded-md text-sm font-medium"
          target="_blank"
        >
          View Lanyard Demo
        </a>
      </div>
    </main>
  );
}
