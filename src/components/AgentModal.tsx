'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateAgent, useUpdateAgentStatus } from '@/lib/convex';
import type { Agent } from '@/lib/types';

interface AgentModalProps {
  workspaceId: string;
  agent?: Agent;
  onClose: () => void;
}

const EMOJIS = ['🦞', '🐸', '🐙', '🦑', '🦐', '🐢', '🐠', '🦈', '🐙', '🦑'];

export function AgentModal({ workspaceId, agent, onClose }: AgentModalProps) {
  const createAgent = useCreateAgent();
  const [name, setName] = useState(agent?.name || '');
  const [role, setRole] = useState(agent?.role || '');
  const [emoji, setEmoji] = useState(agent?.avatar_emoji || '🦞');
  const [description, setDescription] = useState(agent?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    try {
      await createAgent({
        workspace_id: workspaceId as any,
        name,
        role,
        avatar_emoji: emoji,
        description: description || undefined,
        is_master: false,
        session_key: `agent:${name.toLowerCase()}:main`,
      });
      onClose();
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-mc-bg-secondary rounded-xl w-full max-w-md border border-mc-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mc-border">
          <h2 className="text-xl font-bold">{agent ? 'Edit Agent' : 'Create Agent'}</h2>
          <button onClick={onClose} className="text-mc-text-secondary hover:text-mc-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Emoji selector */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-mc-text-secondary mb-2">
              Avatar
            </label>
            <div className="grid grid-cols-5 gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`p-3 text-2xl rounded-lg border transition-all ${
                    emoji === e
                      ? 'border-mc-accent bg-mc-accent/10'
                      : 'border-mc-border hover:border-mc-accent/50'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-mc-text-secondary mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent name"
              className="w-full px-4 py-2 bg-mc-bg border border-mc-border rounded-lg text-mc-text placeholder-mc-text-secondary focus:outline-none focus:border-mc-accent"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-mc-text-secondary mb-2">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Coordinator, Coder, Designer"
              className="w-full px-4 py-2 bg-mc-bg border border-mc-border rounded-lg text-mc-text placeholder-mc-text-secondary focus:outline-none focus:border-mc-accent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wide text-mc-text-secondary mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of agent's responsibilities"
              className="w-full px-4 py-2 bg-mc-bg border border-mc-border rounded-lg text-mc-text placeholder-mc-text-secondary focus:outline-none focus:border-mc-accent min-h-20"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-mc-border rounded-lg text-mc-text hover:bg-mc-bg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !role.trim()}
              className="flex-1 px-4 py-2 bg-mc-accent text-mc-bg rounded-lg font-medium hover:bg-mc-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {agent ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
