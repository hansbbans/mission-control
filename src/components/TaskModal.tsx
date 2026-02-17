'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useUpdateTaskStatus, useAssignTask } from '@/lib/convex';
import type { Task, Agent } from '@/lib/types';

interface TaskModalProps {
  task: Task;
  agents: Agent[];
  onClose: () => void;
}

const STATUSES = ['planning', 'inbox', 'assigned', 'in_progress', 'testing', 'review', 'done'];

export function TaskModal({ task, agents, onClose }: TaskModalProps) {
  const updateTaskStatus = useUpdateTaskStatus();
  const assignTask = useAssignTask();
  const [selectedAgent, setSelectedAgent] = useState<string>(task.assigned_agent_id || '');

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTaskStatus({
        taskId: task.id as any,
        status: newStatus as any,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAssignAgent = async (agentId: string) => {
    try {
      setSelectedAgent(agentId);
      await assignTask({
        taskId: task.id as any,
        agentId: agentId as any,
      });
    } catch (error) {
      console.error('Failed to assign task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-mc-bg-secondary rounded-xl w-full max-w-2xl border border-mc-border max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mc-border sticky top-0 bg-mc-bg-secondary">
          <h2 className="text-xl font-bold">{task.title}</h2>
          <button onClick={onClose} className="text-mc-text-secondary hover:text-mc-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-mc-text-secondary mb-2">
                Description
              </h3>
              <p className="text-mc-text">{task.description}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-mc-text-secondary mb-2">
              Status
            </h3>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    task.status === status
                      ? 'bg-mc-accent text-mc-bg'
                      : 'bg-mc-bg border border-mc-border text-mc-text hover:border-mc-accent/50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Assign Agent */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-mc-text-secondary mb-2">
              Assign to Agent
            </h3>
            <select
              value={selectedAgent}
              onChange={(e) => handleAssignAgent(e.target.value)}
              className="w-full px-4 py-2 bg-mc-bg border border-mc-border rounded-lg text-mc-text focus:outline-none focus:border-mc-accent"
            >
              <option value="">Unassigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.avatar_emoji} {agent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-mc-text-secondary mb-2">
              Priority
            </h3>
            <div className="text-mc-text capitalize">{task.priority}</div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-mc-text-secondary mb-2">
              Dates
            </h3>
            <div className="text-sm text-mc-text space-y-1">
              <div>Created: {new Date(task.created_at).toLocaleDateString()}</div>
              {task.due_date && <div>Due: {task.due_date}</div>}
              <div>Updated: {new Date(task.updated_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
