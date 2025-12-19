/**
 * DateFormatter
 * Handles locale-aware formatting of dates and times
 */
export class DateFormatter {
    formatDate(
        date: Date,
        locale: string,
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

    formatTime(
        date: Date,
        locale: string,
        options?: Intl.DateTimeFormatOptions,
    ): string {
        const defaultOptions: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: '2-digit',
            ...options,
        };
        return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
    }

    formatDateTime(
        date: Date,
        locale: string,
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

    formatDateToString(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    formatToISOString(date: Date): string {
        return date.toISOString();
    }

    formatRelativeTime(date: Date, locale: string): string {
        const now = new Date();
        const diffInMs = date.getTime() - now.getTime();
        const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

        // Use Intl.RelativeTimeFormat for generic localizable relative time
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

        if (Math.abs(diffInDays) < 7) {
            return rtf.format(diffInDays, 'day');
        }

        // For longer periods, fall back to simple date
        return this.formatDate(date, locale, {
            month: 'short',
            day: 'numeric',
            year: Math.abs(diffInDays) > 365 ? 'numeric' : undefined,
        });
    }
}
