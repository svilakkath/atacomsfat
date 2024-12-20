import {useAppTheme} from '@/assets/theme';
import {scale, verticalScale} from '@/utils/scaling/scalingUtil';
import {StyleSheet} from 'react-native';

const useStyles = () => {
  const {spacing} = useAppTheme();

  return StyleSheet.create({
    label: {
      fontSize: 16,
      marginVertical: verticalScale(spacing.s_8),
      color: '#333',
      alignSelf: 'flex-start',
      fontFamily: 'san-serif',
    },
    firstScreen: {
      width: '98%',
      height: '100%',
      paddingRight: 32,
      marginTop: 200,
    },
    secondScreen: {
      width: '98%',
      height: '100%',
      paddingRight: 32,
      marginTop: 200,
    },
    timeOfDayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    dayTimeButton: {
      marginRight: scale(spacing.s_12),
      borderRadius: 5,
      paddingVertical: verticalScale(4),
      paddingHorizontal: scale(spacing.s_16),
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 1,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: '#fff',
      width: 110,
      height: 45,
    },
    selectedDayTimeButton: {
      backgroundColor: '#389EBA',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
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
      gap: 8,
    },
    formatButton: {
      borderRadius: 5,
      height: 45,
      width: 50,
      gap: 10,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedFormatButton: {
      backgroundColor: '#3cb371',
      elevation: 5,
    },
    formatText: {
      color: 'gray',
      textAlign: 'center',
    },
    selectedFormatText: {
      color: '#fff',
      textAlign: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    timeValue: {
      width: '23%',
      backgroundColor: '#fff',
      height: 45,
      borderRadius: 7,
      right: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
      bottom: 1,
    },
    errorText: {
      color: 'red',
    },
    container: {
      flex: 1,
      backgroundColor: '#ededed',
      padding: 18,
    },
    nextButton: {
      height: 67,
      width: 95,
      backgroundColor: '#389EBA',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 17,
      position: 'absolute',
      bottom: 60,
      right: 25,
    },
    backButton: {
      height: 67,
      width: 95,
      backgroundColor: '#389EBA',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 17,
      position: 'absolute',
      bottom: 7,
      left: 23,
    },
    submitButton: {
      height: 67,
      width: 95,
      backgroundColor: '#3cb371',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 17,
      position: 'absolute',
      bottom: 7,
      right: 25,
    },
    successButton: {
      backgroundColor: 'green',
    },
    failButton: {
      backgroundColor: 'red',
    },
  });
};
export default useStyles;
