import { Tabs } from 'expo-router';
import React from 'react';

const TabLayout= () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="editor"
        options={{title: 'Editor' }}
      />
      <Tabs.Screen
        name="archive"
        options={{ title: 'Archive'}}
      />
    </Tabs>
  );
};

export default TabLayout; 