# @umituz/react-native-timezone

Timezone detection and date/time utilities for React Native apps.

## Features

- Auto-detects device timezone
- Locale-aware date/time formatting
- Calendar utilities
- Date manipulation helpers
- Zero external dependencies (uses native Intl API)

## Installation

```bash
npm install @umituz/react-native-timezone
```

## Peer Dependencies

- `react` >= 18.2.0
- `react-native` >= 0.74.0
- `@umituz/react-native-localization` >= 1.3.0

## Usage

### Hook (Recommended)

```typescript
import { useTimezone } from '@umituz/react-native-timezone';

const MyComponent = () => {
  const { timezone, formatDate, formatTime } = useTimezone();

  return (
    <View>
      <Text>Timezone: {timezone}</Text>
      <Text>Date: {formatDate(new Date())}</Text>
      <Text>Time: {formatTime(new Date())}</Text>
    </View>
  );
};
```

### Service (Direct Usage)

```typescript
import { timezoneService } from '@umituz/react-native-timezone';

const timezone = timezoneService.getCurrentTimezone();
const formatted = timezoneService.formatDate(new Date(), 'en-US');
```

## License

MIT




















