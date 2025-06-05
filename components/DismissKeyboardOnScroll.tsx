import React, { useRef } from 'react';
import { Keyboard, PanResponder, View, StyleSheet, GestureResponderEvent, PanResponderGestureState } from 'react-native';

interface DismissKeyboardOnScrollProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const SWIPE_THRESHOLD = 50; // Minimum distance to trigger a swipe
const VELOCITY_THRESHOLD = 0.3; // Minimum velocity to consider it a fast swipe
const HORIZONTAL_SWIPE_ANGLE = 30; // Maximum angle (in degrees) from horizontal to consider it a horizontal swipe

const DismissKeyboardOnScroll = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight 
}: DismissKeyboardOnScrollProps) => {
  const startY = useRef(0);
  const startX = useRef(0);

  const getSwipeDirection = (
    gestureState: PanResponderGestureState
  ): 'left' | 'right' | 'up' | 'down' | null => {
    const { dx, dy } = gestureState;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    if (Math.abs(angle) < HORIZONTAL_SWIPE_ANGLE) return 'right';
    if (Math.abs(angle) > 180 - HORIZONTAL_SWIPE_ANGLE) return 'left';
    if (angle > 0 && angle < 180 - HORIZONTAL_SWIPE_ANGLE) return 'down';
    if (angle < 0 && angle > -180 + HORIZONTAL_SWIPE_ANGLE) return 'up';
    
    return null;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Always capture the gesture to track the full swipe
        return true;
      },
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        startY.current = evt.nativeEvent.pageY;
        startX.current = evt.nativeEvent.pageX;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy, vx, vy } = gestureState;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const velocity = Math.sqrt(vx * vx + vy * vy);
        
        // If it's a fast flick, handle it immediately
        if (velocity > VELOCITY_THRESHOLD) {
          const direction = getSwipeDirection(gestureState);
          
          if (direction === 'down' && vy > 0) {
            Keyboard.dismiss();
          } else if (direction === 'left' && onSwipeLeft) {
            onSwipeLeft();
          } else if (direction === 'right' && onSwipeRight) {
            onSwipeRight();
          }
          return;
        }
        
        // For slower swipes, check the distance
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          if (dx > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (dx < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else if (dy > SWIPE_THRESHOLD) {
          // Only dismiss keyboard on downward swipes
          Keyboard.dismiss();
        }
      },
    })
  ).current;

  return (
    <View 
      style={styles.container}
      {...panResponder.panHandlers}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default DismissKeyboardOnScroll;
