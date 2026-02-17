'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const WorkspaceDashboard = dynamic(() => import('@/components/WorkspaceDashboard').then(mod => ({ default: mod.WorkspaceDashboard })), {
  loading: () => (
    <div className="min-h-screen bg-mc-bg flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">🦞</div>
        <p className="text-mc-text-secondary">Loading Mission Control...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkspaceDashboard />
    </Suspense>
  );
}
