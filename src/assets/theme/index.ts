import { DefaultTheme, useTheme } from 'react-native-paper';
import palette from './colors';
import fonts from './fonts';
import spacing from './spacing';

export const theme = {
  ...DefaultTheme,
  roundness: 16,
  myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.PRIMARY,
    onPrimary: palette.TEXT,
    secondary: palette.SECONDARY,
    background: palette.DISABLED,
    surface: palette.SURFACE,
    text: palette.BLACK,
    error: palette.ERROR,
    success: palette.SUCCESS,
    onSurface: palette.BLACK,
    disabled: palette.DISABLED,
    placeholder: palette.TEXT,
    notification: palette.NOTIFICATION,
    outline: palette.GREY_DISABLED,
    surfaceDisabled: palette.GREY_DISABLED,
    onSurfaceDisabled: palette.WHITE,

    // custom button colors
    primaryButton: palette.PRIMARY,
    primaryButtonText: palette.WHITE,
    primaryDisabledButton: palette.PRIMARY_TRANSPARENT,
    primaryDisabledButtonText: palette.WHITE,

    secondaryButton: palette.LIGHT_GREY,
    secondaryButtonText: palette.BLACK,
    secondaryDisabledButton: palette.WHITE,
    secondaryDisabledButtonText: palette.GREY_DISABLED,

    // custom text colors
    primaryText: palette.BLACK,
    secondaryText: palette.WHITE,
    tertiaryText: palette.GREY_LIGHT,

    // custom text input colors
    primaryInput: palette.LIGHT_GREY,
    secondaryInput: palette.SECONDARY,
    primaryInputLabelText: palette.LABEL_GREY,

    primaryBlack: palette.BLACK,
    transparent: palette.TRANSPARENT,
    backdrop: palette.BACKDROP,
    greyLight: palette.GREY_LIGHT,
    transparentLoader: palette.TRANSPARENT_LOADER,
    toastSuccess: palette.TOAST,
    toastError: palette.ERROR_TOAST,
    toastInfo: palette.INFO_TOAST,
  },
  fonts,
  spacing,
};

export type AppTheme = typeof theme;
export const useAppTheme = () => useTheme<AppTheme>();
