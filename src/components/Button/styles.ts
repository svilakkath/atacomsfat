import { useAppTheme } from '@/assets/theme';
import { verticalScale } from '@/utils/scaling/scalingUtil';
import { StyleSheet } from 'react-native';

const useStyles = () => {
  const { spacing } = useAppTheme();
  return StyleSheet.create({
    button: {
      height: verticalScale(48),
      borderRadius: 40,
      marginTop: verticalScale(spacing.s_8),
      marginBottom: verticalScale(spacing.s_8),
      justifyContent: 'center',
      fontStyle: 'normal',
    },
  });
};

export default useStyles;
