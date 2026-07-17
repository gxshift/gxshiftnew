"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import dinamis dengan mematikan SSR (Server-Side Rendering)
const BlastDoorOverlay = dynamic(() => import('./BlastDoorOverlay'), { ssr: false });

export default function SafeBlastDoor() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  
  return <BlastDoorOverlay />;
}