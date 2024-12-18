import {StyleSheet} from 'react-native';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      // padding: 10,
      justifyContent: 'space-between',
    },
    placeholder: {
      width: 24,
      marginRight: 10,
    },
  });
};
export default useStyles;
