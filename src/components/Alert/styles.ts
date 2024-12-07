import {StyleSheet} from 'react-native';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      margin: 20,
      padding: 15,
      backgroundColor: '#F5F5F5',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    imagePlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    infoContainer: {
      flex: 1,
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    doseRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    separator: {
      height: 15,
      width: 4,
      backgroundColor: 'gray',
      marginHorizontal: 5,
    },
    timeSection: {
      marginBottom: 15,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spacer: {
      width: 10,
    },
    divider: {
      height: 1,
      backgroundColor: 'gray',
      marginVertical: 10,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    smallImagePlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    doneButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#D4EDDA',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
export default useStyles;
