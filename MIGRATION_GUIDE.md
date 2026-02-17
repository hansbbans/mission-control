# Migration Guide: SQLite → Convex

## Overview

This guide walks through replacing SQLite calls with Convex throughout Mission Control.

## Key Changes

### Before (SQLite)
```typescript
// src/lib/db/operations.ts
export async function getTasks() {
  const db = new Database('mission-control.db');
  return db.prepare('SELECT * FROM tasks').all();
}

// In components
const [tasks, setTasks] = useState([]);
useEffect(() => {
  const data = getTasks();
  setTasks(data);
}, []);
```

### After (Convex)
```typescript
// No need to call the database directly
// src/components/TaskList.tsx
import { useTasks } from '@/lib/convex';

export function TaskList() {
  const tasks = useTasks();  // React hook - automatic updates
  return <div>{tasks?.map(task => ...)}</div>;
}
```

## Migration Steps

### 1. Replace fetch() calls with Convex hooks

**Before:**
```typescript
useEffect(() => {
  const loadTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
  };
  loadTasks();
}, []);
```

**After:**
```typescript
import { useTasks } from '@/lib/convex';

const tasks = useTasks();  // That's it!
```

### 2. Replace POST/PATCH with Convex mutations

**Before:**
```typescript
const handleCreateTask = async (title: string) => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  const newTask = await res.json();
  setTasks([...tasks, newTask]);
};
```

**After:**
```typescript
import { useCreateTask } from '@/lib/convex';

const createTask = useCreateTask();

const handleCreateTask = async (title: string) => {
  const taskId = await createTask({ title, description: '' });
  // Convex automatically updates the UI!
};
```

### 3. Files to Update

**API Routes → Remove**
- `src/app/api/workspaces/route.ts`
- `src/app/api/tasks/route.ts`
- `src/app/api/messages/route.ts`
- `src/app/api/documents/route.ts`
- etc. (replace with Convex mutations)

**Components → Update to use hooks**
- `src/components/WorkspaceDashboard.tsx` → Use `useTasks()`, `useActivities()`, etc.
- `src/components/TaskBoard.tsx` → Use task hooks
- `src/components/TaskDetail.tsx` → Use `useTask()`, `useTaskMessages()`
- etc.

**Database → Remove entirely**
- `src/lib/db/` (old SQLite code)
- `mission-control.db` (local database file)

## Convex Hooks Available

Import from `src/lib/convex.ts`:

```typescript
// Queries
useTasks()                          // All tasks
useTask(taskId)                     // Single task
useTaskMessages(taskId)             // Messages on a task
useActivities()                     // Activity feed
useAgents()                         // All agents
useAgentNotifications(agentId)      // Notifications for agent

// Mutations (async functions)
useCreateTask()                     // Create new task
useUpdateTaskStatus()               // Update task status
useAssignTask()                     // Assign task to agents
usePostMessage()                    // Post comment on task
useCreateDocument()                 // Create document
useAgentHeartbeat()                 // Agent heartbeat check
useMarkNotificationDelivered()      // Mark notification as read
```

## Testing the Migration

### Step 1: Verify Convex works locally
```bash
cd ~/code/mission-control
npm install  # Make sure convex is installed
npm run dev  # Start Next.js
```

In browser console, you should see Convex connecting.

### Step 2: Test one component at a time
- Update TaskList component first
- Verify it loads tasks from Convex
- Move to next component

### Step 3: Test mutations
- Create a task in the UI
- Verify it appears in Convex (check activity feed)
- Delete a task
- Verify it's gone

### Step 4: Test agent integration
- Have an agent post a message to a task
- Verify message appears in Mission Control
- Have agent update task status
- Verify status changes in real-time

## Rollback Plan

If something goes wrong:
```bash
# Restore from backup
git checkout old-sqlite-branch

# Or restore SQLite database
cp mission-control.db.backup mission-control.db
```

## Performance Notes

**Convex is more performant because:**
- Real-time updates (no polling)
- Subscriptions instead of manual refetches
- Built-in caching and optimistic updates
- No network round-trips for CRUD

**Before:** Get tasks (API call) → Wait → Update state → Re-render  
**After:** Get tasks (subscription) → Real-time updates → Auto-render

## Common Issues & Solutions

### Issue: "NEXT_PUBLIC_CONVEX_URL not set"
**Solution:** Make sure `.env.local` has the Convex URL and you restarted `npm run dev`

### Issue: Mutations not working
**Solution:** Check that the Convex schema matches what you're sending. Look at `convex/mutations.ts` for the exact shape expected.

### Issue: Real-time updates not working
**Solution:** Make sure you're using the React hooks from `src/lib/convex.ts`, not calling fetch() directly.

## Next: Phase 2

Once Phase 1 is complete, move to Phase 2: Wire agents to use Mission Control API.

Agents will be able to:
- Claim tasks
- Post comments
- Update task status
- Create documents
- Handle @mentions
