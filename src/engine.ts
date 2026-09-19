import { inspectWorkflow } from './findings.js';
import type { AnalysisResult, MinuteShieldConfig, WorkflowHistory, WorkflowPair } from './types.js';
import { estimateWorkflow, parseWorkflow, scheduleRunsPerDay, triggerLoad } from './workflow.js';

export function analyzeWorkflows(
  pairs: WorkflowPair[],
  config: MinuteShieldConfig,
  historyByPath: Record<string, WorkflowHistory> = {}
): AnalysisResult {
  const workflows = [];
  const findings = [];

  for (const pair of pairs) {
    const history = historyByPath[pair.path];
    let before = null;
    let after = null;
    let baseDoc: Record<string, any> | null = null;
    let headDoc: Record<string, any> | null = null;

    if (pair.baseText) {
      try {
        baseDoc = parseWorkflow(pair.baseText);
        before = estimateWorkflow(pair.path, baseDoc, config, history);
      } catch {
        // A broken base should not crash analysis of the PR. The head will carry parse findings.
      }
    }

    if (pair.headText) {
      try {
        headDoc = parseWorkflow(pair.headText);

        // History is trustworthy only when the workflow already exists on the base branch.
        // A brand-new workflow can accumulate tiny PR-only history before MinuteShield runs;
        // using that data would systematically understate both runtime and run frequency.
        const headHistory = baseDoc ? history : undefined;
        let headRunsPerDay = config.estimation.defaultRunsPerDay;

        if (baseDoc && history?.runsPerDay != null) {
          const baseLoad = Math.max(0.25, triggerLoad(baseDoc));
          const headLoad = Math.max(0.25, triggerLoad(headDoc));
          headRunsPerDay = history.runsPerDay * (headLoad / baseLoad);
        } else if (!baseDoc) {
          // For a new scheduled workflow, never estimate fewer runs than the statically
          // observable cron frequency. Non-schedule triggers still use the configured fallback.
          headRunsPerDay = Math.max(headRunsPerDay, scheduleRunsPerDay(headDoc));
        }

        after = estimateWorkflow(pair.path, headDoc, config, headHistory, headRunsPerDay);
        findings.push(...inspectWorkflow(pair.path, pair.headText, after, config));
      } catch (error) {
        findings.push({
          code: 'yaml-invalid' as const,
          severity: 'error' as const,
          workflow: pair.path,
          message: `Workflow could not be parsed: ${error instanceof Error ? error.message : String(error)}`,
          recommendation: 'Fix the workflow YAML before merging.'
        });
      }
    }

    const beforeMonthly = before?.monthlyUsd ?? 0;
    const afterMonthly = after?.monthlyUsd ?? 0;
    workflows.push({
      path: pair.path,
      before,
      after,
      deltaMonthlyUsd: afterMonthly - beforeMonthly
    });
  }

  const beforeMonthlyUsd = workflows.reduce((sum, wf) => sum + (wf.before?.monthlyUsd ?? 0), 0);
  const afterMonthlyUsd = workflows.reduce((sum, wf) => sum + (wf.after?.monthlyUsd ?? 0), 0);
  const monthlyDeltaUsd = afterMonthlyUsd - beforeMonthlyUsd;
  const policyWarnings: string[] = [];
  if (monthlyDeltaUsd >= config.policy.warnMonthlyDeltaUsd) {
    policyWarnings.push(`Estimated monthly CI cost increases by $${monthlyDeltaUsd.toFixed(2)} (warning threshold: $${config.policy.warnMonthlyDeltaUsd.toFixed(2)}).`);
  }
  const policyBreached = monthlyDeltaUsd >= config.policy.failMonthlyDeltaUsd || findings.some((f) => f.severity === 'error');
  if (monthlyDeltaUsd >= config.policy.failMonthlyDeltaUsd) {
    policyWarnings.push(`Estimated monthly CI cost increase exceeds the $${config.policy.failMonthlyDeltaUsd.toFixed(2)} fail threshold.`);
  }

  return { workflows, findings, beforeMonthlyUsd, afterMonthlyUsd, monthlyDeltaUsd, policyBreached, policyWarnings };
}
