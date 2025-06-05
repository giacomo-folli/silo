import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SlideInRight,
  SlideOutLeft,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import ArchivePageWrapper from "../../components/ArchivePageWrapper";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3; // 30% of screen width

export default function ArchiveTab() {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const isGestureActive = useSharedValue(false);

  const navigateToEditor = () => {
    router.push('/(tabs)/index');
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      isGestureActive.value = true;
    },
    onActive: (event, ctx) => {
      // Only process right swipes and only if we're not already in a gesture
      if (event.translationX > 0 && !isGestureActive.value) {
        translateX.value = Math.min(SCREEN_WIDTH, ctx.startX + event.translationX);
      }
    },
    onEnd: (event) => {
      isGestureActive.value = false;
      
      if (event.translationX > SWIPE_THRESHOLD) {
        // If swiped past threshold, navigate to editor
        translateX.value = withSpring(SCREEN_WIDTH, {}, () => {
          runOnJS(navigateToEditor)();
        });
      } else {
        // Otherwise, spring back to start
        translateX.value = withSpring(0);
      }
    },
    onCancel: () => {
      isGestureActive.value = false;
      translateX.value = withSpring(0);
    },
    onFail: () => {
      isGestureActive.value = false;
      translateX.value = withSpring(0);
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      enabled={true}
      shouldCancelWhenOutside={true}
      activeOffsetX={[-20, 20]} // Only activate after 20 pixels of movement
    >
      <Animated.View 
        entering={SlideInRight.duration(300)}
        exiting={SlideOutLeft.duration(300)}
        style={[{ flex: 1 }, animatedStyle]}
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