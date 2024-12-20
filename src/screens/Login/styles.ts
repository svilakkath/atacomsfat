import {StyleSheet} from 'react-native';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '600',
      color: '#333',
      marginBottom: 32,
      textAlign: 'center',
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#3cb371',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonView: {flexDirection: 'row', alignItems: 'center'},
    signUpText: {color: 'blue', fontWeight: 'bold'},
  });
};

export default useStyles;
