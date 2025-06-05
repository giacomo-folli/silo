import { Platform, useColorScheme as useNativeColorScheme } from 'react-native';
import { useColorScheme as useWebColorScheme } from './useColorScheme.web';

export const useColorScheme = Platform.select({
  web: () => useWebColorScheme,
  default: () => useNativeColorScheme,
})();
