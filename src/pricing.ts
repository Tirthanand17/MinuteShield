export interface RunnerPrice {
  label: string;
  usdPerMinute: number | null;
  source: 'github-standard' | 'custom' | 'self-hosted' | 'unknown';
}

const EXACT_RATES: Record<string, number> = {
  'ubuntu-slim': 0.002,
  'ubuntu-latest': 0.006,
  'ubuntu-24.04': 0.006,
  'ubuntu-22.04': 0.006,
  'ubuntu-26.04': 0.006,
  'ubuntu-24.04-arm': 0.005,
  'ubuntu-22.04-arm': 0.005,
  'ubuntu-26.04-arm': 0.005,
  'windows-latest': 0.010,
  'windows-2025': 0.010,
  'windows-2022': 0.010,
  'windows-11-arm': 0.010,
  'windows-11-vs2026-arm': 0.010,
  'macos-latest': 0.062,
  'macos-14': 0.062,
  'macos-15': 0.062,
  'macos-26': 0.062,
  'macos-15-intel': 0.062,
  'macos-26-intel': 0.062,
  'xcode-27': 0.062
};

export function normalizeRunner(runsOn: unknown): string {
  if (typeof runsOn === 'string') return runsOn.trim();
  if (Array.isArray(runsOn)) {
    const labels = runsOn.filter((x): x is string => typeof x === 'string');
    if (labels.some((x) => x === 'self-hosted')) return 'self-hosted';
    return labels.join(',');
  }
  if (runsOn && typeof runsOn === 'object') return '[dynamic-runner]';
  return '[unknown-runner]';
}

export function runnerPrice(runsOn: unknown, customRates: Record<string, number> = {}): RunnerPrice {
  const label = normalizeRunner(runsOn);
  if (label in customRates) return { label, usdPerMinute: customRates[label]!, source: 'custom' };
  if (label === 'self-hosted' || label.split(',').includes('self-hosted')) {
    return { label, usdPerMinute: 0, source: 'self-hosted' };
  }
  if (label in EXACT_RATES) return { label, usdPerMinute: EXACT_RATES[label]!, source: 'github-standard' };

  if (/^ubuntu-.*-arm$/.test(label)) return { label, usdPerMinute: 0.005, source: 'github-standard' };
  if (/^ubuntu-/.test(label)) return { label, usdPerMinute: 0.006, source: 'github-standard' };
  if (/^windows-/.test(label)) return { label, usdPerMinute: 0.010, source: 'github-standard' };
  if (/^macos-/.test(label)) return { label, usdPerMinute: 0.062, source: 'github-standard' };
  return { label, usdPerMinute: null, source: 'unknown' };
}

export function roundedBillableMinutes(minutes: number): number {
  if (!Number.isFinite(minutes) || minutes <= 0) return 1;
  return Math.max(1, Math.ceil(minutes));
}
