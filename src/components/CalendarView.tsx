'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface ScheduledJob {
  id: string;
  name: string;
  schedule: {
    kind: string;
    expr?: string;
    everyMs?: number;
    at?: string;
  };
  payload: {
    text?: string;
    message?: string;
  };
}

export function CalendarView({ workspaceId = 'default' }: { workspaceId?: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<ScheduledJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScheduledJobs();
  }, []);

  const loadScheduledJobs = async () => {
    setLoading(true);
    try {
      // Try to fetch from OpenClaw API
      const res = await fetch('/api/cron/list');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to load scheduled jobs:', error);
      // Fallback to empty
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getDaysOfWeek = (start: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return jobs.filter((job) => {
      if (job.schedule?.kind === 'cron') return true; // Show all recurring
      if (job.schedule?.kind === 'at' && job.schedule.at) {
        const jobDate = new Date(job.schedule.at).toISOString().split('T')[0];
        return jobDate === dateStr;
      }
      return false;
    });
  };

  const formatSchedule = (job: ScheduledJob) => {
    if (job.schedule?.kind === 'cron') {
      return job.schedule.expr || 'Recurring';
    }
    if (job.schedule?.kind === 'every' && job.schedule.everyMs) {
      const ms = job.schedule.everyMs;
      if (ms < 60000) return `Every ${ms / 1000}s`;
      if (ms < 3600000) return `Every ${ms / 60000}m`;
      return `Every ${ms / 3600000}h`;
    }
    if (job.schedule?.kind === 'at' && job.schedule.at) {
      return new Date(job.schedule.at).toLocaleString();
    }
    return 'Scheduled';
  };

  const weekStart = getWeekStart(currentDate);
  const days = getDaysOfWeek(weekStart);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-mc-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={prevWeek}
              className="p-2 hover:bg-mc-bg-tertiary rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">
              Week of {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h2>
            <button
              onClick={nextWeek}
              className="p-2 hover:bg-mc-bg-tertiary rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-mc-accent text-mc-bg rounded-lg font-medium hover:bg-mc-accent/90"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="text-center py-8 text-mc-text-secondary">
            <div className="animate-pulse">Loading calendar...</div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2 min-w-[800px]">
            {/* Day Headers */}
            {dayNames.map((name) => (
              <div
                key={name}
                className="text-center text-sm font-medium text-mc-text-secondary py-2"
              >
                {name}
              </div>
            ))}

            {/* Day Cells */}
            {days.map((day, idx) => {
              const events = getEventsForDate(day);
              const today = isToday(day);
              
              return (
                <div
                  key={idx}
                  className={`min-h-[120px] p-2 rounded-lg border ${
                    today
                      ? 'bg-mc-accent/5 border-mc-accent'
                      : 'bg-mc-bg-secondary border-mc-border'
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    today ? 'text-mc-accent' : 'text-mc-text-secondary'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {events.length > 0 ? (
                      events.slice(0, 3).map((job, i) => (
                        <div
                          key={i}
                          className={`text-xs p-1.5 rounded truncate ${
                            job.schedule?.kind === 'cron'
                              ? 'bg-mc-accent-green/20 text-mc-accent-green'
                              : 'bg-mc-accent-purple/20 text-mc-accent-purple'
                          }`}
                          title={job.name || job.payload?.text || 'Task'}
                        >
                          {job.name?.substring(0, 20) || job.payload?.text?.substring(0, 20) || 'Task'}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-mc-text-secondary italic">No tasks</div>
                    )}
                    {events.length > 3 && (
                      <div className="text-xs text-mc-text-secondary">
                        +{events.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Job List Footer */}
      <div className="p-4 border-t border-mc-border">
        <h3 className="text-sm font-medium mb-2">Scheduled Tasks ({jobs.length})</h3>
        <div className="flex flex-wrap gap-2">
          {jobs.slice(0, 5).map((job) => (
            <span
              key={job.id}
              className="text-xs px-2 py-1 bg-mc-bg-tertiary rounded"
            >
              {job.name || 'Unnamed'}
            </span>
          ))}
          {jobs.length > 5 && (
            <span className="text-xs text-mc-text-secondary">+{jobs.length - 5} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
