import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Agents in the squad
  agents: defineTable({
    name: v.string(),           // "Tej", "Roman", etc.
    role: v.string(),           // "Coder", "QA", etc.
    status: v.union(
      v.literal("idle"),
      v.literal("active"),
      v.literal("blocked")
    ),
    currentTaskId: v.optional(v.id("tasks")),
    sessionKey: v.string(),     // "agent:tej:main"
    lastHeartbeat: v.optional(v.number()), // timestamp
  }),

  // Tasks to be done
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
    assigneeIds: v.array(v.id("agents")),
    createdAt: v.number(),
    updatedAt: v.number(),
    dueDate: v.optional(v.number()),
  }),

  // Comments on tasks
  messages: defineTable({
    taskId: v.id("tasks"),
    fromAgentId: v.id("agents"),
    content: v.string(),
    attachments: v.array(v.id("documents")),
    createdAt: v.number(),
  }),

  // Activity feed (what happened)
  activities: defineTable({
    type: v.union(
      v.literal("task_created"),
      v.literal("task_assigned"),
      v.literal("task_status_changed"),
      v.literal("message_sent"),
      v.literal("document_created"),
      v.literal("agent_heartbeat")
    ),
    agentId: v.optional(v.id("agents")),
    taskId: v.optional(v.id("tasks")),
    message: v.string(),
    createdAt: v.number(),
  }),

  // Deliverables and research documents
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("deliverable"),
      v.literal("research"),
      v.literal("protocol"),
      v.literal("notes")
    ),
    taskId: v.optional(v.id("tasks")),
    createdBy: v.id("agents"),
    createdAt: v.number(),
  }),

  // Notifications for @mentions
  notifications: defineTable({
    mentionedAgentId: v.id("agents"),
    content: v.string(),
    taskId: v.optional(v.id("tasks")),
    delivered: v.boolean(),
    createdAt: v.number(),
  }),
});
