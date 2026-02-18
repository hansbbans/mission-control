'use client';

import { useState, useEffect } from 'react';
import { WorkspaceDashboard } from '@/components/WorkspaceDashboard';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🦞</div>
          <p className="text-[#8b949e]">Loading Mission Control...</p>
        </div>
      </div>
    );
  }

  return <WorkspaceDashboard />;
}
