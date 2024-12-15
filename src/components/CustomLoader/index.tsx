/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

interface CustomLoaderProps {
  size?: number; // Size of the dots
  gap?: number; // Gap between the dots
}

const CustomLoader: React.FC<CustomLoaderProps> = ({size = 10, gap = 5}) => {
  const animations = {
    one: new Animated.Value(0),
    two: new Animated.Value(0),
    three: new Animated.Value(0),
  };

  const onAnimate = (animation: Animated.Value, nextAnimation: () => void) => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: -size / 2, // Adjust bounce height based on size
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(nextAnimation, 0);
    });
  };

  const onStartAnimate = () => {
    const onThreeAnimation = () => {
      onAnimate(animations.three, () => {
        setTimeout(onStartAnimate, 500);
      });
    };

    const onTwoAnimation = () => {
      onAnimate(animations.two, onThreeAnimation);
    };

    onAnimate(animations.one, onTwoAnimation);
  };

  useEffect(() => {
    onStartAnimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, {gap}]}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{translateY: animations.one}],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: 'black',
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{translateY: animations.two}],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: 'green',
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{translateY: animations.three}],
          },
        ]}
      />
    </View>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center', // Center content with small gap
    alignItems: 'center',
  },
  dot: {
    backgroundColor: 'red',
  },
});
