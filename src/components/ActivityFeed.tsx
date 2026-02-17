'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MessageSquare, CheckSquare, Settings, AlertCircle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'task' | 'message' | 'search' | 'system' | 'error';
  title: string;
  description?: string;
  workspace_id: string;
  created_at: string;
}

type ActivityFilter = 'all' | 'task' | 'message' | 'search' | 'system' | 'error';

export function ActivityFeed({ workspaceId = 'default' }: { workspaceId?: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [limit, setLimit] = useState(25);

  useEffect(() => {
    loadActivities();
  }, [workspaceId, filter, limit]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('workspace_id', workspaceId);
      if (filter !== 'all') params.set('type', filter);
      params.set('limit', limit.toString());

      const res = await fetch(`/api/activities?${params}`);
      if (res.ok) {
        setActivities(await res.json());
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare className="w-4 h-4 text-mc-accent-green" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-mc-accent-purple" />;
      case 'search': return <Search className="w-4 h-4 text-mc-accent" />;
      case 'system': return <Settings className="w-4 h-4 text-mc-accent-yellow" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-mc-accent-red" />;
      default: return <CheckSquare className="w-4 h-4" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'task': return 'bg-mc-accent-green/10 border-mc-accent-green/20';
      case 'message': return 'bg-mc-accent-purple/10 border-mc-accent-purple/20';
      case 'search': return 'bg-mc-accent/10 border-mc-accent/20';
      case 'system': return 'bg-mc-accent-yellow/10 border-mc-accent-yellow/20';
      case 'error': return 'bg-mc-accent-red/10 border-mc-accent-red/20';
      default: return 'bg-mc-bg-tertiary border-mc-border';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filters: { value: ActivityFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'task', label: 'Tasks' },
    { value: 'message', label: 'Messages' },
    { value: 'search', label: 'Searches' },
    { value: 'system', label: 'System' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-mc-border">
        <h2 className="text-lg font-semibold mb-3">Activity Feed</h2>
        
        {/* Filters */}
        <div className="flex gap-2 mb-3">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === f.value
                  ? 'bg-mc-accent text-mc-bg'
                  : 'bg-mc-bg-tertiary text-mc-text-secondary hover:text-mc-text'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Limit selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-mc-text-secondary">Show:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="bg-mc-bg-tertiary border border-mc-border rounded-lg px-2 py-1 text-sm"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center py-8 text-mc-text-secondary">
            <div className="animate-pulse">Loading...</div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-mc-text-secondary">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No activities yet</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-3 rounded-lg border ${getActivityBg(activity.type)} flex gap-3`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{activity.title}</p>
                <p className="text-xs text-mc-text-secondary mt-1">
                  {formatDate(activity.created_at)}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                activity.type === 'task' ? 'bg-mc-accent-green/20 text-mc-accent-green' :
                activity.type === 'message' ? 'bg-mc-accent-purple/20 text-mc-accent-purple' :
                activity.type === 'search' ? 'bg-mc-accent/20 text-mc-accent' :
                activity.type === 'system' ? 'bg-mc-accent-yellow/20 text-mc-accent-yellow' :
                'bg-mc-accent-red/20 text-mc-accent-red'
              }`}>
                {activity.type}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
