import {useAppTheme} from '@/assets/theme';
import {StyleSheet} from 'react-native';

const useStyles = () => {
  const {colors, spacing} = useAppTheme();
  return StyleSheet.create({
    textInput: {
      borderRadius: 20,
      height: 56,
      paddingLeft: spacing.s_4,
      backgroundColor: colors.primaryInput,
      paddingVertical: spacing.s_8,
    },
    error: {
      backgroundColor: colors.error,
    },
    disabled: {
      backgroundColor: colors.disabled,
    },

    content: {
      height: 50,
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      fontWeight: undefined,
    },
    icon: {
      paddingTop: spacing.s_12,
    },
  });
};
export default useStyles;
