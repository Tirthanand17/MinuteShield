import { parse } from 'yaml';
import type { MinuteShieldConfig } from './types.js';

export const DEFAULT_CONFIG: MinuteShieldConfig = {
  version: 1,
  estimation: {
    defaultJobMinutes: 8,
    defaultRunsPerDay: 5,
    historyDays: 30,
    historyRunLimit: 100
  },
  policy: {
    warnMonthlyDeltaUsd: 10,
    failMonthlyDeltaUsd: 50,
    requireTimeoutMinutes: true,
    requireConcurrencyCancel: true,
    maxMatrixJobs: 24,
    maxScheduleRunsPerDay: 24,
    warnOnMacos: true,
    warnOnWindows: false
  },
  comment: true,
  customRunnerRates: {}
};

function positive(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function loadConfig(text?: string | null): MinuteShieldConfig {
  if (!text?.trim()) return structuredClone(DEFAULT_CONFIG);
  const raw = parse(text) as Record<string, any> | null;
  if (!raw || typeof raw !== 'object') return structuredClone(DEFAULT_CONFIG);
  const e = raw.estimation ?? {};
  const p = raw.policy ?? {};
  const rates: Record<string, number> = {};
  if (raw.customRunnerRates && typeof raw.customRunnerRates === 'object') {
    for (const [k, v] of Object.entries(raw.customRunnerRates)) {
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) rates[k] = v;
    }
  }
  return {
    version: 1,
    estimation: {
      defaultJobMinutes: positive(e.defaultJobMinutes, DEFAULT_CONFIG.estimation.defaultJobMinutes),
      defaultRunsPerDay: positive(e.defaultRunsPerDay, DEFAULT_CONFIG.estimation.defaultRunsPerDay),
      historyDays: Math.max(1, positive(e.historyDays, DEFAULT_CONFIG.estimation.historyDays)),
      historyRunLimit: Math.max(1, Math.min(500, positive(e.historyRunLimit, DEFAULT_CONFIG.estimation.historyRunLimit)))
    },
    policy: {
      warnMonthlyDeltaUsd: positive(p.warnMonthlyDeltaUsd, DEFAULT_CONFIG.policy.warnMonthlyDeltaUsd),
      failMonthlyDeltaUsd: positive(p.failMonthlyDeltaUsd, DEFAULT_CONFIG.policy.failMonthlyDeltaUsd),
      requireTimeoutMinutes: typeof p.requireTimeoutMinutes === 'boolean' ? p.requireTimeoutMinutes : DEFAULT_CONFIG.policy.requireTimeoutMinutes,
      requireConcurrencyCancel: typeof p.requireConcurrencyCancel === 'boolean' ? p.requireConcurrencyCancel : DEFAULT_CONFIG.policy.requireConcurrencyCancel,
      maxMatrixJobs: Math.max(1, positive(p.maxMatrixJobs, DEFAULT_CONFIG.policy.maxMatrixJobs)),
      maxScheduleRunsPerDay: Math.max(0, positive(p.maxScheduleRunsPerDay, DEFAULT_CONFIG.policy.maxScheduleRunsPerDay)),
      warnOnMacos: typeof p.warnOnMacos === 'boolean' ? p.warnOnMacos : DEFAULT_CONFIG.policy.warnOnMacos,
      warnOnWindows: typeof p.warnOnWindows === 'boolean' ? p.warnOnWindows : DEFAULT_CONFIG.policy.warnOnWindows
    },
    comment: typeof raw.comment === 'boolean' ? raw.comment : DEFAULT_CONFIG.comment,
    customRunnerRates: rates
  };
}
