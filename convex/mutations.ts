import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Tasks
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    assigneeIds: v.optional(v.array(v.id("agents"))),
    dueDate: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: "inbox",
      assigneeIds: args.assigneeIds || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      dueDate: args.dueDate,
    });

    // Log activity
    await ctx.db.insert("activities", {
      type: "task_created",
      taskId,
      message: `Task created: ${args.title}`,
      createdAt: Date.now(),
    });

    return taskId;
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.taskId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    // Log activity
    const task = await ctx.db.get(args.taskId);
    await ctx.db.insert("activities", {
      type: "task_status_changed",
      taskId: args.taskId,
      message: `Task status changed to: ${args.status}`,
      createdAt: Date.now(),
    });
  },
});

export const assignTask = mutation({
  args: {
    taskId: v.id("tasks"),
    agentIds: v.array(v.id("agents")),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.taskId, {
      assigneeIds: args.agentIds,
      status: "assigned",
      updatedAt: Date.now(),
    });

    // Notify agents
    for (const agentId of args.agentIds) {
      const agent = await ctx.db.get(agentId);
      await ctx.db.insert("notifications", {
        mentionedAgentId: agentId,
        content: `You've been assigned a task`,
        taskId: args.taskId,
        delivered: false,
        createdAt: Date.now(),
      });
    }
  },
});

// Messages/Comments
export const postMessage = mutation({
  args: {
    taskId: v.id("tasks"),
    fromAgentId: v.id("agents"),
    content: v.string(),
    attachments: v.optional(v.array(v.id("documents"))),
  },
  async handler(ctx, args) {
    const messageId = await ctx.db.insert("messages", {
      taskId: args.taskId,
      fromAgentId: args.fromAgentId,
      content: args.content,
      attachments: args.attachments || [],
      createdAt: Date.now(),
    });

    // Log activity
    const agent = await ctx.db.get(args.fromAgentId);
    await ctx.db.insert("activities", {
      type: "message_sent",
      agentId: args.fromAgentId,
      taskId: args.taskId,
      message: `Message posted on task`,
      createdAt: Date.now(),
    });

    // Handle @mentions
    const mentionRegex = /@(\w+)/g;
    const mentions = args.content.match(mentionRegex) || [];
    
    for (const mention of mentions) {
      const agentName = mention.slice(1); // Remove @
      const mentionedAgents = await ctx.db
        .query("agents")
        .filter((q) => q.eq(q.field("name"), agentName))
        .collect();

      for (const mentionedAgent of mentionedAgents) {
        await ctx.db.insert("notifications", {
          mentionedAgentId: mentionedAgent._id,
          content: `@${mentionedAgent.name}: ${args.content.substring(0, 100)}...`,
          taskId: args.taskId,
          delivered: false,
          createdAt: Date.now(),
        });
      }
    }

    return messageId;
  },
});

// Documents
export const createDocument = mutation({
  args: {
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
  },
  async handler(ctx, args) {
    const docId = await ctx.db.insert("documents", {
      title: args.title,
      content: args.content,
      type: args.type,
      taskId: args.taskId,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activities", {
      type: "document_created",
      agentId: args.createdBy,
      taskId: args.taskId,
      message: `Document created: ${args.title}`,
      createdAt: Date.now(),
    });

    return docId;
  },
});

// Agent heartbeat
export const agentHeartbeat = mutation({
  args: {
    agentId: v.id("agents"),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.agentId, {
      lastHeartbeat: Date.now(),
      status: "active",
    });

    // Log activity
    const agent = await ctx.db.get(args.agentId);
    await ctx.db.insert("activities", {
      type: "agent_heartbeat",
      agentId: args.agentId,
      message: `${agent.name} checked in`,
      createdAt: Date.now(),
    });
  },
});

// Queries for frontend and agents
export const getTasks = query({
  async handler(ctx) {
    return await ctx.db.query("tasks").collect();
  },
});

export const getTask = query({
  args: { taskId: v.id("tasks") },
  async handler(ctx, args) {
    return await ctx.db.get(args.taskId);
  },
});

export const getTaskMessages = query({
  args: { taskId: v.id("tasks") },
  async handler(ctx, args) {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("taskId"), args.taskId))
      .collect();
  },
});

export const getActivities = query({
  async handler(ctx) {
    return await ctx.db
      .query("activities")
      .order("desc")
      .take(100);
  },
});

export const getAgents = query({
  async handler(ctx) {
    return await ctx.db.query("agents").collect();
  },
});

export const getAgentNotifications = query({
  args: { agentId: v.id("agents") },
  async handler(ctx, args) {
    return await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("mentionedAgentId"), args.agentId))
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
