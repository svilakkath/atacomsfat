import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Animated, Dimensions, ScrollView, StyleSheet, View} from 'react-native';

const {width} = Dimensions.get('window');

type SwiperProps = {
  children: React.ReactNode; // Pages passed as children
  onPageChanged?: (pageIndex: number) => void;
};

// Wrapping the function component with forwardRef
const CustomSwiper = forwardRef(
  ({children, onPageChanged}: SwiperProps, ref: any) => {
    const scrollViewRef = useRef<ScrollView | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const scrollX = useRef(new Animated.Value(0)).current;

    const onScroll = Animated.event(
      [{nativeEvent: {contentOffset: {x: scrollX}}}],
      {useNativeDriver: false},
    );

    const handlePageChange = (event: any) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const pageIndex = Math.round(offsetX / width);
      setCurrentPage(pageIndex);
      if (onPageChanged) {
        onPageChanged(pageIndex);
      }
    };

    const goToPage = (index: number) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({x: index * width, animated: true});
        setCurrentPage(index);
      }
    };

    const renderPagination = () => {
      const dots = React.Children.map(children, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentPage ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ));

      return <View style={styles.pagination}>{dots}</View>;
    };

    // Expose goToPage function to the parent
    useImperativeHandle(ref, () => ({
      goToPage,
    }));

    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          onMomentumScrollEnd={handlePageChange}
          scrollEventThrottle={16}>
          {React.Children.map(children, (child, index) => (
            <View key={index} style={styles.page}>
              {child}
            </View>
          ))}
        </ScrollView>

        {renderPagination()}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width, // Each page takes full screen width
    flex: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default CustomSwiper;
