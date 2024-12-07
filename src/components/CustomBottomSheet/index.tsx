import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useStyles from './styles';

type CustomBottomSheetProps = {
  children: React.ReactNode;
  initialHeight?: number;
  maxHeight?: number;
  isVisible: boolean;
  onClose?: () => void;
};

const {height: screenHeight} = Dimensions.get('window');

export default function CustomBottomSheet({
  children,
  initialHeight = 300,
  maxHeight = screenHeight * 0.9,
  isVisible,
  onClose,
}: CustomBottomSheetProps) {
  const [currentValue, setCurrentValue] = useState(initialHeight);
  const animationValue = useRef(new Animated.Value(initialHeight)).current;
  const styles = useStyles();

  useEffect(() => {
    const id = animationValue.addListener(({value}) => {
      setCurrentValue(value);
    });

    return () => {
      animationValue.removeListener(id);
    };
  }, [animationValue]);

  useEffect(() => {
    if (isVisible) {
      Animated.spring(animationValue, {
        toValue: initialHeight,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible, initialHeight, animationValue]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_evt, _gestureState) => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (Math.abs(gestureState.dy) > 10) {
          const newHeight = Math.min(
            maxHeight,
            Math.max(0, currentValue - gestureState.dy),
          );
          animationValue.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const {dy} = gestureState;

        if (dy > 50) {
          //   closeSheet();
          collapseSheet();
        } else if (dy < -50) {
          expandSheet();
        } else {
          if (currentValue > maxHeight / 2) {
            expandSheet();
          } else {
            collapseSheet();
          }
        }
      },
    }),
  ).current;

  const closeSheet = () => {
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (onClose) {
        onClose();
      }
    });
  };

  const expandSheet = () => {
    Animated.spring(animationValue, {
      toValue: maxHeight,
      useNativeDriver: false,
    }).start();
  };

  const collapseSheet = () => {
    Animated.spring(animationValue, {
      toValue: initialHeight,
      useNativeDriver: false,
    }).start();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[styles.bottomSheet, {height: animationValue, maxHeight}]}
        {...panResponder.panHandlers}>
        <View style={styles.handle} />
        <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
          <Icon name="close" size={28} color="gray" />
        </TouchableOpacity>

        {children}
      </Animated.View>
    </View>
  );
}
