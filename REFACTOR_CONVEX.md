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

### Frontend Migration (TODO)
- [ ] Replace API layer (/api/workspaces) with Convex queries
- [ ] Update WorkspaceDashboard.tsx to use Convex hooks instead of fetch()
- [ ] Update all components that read/write data to use Convex
- [ ] Migrate SQLite API routes to Convex mutations
- [ ] Test all CRUD operations on dashboard
- [ ] Verify password protection still works in production
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

## Progress Summary (End of Session 1)

**Time spent:** ~2 hours  
**What's done:**
- ✅ Convex account + project set up (clear-spaniel-65.convex.cloud)
- ✅ Full schema with 6 tables (agents, tasks, messages, activities, documents, notifications)
- ✅ All mutations and queries for agent operations
- ✅ Convex client/provider integrated into Next.js
- ✅ React hooks wrapper (src/lib/convex.ts)
- ✅ Migration guide created for developers

**What's next (Phase 1 continuation):**
- Update WorkspaceDashboard and other components to use Convex hooks
- Replace API routes with Convex mutations
- Test locally
- Deploy to Vercel with custom domain

**See MIGRATION_GUIDE.md for detailed instructions on component updates**
