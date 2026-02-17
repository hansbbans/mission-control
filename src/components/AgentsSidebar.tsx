'use client';

import { Plus } from 'lucide-react';
import type { Agent } from '@/lib/types';

interface AgentsSidebarProps {
  agents: Agent[];
  workspaceId: string;
  onAddAgent?: () => void;
}

export function AgentsSidebar({ agents, workspaceId, onAddAgent }: AgentsSidebarProps) {
  return (
    <div className="w-64 bg-mc-bg-secondary border-r border-mc-border p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">Squad</h2>
        {onAddAgent && (
          <button
            onClick={onAddAgent}
            className="p-1 hover:bg-mc-bg rounded-lg transition-colors"
            title="Add agent"
          >
            <Plus className="w-4 h-4 text-mc-accent" />
          </button>
        )}
      </div>
      <div className="space-y-3 flex-1">
        {agents.map((agent) => (
          <div key={agent.id} className="p-3 bg-mc-bg rounded-lg border border-mc-border hover:border-mc-accent/50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{agent.avatar_emoji}</span>
              <span className="text-sm font-medium text-mc-text">{agent.name}</span>
            </div>
            <p className="text-xs text-mc-text-secondary">{agent.role}</p>
            <div className="mt-2 flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  agent.status === 'working'
                    ? 'bg-green-500'
                    : agent.status === 'offline'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                }`}
              />
              <span className="text-xs text-mc-text-secondary capitalize">{agent.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
