import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeGestureHandler from '../../components/SwipeGestureHandler';

const TabLayout = () => {
  const pathname = usePathname();
  const currentRoute = pathname.includes('archive') ? 'archive' : 'index';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SwipeGestureHandler currentRoute={currentRoute}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            animation: 'none', // Disable default tab animations
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="archive" />
        </Tabs>
      </SwipeGestureHandler>
    </GestureHandlerRootView>
  );
};

export default TabLayout; 