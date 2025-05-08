import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const useStyles = () => {
  return StyleSheet.create({
    container: {
      padding: 15,
      backgroundColor: '#389EBA',
      borderRadius: 12,
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 0,
    },
    imagePlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    infoContainer: {
      flex: 1,
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 3,
      maxWidth: '100%',
    },
    doseRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 5,
    },
    separator: {
      height: 15,
      width: 2,
      backgroundColor: '#B0B0B0',
      marginHorizontal: 8,
    },
    timeSection: {
      marginBottom: 0,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spacer: {
      width: 15,
    },
    divider: {
      height: 1,
      backgroundColor: '#E0E0E0',
      marginVertical: 15,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginHorizontal: 5,
      gap: 2,
    },
    smallImagePlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    doneButton: {
      width: width * 0.3,
      borderRadius: 25,
      justifyContent: 'center',
    },
    skipButton: {
      width: width * 0.3,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullNameText: {
      fontSize: 18,
      fontWeight: '400',
      color: '#fff',
      flexWrap: 'wrap',
      maxWidth: width - 140, // Adjust width dynamically based on available space
    },
  });
};

export default useStyles;
