import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Convex hooks wrapper
 * These replace the old SQLite calls throughout the app
 */

// Tasks
export const useTasks = () => {
  return useQuery(api.mutations.getTasks);
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

// Messages
export const useTaskMessages = (taskId: string) => {
  return useQuery(api.mutations.getTaskMessages, taskId ? { taskId: taskId as any } : "skip");
};

export const usePostMessage = () => {
  return useMutation(api.mutations.postMessage);
};

// Documents
export const useCreateDocument = () => {
  return useMutation(api.mutations.createDocument);
};

// Activity
export const useActivities = () => {
  return useQuery(api.mutations.getActivities);
};

// Agents
export const useAgents = () => {
  return useQuery(api.mutations.getAgents);
};

export const useAgentHeartbeat = () => {
  return useMutation(api.mutations.agentHeartbeat);
};

// Notifications
export const useAgentNotifications = (agentId: string) => {
  return useQuery(api.mutations.getAgentNotifications, agentId ? { agentId: agentId as any } : "skip");
};

export const useMarkNotificationDelivered = () => {
  return useMutation(api.mutations.markNotificationDelivered);
};
