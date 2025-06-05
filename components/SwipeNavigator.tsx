import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SwipeNavigator = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleTouchStart = (e: any) => {
    setTouchStartX(e.nativeEvent.pageX);
  };

  const handleTouchEnd = (e: any) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.nativeEvent.pageX;
    const diffX = touchEndX - touchStartX;
    
    // Minimum swipe distance to trigger navigation (in pixels)
    const minSwipeDistance = 50;
    
    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0 && currentPage === 1) {
        // Swipe right on archive page, go to index
        setCurrentPage(0);
        router.push('/');
      } else if (diffX < 0 && currentPage === 0) {
        // Swipe left on index page, go to archive
        setCurrentPage(1);
        router.push('/archive');
      }
    }
    
    setTouchStartX(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View 
        style={styles.container}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onResponderGrant={handleTouchStart}
        onResponderRelease={handleTouchEnd}
      >
        {children}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default SwipeNavigator;
