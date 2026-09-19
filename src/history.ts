import type { WorkflowHistory } from './types.js';

function median(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid];
}

function durationMinutes(started?: string | null, completed?: string | null): number | null {
  if (!started || !completed) return null;
  const ms = new Date(completed).getTime() - new Date(started).getTime();
  return Number.isFinite(ms) && ms > 0 ? ms / 60000 : null;
}

export async function collectHistory(
  octokit: any,
  owner: string,
  repo: string,
  workflowPaths: string[],
  days: number,
  runLimit: number
): Promise<Record<string, WorkflowHistory>> {
  const since = Date.now() - days * 86400000;
  const wanted = new Set(workflowPaths);
  const result: Record<string, WorkflowHistory> = {};
  for (const path of workflowPaths) result[path] = { samples: 0 };

  const response = await octokit.rest.actions.listWorkflowRunsForRepo({ owner, repo, per_page: Math.min(100, runLimit) });
  const runs = (response.data.workflow_runs as any[])
    .filter((run) => typeof run.path === 'string' && wanted.has(run.path) && new Date(run.created_at).getTime() >= since)
    .slice(0, runLimit);

  const grouped = new Map<string, any[]>();
  for (const run of runs) {
    const list = grouped.get(run.path) ?? [];
    list.push(run);
    grouped.set(run.path, list);
  }

  for (const path of workflowPaths) {
    const pathRuns = grouped.get(path) ?? [];
    const jobDurations: number[] = [];
    const byName = new Map<string, number[]>();
    const sampleRuns = pathRuns.slice(0, 12);
    for (const run of sampleRuns) {
      try {
        const jobsResp = await octokit.rest.actions.listJobsForWorkflowRun({ owner, repo, run_id: run.id, per_page: 100 });
        for (const job of jobsResp.data.jobs as any[]) {
          const duration = durationMinutes(job.started_at, job.completed_at);
          if (duration == null) continue;
          jobDurations.push(duration);
          const name = String(job.name ?? '').replace(/\s*\([^)]*\)\s*$/, '').trim();
          if (!name) continue;
          const list = byName.get(name) ?? [];
          list.push(duration);
          byName.set(name, list);
        }
      } catch {
        // History is optional. Keep estimation alive if permissions/API limits block job detail.
      }
    }
    const jobMedianMinutes: Record<string, number> = {};
    for (const [name, durations] of byName) {
      const med = median(durations);
      if (med != null) jobMedianMinutes[name] = med;
    }
    const history: WorkflowHistory = {
      samples: pathRuns.length,
      runsPerDay: pathRuns.length / days
    };
    const med = median(jobDurations);
    if (med != null) history.medianJobMinutes = med;
    if (Object.keys(jobMedianMinutes).length) history.jobMedianMinutes = jobMedianMinutes;
    result[path] = history;
  }
  return result;
}
