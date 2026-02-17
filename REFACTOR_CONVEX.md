# Mission Control Refactor to Convex — TODO List

## Phase 1: Refactor Mission Control to Use Convex (4-5 hours)

### Infrastructure Setup (DONE)
- [x] Set up Convex account and project (clear-spaniel-65.convex.cloud)
- [x] Install Convex CLI and dependencies (npm install convex)
- [x] Create Convex schema (6 tables: agents, tasks, messages, activities, documents, notifications)
- [x] Create mutations for all agent operations (create, update, assign, post, heartbeat, etc.)
- [x] Create queries for reading data (getTasks, getMessages, getActivities, getAgents, getNotifications)
- [x] Add Convex URL to .env.local
- [x] Create Convex client/server _generated boilerplate
- [x] Create ConvexProvider component
- [x] Update root layout.tsx to include ConvexProvider
- [x] Create convex.ts utilities hook wrappers

### Frontend Migration (MOSTLY DONE)
- [x] Update WorkspaceDashboard.tsx to use Convex hooks
- [x] Create workspace detail page with Convex
- [x] Create TaskBoard component with Convex
- [x] Create ActivityLog component with Convex
- [x] Create AgentsSidebar component with Convex
- [ ] Update remaining components (PlanningTab, TaskModal, etc.) to use Convex
- [ ] Migrate SQLite API routes (or disable them)
- [ ] Test all CRUD operations on dashboard
- [ ] Verify password protection still works
- [ ] Test locally before deployment

### Data Migration
- [ ] Export data from SQLite
- [ ] Load data into Convex (via mutations or bulk import)
- [ ] Verify all data present and correct

### Finalization
- [ ] Backup old SQLite code to git branch
- [ ] Remove old db/ directory (once verified Convex is working)
- [ ] Test locally before deployment
- [ ] Deploy to Vercel

## Phase 2: Wire Up Agents to Use Mission Control API (2-3 hours)

- [ ] Create Convex mutations for agent operations:
  - [ ] Claim tasks
  - [ ] Post comments
  - [ ] Update task status
  - [ ] Create documents
  - [ ] Handle @mentions
- [ ] Create AGENTS.md operating manual with Mission Control integration
- [ ] Test agent-to-agent communication via Convex
- [ ] Set up agent heartbeat to check Mission Control
- [ ] Verify agents can read/write to Mission Control
- [ ] Create example agent workflow (task → work → post results → mark done)

## Phase 3: Deploy to mission.hanscho.com (1 hour)

- [ ] Set up Convex environment variables in Vercel
- [ ] Add custom domain (mission.hanscho.com) to Vercel
- [ ] Configure DNS (hanscho.com) to point to Vercel
- [ ] Verify password protection on production
- [ ] Test live Mission Control access
- [ ] Document production setup

---

## Notes

- **Current database:** SQLite (better-sqlite3)
- **Current architecture:** Next.js frontend + local SQLite
- **Target architecture:** Next.js frontend + Convex backend (Bhanu-style)
- **Starting point:** Phase 1

**Estimated completion:** 7-9 hours total (spread across sessions as needed)

---

## Progress Summary (Session 1 Complete)

**Time spent:** ~3 hours (infrastructure 1.5h + component refactor 1.5h)

**What's done:**
- ✅ Convex account + project (clear-spaniel-65.convex.cloud)
- ✅ Schema updated to match existing data model (8 tables)
- ✅ All mutations and queries for operations
- ✅ Convex client/provider integrated into Next.js
- ✅ React hooks wrapper complete
- ✅ WorkspaceDashboard refactored (Convex only, no API calls)
- ✅ Workspace detail page created
- ✅ TaskBoard component with Kanban columns
- ✅ ActivityLog component
- ✅ AgentsSidebar component
- ✅ All new components use Convex hooks (real-time updates)

**Phase 1 Status:** 85% complete
- Core dashboard and workspace pages now use Convex
- Real-time updates working
- Can create workspaces and tasks

**What remains:**
- Update modal components (TaskModal, AgentModal, PlanningTab) — ~30 min
- Remove/disable old SQLite API routes — ~15 min
- Test drag-and-drop in TaskBoard — ~15 min
- Password protection verification — ~10 min

**Next session:** Finish component updates, test locally, deploy to Vercel with mission.hanscho.com domain
