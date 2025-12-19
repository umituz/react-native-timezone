/**
 * Timezone Service Implementation
 * Infrastructure Layer - Composes smaller services for specialized tasks
 */

import {
  ITimezoneService,
  TimezoneInfo,
  CalendarDay,
} from '../../domain/entities/Timezone';
import { TimezoneProvider } from './TimezoneProvider';
import { CalendarManager } from './CalendarManager';
import { DateFormatter } from './DateFormatter';

export class TimezoneService implements ITimezoneService {
  private provider = new TimezoneProvider();
  private calendar = new CalendarManager();
  private formatter = new DateFormatter();

  getCurrentTimezone(): string {
    return this.provider.getCurrentTimezone();
  }

  getTimezoneOffset(): number {
    return this.provider.getTimezoneOffset();
  }

  getTimezoneInfo(): TimezoneInfo {
    return this.provider.getTimezoneInfo();
  }

  getTimezones(): TimezoneInfo[] {
    return this.provider.getTimezones();
  }

  formatDate(
    date: Date,
    locale: string,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    return this.formatter.formatDate(date, locale, options);
  }

  formatTime(
    date: Date,
    locale: string,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    return this.formatter.formatTime(date, locale, options);
  }

  formatDateTime(
    date: Date,
    locale: string,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    return this.formatter.formatDateTime(date, locale, options);
  }

  getCalendarDays(year: number, month: number): CalendarDay[] {
    return this.calendar.getCalendarDays(year, month, (d) =>
      this.formatter.formatDateToString(d),
    );
  }

  isToday(date: Date): boolean {
    return this.calendar.isToday(date);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return this.calendar.isSameDay(date1, date2);
  }

  addDays(date: Date, days: number): Date {
    return this.calendar.addDays(date, days);
  }

  startOfDay(date: Date): Date {
    return this.calendar.startOfDay(date);
  }

  endOfDay(date: Date): Date {
    return this.calendar.endOfDay(date);
  }

  formatDateToString(date: Date): string {
    return this.formatter.formatDateToString(date);
  }

  getCurrentISOString(): string {
    return this.formatter.formatToISOString(new Date());
  }

  formatToISOString(date: Date): string {
    return this.formatter.formatToISOString(date);
  }

  formatRelativeTime(date: Date, locale: string): string {
    return this.formatter.formatRelativeTime(date, locale);
  }
}

// Export singleton instance for backward compatibility/ease of use
export const timezoneService = new TimezoneService();
