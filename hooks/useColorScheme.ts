import { Platform } from 'react-native';

export const useColorScheme = Platform.select({
  web: () => require('./useColorScheme.web').useColorScheme,
  default: () => require('react-native').useColorScheme,
})();
