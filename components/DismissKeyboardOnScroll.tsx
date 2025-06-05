import React from 'react';
import { Keyboard, PanResponder, View, StyleSheet } from 'react-native';

interface DismissKeyboardOnScrollProps {
  children: React.ReactNode;
}

const DismissKeyboardOnScroll = ({ children }: DismissKeyboardOnScrollProps) => {
  // PanResponder for slide down gesture to dismiss keyboard
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        // Only activate if the user is swiping down and not swiping horizontally too much
        return gestureState.dy > 10 && Math.abs(gestureState.dx) < 20;
      },
      onPanResponderEnd: (_, gestureState) => {
        // If the swipe was fast enough downward, dismiss the keyboard
        if (gestureState.vy > 0.5) {
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
