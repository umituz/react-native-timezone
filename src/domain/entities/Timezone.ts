/**
 * Timezone Domain Entities
 *
 * Core timezone types and interfaces for device timezone detection
 * and date/time manipulation
 *
 * Features:
 * - Auto-detects device timezone
 * - Locale-aware date/time formatting
 * - Calendar utilities
 * - Date manipulation helpers
 *
 * Zero external dependencies - uses native Intl API
 */

/**
 * Timezone information from device
 */
export interface TimezoneInfo {
  /** IANA timezone identifier (e.g., "America/New_York", "Europe/Istanbul") */
  timezone: string;

  /** UTC offset in minutes (negative for west, positive for east) */
  offset: number;

  /** Human-readable timezone display name */
  displayName: string;
}

/**
 * Calendar day representation
 * Generic structure - can be extended by apps for app-specific data
 */
export interface CalendarDay {
  /** Date object for this day */
  date: Date;

  /** Day of month (1-31) */
  day: number;

  /** Day of week (0 = Sunday, 6 = Saturday) */
  dayOfWeek: number;

  /** Month (0-11, 0 = January) */
  month: number;

  /** Year (e.g., 2024) */
  year: number;

  /** Whether this day is in the current month */
  isCurrentMonth: boolean;

  /** Whether this day is today */
  isToday: boolean;

  /** ISO date string (YYYY-MM-DD) */
  isoDate: string;
}

/**
 * Timezone Service Interface
 * Defines contract for timezone operations
 */
export interface ITimezoneService {
  /** Get current device timezone (IANA identifier) */
  getCurrentTimezone(): string;

  /** Get timezone offset in minutes */
  getTimezoneOffset(): number;

  /** Get complete timezone information */
  getTimezoneInfo(): TimezoneInfo;

  /** Format date with locale support */
  formatDate(
    date: Date,
    locale?: string,
    options?: Intl.DateTimeFormatOptions,
  ): string;

  /** Format time with locale support */
  formatTime(
    date: Date,
    locale?: string,
    options?: Intl.DateTimeFormatOptions,
  ): string;

  /** Get calendar days for a month */
  getCalendarDays(year: number, month: number): CalendarDay[];

  /** Check if date is today */
  isToday(date: Date): boolean;

  /** Check if two dates are the same day */
  isSameDay(date1: Date, date2: Date): boolean;

  /** Add days to a date */
  addDays(date: Date, days: number): Date;

  /** Get start of day (00:00:00) */
  startOfDay(date: Date): Date;

  /** Get end of day (23:59:59.999) */
  endOfDay(date: Date): Date;

  /** Format date to ISO string (YYYY-MM-DD) */
  formatDateToString(date: Date): string;

  /** Get current date as ISO string (YYYY-MM-DDTHH:mm:ss.sssZ) */
  getCurrentISOString(): string;

  /** Format date to ISO datetime string (YYYY-MM-DDTHH:mm:ss.sssZ) */
  formatToISOString(date: Date): string;
}








