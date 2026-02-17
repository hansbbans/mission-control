'use client';

import type { Activity } from '@/lib/types';

interface ActivityLogProps {
  activities: Activity[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <div className="bg-mc-bg-secondary rounded-lg p-4">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-mc-text-secondary mb-4">
        Activity Feed
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="text-sm">
            <p className="text-mc-text">{activity.message}</p>
            <p className="text-xs text-mc-text-secondary mt-1">
              {new Date(activity.created_at).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
