'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, CheckSquare, MessageSquare, Clock, X } from 'lucide-react';

interface SearchResult {
  type: 'activity' | 'task' | 'message' | 'file';
  title: string;
  snippet: string;
  path: string;
  score: number;
}

export function GlobalSearch({ workspaceId = 'default' }: { workspaceId?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, workspaceId]);

  const performSearch = async (q: string) => {
    setLoading(true);
    setSearched(true);

    try {
      // Search across multiple sources in parallel
      const [activitiesRes, tasksRes] = await Promise.all([
        fetch(`/api/activities?workspace_id=${workspaceId}&limit=20`),
        fetch(`/api/tasks?workspace_id=${workspaceId}&limit=20`),
      ]);

      const searchResults: SearchResult[] = [];
      const qLower = q.toLowerCase();

      // Search activities
      if (activitiesRes.ok) {
        const activities = await activitiesRes.json();
        activities
          .filter((a: { title: string }) => a.title.toLowerCase().includes(qLower))
          .slice(0, 5)
          .forEach((a: { type: string; title: string; created_at: string }) => {
            searchResults.push({
              type: 'activity',
              title: a.title,
              snippet: `Recorded ${new Date(a.created_at).toLocaleDateString()}`,
              path: 'Activities',
              score: a.title.toLowerCase().includes(qLower) ? 1 : 0,
            });
          });
      }

      // Search tasks
      if (tasksRes.ok) {
        const tasks = await tasksRes.json();
        tasks
          .filter((t: { title: string; description?: string }) => 
            t.title.toLowerCase().includes(qLower) || 
            (t.description && t.description.toLowerCase().includes(qLower))
          )
          .slice(0, 5)
          .forEach((t: { id: string; title: string; status: string; description?: string }) => {
            searchResults.push({
              type: 'task',
              title: t.title,
              snippet: t.description?.substring(0, 100) || `Status: ${t.status}`,
              path: `Task #${t.id}`,
              score: t.title.toLowerCase().includes(qLower) ? 1 : 0,
            });
          });
      }

      // Sort by score
      searchResults.sort((a, b) => b.score - a.score);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'activity': return <Clock className="w-4 h-4" />;
      case 'task': return <CheckSquare className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'file': return <FileText className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'activity': return 'bg-mc-accent-yellow/20 text-mc-accent-yellow';
      case 'task': return 'bg-mc-accent-green/20 text-mc-accent-green';
      case 'message': return 'bg-mc-accent-purple/20 text-mc-accent-purple';
      case 'file': return 'bg-mc-accent/20 text-mc-accent';
      default: return 'bg-mc-bg-tertiary text-mc-text-secondary';
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="p-4 border-b border-mc-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mc-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, activities, messages..."
            className="w-full pl-10 pr-10 py-3 bg-mc-bg-tertiary border border-mc-border rounded-lg text-mc-text placeholder-mc-text-secondary focus:outline-none focus:border-mc-accent"
            autoFocus
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mc-text-secondary hover:text-mc-text"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-8 text-mc-text-secondary">
            <div className="animate-pulse">Searching...</div>
          </div>
        ) : !searched ? (
          <div className="text-center py-8 text-mc-text-secondary">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Start typing to search</p>
            <p className="text-sm mt-1">Search across tasks, activities, and more</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8 text-mc-text-secondary">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No results found for &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((result, idx) => (
              <div
                key={idx}
                className="p-3 bg-mc-bg-secondary border border-mc-border rounded-lg hover:border-mc-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{result.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                    <p className="text-sm text-mc-text-secondary mt-1 line-clamp-2">
                      {result.snippet}
                    </p>
                    <p className="text-xs text-mc-text-secondary mt-2 font-mono">
                      {result.path}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-mc-border">
        <p className="text-xs text-mc-text-secondary">
          {searched
            ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for &ldquo;${query}&rdquo;`
            : 'Start typing to search across your workspace'}
        </p>
      </div>
    </div>
  );
}
