import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import ArchivePageWrapper from "../../components/ArchivePageWrapper";
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';

export default function ArchiveTab() {
  const { gestureHandler, animatedStyle } = useSwipeNavigation('/(tabs)/index', 'right');

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
        <ArchivePageWrapper
          onLoadArchivedNote={(note) => {
            // Handle note loading if needed - currently handled by navigation in ArchivePageWrapper
          }}
        />
      </Animated.View>
    </PanGestureHandler>
  );
} 