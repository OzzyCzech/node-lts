import { describe, it, expect } from 'vitest';
import { parseSchedule } from '../src/index.js';

const mockSchedule = {
  v20: {
    start: '2023-04-18',
    end: '2026-04-30',
    lts: '2023-10-24',
    maintenance: '2025-10-21',
  },
  v21: { start: '2023-10-17', end: '2024-06-01', maintenance: '2024-04-01' },
  v22: {
    start: '2024-04-24',
    end: '2027-04-30',
    lts: '2024-10-29',
    maintenance: '2026-10-20',
  },
  v23: { start: '2024-10-16', end: '2025-06-01', maintenance: '2025-04-01' },
  v24: {
    start: '2025-05-06',
    end: '2028-04-30',
    lts: '2025-10-28',
    maintenance: '2027-10-19',
  },
  v25: { start: '2025-10-15', end: '2026-06-01', maintenance: '2026-04-01' },
  v26: {
    start: '2026-04-22',
    end: '2029-04-30',
    lts: '2026-10-27',
    maintenance: '2028-10-17',
  },
};

describe('parseSchedule', () => {
  it('returns correct snapshot for 2026-04-10', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result).toEqual({
      lts: 24,
      activeLts: [22, 24],
      maintenanceLts: [20],
      current: 25,
      supported: [20, 22, 24, 25],
      next: 26,
    });
  });

  it('excludes versions past EOL', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.supported).not.toContain(21);
    expect(result.supported).not.toContain(23);
  });

  it('excludes versions not yet released', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.supported).not.toContain(26);
  });

  it('lts is highest Active LTS (excludes Maintenance LTS)', () => {
    // Before v24 enters LTS (2025-10-28), v22 is the highest Active LTS
    const result = parseSchedule(mockSchedule, '2025-06-01');
    expect(result.lts).toBe(22);
    expect(result.activeLts).toEqual([20, 22]);
    expect(result.current).toBe(24);
  });

  it('version promoting to LTS is immediately reflected', () => {
    const result = parseSchedule(mockSchedule, '2025-10-28');
    expect(result.lts).toBe(24);
    expect(result.activeLts).toContain(24);
  });

  it('all arrays are sorted ascending', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.supported).toEqual([...result.supported].sort((a, b) => a - b));
    expect(result.activeLts).toEqual([...result.activeLts].sort((a, b) => a - b));
    expect(result.maintenanceLts).toEqual(
      [...result.maintenanceLts].sort((a, b) => a - b),
    );
  });

  it('returns null for next when no upcoming versions', () => {
    const result = parseSchedule(mockSchedule, '2030-01-01');
    expect(result.next).toBeNull();
  });

  it('returns empty arrays and zero scalars when nothing is in range', () => {
    const result = parseSchedule(mockSchedule, '2030-01-01');
    expect(result.supported).toEqual([]);
    expect(result.activeLts).toEqual([]);
    expect(result.maintenanceLts).toEqual([]);
    expect(result.lts).toBe(0);
    expect(result.current).toBe(0);
  });

  it('LTS entering maintenance moves from activeLts to maintenanceLts', () => {
    // v20 enters maintenance on 2025-10-21
    const before = parseSchedule(mockSchedule, '2025-10-20');
    expect(before.activeLts).toContain(20);
    expect(before.maintenanceLts).not.toContain(20);
    const onDate = parseSchedule(mockSchedule, '2025-10-21');
    expect(onDate.activeLts).not.toContain(20);
    expect(onDate.maintenanceLts).toContain(20);
  });

  it('Current-in-maintenance is not counted as Maintenance LTS', () => {
    // v25 is non-LTS Current; it enters maintenance on 2026-04-01 but must
    // not appear in maintenanceLts — only LTS lines qualify.
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.maintenanceLts).not.toContain(25);
    expect(result.activeLts).not.toContain(25);
    expect(result.supported).toContain(25);
    expect(result.current).toBe(25);
  });

  it('non-LTS version is never in activeLts or maintenanceLts', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.activeLts).not.toContain(25);
    expect(result.maintenanceLts).not.toContain(25);
  });

  it('supported = activeLts ∪ maintenanceLts ∪ current (non-LTS)', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    const union = new Set([
      ...result.activeLts,
      ...result.maintenanceLts,
      result.current,
    ]);
    expect([...union].sort((a, b) => a - b)).toEqual(result.supported);
  });

  it('ignores entries without a maintenance date', () => {
    const schedule = {
      v18: { start: '2022-04-19', end: '2099-04-30', lts: '2022-10-25' },
    };
    const result = parseSchedule(schedule, '2026-04-10');
    expect(result.activeLts).toEqual([18]);
    expect(result.maintenanceLts).toEqual([]);
    expect(result.supported).toEqual([18]);
    expect(result.lts).toBe(18);
  });
});
