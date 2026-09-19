import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '../src/config.js';
import { analyzeWorkflows } from '../src/engine.js';

const base = `
name: CI
on:
  pull_request:
jobs:
  lint:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: npm test
`;

const expensive = `
name: CI
on:
  pull_request:
jobs:
  lint:
    runs-on: macos-latest
    timeout-minutes: 10
    steps:
      - run: npm test
`;

const frequentSchedule = `
name: Frequent schedule
on:
  schedule:
    - cron: '*/30 * * * *'
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: npm test
`;

describe('analysis engine', () => {
  it('detects a meaningful monthly runner-cost regression', () => {
    const result = analyzeWorkflows(
      [{ path: '.github/workflows/ci.yml', baseText: base, headText: expensive }],
      DEFAULT_CONFIG,
      { '.github/workflows/ci.yml': { runsPerDay: 10, medianJobMinutes: 5, samples: 30 } }
    );
    expect(result.beforeMonthlyUsd).toBeCloseTo(9, 4);
    expect(result.afterMonthlyUsd).toBeCloseTo(93, 4);
    expect(result.monthlyDeltaUsd).toBeCloseTo(84, 4);
    expect(result.policyBreached).toBe(true);
    expect(result.findings.some((f) => f.code === 'macos-runner')).toBe(true);
  });

  it('uses trusted thresholds from config', () => {
    const config = structuredClone(DEFAULT_CONFIG);
    config.policy.failMonthlyDeltaUsd = 100;
    const result = analyzeWorkflows(
      [{ path: '.github/workflows/ci.yml', baseText: base, headText: expensive }],
      config,
      { '.github/workflows/ci.yml': { runsPerDay: 10, medianJobMinutes: 5, samples: 30 } }
    );
    expect(result.policyBreached).toBe(false);
  });

  it('ignores PR-only history for a brand-new workflow', () => {
    const result = analyzeWorkflows(
      [{ path: '.github/workflows/new.yml', baseText: null, headText: expensive }],
      DEFAULT_CONFIG,
      { '.github/workflows/new.yml': { runsPerDay: 0.03, medianJobMinutes: 1, samples: 1 } }
    );

    const after = result.workflows[0]?.after;
    expect(after).toBeTruthy();
    if (!after) throw new Error('expected an after estimate for new workflow');

    expect(result.afterMonthlyUsd).toBeCloseTo(74.4, 4);
    expect(after.runsPerDay).toBe(5);
    expect(after.jobs[0]?.estimatedMinutes).toBe(8);
    expect(result.policyBreached).toBe(true);
  });

  it('uses observable cron frequency for a new scheduled workflow', () => {
    const result = analyzeWorkflows(
      [{ path: '.github/workflows/scheduled.yml', baseText: null, headText: frequentSchedule }],
      DEFAULT_CONFIG,
      { '.github/workflows/scheduled.yml': { runsPerDay: 0.03, medianJobMinutes: 1, samples: 1 } }
    );

    const after = result.workflows[0]?.after;
    expect(after).toBeTruthy();
    if (!after) throw new Error('expected an after estimate for scheduled workflow');

    expect(after.runsPerDay).toBe(48);
    expect(after.jobs[0]?.estimatedMinutes).toBe(8);
    expect(result.afterMonthlyUsd).toBeCloseTo(69.12, 4);
  });
});
