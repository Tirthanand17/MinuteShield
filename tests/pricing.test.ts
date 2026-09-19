import { describe, expect, it } from 'vitest';
import { roundedBillableMinutes, runnerPrice } from '../src/pricing.js';

describe('runner pricing', () => {
  it('uses current standard GitHub-hosted rates', () => {
    expect(runnerPrice('ubuntu-latest').usdPerMinute).toBe(0.006);
    expect(runnerPrice('windows-latest').usdPerMinute).toBe(0.010);
    expect(runnerPrice('macos-latest').usdPerMinute).toBe(0.062);
    expect(runnerPrice('ubuntu-slim').usdPerMinute).toBe(0.002);
  });

  it('allows explicit custom runner rates', () => {
    const price = runnerPrice('my-large-runner', { 'my-large-runner': 0.041 });
    expect(price.usdPerMinute).toBe(0.041);
    expect(price.source).toBe('custom');
  });

  it('rounds partial billable minutes upward', () => {
    expect(roundedBillableMinutes(1.01)).toBe(2);
    expect(roundedBillableMinutes(4)).toBe(4);
  });
});
