import React from 'react';
import {Button} from 'react-native-paper';

import {useAppTheme} from '@/assets/theme';
import {ButtonVariantType, CustomButtonModes} from '@/types/common';
import Text from '../Text';
import useStyles from './styles';

type DisabledT = 'primaryDisabled' | 'secondaryDisabled';
type ButtonProps = {
  title: string;
  variant: ButtonVariantType;
  onPress?: () => void;
  disabled?: boolean;
  buttonColor?: string;
  mode?: CustomButtonModes;
  accessibilityLabel: string;
  disabledType?: DisabledT;
  accessibilityHint: string;
};

export default function CustomButton({
  title,
  onPress,
  disabled,
  variant,
  buttonColor,
  mode,
  accessibilityLabel,
  disabledType,
  accessibilityHint,
}: ButtonProps) {
  const {colors} = useAppTheme();
  const styles = useStyles();
  let textColor = `${variant}Button`;
  if (disabled && disabledType) {
    textColor = `${disabledType}Button`;
  }
  return (
    <Button
      style={[
        {...styles.button},
        disabled && disabledType
          ? {backgroundColor: colors[`${disabledType}Button`]}
          : null,
      ]}
      mode={mode ?? 'contained'}
      buttonColor={buttonColor ?? colors[`${variant}Button`]}
      disabled={disabled ?? false}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}>
      <Text color={textColor} title={title} />
    </Button>
  );
}
