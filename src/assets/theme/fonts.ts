import { configureFonts } from 'react-native-paper';
import palette from './colors';

const baseFont = {
  fontFamily: '',
  fontSize: 16,
  color: palette.BLACK,
  lineHeight: 22,
};

const baseVariants = configureFonts({ config: baseFont });

const customVariants = {
  // Customize individual base variants:
  displayMedium: {
    ...baseVariants.displayMedium,
    fontFamily: 'FrutigerLTPro-Bold',
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.2,
  },
  displaySmall: {
    ...baseVariants.displayMedium,
    fontFamily: '',
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  headerLarge: {
    fontFamily: '',
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1.6,
    fontWeight: '700',
  },
  headerMedium: {
    fontFamily: '',
    fontSize: 30,
    lineHeight: 38.5,
    letterSpacing: 0.1,
    fontWeight: '700',
  },
  headerSmall: {
    fontFamily: '',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  body: {
    ...baseVariants.default,
    lineHeight: 23,
    letterSpacing: 0.1,
  },
  bodyBold: {
    ...baseVariants.default,
    fontFamily: '',
    fontWeight: '600',
  },
  bodySmall: {
    ...baseVariants.default,
    fontSize: 16,
    lineHeight: 18,
  },
  regularText: {
    ...baseVariants.default,
    fontFamily: '',
    fontWeight: '600',
    lineHeight: 20,
  },
  regularTextMedium: {
    ...baseVariants.default,
    fontFamily: '',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 600,
  },
  regularTextSmall: {
    ...baseVariants.default,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 400,
  },
  labelTextMedium: {
    ...baseVariants.default,
    fontFamily: '',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  labelTextSmall: {
    ...baseVariants.default,

    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  baseFont: {
    ...baseVariants.default,
  },
};

const fonts = configureFonts({
  config: {
    ...baseVariants,
    ...customVariants,
  },
});

export default fonts;
