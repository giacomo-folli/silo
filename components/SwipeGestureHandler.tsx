import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import ArchivePageWrapper from './ArchivePageWrapper';
import EditorPage from './EditorPage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const VELOCITY_THRESHOLD = 500;
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

interface SwipeGestureHandlerProps {
  children: React.ReactNode;
  currentRoute: 'index' | 'archive';
}

export default function SwipeGestureHandler({ children, currentRoute }: SwipeGestureHandlerProps) {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const isNavigating = useSharedValue(false);

  const navigateToPage = (route: 'index' | 'archive') => {
    if (isNavigating.value) return;
    isNavigating.value = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace(route === 'archive' ? '/(tabs)/archive' : '/(tabs)');
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      // Only allow swipes in the correct direction
      if (
        (currentRoute === 'index' && event.translationX < 0) ||
        (currentRoute === 'archive' && event.translationX > 0)
      ) {
        translateX.value = ctx.startX + event.translationX;
      }
    },
    onEnd: (event) => {
      const shouldNavigate =
        (Math.abs(event.velocityX) > VELOCITY_THRESHOLD && Math.abs(event.translationX) > 50) ||
        Math.abs(event.translationX) > SWIPE_THRESHOLD;

      if (shouldNavigate) {
        if (currentRoute === 'index' && event.translationX < 0) {
          translateX.value = withSpring(-SCREEN_WIDTH, SPRING_CONFIG, () => {
            runOnJS(navigateToPage)('archive');
          });
        } else if (currentRoute === 'archive' && event.translationX > 0) {
          translateX.value = withSpring(SCREEN_WIDTH, SPRING_CONFIG, () => {
            runOnJS(navigateToPage)('index');
          });
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG);
        }
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    },
  });

  const currentPageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const nextPageStyle = useAnimatedStyle(() => {
    // For index -> archive (swipe left), next page starts at SCREEN_WIDTH and moves left
    // For archive -> index (swipe right), next page starts at -SCREEN_WIDTH and moves right
    const nextPageTranslateX = currentRoute === 'index'
      ? translateX.value + SCREEN_WIDTH // Archive page moves left with current page
      : translateX.value - SCREEN_WIDTH; // Index page moves right with current page

    return {
      transform: [{ translateX: nextPageTranslateX }],
    };
  });

  const getNextPage = () => {
    if (currentRoute === 'index') {
      return (
        <View style={styles.page}>
          <ArchivePageWrapper
            onLoadArchivedNote={() => {}}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.page}>
          <EditorPage
            archivedNotes={[]}
            setArchivedNotes={() => {}}
          />
        </View>
      );
    }
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={styles.container}>
        <Animated.View style={[styles.page, currentPageStyle]}>
          {children}
        </Animated.View>
        <Animated.View style={[styles.page, nextPageStyle]}>
          {getNextPage()}
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden', // Prevent any content from spilling outside
  },
  page: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0, // Ensure pages are aligned to the left edge
    top: 0,  // Ensure pages are aligned to the top edge
  },
}); 