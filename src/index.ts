const SCHEDULE_URL =
  'https://raw.githubusercontent.com/nodejs/Release/main/schedule.json';

export interface NodeVersions {
  /** Highest major currently in Active LTS — the single recommended production version. */
  lts: number;
  /** Majors currently in Active LTS phase — use for CI matrix. */
  activeLts: number[];
  /** LTS majors now in Maintenance (critical fixes only) — users should upgrade. */
  maintenanceLts: number[];
  /** Highest released major (may be non-LTS Current). */
  current: number;
  /** All majors still receiving any updates (Active LTS ∪ Maintenance LTS ∪ Current). */
  supported: number[];
  /** Next upcoming major (not yet released), or `null`. */
  next: number | null;
}

interface ScheduleEntry {
  start: string;
  end: string;
  lts?: string;
  maintenance?: string;
  codename?: string;
}

export function parseSchedule(
  schedule: Record<string, ScheduleEntry>,
  today = new Date().toISOString().slice(0, 10),
): NodeVersions {
  const supported: number[] = [];
  const activeLts: number[] = [];
  const maintenanceLts: number[] = [];
  let current = 0;
  let next: number | null = null;
  let nextStart = '';

  for (const [key, info] of Object.entries(schedule)) {
    const major = parseInt(key.slice(1), 10);
    if (today >= info.start && today <= info.end) {
      supported.push(major);
      const isLts = !!info.lts && today >= info.lts;
      const inMaintenance = !!info.maintenance && today >= info.maintenance;
      if (isLts && inMaintenance) {
        maintenanceLts.push(major);
      } else if (isLts) {
        activeLts.push(major);
      }
      current = Math.max(current, major);
    } else if (info.start > today && (nextStart === '' || info.start < nextStart)) {
      next = major;
      nextStart = info.start;
    }
  }

  supported.sort((a, b) => a - b);
  activeLts.sort((a, b) => a - b);
  maintenanceLts.sort((a, b) => a - b);
  const lts = activeLts.length > 0 ? activeLts[activeLts.length - 1]! : 0;
  return { lts, activeLts, maintenanceLts, current, supported, next };
}

export async function getNodeVersions(): Promise<NodeVersions> {
  const res = await fetch(SCHEDULE_URL);
  if (!res.ok) throw new Error(`Failed to fetch schedule: HTTP ${res.status}`);
  const schedule = (await res.json()) as Record<string, ScheduleEntry>;
  return parseSchedule(schedule);
}
