import {StyleSheet} from 'react-native';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 8,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      marginBottom: 15,
    },
    button: {
      backgroundColor: '#007BFF',
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};
export default useStyles;
