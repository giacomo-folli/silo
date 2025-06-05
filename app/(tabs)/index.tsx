import React, { useState } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import EditorPage from "../../components/EditorPage";
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';

export default function EditorTab() {
  const [archivedNotes, setArchivedNotes] = useState<{ id: number; content: string }[]>([]);
  const { gestureHandler, animatedStyle } = useSwipeNavigation('/(tabs)/archive', 'left');

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      activeOffsetX={[-20, 20]} // Only activate after 20 pixels of movement
    >
      <Animated.View
        style={[{ flex: 1 }, animatedStyle]}
        entering={SlideInRight.duration(300)}
        exiting={SlideOutLeft.duration(300)}
      >
        <EditorPage
          archivedNotes={archivedNotes}
          setArchivedNotes={setArchivedNotes}
        />
      </Animated.View>
    </PanGestureHandler>
  );
} 