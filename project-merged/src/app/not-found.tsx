"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-scailer-dark text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading...</h1>
        <p className="text-lg text-white/70">Redirecting to home page</p>
      </div>
    </div>
  );
} 