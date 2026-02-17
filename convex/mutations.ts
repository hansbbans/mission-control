import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ==================== WORKSPACES ====================

export const createWorkspace = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      description: args.description,
      created_at: Date.now(),
    });
    return workspaceId;
  },
});

export const getWorkspaces = query({
  async handler(ctx) {
    return await ctx.db.query("workspaces").collect();
  },
});

export const getWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  async handler(ctx, args) {
    return await ctx.db.get(args.workspaceId);
  },
});

// ==================== AGENTS ====================

export const createAgent = mutation({
  args: {
    workspace_id: v.id("workspaces"),
    name: v.string(),
    role: v.string(),
    description: v.optional(v.string()),
    avatar_emoji: v.string(),
    is_master: v.boolean(),
    session_key: v.string(),
  },
  async handler(ctx, args) {
    const agentId = await ctx.db.insert("agents", {
      workspace_id: args.workspace_id,
      name: args.name,
      role: args.role,
      description: args.description,
      avatar_emoji: args.avatar_emoji,
      status: "standby",
      is_master: args.is_master,
      session_key: args.session_key,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    return agentId;
  },
});

export const getWorkspaceAgents = query({
  args: { workspaceId: v.id("workspaces") },
  async handler(ctx, args) {
    return await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("workspace_id"), args.workspaceId))
      .collect();
  },
});

export const updateAgentStatus = mutation({
  args: {
    agentId: v.id("agents"),
    status: v.union(v.literal("standby"), v.literal("working"), v.literal("offline")),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.agentId, {
      status: args.status,
      updated_at: Date.now(),
    });
  },
});

export const agentHeartbeat = mutation({
  args: {
    agentId: v.id("agents"),
  },
  async handler(ctx, args) {
    const agent = await ctx.db.get(args.agentId);
    if (!agent) return;

    await ctx.db.patch(args.agentId, {
      last_heartbeat: Date.now(),
      status: "working",
    });

    // Log activity
    await ctx.db.insert("activities", {
      workspace_id: agent.workspace_id,
      type: "agent_status_changed",
      agent_id: args.agentId,
      message: `${agent.name} checked in`,
      created_at: Date.now(),
    });
  },
});

// ==================== TASKS ====================

export const createTask = mutation({
  args: {
    workspace_id: v.id("workspaces"),
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    )),
    assigned_agent_id: v.optional(v.id("agents")),
  },
  async handler(ctx, args) {
    const taskId = await ctx.db.insert("tasks", {
      workspace_id: args.workspace_id,
      title: args.title,
      description: args.description,
      status: "planning",
      priority: args.priority || "normal",
      assigned_agent_id: args.assigned_agent_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    // Create conversation for task
    await ctx.db.insert("conversations", {
      workspace_id: args.workspace_id,
      type: "task",
      task_id: taskId,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activities", {
      workspace_id: args.workspace_id,
      type: "task_created",
      task_id: taskId,
      message: `Task created: ${args.title}`,
      created_at: Date.now(),
    });

    return taskId;
  },
});

export const getWorkspaceTasks = query({
  args: { workspaceId: v.id("workspaces") },
  async handler(ctx, args) {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("workspace_id"), args.workspaceId))
      .collect();
  },
});

export const getTask = query({
  args: { taskId: v.id("tasks") },
  async handler(ctx, args) {
    return await ctx.db.get(args.taskId);
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("planning"),
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("testing"),
      v.literal("review"),
      v.literal("done")
    ),
  },
  async handler(ctx, args) {
    const task = await ctx.db.get(args.taskId);
    if (!task) return;

    await ctx.db.patch(args.taskId, {
      status: args.status,
      updated_at: Date.now(),
    });

    await ctx.db.insert("activities", {
      workspace_id: task.workspace_id,
      type: "task_status_changed",
      task_id: args.taskId,
      message: `Task status changed to: ${args.status}`,
      created_at: Date.now(),
    });
  },
});

export const assignTask = mutation({
  args: {
    taskId: v.id("tasks"),
    agentId: v.id("agents"),
  },
  async handler(ctx, args) {
    const task = await ctx.db.get(args.taskId);
    if (!task) return;

    await ctx.db.patch(args.taskId, {
      assigned_agent_id: args.agentId,
      status: "assigned",
      updated_at: Date.now(),
    });

    await ctx.db.insert("activities", {
      workspace_id: task.workspace_id,
      type: "task_assigned",
      task_id: args.taskId,
      agent_id: args.agentId,
      message: `Task assigned to agent`,
      created_at: Date.now(),
    });

    // Notify agent
    await ctx.db.insert("notifications", {
      workspace_id: task.workspace_id,
      agent_id: args.agentId,
      content: `You've been assigned a task: ${task.title}`,
      task_id: args.taskId,
      delivered: false,
      created_at: Date.now(),
    });
  },
});

// ==================== MESSAGES ====================

export const postMessage = mutation({
  args: {
    conversation_id: v.id("conversations"),
    sender_agent_id: v.optional(v.id("agents")),
    content: v.string(),
  },
  async handler(ctx, args) {
    const conversation = await ctx.db.get(args.conversation_id);
    if (!conversation) return;

    const messageId = await ctx.db.insert("messages", {
      conversation_id: args.conversation_id,
      sender_agent_id: args.sender_agent_id,
      content: args.content,
      message_type: "text",
      created_at: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activities", {
      workspace_id: conversation.workspace_id,
      type: "message_sent",
      agent_id: args.sender_agent_id,
      task_id: conversation.task_id,
      message: `Message posted`,
      created_at: Date.now(),
    });

    return messageId;
  },
});

export const getConversationMessages = query({
  args: { conversationId: v.id("conversations") },
  async handler(ctx, args) {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversation_id"), args.conversationId))
      .order("asc")
      .collect();
  },
});

export const getTaskConversation = query({
  args: { taskId: v.id("tasks") },
  async handler(ctx, args) {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("task_id"), args.taskId))
      .collect();
    return conversations[0];
  },
});

// ==================== ACTIVITIES ====================

export const getWorkspaceActivities = query({
  args: { workspaceId: v.id("workspaces") },
  async handler(ctx, args) {
    return await ctx.db
      .query("activities")
      .filter((q) => q.eq(q.field("workspace_id"), args.workspaceId))
      .order("desc")
      .take(100);
  },
});

// ==================== NOTIFICATIONS ====================

export const getAgentNotifications = query({
  args: { agentId: v.id("agents") },
  async handler(ctx, args) {
    return await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("agent_id"), args.agentId))
      .filter((q) => q.eq(q.field("delivered"), false))
      .collect();
  },
});

export const markNotificationDelivered = mutation({
  args: { notificationId: v.id("notifications") },
  async handler(ctx, args) {
    await ctx.db.patch(args.notificationId, {
      delivered: true,
    });
  },
});
