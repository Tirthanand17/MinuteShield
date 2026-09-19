import type { AnalysisResult } from './types.js';

const MARKER = '<!-- minuteshield-report -->';

function money(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}$${value.toFixed(2)}`;
}

function statusEmoji(delta: number): string {
  if (delta > 0.01) return '⚠️';
  if (delta < -0.01) return '✅';
  return '➖';
}

export function renderMarkdown(result: AnalysisResult): string {
  const rows = result.workflows.map((wf) => {
    const before = wf.before?.monthlyUsd ?? 0;
    const after = wf.after?.monthlyUsd ?? 0;
    const runs = wf.after?.runsPerDay ?? wf.before?.runsPerDay ?? 0;
    return `| \`${wf.path}\` | $${before.toFixed(2)} | $${after.toFixed(2)} | ${money(wf.deltaMonthlyUsd)} | ${runs.toFixed(2)} |`;
  }).join('\n') || '| _No changed workflows_ | $0.00 | $0.00 | $0.00 | 0 |';

  const findingLines = result.findings.slice(0, 20).map((f) => {
    const icon = f.severity === 'error' ? '❌' : f.severity === 'warning' ? '⚠️' : 'ℹ️';
    const job = f.job ? ` / \`${f.job}\`` : '';
    return `- ${icon} **${f.code}** — \`${f.workflow}\`${job}: ${f.message} _${f.recommendation}_`;
  }).join('\n');

  const warnings = result.policyWarnings.length
    ? result.policyWarnings.map((w) => `- ${w}`).join('\n')
    : '- No configured monthly-delta threshold was crossed.';

  return `${MARKER}\n## 🛡️ MinuteShield CI cost check\n\n` +
    `${statusEmoji(result.monthlyDeltaUsd)} **Estimated monthly delta: ${money(result.monthlyDeltaUsd)}** ` +
    `(changed workflows only; before $${result.beforeMonthlyUsd.toFixed(2)} → after $${result.afterMonthlyUsd.toFixed(2)}).\n\n` +
    `| Workflow | Before / mo | After / mo | Delta / mo | Est. runs/day |\n|---|---:|---:|---:|---:|\n${rows}\n\n` +
    `### Policy\n${warnings}\n\n` +
    `### Findings (${result.findings.length})\n${findingLines || '- No findings.'}\n\n` +
    `<details><summary>How this estimate works</summary>\n\n` +
    `MinuteShield combines current GitHub-hosted runner rates with recent workflow/job history when the token can read it. ` +
    `For new or low-history workflows it uses configured fallback runtimes and run frequency. Static matrices are expanded; dynamic expressions and unknown/custom runners reduce confidence. ` +
    `This is a preventive estimate, not a GitHub invoice.\n\n</details>\n`;
}

export function reportMarker(): string {
  return MARKER;
}
