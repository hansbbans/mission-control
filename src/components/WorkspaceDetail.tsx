'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
// import { useWorkspace, useWorkspaceTasks, useWorkspaceAgents, useWorkspaceActivities } from '@/lib/convex';
import { TaskBoard } from '@/components/TaskBoard';
import { ActivityLog } from '@/components/ActivityLog';
import { AgentsSidebar } from '@/components/AgentsSidebar';
import { AgentModal } from '@/components/AgentModal';

export function WorkspaceDetail() {
  const params = useParams();
  const workspaceId = (params?.id as string) || '';
  const [showAgentModal, setShowAgentModal] = useState(false);

  // TODO: Re-enable when Convex is fixed
  // const workspace = useWorkspace(workspaceId);
  // const tasks = useWorkspaceTasks(workspaceId);
  // const agents = useWorkspaceAgents(workspaceId);
  // const activities = useWorkspaceActivities(workspaceId);
  
  // Dummy data for now
  const workspace = { _id: '1', name: 'Demo Workspace', description: 'Test' };
  const tasks = [];
  const agents = [];
  const activities = [];

  if (!workspace || !tasks || !agents || !activities) {
    return (
      <div className="min-h-screen bg-mc-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🦞</div>
          <p className="text-mc-text-secondary">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mc-bg flex">
      {/* Sidebar with agents */}
      <AgentsSidebar agents={agents} workspaceId={workspaceId} onAddAgent={() => setShowAgentModal(true)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-mc-border bg-mc-bg-secondary px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">{workspace.name}</h1>
            {workspace.description && (
              <p className="text-mc-text-secondary mt-1">{workspace.description}</p>
            )}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 flex gap-6 p-6">
          {/* Task board */}
          <div className="flex-1">
            <TaskBoard tasks={tasks} workspaceId={workspaceId} />
          </div>

          {/* Activity log */}
          <div className="w-80">
            <ActivityLog activities={activities} />
          </div>
        </main>
      </div>

      {/* Agent modal */}
      {showAgentModal && <AgentModal workspaceId={workspaceId} onClose={() => setShowAgentModal(false)} />}
    </div>
  );
}
