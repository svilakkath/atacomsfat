import {StyleSheet} from 'react-native';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f9f9f9',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 8,
      color: '#333',
      alignSelf: 'flex-start',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 15,
      backgroundColor: '#fff',
      width: '100%',
    },
    timeOfDayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    timeButton: {
      marginRight: 10,
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedTimeButton: {
      backgroundColor: '#007BFF',
      borderColor: '#007BFF',
    },
    timeText: {
      fontSize: 16,
      color: '#333',
    },
    selectedTimeText: {
      color: '#fff',
    },
    formatContainer: {
      flexDirection: 'row',
      marginLeft: 10,
      alignItems: 'center',
    },
    formatButton: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginHorizontal: 5,
    },
    selectedFormatButton: {
      backgroundColor: '#007BFF',
      borderColor: '#007BFF',
    },
    formatText: {
      color: '#333',
    },
    submitButton: {
      backgroundColor: '#007BFF',
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 20,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    test: {
      width: '30%',
    },
  });
};
export default useStyles;
