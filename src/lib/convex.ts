import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Convex hooks wrapper
 * These replace the old SQLite calls throughout the app
 */

// ==================== WORKSPACES ====================

export const useWorkspaces = () => {
  return useQuery(api.mutations.getWorkspaces);
};

export const useWorkspace = (workspaceId: string) => {
  return useQuery(api.mutations.getWorkspace, workspaceId ? { workspaceId: workspaceId as any } : "skip");
};

export const useCreateWorkspace = () => {
  return useMutation(api.mutations.createWorkspace);
};

// ==================== AGENTS ====================

export const useWorkspaceAgents = (workspaceId: string) => {
  return useQuery(api.mutations.getWorkspaceAgents, workspaceId ? { workspaceId: workspaceId as any } : "skip");
};

export const useCreateAgent = () => {
  return useMutation(api.mutations.createAgent);
};

export const useUpdateAgentStatus = () => {
  return useMutation(api.mutations.updateAgentStatus);
};

export const useAgentHeartbeat = () => {
  return useMutation(api.mutations.agentHeartbeat);
};

// ==================== TASKS ====================

export const useWorkspaceTasks = (workspaceId: string) => {
  return useQuery(api.mutations.getWorkspaceTasks, workspaceId ? { workspaceId: workspaceId as any } : "skip");
};

export const useTask = (taskId: string) => {
  return useQuery(api.mutations.getTask, taskId ? { taskId: taskId as any } : "skip");
};

export const useCreateTask = () => {
  return useMutation(api.mutations.createTask);
};

export const useUpdateTaskStatus = () => {
  return useMutation(api.mutations.updateTaskStatus);
};

export const useAssignTask = () => {
  return useMutation(api.mutations.assignTask);
};

// ==================== MESSAGES ====================

export const useConversationMessages = (conversationId: string) => {
  return useQuery(api.mutations.getConversationMessages, conversationId ? { conversationId: conversationId as any } : "skip");
};

export const useTaskConversation = (taskId: string) => {
  return useQuery(api.mutations.getTaskConversation, taskId ? { taskId: taskId as any } : "skip");
};

export const usePostMessage = () => {
  return useMutation(api.mutations.postMessage);
};

// ==================== ACTIVITIES ====================

export const useWorkspaceActivities = (workspaceId: string) => {
  return useQuery(api.mutations.getWorkspaceActivities, workspaceId ? { workspaceId: workspaceId as any } : "skip");
};

// ==================== NOTIFICATIONS ====================

export const useAgentNotifications = (agentId: string) => {
  return useQuery(api.mutations.getAgentNotifications, agentId ? { agentId: agentId as any } : "skip");
};

export const useMarkNotificationDelivered = () => {
  return useMutation(api.mutations.markNotificationDelivered);
};
