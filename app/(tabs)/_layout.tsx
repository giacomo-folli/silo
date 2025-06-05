import { Tabs } from 'expo-router';
import React from 'react';

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarActiveTintColor: '#0a7ea4',
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="archive" />
    </Tabs>
  );
};

export default TabLayout; 