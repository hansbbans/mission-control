'use client';

import dynamic from 'next/dynamic';

const WorkspaceDetail = dynamic(
  () =>
    import('@/components/WorkspaceDetail').then((mod) => ({
      default: mod.WorkspaceDetail,
    })),
  {
    loading: () => (
      <div className="min-h-screen bg-mc-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🦞</div>
          <p className="text-mc-text-secondary">Loading workspace...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function Page() {
  return <WorkspaceDetail />;
}
