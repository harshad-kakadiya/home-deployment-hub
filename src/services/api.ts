/**
 * Mock API Service Layer
 * 
 * Replace these functions with actual API calls to your Python backend.
 * Each function simulates a network request with a delay.
 * 
 * Backend integration points:
 * - Replace `simulateDelay()` with `fetch()` or `axios` calls
 * - Update base URL via environment variable: VITE_API_URL
 * - Add authentication headers in a request interceptor
 */

import type { App, Deployment, LogEntry, Domain, EnvironmentVariable, ServerMetric, ServerInfo, Notification, ProcessInfo } from "@/types";
import { mockApps, mockDeployments, mockLogs, mockDomains, mockEnvVars, generateMetricsHistory, mockServerInfo, mockNotifications, mockProcesses } from "@/data/mock-data";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Apps ────────────────────────────────────────────────────────────────────

export async function fetchApps(): Promise<App[]> {
  await simulateDelay(600);
  // TODO: Replace with `fetch(${API_BASE}/apps)`
  return mockApps;
}

export async function fetchApp(id: string): Promise<App | undefined> {
  await simulateDelay(400);
  // TODO: Replace with `fetch(${API_BASE}/apps/${id})`
  return mockApps.find(app => app.id === id);
}

export async function createApp(data: Partial<App>): Promise<App> {
  await simulateDelay(800);
  // TODO: Replace with POST to `${API_BASE}/apps`
  const newApp: App = {
    id: `app-${Date.now()}`,
    name: data.name || "new-app",
    framework: data.framework || "Docker",
    runtime: data.runtime || "Node 20",
    status: "building",
    domain: "",
    customDomains: [],
    lastDeployedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    cpuUsage: 0,
    ramUsage: 0,
    diskUsage: 0,
    uptime: "0m",
    gitRepo: data.gitRepo || "",
    branch: data.branch || "main",
    port: data.port || 3000,
    buildCommand: data.buildCommand || "",
    startCommand: data.startCommand || "",
    rootDirectory: data.rootDirectory || "/",
    autoDeploy: data.autoDeploy ?? true,
    healthCheckUrl: data.healthCheckUrl || "/health",
    currentVersion: "v0.1.0",
    sslStatus: "none",
    envVarCount: 0,
  };
  return newApp;
}

export async function updateApp(id: string, data: Partial<App>): Promise<App> {
  await simulateDelay(500);
  // TODO: Replace with PATCH to `${API_BASE}/apps/${id}`
  const app = mockApps.find(a => a.id === id);
  if (!app) throw new Error("App not found");
  return { ...app, ...data };
}

export async function deleteApp(id: string): Promise<void> {
  await simulateDelay(600);
  // TODO: Replace with DELETE to `${API_BASE}/apps/${id}`
}

export async function restartApp(id: string): Promise<void> {
  await simulateDelay(1000);
  // TODO: Replace with POST to `${API_BASE}/apps/${id}/restart`
}

export async function stopApp(id: string): Promise<void> {
  await simulateDelay(800);
  // TODO: Replace with POST to `${API_BASE}/apps/${id}/stop`
}

export async function redeployApp(id: string): Promise<Deployment> {
  await simulateDelay(1000);
  // TODO: Replace with POST to `${API_BASE}/apps/${id}/redeploy`
  return mockDeployments[0];
}

// ─── Deployments ─────────────────────────────────────────────────────────────

export async function fetchDeployments(appId?: string): Promise<Deployment[]> {
  await simulateDelay(500);
  // TODO: Replace with `fetch(${API_BASE}/deployments?app_id=${appId})`
  if (appId) return mockDeployments.filter(d => d.appId === appId);
  return mockDeployments;
}

export async function fetchDeployment(id: string): Promise<Deployment | undefined> {
  await simulateDelay(300);
  return mockDeployments.find(d => d.id === id);
}

// ─── Logs ────────────────────────────────────────────────────────────────────

export async function fetchLogs(appId: string): Promise<LogEntry[]> {
  await simulateDelay(400);
  // TODO: Replace with `fetch(${API_BASE}/apps/${appId}/logs)`
  return mockLogs;
}

// ─── Domains ─────────────────────────────────────────────────────────────────

export async function fetchDomains(appId?: string): Promise<Domain[]> {
  await simulateDelay(400);
  if (appId) return mockDomains.filter(d => d.appId === appId);
  return mockDomains;
}

export async function addDomain(data: Partial<Domain>): Promise<Domain> {
  await simulateDelay(600);
  // TODO: Replace with POST to `${API_BASE}/domains`
  return { ...mockDomains[0], ...data, id: `dom-${Date.now()}` };
}

export async function deleteDomain(id: string): Promise<void> {
  await simulateDelay(400);
  // TODO: Replace with DELETE to `${API_BASE}/domains/${id}`
}

// ─── Environment Variables ───────────────────────────────────────────────────

export async function fetchEnvVars(appId: string): Promise<EnvironmentVariable[]> {
  await simulateDelay(400);
  // TODO: Replace with `fetch(${API_BASE}/apps/${appId}/env)`
  return mockEnvVars;
}

export async function upsertEnvVar(appId: string, data: Partial<EnvironmentVariable>): Promise<EnvironmentVariable> {
  await simulateDelay(500);
  // TODO: Replace with PUT to `${API_BASE}/apps/${appId}/env`
  return { ...mockEnvVars[0], ...data, id: data.id || `env-${Date.now()}`, updatedAt: new Date().toISOString() };
}

export async function deleteEnvVar(appId: string, id: string): Promise<void> {
  await simulateDelay(400);
  // TODO: Replace with DELETE to `${API_BASE}/apps/${appId}/env/${id}`
}

// ─── Server / Metrics ────────────────────────────────────────────────────────

export async function fetchServerInfo(): Promise<ServerInfo> {
  await simulateDelay(300);
  // TODO: Replace with `fetch(${API_BASE}/server/info)`
  return mockServerInfo;
}

export async function fetchMetricsHistory(hours?: number): Promise<ServerMetric[]> {
  await simulateDelay(500);
  // TODO: Replace with `fetch(${API_BASE}/server/metrics?hours=${hours})`
  return generateMetricsHistory(hours);
}

export async function fetchProcesses(): Promise<ProcessInfo[]> {
  await simulateDelay(400);
  // TODO: Replace with `fetch(${API_BASE}/server/processes)`
  return mockProcesses;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function fetchNotifications(): Promise<Notification[]> {
  await simulateDelay(300);
  // TODO: Replace with `fetch(${API_BASE}/notifications)`
  return mockNotifications;
}

export async function markNotificationRead(id: string): Promise<void> {
  await simulateDelay(200);
  // TODO: Replace with PATCH to `${API_BASE}/notifications/${id}`
}
