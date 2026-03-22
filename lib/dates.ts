import { DateTime } from "luxon";

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";

  const dt = date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date);

  return dt.toFormat("yyyy-MM-dd");
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";

  const dt = date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date);

  return dt.toFormat("yyyy-MM-dd HH:mm");
}

export function oneWeekAgo(): Date {
  return DateTime.now().minus({ weeks: 1 }).toJSDate();
}
