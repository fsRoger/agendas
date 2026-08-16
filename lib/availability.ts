// Regras de agenda do estúdio de cílios.
// 0 = domingo, 1 = segunda, ..., 6 = sábado.
// Terça e quinta ficam fechadas. Os horários do mesmo dia já respeitam o
// intervalo mínimo de 4h entre atendimentos por construção.
const SCHEDULE: Record<number, string[]> = {
  0: ["10:00", "14:00", "18:00"], // domingo
  1: ["17:00"], // segunda
  2: [], // terça — fechado
  3: ["17:00"], // quarta
  4: [], // quinta — fechado
  5: ["17:00"], // sexta
  6: ["10:00", "14:00", "18:00"], // sábado
};

export const DAYS_AHEAD = 45;

// São Paulo está fixo em UTC-3 (sem horário de verão desde 2019), então dá
// para comparar instantes com um offset fixo em vez de lidar com fuso do
// servidor.
const SP_OFFSET = "-03:00";

export function slotsForWeekday(weekday: number): string[] {
  return SCHEDULE[weekday] ?? [];
}

export function isOpenDay(weekday: number): boolean {
  return slotsForWeekday(weekday).length > 0;
}

export function isValidSlot(weekday: number, time: string): boolean {
  return slotsForWeekday(weekday).includes(time);
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

export function upcomingOpenDates(daysAhead = DAYS_AHEAD): OpenDate[] {
  const today = todayISOInSaoPaulo();
  const results: OpenDate[] = [];
  for (let i = 0; i < daysAhead; i++) {
    const date = addDaysISO(today, i);
    const weekday = weekdayOfISO(date);
    if (isOpenDay(weekday)) results.push({ date, weekday });
  }
  return results;
}
