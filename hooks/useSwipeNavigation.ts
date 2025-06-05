import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

type SwipeDirection = 'left' | 'right';

export const useSwipeNavigation = (targetRoute: string, swipeDirection: SwipeDirection) => {
  const router = useRouter();
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      if (swipeDirection === 'left') {
        if (event.translationX < 0) {
          translateX.value = Math.max(-SCREEN_WIDTH, event.translationX);
        } else {
          // If user drags right during a 'left' swipe, reset or keep at 0
          translateX.value = 0;
        }
      } else { // swipeDirection === 'right'
        if (event.translationX > 0) {
          translateX.value = Math.min(SCREEN_WIDTH, event.translationX);
        } else {
          // If user drags left during a 'right' swipe, reset or keep at 0
          translateX.value = 0;
        }
      }
    },
    onEnd: (event) => {
      const translationX = event.translationX;
      let shouldNavigate = false;

      if (swipeDirection === 'left' && translationX < -SWIPE_THRESHOLD) {
        shouldNavigate = true;
        translateX.value = withSpring(-SCREEN_WIDTH, {}, () => {
          runOnJS(router.navigate)(targetRoute);
        });
      } else if (swipeDirection === 'right' && translationX > SWIPE_THRESHOLD) {
        shouldNavigate = true;
        translateX.value = withSpring(SCREEN_WIDTH, {}, () => {
          runOnJS(router.navigate)(targetRoute);
        });
      }

      if (!shouldNavigate) {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { gestureHandler, animatedStyle };
};
