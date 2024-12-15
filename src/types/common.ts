import {WellnessPartnerProps} from '@/screens/WellnessPartnerList';
import {MD3TypescaleKey} from 'react-native-paper';

export type CustomTextType =
  | MD3TypescaleKey
  | 'baseFont'
  | 'headerLarge'
  | 'headerBlackLarge'
  | 'headerMedium'
  | 'headerSmall'
  | 'body'
  | 'bodyBold'
  | 'bodySmall'
  | 'regularText'
  | 'regularTextMedium'
  | 'regularTextSmall'
  | 'displayMedium'
  | 'displaySmall'
  | 'labelTextMedium'
  | 'labelTextSmall';

export type CustomButtonModes =
  | 'text'
  | 'outlined'
  | 'contained'
  | 'elevated'
  | 'contained-tonal';
export type ButtonVariantType = 'primary' | 'secondary' | 'secondaryDisabled';
export type ToastTypes = 'success' | 'error' | 'info' | 'close';
export type TextInputTypes = 'primary' | 'secondary';
export type LoginError =
  | 'credentialError'
  | 'emailError'
  | 'passwordError'
  | '';
export type IconTypes = 'password' | 'close' | 'magnify';
export type DayTimeValues = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Login: undefined;
  SignUp: undefined;
  BottomNavigator: undefined;
  AddWellnessPartner: undefined;
  AddMedicineDetails: undefined;
  WellnessPartnerHome: {wellnessPartner: WellnessPartnerProps};
  WellnessPartnerList: undefined;
  MedicineDetailsHome: {wellnessPartnerId: string};
};
