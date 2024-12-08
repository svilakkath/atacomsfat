import {StyleSheet} from 'react-native';

const useStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      // paddingHorizontal: 20,
      justifyContent: 'center',
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 10,
    },
    label: {
      fontSize: 16,
      color: '#333',
      marginBottom: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
  });

export default useStyles;
