import { parse } from 'yaml';
import { roundedBillableMinutes, runnerPrice } from './pricing.js';
import type { MinuteShieldConfig, WorkflowEstimate, WorkflowHistory } from './types.js';

export type WorkflowDoc = Record<string, any>;

export function parseWorkflow(text: string): WorkflowDoc {
  const doc = parse(text) as WorkflowDoc | null;
  if (!doc || typeof doc !== 'object') throw new Error('Workflow YAML must contain an object');
  return doc;
}

export function matrixCopies(job: Record<string, any>): { copies: number; dynamic: boolean } {
  const matrix = job.strategy?.matrix;
  if (!matrix || typeof matrix !== 'object' || Array.isArray(matrix)) return { copies: 1, dynamic: false };
  let copies = 1;
  let dynamic = false;
  let dimensions = 0;
  for (const [key, value] of Object.entries(matrix)) {
    if (key === 'include' || key === 'exclude') continue;
    dimensions += 1;
    if (Array.isArray(value)) copies *= Math.max(1, value.length);
    else {
      dynamic = true;
      copies *= 1;
    }
  }
  if (dimensions === 0) copies = 1;
  const includeCount = Array.isArray(matrix.include) ? matrix.include.length : 0;
  const excludeCount = Array.isArray(matrix.exclude) ? matrix.exclude.length : 0;
  copies = Math.max(1, copies - excludeCount + includeCount);
  return { copies: Math.min(256, copies), dynamic };
}

function listEvents(on: unknown): string[] {
  if (typeof on === 'string') return [on];
  if (Array.isArray(on)) return on.filter((v): v is string => typeof v === 'string');
  if (on && typeof on === 'object') return Object.keys(on as Record<string, unknown>);
  return [];
}

function scheduleEntries(doc: WorkflowDoc): Array<Record<string, any>> {
  const on = doc.on;
  if (!on || typeof on !== 'object' || Array.isArray(on)) return [];
  const schedule = (on as Record<string, any>).schedule;
  return Array.isArray(schedule) ? schedule.filter((x) => x && typeof x === 'object') : [];
}

function fieldFrequency(field: string, max: number): number | null {
  const value = field.trim();
  if (value === '*') return max;
  const every = value.match(/^\*\/(\d+)$/);
  if (every) {
    const n = Number(every[1]);
    return n > 0 ? max / n : null;
  }
  if (/^\d+(,\d+)+$/.test(value)) return value.split(',').length;
  if (/^\d+$/.test(value)) return 1;
  return null;
}

export function cronRunsPerDay(cron: string): number {
  const fields = cron.trim().split(/\s+/);
  if (fields.length !== 5) return 1;
  const [minute, hour, dayOfMonth, month, dayOfWeek] = fields as [string, string, string, string, string];
  if (dayOfMonth !== '*' || month !== '*' || dayOfWeek !== '*') return 1;
  const minuteFreq = fieldFrequency(minute, 60);
  const hourFreq = fieldFrequency(hour, 24);
  if (minuteFreq == null || hourFreq == null) return 1;
  if (hour === '*' || hour.startsWith('*/')) return Math.max(1, minuteFreq * hourFreq);
  return Math.max(1, hourFreq);
}

export function scheduleRunsPerDay(doc: WorkflowDoc): number {
  return scheduleEntries(doc).reduce((sum, entry) => {
    const cron = typeof entry.cron === 'string' ? entry.cron : '';
    return sum + (cron ? cronRunsPerDay(cron) : 1);
  }, 0);
}

export function triggerLoad(doc: WorkflowDoc): number {
  const events = listEvents(doc.on);
  let load = 0;
  for (const event of events) {
    if (event === 'schedule') continue;
    if (event === 'workflow_dispatch' || event === 'repository_dispatch') load += 0.25;
    else if (event === 'workflow_call') load += 0.5;
    else load += 1;
  }
  return Math.max(0.25, load + scheduleRunsPerDay(doc));
}

export function hasEvent(doc: WorkflowDoc, event: string): boolean {
  return listEvents(doc.on).includes(event);
}

export function estimateWorkflow(
  path: string,
  doc: WorkflowDoc,
  config: MinuteShieldConfig,
  history: WorkflowHistory | undefined,
  runsPerDayOverride?: number
): WorkflowEstimate {
  const jobsObject = doc.jobs && typeof doc.jobs === 'object' ? doc.jobs as Record<string, Record<string, any>> : {};
  const jobs = Object.entries(jobsObject).map(([id, job]) => {
    const displayName = typeof job.name === 'string' && !job.name.includes('${{') ? job.name : id;
    const price = runnerPrice(job['runs-on'], config.customRunnerRates);
    const matrix = matrixCopies(job);
    const historyMinutes = history?.jobMedianMinutes?.[displayName] ?? history?.jobMedianMinutes?.[id] ?? history?.medianJobMinutes;
    const estimatedMinutes = Math.max(0.1, historyMinutes ?? config.estimation.defaultJobMinutes);
    const billedMinutes = roundedBillableMinutes(estimatedMinutes);
    const costPerRunUsd = price.usdPerMinute == null ? 0 : billedMinutes * price.usdPerMinute * matrix.copies;
    return {
      id,
      displayName,
      runner: price.label,
      ratePerMinuteUsd: price.usdPerMinute,
      estimatedMinutes,
      matrixCopies: matrix.copies,
      costPerRunUsd,
      priced: price.usdPerMinute != null
    };
  });
  const costPerRunUsd = jobs.reduce((sum, job) => sum + job.costPerRunUsd, 0);
  const runsPerDay = Math.max(0, runsPerDayOverride ?? history?.runsPerDay ?? config.estimation.defaultRunsPerDay);
  return {
    path,
    runsPerDay,
    scheduleRunsPerDay: scheduleRunsPerDay(doc),
    triggerLoad: triggerLoad(doc),
    costPerRunUsd,
    monthlyUsd: costPerRunUsd * runsPerDay * 30,
    jobs,
    unpricedJobs: jobs.filter((j) => !j.priced).length
  };
}
