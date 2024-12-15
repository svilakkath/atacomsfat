import {useAppTheme} from '@/assets/theme';
import {scale, verticalScale} from '@/utils/scaling/scalingUtil';
import {StyleSheet} from 'react-native';

const useStyles = () => {
  const {spacing} = useAppTheme();

  return StyleSheet.create({
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: verticalScale(spacing.s_8),
      color: '#333',
      alignSelf: 'flex-start',
    },
    firstScreen: {
      width: '100%',
      height: '100%',
    },
    secondScreen: {
      width: '100%',
      height: '100%',
    },
    input: {
      borderWidth: scale(1),
      borderColor: '#ccc',
      borderRadius: 8,
      padding: scale(spacing.s_8),
      fontSize: 16,
      marginBottom: verticalScale(spacing.s_16),
      backgroundColor: '#fff',
      width: '100%',
    },
    timeOfDayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(spacing.s_16),
    },
    timeButton: {
      marginRight: scale(spacing.s_12),
      borderRadius: 5,
      paddingVertical: verticalScale(spacing.s_8),
      paddingHorizontal: scale(spacing.s_16),
      borderWidth: scale(1),
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
      marginLeft: scale(spacing.s_12),
      alignItems: 'center',
    },
    formatButton: {
      borderWidth: scale(1),
      borderColor: '#ccc',
      borderRadius: 5,
      paddingVertical: verticalScale(spacing.s_4),
      paddingHorizontal: scale(spacing.s_12),
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
      paddingVertical: verticalScale(spacing.s_12),
      borderRadius: 8,
      marginTop: verticalScale(spacing.s_12),
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
      marginTop: verticalScale(spacing.s_20),
    },
    test: {
      width: '30%',
    },
    errorText: {
      color: 'red',
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
  });
};
export default useStyles;
