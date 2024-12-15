import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';

type SkeletonProps = {
  width?: number;
  height: number;
  variant?: 'box' | 'circle';
};

const CustomSkeletonLoader: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'box',
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  let borderRadius = 0;

  // If the variant is 'circle', we set the borderRadius to half of height (or width, whichever is smaller)
  if (variant === 'circle') {
    const size = typeof height === 'string' ? parseInt(height, 10) : height;
    borderRadius = size / 2;
  }

  useEffect(() => {
    // Looping opacity animation
    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    opacityAnimation.start();

    return () => {
      opacityAnimation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          opacity,
          width,
          height,
          borderRadius,
        },
        styles.skeleton,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'gray',
  },
});

export default CustomSkeletonLoader;
