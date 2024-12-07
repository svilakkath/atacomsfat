import {StyleSheet} from 'react-native';

const useStyles = () => {
  return StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      backgroundColor: '#ccc', // Fallback background color if image fails to load.
    },
    detailsContainer: {
      flex: 1,
      flexDirection: 'column',
    },
  });
};
export default useStyles;
