/**
 * Timezone Service Implementation
 *
 * Provides timezone detection, date/time formatting, and calendar utilities
 * using native browser/device APIs (Intl.DateTimeFormat)
 *
 * Zero external dependencies - uses native Intl API
 *
 * Infrastructure Layer - Implementation of ITimezoneService
 */

import { ITimezoneService, TimezoneInfo, CalendarDay } from '../../domain/entities/Timezone';

export class TimezoneService implements ITimezoneService {
  /**
   * Get current device timezone using Intl API
   * @returns IANA timezone identifier (e.g., "America/New_York", "Europe/Istanbul")
   */
  getCurrentTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /**
   * Get current timezone offset in minutes
   * Negative for west of UTC, positive for east
   * @returns Offset in minutes
   */
  getTimezoneOffset(): number {
    return new Date().getTimezoneOffset() * -1; // Invert sign (JS returns opposite)
  }

  /**
   * Get complete timezone information
   * @returns TimezoneInfo object with timezone, offset, and display name
   */
  getTimezoneInfo(): TimezoneInfo {
    const timezone = this.getCurrentTimezone();
    const offset = this.getTimezoneOffset();

    // Create a formatter to get display name
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long',
    });

    // Extract display name from formatted string
    const parts = formatter.formatToParts(new Date());
    const timeZoneNamePart = parts.find((part) => part.type === 'timeZoneName');
    const displayName = timeZoneNamePart?.value || timezone;

    return {
      timezone,
      offset,
      displayName,
    };
  }

  /**
   * Format date with locale support
   * @param date - Date to format
   * @param locale - Locale string (e.g., "en-US", "tr-TR")
   * @param options - Intl.DateTimeFormatOptions
   * @returns Formatted date string
   */
  formatDate(
    date: Date,
    locale: string = 'en-US',
    options?: Intl.DateTimeFormatOptions,
  ): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
  }

  /**
   * Format time with locale support
   * @param date - Date to format
   * @param locale - Locale string (e.g., "en-US", "tr-TR")
   * @param options - Intl.DateTimeFormatOptions
   * @returns Formatted time string
   */
  formatTime(
    date: Date,
    locale: string = 'en-US',
    options?: Intl.DateTimeFormatOptions,
  ): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      ...options,
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
  }

  /**
   * Get calendar days for a specific month
   * Includes days from previous/next month to fill the calendar grid
   * @param year - Year (e.g., 2024)
   * @param month - Month (0-11, 0 = January)
   * @returns Array of CalendarDay objects
   */
  getCalendarDays(year: number, month: number): CalendarDay[] {
    const days: CalendarDay[] = [];

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const lastDayOfMonth = lastDay.getDate();

    // Today for comparison
    const today = new Date();
    const isTodayDate = (date: Date) =>
      this.isSameDay(date, today);

    // Add days from previous month to fill the first week
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(prevYear, prevMonth, day);
      days.push({
        date,
        day,
        dayOfWeek: date.getDay(),
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isToday: isTodayDate(date),
        isoDate: this.formatDateToString(date),
      });
    }

    // Add days from current month
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        day,
        dayOfWeek: date.getDay(),
        month,
        year,
        isCurrentMonth: true,
        isToday: isTodayDate(date),
        isoDate: this.formatDateToString(date),
      });
    }

    // Add days from next month to fill the last week
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 weeks * 7 days = 42

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(nextYear, nextMonth, day);
      days.push({
        date,
        day,
        dayOfWeek: date.getDay(),
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: isTodayDate(date),
        isoDate: this.formatDateToString(date),
      });
    }

    return days;
  }

  /**
   * Check if date is today
   * @param date - Date to check
   * @returns True if date is today
   */
  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  /**
   * Check if two dates are the same day
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if dates are the same day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Add days to a date
   * @param date - Base date
   * @param days - Number of days to add (can be negative)
   * @returns New date with days added
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Get start of day (00:00:00.000)
   * @param date - Date to get start of day for
   * @returns New date at start of day
   */
  startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of day (23:59:59.999)
   * @param date - Date to get end of day for
   * @returns New date at end of day
   */
  endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Format date to ISO string (YYYY-MM-DD)
   * @param date - Date to format
   * @returns ISO date string
   */
  formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get current date as ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
   * @returns Current date in ISO format
   */
  getCurrentISOString(): string {
    return new Date().toISOString();
  }

  /**
   * Format date to ISO datetime string (YYYY-MM-DDTHH:mm:ss.sssZ)
   * @param date - Date to format
   * @returns ISO datetime string
   */
  formatToISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Format date to relative time string (e.g., "Today", "Yesterday", "2 days ago")
   * @param date - Date to format
   * @param locale - Locale string (e.g., "en-US", "tr-TR")
   * @returns Relative time string
   */
  formatRelativeTime(date: Date, locale: string = 'en-US'): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return locale.startsWith('tr') ? 'Bugün' : 'Today';
    }
    if (diffInDays === 1) {
      return locale.startsWith('tr') ? 'Dün' : 'Yesterday';
    }
    if (diffInDays < 7) {
      return locale.startsWith('tr')
        ? `${diffInDays} gün önce`
        : `${diffInDays} days ago`;
    }

    // For older dates, use locale-aware date formatting
    return this.formatDate(date, locale, {
      month: 'short',
      day: 'numeric',
      year: diffInDays > 365 ? 'numeric' : undefined,
    });
  }

  /**
   * Format date and time together with locale support
   * @param date - Date to format
   * @param locale - Locale string (e.g., "en-US", "tr-TR")
   * @param options - Intl.DateTimeFormatOptions
   * @returns Formatted date and time string
   */
  formatDateTime(
    date: Date,
    locale: string = 'en-US',
    options?: Intl.DateTimeFormatOptions,
  ): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
  }
}

// Export singleton instance
export const timezoneService = new TimezoneService();

