'use client';

import { useState } from 'react';
import { Plus, ArrowRight, Folder } from 'lucide-react';
import Link from 'next/link';
import { useWorkspaces, useCreateWorkspace } from '@/lib/convex';

export function WorkspaceDashboard() {
  const workspaces = useWorkspaces();
  const createWorkspace = useCreateWorkspace();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    try {
      await createWorkspace({
        name: newWorkspaceName,
        description: '',
      });
      setNewWorkspaceName('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  if (!workspaces) {
    return (
      <div className="min-h-screen bg-mc-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🦞</div>
          <p className="text-mc-text-secondary">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mc-bg">
      {/* Header */}
      <header className="border-b border-mc-border bg-mc-bg-secondary">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦞</span>
              <h1 className="text-xl font-bold">Mission Control</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-mc-accent text-mc-bg rounded-lg font-medium hover:bg-mc-accent/90"
            >
              <Plus className="w-4 h-4" />
              New Workspace
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">All Workspaces</h2>
          <p className="text-mc-text-secondary">
            Select a workspace to view its mission queue and agents
          </p>
        </div>

        {workspaces.length === 0 ? (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 mx-auto text-mc-text-secondary mb-4" />
            <h3 className="text-lg font-medium mb-2">No workspaces yet</h3>
            <p className="text-mc-text-secondary mb-6">
              Create your first workspace to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-mc-accent text-mc-bg rounded-lg font-medium hover:bg-mc-accent/90"
            >
              Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace: any) => (
              <Link
                key={workspace._id}
                href={`/workspaces/${workspace._id}`}
                className="border border-mc-border rounded-xl p-6 hover:border-mc-accent/50 hover:bg-mc-bg-secondary transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-mc-text">{workspace.name}</h3>
                    {workspace.description && (
                      <p className="text-sm text-mc-text-secondary mt-1">{workspace.description}</p>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-mc-text-secondary" />
                </div>
                <div className="text-sm text-mc-text-secondary">
                  Created {new Date(workspace.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}

            {/* Add workspace card */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="border-2 border-dashed border-mc-border rounded-xl p-6 hover:border-mc-accent/50 transition-colors flex flex-col items-center justify-center gap-3 min-h-[200px]"
            >
              <Plus className="w-8 h-8 text-mc-text-secondary" />
              <span className="text-mc-text-secondary">Create Workspace</span>
            </button>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-mc-bg-secondary rounded-xl p-6 w-full max-w-md border border-mc-border">
            <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
            <form onSubmit={handleCreateWorkspace}>
              <input
                type="text"
                placeholder="Workspace name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="w-full px-4 py-2 bg-mc-bg border border-mc-border rounded-lg mb-4 text-mc-text placeholder-mc-text-secondary focus:outline-none focus:border-mc-accent"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewWorkspaceName('');
                  }}
                  className="flex-1 px-4 py-2 border border-mc-border rounded-lg text-mc-text hover:bg-mc-bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newWorkspaceName.trim()}
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
