import {StyleSheet} from 'react-native';

const useStyles = () => {
  return StyleSheet.create({
    overlay: {
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: '#ededed',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden',
    },
    handle: {
      width: 40,
      height: 5,
      backgroundColor: '#ccc',
      borderRadius: 2.5,
      alignSelf: 'center',
      marginVertical: 10,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
      padding: 5,
    },
  });
};
export default useStyles;
