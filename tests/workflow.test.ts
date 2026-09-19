import { describe, expect, it } from 'vitest';
import { cronRunsPerDay, matrixCopies, parseWorkflow, scheduleRunsPerDay } from '../src/workflow.js';

describe('workflow parsing', () => {
  it('expands static matrices', () => {
    const job = { strategy: { matrix: { node: [20, 22, 24], os: ['ubuntu', 'windows'] } } };
    expect(matrixCopies(job).copies).toBe(6);
  });

  it('accounts for include and exclude', () => {
    const job = { strategy: { matrix: { node: [22, 24], os: ['a', 'b'], exclude: [{ node: 22, os: 'a' }], include: [{ node: 24, os: 'c' }] } } };
    expect(matrixCopies(job).copies).toBe(4);
  });

  it('estimates simple cron frequency', () => {
    expect(cronRunsPerDay('*/30 * * * *')).toBe(48);
    expect(cronRunsPerDay('0 6 * * *')).toBe(1);
    const doc = parseWorkflow('on:\n  schedule:\n    - cron: "*/30 * * * *"\njobs: {}\n');
    expect(scheduleRunsPerDay(doc)).toBe(48);
  });
});
