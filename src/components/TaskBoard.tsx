'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
// import { useCreateTask, useUpdateTaskStatus } from '@/lib/convex';
import type { Task } from '@/lib/types';

interface TaskBoardProps {
  tasks: Task[];
  workspaceId: string;
}

const STATUSES = ['planning', 'inbox', 'assigned', 'in_progress', 'testing', 'review', 'done'];

export function TaskBoard({ tasks, workspaceId }: TaskBoardProps) {
  // TODO: Re-enable when Convex is fixed
  // const createTask = useCreateTask();
  // const updateTaskStatus = useUpdateTaskStatus();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask({
        workspace_id: workspaceId as any,
        title: newTaskTitle,
        description: '',
      });
      setNewTaskTitle('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    try {
      await updateTaskStatus({
        taskId: draggedTask.id as any,
        status: newStatus as any,
      });
      setDraggedTask(null);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Mission Queue</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-mc-accent text-mc-bg rounded-lg font-medium hover:bg-mc-accent/90"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-7 gap-4">
        {STATUSES.map((status) => (
          <div
            key={status}
            className="bg-mc-bg-secondary rounded-lg p-4 min-h-96"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h3 className="font-semibold text-sm uppercase tracking-wide text-mc-text-secondary mb-4">
              {status}
            </h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={() => setDraggedTask(null)}
                    className={`bg-mc-bg p-3 rounded-lg border cursor-move transition-all ${
                      draggedTask?.id === task.id
                        ? 'border-mc-accent/50 opacity-50'
                        : 'border-mc-border hover:border-mc-accent/50'
                    }`}
                  >
                    <p className="text-sm font-medium text-mc-text">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-mc-text-secondary mt-1">{task.description}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-mc-bg-secondary rounded-xl p-6 w-full max-w-md border border-mc-border">
            <h2 className="text-xl font-bold mb-4">Create Task</h2>
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-4 py-2 bg-mc-bg border border-mc-border rounded-lg mb-4 text-mc-text placeholder-mc-text-secondary focus:outline-none focus:border-mc-accent"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTaskTitle('');
                  }}
                  className="flex-1 px-4 py-2 border border-mc-border rounded-lg text-mc-text hover:bg-mc-bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="flex-1 px-4 py-2 bg-mc-accent text-mc-bg rounded-lg font-medium hover:bg-mc-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
