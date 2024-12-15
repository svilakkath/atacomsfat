import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const useStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    page: {
      width, // Match the device width for each page
      height, // Match the device height to prevent overlapping
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: '#ccc',
    },
    activeDot: {
      backgroundColor: '#007bff',
    },
    inactiveDot: {
      backgroundColor: '#ccc',
    },
    pagination: {
      position: 'absolute',
      bottom: 20,
      flexDirection: 'row',
      alignSelf: 'center',
    },
  });

export default useStyles;
