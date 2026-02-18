/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "convex/react";

// Safely import api - it's a mock during build but works at runtime
let api: any;
try {
  api = require("../../convex/_generated/api").api;
} catch (e) {
  api = { mutations: {} } as any;
}

const mutations = api?.mutations || {};

/**
 * Convex hooks wrapper
 * These replace the old SQLite calls throughout the app
 */

// ==================== WORKSPACES ====================

export const useWorkspaces = () => {
  return useQuery(mutations.getWorkspaces);
};

export const useWorkspace = (workspaceId: string) => {
  return useQuery(mutations.getWorkspace, workspaceId ? { workspaceId: workspaceId as any } : "skip");
};

export const useCreateWorkspace = () => {
  return useMutation(mutations.createWorkspace);
};

// ==================== AGENTS ====================

export const useWorkspaceAgents = (workspaceId: string) => {
  return useQuery(mutations.getWorkspaceAgents, workspaceId ? { workspaceId: workspaceId as any } : "skip");
};

export const useCreateAgent = () => {
  return useMutation(mutations.createAgent);
};

export const useUpdateAgentStatus = () => {
  return useMutation(mutations.updateAgentStatus);
};

export const useAgentHeartbeat = () => {
  return useMutation(mutations.agentHeartbeat);
};

// ==================== TASKS ====================

export const useWorkspaceTasks = (workspaceId: string) => {
  return useQuery(mutations.getWorkspaceTasks, workspaceId ? { workspaceId: workspaceId as any } : "skip");
};

export const useTask = (taskId: string) => {
  return useQuery(mutations.getTask, taskId ? { taskId: taskId as any } : "skip");
};

export const useCreateTask = () => {
  return useMutation(mutations.createTask);
};

export const useUpdateTaskStatus = () => {
  return useMutation(mutations.updateTaskStatus);
};

export const useAssignTask = () => {
  return useMutation(mutations.assignTask);
};

// ==================== MESSAGES ====================

export const useConversationMessages = (conversationId: string) => {
  return useQuery(mutations.getConversationMessages, conversationId ? { conversationId: conversationId as any } : "skip");
};

export const useTaskConversation = (taskId: string) => {
  return useQuery(mutations.getTaskConversation, taskId ? { taskId: taskId as any } : "skip");
};

export const usePostMessage = () => {
  return useMutation(mutations.postMessage);
};

// ==================== ACTIVITIES ====================

export const useWorkspaceActivities = (workspaceId: string) => {
  return useQuery(mutations.getWorkspaceActivities, workspaceId ? { workspaceId: workspaceId as any } : "skip");
};

// ==================== NOTIFICATIONS ====================

export const useAgentNotifications = (agentId: string) => {
  return useQuery(mutations.getAgentNotifications, agentId ? { agentId: agentId as any } : "skip");
};

export const useMarkNotificationDelivered = () => {
  return useMutation(mutations.markNotificationDelivered);
};
