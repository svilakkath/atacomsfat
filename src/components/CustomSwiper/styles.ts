import {Dimensions, StyleSheet} from 'react-native';

const useStyles = () => {
  const {width} = Dimensions.get('window');

  return StyleSheet.create({
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
};
export default useStyles;
