import {useAppTheme} from '@/assets/theme';
import {scale, verticalScale} from '@/utils/scaling/scalingUtil';
import {StyleSheet} from 'react-native';

const useStyles = () => {
  const {spacing} = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: verticalScale(spacing.s_8),
      color: '#333',
    },
    input: {
      borderWidth: scale(1),
      borderColor: '#ccc',
      borderRadius: 5,
      padding: scale(10),
      fontSize: 16,
      marginBottom: verticalScale(spacing.s_16),
    },
    button: {
      backgroundColor: '#007BFF',
      borderRadius: 5,
      padding: scale(10),
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
