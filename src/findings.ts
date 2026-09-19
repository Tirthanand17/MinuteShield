import type { Finding, MinuteShieldConfig, WorkflowEstimate } from './types.js';
import { hasEvent, matrixCopies, parseWorkflow, scheduleRunsPerDay } from './workflow.js';

function boolCancelInProgress(concurrency: unknown): boolean {
  if (!concurrency) return false;
  if (typeof concurrency === 'object' && !Array.isArray(concurrency)) {
    return (concurrency as Record<string, unknown>)['cancel-in-progress'] === true;
  }
  return false;
}

export function inspectWorkflow(
  path: string,
  text: string,
  estimate: WorkflowEstimate,
  config: MinuteShieldConfig
): Finding[] {
  const findings: Finding[] = [];
  let doc: Record<string, any>;
  try {
    doc = parseWorkflow(text);
  } catch (error) {
    return [{
      code: 'yaml-invalid', severity: 'error', workflow: path,
      message: `Workflow could not be parsed: ${error instanceof Error ? error.message : String(error)}`,
      recommendation: 'Fix the workflow YAML before merging.'
    }];
  }

  const jobs = doc.jobs && typeof doc.jobs === 'object' ? doc.jobs as Record<string, Record<string, any>> : {};
  for (const [id, job] of Object.entries(jobs)) {
    const estimateJob = estimate.jobs.find((j) => j.id === id);
    const runner = estimateJob?.runner ?? '[unknown-runner]';
    if (estimateJob && !estimateJob.priced) {
      findings.push({
        code: 'runner-unpriced', severity: 'warning', workflow: path, job: id,
        message: `Runner ${runner} has no known price, so its cost is excluded from the estimate.`,
        recommendation: `Add a customRunnerRates entry for "${runner}" in .minuteshield.yml.`
      });
    }
    if (config.policy.requireTimeoutMinutes && job['timeout-minutes'] == null) {
      findings.push({
        code: 'missing-timeout', severity: 'warning', workflow: path, job: id,
        message: 'Job has no timeout-minutes limit; hung jobs can consume runner minutes until the platform limit.',
        recommendation: 'Set timeout-minutes to a realistic upper bound for this job.'
      });
    }
    if (config.policy.warnOnMacos && runner.startsWith('macos-')) {
      const finding: Finding = {
        code: 'macos-runner', severity: 'warning', workflow: path, job: id,
        message: `Job uses ${runner}; standard macOS runners cost materially more per minute than standard Linux runners.`,
        recommendation: 'Keep macOS only when the job genuinely requires Apple tooling or macOS behavior.'
      };
      if (estimateJob) finding.estimatedMonthlyUsd = estimateJob.costPerRunUsd * estimate.runsPerDay * 30;
      findings.push(finding);
    }
    if (config.policy.warnOnWindows && runner.startsWith('windows-')) {
      const finding: Finding = {
        code: 'windows-runner', severity: 'info', workflow: path, job: id,
        message: `Job uses ${runner}, which costs more per minute than standard Linux.`,
        recommendation: 'Use Linux for platform-neutral tasks when practical.'
      };
      if (estimateJob) finding.estimatedMonthlyUsd = estimateJob.costPerRunUsd * estimate.runsPerDay * 30;
      findings.push(finding);
    }
    const matrix = matrixCopies(job);
    if (matrix.copies > config.policy.maxMatrixJobs) {
      findings.push({
        code: 'matrix-large', severity: 'warning', workflow: path, job: id,
        message: `Static matrix expands this job to ${matrix.copies} copies per workflow run.`,
        recommendation: `Reduce redundant matrix combinations or raise maxMatrixJobs intentionally if ${matrix.copies} is required.`
      });
    }
    if (matrix.dynamic) {
      findings.push({
        code: 'matrix-dynamic', severity: 'info', workflow: path, job: id,
        message: 'Matrix contains dynamic expressions, so MinuteShield cannot fully expand it before runtime.',
        recommendation: 'Treat the dollar estimate as a lower-confidence estimate for this job.'
      });
    }
  }

  if (config.policy.requireConcurrencyCancel && !boolCancelInProgress(doc.concurrency) && hasEvent(doc, 'pull_request')) {
    findings.push({
      code: 'missing-cancel-in-progress', severity: 'warning', workflow: path,
      message: 'PR workflow does not enable concurrency.cancel-in-progress; obsolete runs may continue after a new push.',
      recommendation: 'Add a PR-scoped concurrency group with cancel-in-progress: true.'
    });
  }

  const scheduleDaily = scheduleRunsPerDay(doc);
  if (scheduleDaily > config.policy.maxScheduleRunsPerDay) {
    findings.push({
      code: 'schedule-high-frequency', severity: 'warning', workflow: path,
      message: `Schedules can trigger about ${scheduleDaily.toFixed(1)} runs/day, above the configured ${config.policy.maxScheduleRunsPerDay}.`,
      recommendation: 'Reduce cron frequency unless this cadence has a clear operational requirement.'
    });
  }

  if (hasEvent(doc, 'push') && hasEvent(doc, 'pull_request')) {
    findings.push({
      code: 'push-pr-double-trigger', severity: 'info', workflow: path,
      message: 'Workflow listens to both push and pull_request; branches with open PRs can run similar CI twice.',
      recommendation: 'Use branch/path filters or split responsibilities if duplicate validation is unnecessary.'
    });
  }
  return findings;
}
