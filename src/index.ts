import * as core from '@actions/core';
import * as github from '@actions/github';
import { analyzeWorkflows } from './engine.js';
import { loadConfig } from './config.js';
import { changedWorkflowPairs, getFileText, upsertPullRequestComment } from './github.js';
import { collectHistory } from './history.js';
import { renderMarkdown, reportMarker } from './report.js';

async function run(): Promise<void> {
  const pr = github.context.payload.pull_request;
  if (!pr) {
    core.notice('MinuteShield currently performs before/after cost analysis on pull_request events.');
    return;
  }

  const token = core.getInput('github-token', { required: true });
  const configPath = core.getInput('config-path') || '.minuteshield.yml';
  const commentInput = (core.getInput('comment') || 'true').toLowerCase() !== 'false';
  const failInput = (core.getInput('fail-on-policy') || 'true').toLowerCase() !== 'false';
  const octokit = github.getOctokit(token);
  const { owner, repo } = github.context.repo;
  const pullNumber = pr.number;
  const baseSha = pr.base.sha;
  const headSha = pr.head.sha;

  // Policy comes from the trusted base branch so a PR cannot raise its own budget threshold.
  const configText = await getFileText(octokit, owner, repo, configPath, baseSha);
  const config = loadConfig(configText);
  const pairs = await changedWorkflowPairs(octokit, owner, repo, pullNumber, baseSha, headSha);

  if (pairs.length === 0) {
    core.notice('No GitHub Actions workflow YAML changed in this pull request.');
    core.setOutput('monthly-delta-usd', '0.00');
    core.setOutput('before-monthly-usd', '0.00');
    core.setOutput('after-monthly-usd', '0.00');
    core.setOutput('findings-count', '0');
    return;
  }

  let history = {};
  try {
    history = await collectHistory(
      octokit, owner, repo, pairs.map((p) => p.path),
      config.estimation.historyDays, config.estimation.historyRunLimit
    );
  } catch (error) {
    core.warning(`Historical calibration unavailable; using configured fallbacks. ${error instanceof Error ? error.message : String(error)}`);
  }

  const result = analyzeWorkflows(pairs, config, history);
  const markdown = renderMarkdown(result);
  await core.summary.addRaw(markdown).write();

  core.setOutput('monthly-delta-usd', result.monthlyDeltaUsd.toFixed(2));
  core.setOutput('before-monthly-usd', result.beforeMonthlyUsd.toFixed(2));
  core.setOutput('after-monthly-usd', result.afterMonthlyUsd.toFixed(2));
  core.setOutput('findings-count', String(result.findings.length));

  if (config.comment && commentInput) {
    try {
      await upsertPullRequestComment(octokit, owner, repo, pullNumber, markdown, reportMarker());
    } catch (error) {
      core.warning(`Could not post PR comment (common for fork PRs with read-only tokens): ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (result.policyBreached && failInput) {
    core.setFailed(`MinuteShield policy blocked this workflow change. Estimated monthly delta: $${result.monthlyDeltaUsd.toFixed(2)}.`);
  }
}

run().catch((error) => core.setFailed(error instanceof Error ? error.message : String(error)));
