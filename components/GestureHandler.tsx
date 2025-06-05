import React, { useRef } from 'react';
import { 
  Keyboard, 
  PanResponder, 
  View, 
  StyleSheet, 
  GestureResponderEvent, 
  PanResponderGestureState,
  Platform 
} from 'react-native';

interface GestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeDown?: () => void;
  onSwipeUp?: () => void;
  dismissKeyboardOnSwipeDown?: boolean;
  swipeThreshold?: number;
  velocityThreshold?: number;
  swipeAngle?: number;
}

const GestureHandler = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  onSwipeDown,
  onSwipeUp,
  dismissKeyboardOnSwipeDown = true,
  swipeThreshold = 50,
  velocityThreshold = 0.3,
  swipeAngle = 30,
}: GestureHandlerProps) => {
  const startY = useRef(0);
  const startX = useRef(0);
  const isSwiping = useRef(false);

  const getSwipeDirection = (
    gestureState: PanResponderGestureState
  ): 'left' | 'right' | 'up' | 'down' | null => {
    const { dx, dy } = gestureState;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const angleThreshold = swipeAngle;
    
    if (Math.abs(angle) < angleThreshold) return 'right';
    if (Math.abs(angle) > 180 - angleThreshold) return 'left';
    if (angle > 0 && angle < 180 - angleThreshold) return 'down';
    if (angle < 0 && angle > -180 + angleThreshold) return 'up';
    
    return null;
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left' && onSwipeLeft) {
      onSwipeLeft();
    } else if (direction === 'right' && onSwipeRight) {
      onSwipeRight();
    } else if (direction === 'down' && onSwipeDown) {
      onSwipeDown();
      if (dismissKeyboardOnSwipeDown) {
        Keyboard.dismiss();
      }
    } else if (direction === 'up' && onSwipeUp) {
      onSwipeUp();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        startY.current = evt.nativeEvent.pageY;
        startX.current = evt.nativeEvent.pageX;
        isSwiping.current = false;
      },
      
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;
        // Consider it a swipe if we've moved a certain distance
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          isSwiping.current = true;
        }
      },
      
      onPanResponderRelease: (_, gestureState) => {
        if (!isSwiping.current) return;
        
        const { dx, dy, vx, vy } = gestureState;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const velocity = Math.sqrt(vx * vx + vy * vy);
        
        // Handle fast flicks/swipes
        if (velocity > velocityThreshold) {
          const direction = getSwipeDirection(gestureState);
          if (direction) {
            handleSwipe(direction);
          }
          return;
        }
        
        // Handle slower, deliberate swipes
        if (distance > swipeThreshold) {
          const direction = getSwipeDirection(gestureState);
          if (direction) {
            handleSwipe(direction);
          }
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

export default GestureHandler;
