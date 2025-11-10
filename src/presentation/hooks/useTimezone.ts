/**
 * useTimezone Hook
 *
 * React hook for timezone operations with automatic locale integration
 * Integrates with localization package for locale-aware date/time formatting
 *
 * Features:
 * - Auto-detects device timezone
 * - Locale-aware formatting (uses current app language)
 * - Calendar utilities
 * - Date manipulation helpers
 *
 * USAGE:
 * ```typescript
 * const {
 *   timezone,
 *   timezoneInfo,
 *   formatDate,
 *   formatTime,
 *   getCalendarDays,
 *   isToday,
 *   addDays,
 * } = useTimezone();
 *
 * // Automatic locale-aware formatting
 * const dateStr = formatDate(new Date()); // Uses current app language
 * const timeStr = formatTime(new Date()); // Uses current app language
 *
 * // Calendar for current month
 * const days = getCalendarDays(2024, 0); // January 2024
 *
 * // Date utilities
 * const tomorrow = addDays(new Date(), 1);
 * const isTodayDate = isToday(someDate);
 * ```
 */

import { useMemo, useCallback } from 'react';
import { useLocalization } from '@umituz/react-native-localization';
import { timezoneService } from '../../infrastructure/services/TimezoneService';
import type { TimezoneInfo, CalendarDay } from '../../domain/entities/Timezone';

export interface UseTimezoneReturn {
  /** Current device timezone (IANA identifier) */
  timezone: string;

  /** Complete timezone information */
  timezoneInfo: TimezoneInfo;

  /** Format date with current app locale */
  formatDate: (
    date: Date,
    options?: Intl.DateTimeFormatOptions,
  ) => string;

  /** Format time with current app locale */
  formatTime: (
    date: Date,
    options?: Intl.DateTimeFormatOptions,
  ) => string;

  /** Get calendar days for a month */
  getCalendarDays: (year: number, month: number) => CalendarDay[];

  /** Check if date is today */
  isToday: (date: Date) => boolean;

  /** Check if two dates are the same day */
  isSameDay: (date1: Date, date2: Date) => boolean;

  /** Add days to a date */
  addDays: (date: Date, days: number) => Date;

  /** Get start of day (00:00:00) */
  startOfDay: (date: Date) => Date;

  /** Get end of day (23:59:59.999) */
  endOfDay: (date: Date) => Date;

  /** Format date to ISO string (YYYY-MM-DD) */
  formatDateToString: (date: Date) => string;

  /** Get current date as ISO string (YYYY-MM-DDTHH:mm:ss.sssZ) */
  getCurrentISOString: () => string;

  /** Format date to ISO datetime string (YYYY-MM-DDTHH:mm:ss.sssZ) */
  formatToISOString: (date: Date) => string;
}

/**
 * Hook for timezone operations with automatic locale integration
 * Provides locale-aware date/time formatting using current app language
 */
export const useTimezone = (): UseTimezoneReturn => {
  // Get current app language from localization package
  const { currentLanguage } = useLocalization();

  // Get timezone info (memoized - only changes if device timezone changes)
  const timezoneInfo = useMemo(() => timezoneService.getTimezoneInfo(), []);

  // Locale-aware date formatting (automatically uses current app language)
  const formatDate = useCallback(
    (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return timezoneService.formatDate(date, currentLanguage, options);
    },
    [currentLanguage],
  );

  // Locale-aware time formatting (automatically uses current app language)
  const formatTime = useCallback(
    (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return timezoneService.formatTime(date, currentLanguage, options);
    },
    [currentLanguage],
  );

  // Calendar utilities (no locale dependency)
  const getCalendarDays = useCallback((year: number, month: number) => {
    return timezoneService.getCalendarDays(year, month);
  }, []);

  const isToday = useCallback((date: Date) => {
    return timezoneService.isToday(date);
  }, []);

  const isSameDay = useCallback((date1: Date, date2: Date) => {
    return timezoneService.isSameDay(date1, date2);
  }, []);

  const addDays = useCallback((date: Date, days: number) => {
    return timezoneService.addDays(date, days);
  }, []);

  const startOfDay = useCallback((date: Date) => {
    return timezoneService.startOfDay(date);
  }, []);

  const endOfDay = useCallback((date: Date) => {
    return timezoneService.endOfDay(date);
  }, []);

  const formatDateToString = useCallback((date: Date) => {
    return timezoneService.formatDateToString(date);
  }, []);

  const getCurrentISOString = useCallback(() => {
    return timezoneService.getCurrentISOString();
  }, []);

  const formatToISOString = useCallback((date: Date) => {
    return timezoneService.formatToISOString(date);
  }, []);

  return {
    timezone: timezoneInfo.timezone,
    timezoneInfo,
    formatDate,
    formatTime,
    getCalendarDays,
    isToday,
    isSameDay,
    addDays,
    startOfDay,
    endOfDay,
    formatDateToString,
    getCurrentISOString,
    formatToISOString,
  };
};

