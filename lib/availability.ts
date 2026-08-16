import type { WeekSchedule } from "@/lib/locations-config";

export const DAYS_AHEAD = 45;

// São Paulo está fixo em UTC-3 (sem horário de verão desde 2019), então dá
// para comparar instantes com um offset fixo em vez de lidar com fuso do
// servidor.
const SP_OFFSET = "-03:00";

export function slotsForWeekday(schedule: WeekSchedule, weekday: number): string[] {
  return schedule[weekday] ?? [];
}

export function isOpenDay(schedule: WeekSchedule, weekday: number): boolean {
  return slotsForWeekday(schedule, weekday).length > 0;
}

export function isValidSlot(schedule: WeekSchedule, weekday: number, time: string): boolean {
  return slotsForWeekday(schedule, weekday).includes(time);
}

export function todayISOInSaoPaulo(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function weekdayOfISO(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isSlotInPast(date: string, time: string): boolean {
  const slotInstant = new Date(`${date}T${time}:00${SP_OFFSET}`);
  return slotInstant.getTime() <= Date.now();
}

export function isWithinBookingWindow(date: string): boolean {
  const today = todayISOInSaoPaulo();
  return date >= today && date <= addDaysISO(today, DAYS_AHEAD);
}

export interface OpenDate {
  date: string;
  weekday: number;
}

export function upcomingOpenDates(schedule: WeekSchedule, daysAhead = DAYS_AHEAD): OpenDate[] {
  const today = todayISOInSaoPaulo();
  const results: OpenDate[] = [];
  for (let i = 0; i < daysAhead; i++) {
    const date = addDaysISO(today, i);
    const weekday = weekdayOfISO(date);
    if (isOpenDay(schedule, weekday)) results.push({ date, weekday });
  }
  return results;
}
