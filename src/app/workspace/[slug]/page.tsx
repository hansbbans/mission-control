'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ListTodo, Activity, Calendar, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { AgentsSidebar } from '@/components/AgentsSidebar';
import { MissionQueue } from '@/components/MissionQueue';
import { LiveFeed } from '@/components/LiveFeed';
import { SSEDebugPanel } from '@/components/SSEDebugPanel';
import { ActivityFeed } from '@/components/ActivityFeed';
import { CalendarView } from '@/components/CalendarView';
import { GlobalSearch } from '@/components/GlobalSearch';
import { useMissionControl } from '@/lib/store';
import { useSSE } from '@/hooks/useSSE';
import { debug } from '@/lib/debug';
import type { Task, Workspace } from '@/lib/types';

type ViewType = 'queue' | 'activity' | 'calendar' | 'search';

export default function WorkspacePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const {
    setAgents,
    setTasks,
    setEvents,
    setIsOnline,
    setIsLoading,
    isLoading,
  } = useMissionControl();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('queue');

  // Connect to SSE for real-time updates
  useSSE();

  // Load workspace data
  useEffect(() => {
    async function loadWorkspace() {
      try {
        const res = await fetch(`/api/workspaces/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setWorkspace(data);
        } else if (res.status === 404) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Failed to load workspace:', error);
        setNotFound(true);
        setIsLoading(false);
        return;
      }
    }

    loadWorkspace();
  }, [slug, setIsLoading]);

  // Load workspace-specific data
  useEffect(() => {
    if (!workspace) return;
    
    const workspaceId = workspace.id;

    async function loadData() {
      try {
        debug.api('Loading workspace data...', { workspaceId });
        
        // Fetch workspace-scoped data
        const [agentsRes, tasksRes, eventsRes] = await Promise.all([
          fetch(`/api/agents?workspace_id=${workspaceId}`),
          fetch(`/api/tasks?workspace_id=${workspaceId}`),
          fetch('/api/events'),
        ]);

        if (agentsRes.ok) setAgents(await agentsRes.json());
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          debug.api('Loaded tasks', { count: tasksData.length });
          setTasks(tasksData);
        }
        if (eventsRes.ok) setEvents(await eventsRes.json());
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Check OpenClaw connection separately (non-blocking)
    async function checkOpenClaw() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const openclawRes = await fetch('/api/openclaw/status', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (openclawRes.ok) {
          const status = await openclawRes.json();
          setIsOnline(status.connected);
        }
      } catch {
        setIsOnline(false);
      }
    }

    loadData();
    checkOpenClaw();

    // Poll for events every 5 seconds
    const eventPoll = setInterval(async () => {
      try {
        const res = await fetch('/api/events?limit=20');
        if (res.ok) {
          setEvents(await res.json());
        }
      } catch (error) {
        console.error('Failed to poll events:', error);
      }
    }, 5000);

    // Poll tasks as SSE fallback (every 10 seconds)
    const taskPoll = setInterval(async () => {
      try {
        const res = await fetch(`/api/tasks?workspace_id=${workspaceId}`);
        if (res.ok) {
          const newTasks: Task[] = await res.json();
          const currentTasks = useMissionControl.getState().tasks;

          const hasChanges = newTasks.length !== currentTasks.length ||
            newTasks.some((t) => {
              const current = currentTasks.find(ct => ct.id === t.id);
              return !current || current.status !== t.status;
            });

          if (hasChanges) {
            debug.api('[FALLBACK] Task changes detected, updating store');
            setTasks(newTasks);
          }
        }
      } catch (error) {
        console.error('Failed to poll tasks:', error);
      }
    }, 10000);

    // Check OpenClaw connection every 30 seconds
    const connectionCheck = setInterval(async () => {
      try {
        const res = await fetch('/api/openclaw/status');
        if (res.ok) {
          const status = await res.json();
          setIsOnline(status.connected);
        }
      } catch {
        setIsOnline(false);
      }
    }, 30000);

    return () => {
      clearInterval(eventPoll);
      clearInterval(connectionCheck);
      clearInterval(taskPoll);
    };
  }, [workspace, setAgents, setTasks, setEvents, setIsOnline, setIsLoading]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-mc-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Workspace Not Found</h1>
          <p className="text-mc-text-secondary mb-6">
            The workspace &ldquo;{slug}&rdquo; doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-mc-accent text-mc-bg rounded-lg font-medium hover:bg-mc-accent/90"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !workspace) {
    return (
      <div className="min-h-screen bg-mc-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🦞</div>
          <p className="text-mc-text-secondary">Loading {slug}...</p>
        </div>
      </div>
    );
  }

  const views: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'queue', label: 'Mission Queue', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity Feed', icon: <Activity className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
  ];

  const renderMainContent = () => {
    switch (activeView) {
      case 'activity':
        return <ActivityFeed workspaceId={workspace.id} />;
      case 'calendar':
        return <CalendarView workspaceId={workspace.id} />;
      case 'search':
        return <GlobalSearch workspaceId={workspace.id} />;
      default:
        return <MissionQueue workspaceId={workspace.id} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-mc-bg overflow-hidden">
      <Header workspace={workspace} />

      {/* View Tabs */}
      <div className="px-4 pt-2 border-b border-mc-border">
        <div className="flex gap-1">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeView === view.id
                  ? 'bg-mc-bg-secondary text-mc-accent border-b-2 border-mc-accent'
                  : 'text-mc-text-secondary hover:text-mc-text hover:bg-mc-bg-tertiary'
              }`}
            >
              {view.icon}
              <span className="text-sm font-medium">{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Agents Sidebar */}
        <AgentsSidebar workspaceId={workspace.id} />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden border-l border-mc-border">
          {renderMainContent()}
        </div>

        {/* Live Feed */}
        <LiveFeed />
      </div>

      {/* Debug Panel - only shows when debug mode enabled */}
      <SSEDebugPanel />
    </div>
  );
}
