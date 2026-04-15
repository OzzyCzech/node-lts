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
  it('returns correct active versions for 2026-04-10', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.active).toEqual([20, 22, 24, 25]);
    expect(result.lts).toBe(24);
    expect(result.current).toBe(25);
    expect(result.next).toBe(26);
  });

  it('excludes versions past EOL', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.active).not.toContain(21);
    expect(result.active).not.toContain(23);
  });

  it('excludes versions not yet released', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.active).not.toContain(26);
  });

  it('lts is highest even version past its lts date', () => {
    // Before v24 enters LTS (2025-10-28), v22 should be lts
    const result = parseSchedule(mockSchedule, '2025-06-01');
    expect(result.lts).toBe(22);
    expect(result.current).toBe(24);
  });

  it('version entering LTS is immediately reflected', () => {
    const result = parseSchedule(mockSchedule, '2025-10-28');
    expect(result.lts).toBe(24);
  });

  it('active list is sorted ascending', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.active).toEqual([...result.active].sort((a, b) => a - b));
  });

  it('returns null for next when no upcoming versions', () => {
    const result = parseSchedule(mockSchedule, '2030-01-01');
    expect(result.next).toBeNull();
  });

  it('returns empty active when all versions are outside range', () => {
    const result = parseSchedule(mockSchedule, '2030-01-01');
    expect(result.active).toEqual([]);
    expect(result.lts).toBe(0);
    expect(result.current).toBe(0);
    expect(result.maintenance).toEqual([]);
  });

  it('lists majors in maintenance phase', () => {
    // 2026-04-10: v20 past its maintenance date (2025-10-21),
    // v25 past its maintenance date (2026-04-01), v22/v24 still active LTS
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.maintenance).toEqual([20, 25]);
  });

  it('maintenance list is sorted ascending', () => {
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.maintenance).toEqual(
      [...result.maintenance].sort((a, b) => a - b),
    );
  });

  it('excludes maintenance versions past EOL', () => {
    // 2026-04-10: v21 and v23 are past their end dates → not in active or maintenance
    const result = parseSchedule(mockSchedule, '2026-04-10');
    expect(result.maintenance).not.toContain(21);
    expect(result.maintenance).not.toContain(23);
  });

  it('version entering maintenance is immediately reflected', () => {
    // v20 enters maintenance on 2025-10-21
    const before = parseSchedule(mockSchedule, '2025-10-20');
    expect(before.maintenance).not.toContain(20);
    const onDate = parseSchedule(mockSchedule, '2025-10-21');
    expect(onDate.maintenance).toContain(20);
  });

  it('ignores entries without a maintenance date', () => {
    const schedule = {
      v18: { start: '2022-04-19', end: '2099-04-30', lts: '2022-10-25' },
    };
    const result = parseSchedule(schedule, '2026-04-10');
    expect(result.maintenance).toEqual([]);
    expect(result.active).toEqual([18]);
  });
});
