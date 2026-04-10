const SCHEDULE_URL =
  'https://raw.githubusercontent.com/nodejs/Release/main/schedule.json';

export interface NodeVersions {
  active: number[];
  lts: number;
  current: number;
  next: number | null;
}

interface ScheduleEntry {
  start: string;
  end: string;
  lts?: string;
  codename?: string;
}

export function parseSchedule(
  schedule: Record<string, ScheduleEntry>,
  today = new Date().toISOString().slice(0, 10),
): NodeVersions {
  const active: number[] = [];
  let lts = 0;
  let current = 0;
  let next: number | null = null;
  let nextStart = '';

  for (const [key, info] of Object.entries(schedule)) {
    const major = parseInt(key.slice(1), 10);
    if (today >= info.start && today <= info.end) {
      active.push(major);
      if (info.lts && today >= info.lts) {
        lts = Math.max(lts, major);
      }
      current = Math.max(current, major);
    } else if (info.start > today && (nextStart === '' || info.start < nextStart)) {
      next = major;
      nextStart = info.start;
    }
  }

  active.sort((a, b) => a - b);
  return { active, lts, current, next };
}

export async function getNodeVersions(): Promise<NodeVersions> {
  const res = await fetch(SCHEDULE_URL);
  if (!res.ok) throw new Error(`Failed to fetch schedule: HTTP ${res.status}`);
  const schedule: Record<string, ScheduleEntry> = await res.json();
  return parseSchedule(schedule);
}
