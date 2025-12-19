import { CalendarDay } from '../../domain/entities/Timezone';

/**
 * CalendarManager
 * Handles calendar grid generation and date comparisons
 */
export class CalendarManager {
    /**
     * Get calendar days for a specific month
     */
    getCalendarDays(
        year: number,
        month: number,
        formatDateFn: (date: Date) => string,
    ): CalendarDay[] {
        const days: CalendarDay[] = [];
        const firstDay = new Date(year, month, 1);
        const firstDayOfWeek = firstDay.getDay();
        const lastDay = new Date(year, month + 1, 0);
        const lastDayOfMonth = lastDay.getDate();
        const today = new Date();

        // Previous month filler
        const prevMonthDate = new Date(year, month, 0);
        const prevMonthLastDay = prevMonthDate.getDate();
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();

        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const date = new Date(prevYear, prevMonth, day);
            days.push(this.createDay(date, false, today, formatDateFn));
        }

        // Current month
        for (let day = 1; day <= lastDayOfMonth; day++) {
            const date = new Date(year, month, day);
            days.push(this.createDay(date, true, today, formatDateFn));
        }

        // Next month filler
        const remainingDays = 42 - days.length;
        const nextMonthDate = new Date(year, month + 1, 1);
        const nextMonth = nextMonthDate.getMonth();
        const nextYear = nextMonthDate.getFullYear();

        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(nextYear, nextMonth, day);
            days.push(this.createDay(date, false, today, formatDateFn));
        }

        return days;
    }

    private createDay(
        date: Date,
        isCurrentMonth: boolean,
        today: Date,
        formatDateFn: (date: Date) => string,
    ): CalendarDay {
        return {
            date,
            day: date.getDate(),
            dayOfWeek: date.getDay(),
            month: date.getMonth(),
            year: date.getFullYear(),
            isCurrentMonth,
            isToday: this.isSameDay(date, today),
            isoDate: formatDateFn(date),
        };
    }

    isSameDay(d1: Date, d2: Date): boolean {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    }

    isToday(date: Date): boolean {
        return this.isSameDay(date, new Date());
    }

    addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    startOfDay(date: Date): Date {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }

    endOfDay(date: Date): Date {
        const result = new Date(date);
        result.setHours(23, 59, 59, 999);
        return result;
    }
}
