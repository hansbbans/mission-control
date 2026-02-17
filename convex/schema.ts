import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Workspaces/Businesses
  workspaces: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    created_at: v.number(),
  }),

  // Agents in the squad
  agents: defineTable({
    workspace_id: v.id("workspaces"),
    name: v.string(),
    role: v.string(),
    description: v.optional(v.string()),
    avatar_emoji: v.string(),
    status: v.union(
      v.literal("standby"),
      v.literal("working"),
      v.literal("offline")
    ),
    is_master: v.boolean(),
    soul_md: v.optional(v.string()),
    user_md: v.optional(v.string()),
    agents_md: v.optional(v.string()),
    session_key: v.string(),
    last_heartbeat: v.optional(v.number()),
    created_at: v.number(),
    updated_at: v.number(),
  }),

  // Tasks to be done
  tasks: defineTable({
    workspace_id: v.id("workspaces"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("planning"),
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("testing"),
      v.literal("review"),
      v.literal("done")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    assigned_agent_id: v.optional(v.id("agents")),
    created_by_agent_id: v.optional(v.id("agents")),
    due_date: v.optional(v.string()),
    created_at: v.number(),
    updated_at: v.number(),
  }),

  // Comments/Messages on tasks
  messages: defineTable({
    conversation_id: v.id("conversations"),
    sender_agent_id: v.optional(v.id("agents")),
    content: v.string(),
    message_type: v.union(
      v.literal("text"),
      v.literal("system"),
      v.literal("task_update"),
      v.literal("file")
    ),
    metadata: v.optional(v.string()),
    created_at: v.number(),
  }),

  // Conversations (task threads, direct, group)
  conversations: defineTable({
    workspace_id: v.id("workspaces"),
    title: v.optional(v.string()),
    type: v.union(
      v.literal("direct"),
      v.literal("group"),
      v.literal("task")
    ),
    task_id: v.optional(v.id("tasks")),
    created_at: v.number(),
    updated_at: v.number(),
  }),

  // Activity feed (what happened)
  activities: defineTable({
    workspace_id: v.id("workspaces"),
    type: v.union(
      v.literal("task_created"),
      v.literal("task_assigned"),
      v.literal("task_status_changed"),
      v.literal("task_completed"),
      v.literal("message_sent"),
      v.literal("agent_status_changed"),
      v.literal("agent_joined"),
      v.literal("system")
    ),
    agent_id: v.optional(v.id("agents")),
    task_id: v.optional(v.id("tasks")),
    message: v.string(),
    metadata: v.optional(v.string()),
    created_at: v.number(),
  }),

  // Notifications for @mentions
  notifications: defineTable({
    workspace_id: v.id("workspaces"),
    agent_id: v.id("agents"),
    content: v.string(),
    task_id: v.optional(v.id("tasks")),
    delivered: v.boolean(),
    created_at: v.number(),
  }),
});
