export type AppStatus = "running" | "stopped" | "failed" | "building" | "deploying";
export type DeploymentStatus = "success" | "failed" | "building" | "queued" | "cancelled";
export type LogLevel = "info" | "warn" | "error" | "debug";
export type DomainVerificationStatus = "verified" | "pending" | "failed";
export type SSLStatus = "active" | "pending" | "expired" | "none";

export interface App {
  id: string;
  name: string;
  framework: string;
  runtime: string;
  status: AppStatus;
  domain: string;
  customDomains: string[];
  lastDeployedAt: string;
  createdAt: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  uptime: string;
  gitRepo: string;
  branch: string;
  port: number;
  buildCommand: string;
  startCommand: string;
  rootDirectory: string;
  autoDeploy: boolean;
  healthCheckUrl: string;
  currentVersion: string;
  sslStatus: SSLStatus;
  envVarCount: number;
}

export interface Deployment {
  id: string;
  appId: string;
  appName: string;
  status: DeploymentStatus;
  commitHash: string;
  commitMessage: string;
  branch: string;
  triggerSource: "git_push" | "manual" | "webhook" | "rollback";
  startedAt: string;
  finishedAt: string | null;
  duration: number | null;
  version: string;
  author: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
}

export interface Domain {
  id: string;
  domain: string;
  appId: string;
  appName: string;
  isPrimary: boolean;
  sslStatus: SSLStatus;
  verificationStatus: DomainVerificationStatus;
  lastChecked: string;
  dnsRecords: { type: string; name: string; value: string }[];
}

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
  updatedAt: string;
}

export interface ServerMetric {
  timestamp: string;
  cpu: number;
  ram: number;
  disk: number;
  networkIn: number;
  networkOut: number;
}

export interface ServerInfo {
  hostname: string;
  os: string;
  kernel: string;
  uptime: string;
  cpuModel: string;
  cpuCores: number;
  totalRam: number;
  totalDisk: number;
  dockerVersion: string;
  runningContainers: number;
  temperature: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
  read: boolean;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  ram: number;
  status: "running" | "sleeping" | "stopped";
  uptime: string;
}
