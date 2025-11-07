/**
 * @umituz/react-native-timezone - Public API
 *
 * Timezone detection and date/time utilities for React Native apps
 *
 * Usage:
 *   import { useTimezone, timezoneService } from '@umituz/react-native-timezone';
 */

// =============================================================================
// DOMAIN ENTITIES
// =============================================================================

export type {
  TimezoneInfo,
  CalendarDay,
  ITimezoneService,
} from './domain/entities/Timezone';

// =============================================================================
// INFRASTRUCTURE SERVICES
// =============================================================================

export { timezoneService, TimezoneService } from './infrastructure/services/TimezoneService';

// =============================================================================
// PRESENTATION HOOKS
// =============================================================================

export { useTimezone } from './presentation/hooks/useTimezone';
export type { UseTimezoneReturn } from './presentation/hooks/useTimezone';





