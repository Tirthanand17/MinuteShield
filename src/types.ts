export type Severity = 'info' | 'warning' | 'error';

export interface Finding {
  code: string;
  severity: Severity;
  workflow: string;
  job?: string;
  message: string;
  recommendation: string;
  estimatedMonthlyUsd?: number;
}

export interface PolicyConfig {
  warnMonthlyDeltaUsd: number;
  failMonthlyDeltaUsd: number;
  requireTimeoutMinutes: boolean;
  requireConcurrencyCancel: boolean;
  maxMatrixJobs: number;
  maxScheduleRunsPerDay: number;
  warnOnMacos: boolean;
  warnOnWindows: boolean;
}

export interface EstimationConfig {
  defaultJobMinutes: number;
  defaultRunsPerDay: number;
  historyDays: number;
  historyRunLimit: number;
}

export interface MinuteShieldConfig {
  version: 1;
  estimation: EstimationConfig;
  policy: PolicyConfig;
  comment: boolean;
  customRunnerRates: Record<string, number>;
}

export interface WorkflowHistory {
  runsPerDay?: number;
  medianJobMinutes?: number;
  jobMedianMinutes?: Record<string, number>;
  samples: number;
}

export interface JobEstimate {
  id: string;
  displayName: string;
  runner: string;
  ratePerMinuteUsd: number | null;
  estimatedMinutes: number;
  matrixCopies: number;
  costPerRunUsd: number;
  priced: boolean;
}

export interface WorkflowEstimate {
  path: string;
  runsPerDay: number;
  scheduleRunsPerDay: number;
  triggerLoad: number;
  costPerRunUsd: number;
  monthlyUsd: number;
  jobs: JobEstimate[];
  unpricedJobs: number;
}

export interface WorkflowPair {
  path: string;
  baseText: string | null;
  headText: string | null;
}

export interface AnalyzedWorkflow {
  path: string;
  before: WorkflowEstimate | null;
  after: WorkflowEstimate | null;
  deltaMonthlyUsd: number;
}

export interface AnalysisResult {
  workflows: AnalyzedWorkflow[];
  findings: Finding[];
  beforeMonthlyUsd: number;
  afterMonthlyUsd: number;
  monthlyDeltaUsd: number;
  policyBreached: boolean;
  policyWarnings: string[];
}
