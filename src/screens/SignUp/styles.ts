import {useAppTheme} from '@/assets/theme';
import {scale, verticalScale} from '@/utils/scaling/scalingUtil';
import {StyleSheet} from 'react-native';

const useStyles = () => {
  const {spacing} = useAppTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      // justifyContent: 'center',
    },
    input: {
      width: '100%',
      height: scale(50),
      borderWidth: scale(1),
      borderColor: '#ddd',
      borderRadius: 8,
      marginBottom: verticalScale(spacing.s_16),
      paddingHorizontal: scale(spacing.s_12),
    },
    label: {
      fontSize: 16,
      color: '#333',
      marginBottom: verticalScale(spacing.s_8),
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginTop: verticalScale(spacing.s_20),
      position: 'absolute',
      // top: scale(270),
      // left: scale(150),
    },
    nextButton: {
      height: 67,
      width: 95,
      backgroundColor: '#389EBA',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 17,
      position: 'absolute',
      top: 450,
      left: 150,
    },
    backButton: {
      height: 67,
      width: 95,
      backgroundColor: '#389EBA',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 17,
      position: 'absolute',
      top: 450,
      left: 30,
    },
    submitButton: {
      height: 67,
      width: 95,
      backgroundColor: '#3cb371',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 17,
      position: 'absolute',
      top: 450,
      left: 150,
      // bottom: 7,
      // right: 25,
    },
  });
};

export default useStyles;
