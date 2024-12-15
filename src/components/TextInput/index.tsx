import React, {useEffect, useRef, useState} from 'react';
import {
  Text as ErrorText,
  Keyboard,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import {TextInput as NativePaperTextInput} from 'react-native-paper';

import {useAppTheme} from '@/assets/theme';
import {CustomTextType, IconTypes, TextInputTypes} from '@/types/common';
import Text from '../Text';
import useStyles from './styles';

type TextInputProps = {
  label?: string;
  onChangeText: (text: string) => void;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  value: string;
  placeHolder?: string;
  errors?: string;
  disabled?: boolean;
  accessibilityHint?: string;
  accessibilityLabel?: string;
  type?: TextInputTypes;
  iconType?: IconTypes;
  left?: string;
  onIconPress?: () => void;
  validate?: (value: string) => string | null; // Validation function
};

export default function TextInput({
  label,
  onChangeText,
  placeholderTextColor,
  secureTextEntry,
  value,
  placeHolder,
  errors,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  type,
  iconType,
  left,
  onIconPress,
  validate,
}: TextInputProps) {
  const {colors} = useAppTheme();
  const styles = useStyles();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errors || null,
  );

  const togglePasswordVisibility = () => setPasswordVisible(!isPasswordVisible);

  const getIcon = (iconType: string) => {
    if (iconType === 'password') {
      return (
        <NativePaperTextInput.Icon
          style={styles.icon}
          icon={isPasswordVisible ? 'eye-off' : 'eye'}
          onPress={togglePasswordVisibility}
        />
      );
    }
    return (
      <NativePaperTextInput.Icon
        icon={iconType}
        onPress={onIconPress}
        style={styles.icon}
      />
    );
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (validate) {
      const validationError = validate(value);
      setErrorMessage(validationError);
    }
  };

  let inputStyle = {backgroundColor: colors[`${type ?? 'primary'}Input`]};
  if (disabled) {
    inputStyle = {backgroundColor: colors.disabled};
  }
  if (errorMessage) {
    inputStyle = {backgroundColor: colors.error};
  }

  const ref = useRef<RNTextInput>(null);

  useEffect(() => {
    const showHideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
      ref.current?.blur();
    });
    return () => {
      showHideKeyboard.remove();
    };
  }, []);

  const getLabel = () => {
    if (!label) {
      return undefined;
    }
    const isSecondary = isFocused || value;
    const labelProps = {
      title: label,
      color: isSecondary ? 'secondaryButton' : 'primaryInputLabel',
      variant: isSecondary ? ('bodySmall' as CustomTextType) : undefined,
    };
    return <Text {...labelProps} />;
  };

  const handleChangeText = (text: string) => {
    if (errorMessage) {
      setErrorMessage(null);
    }
    onChangeText(text);
  };

  return (
    <>
      <NativePaperTextInput
        label={getLabel()}
        ref={ref}
        onChangeText={handleChangeText}
        placeholderTextColor={placeholderTextColor}
        right={iconType && value ? getIcon(iconType) : null}
        left={left ? getIcon(left) : null}
        textColor={colors.text}
        contentStyle={styles.content}
        underlineColor={colors.transparent}
        style={[styles.textInput, inputStyle]}
        activeUnderlineColor={colors.transparent}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={!isPasswordVisible && secureTextEntry}
        value={value}
        cursorColor={colors.text}
        selectionColor={colors.text}
        placeholder={placeHolder}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        autoCorrect={false}
      />
      {errorMessage ? (
        <View
          style={{padding: 10, backgroundColor: '#ffe6e6', borderRadius: 5}}>
          <ErrorText style={{color: 'red', fontSize: 14}}>
            {errorMessage}
          </ErrorText>
        </View>
      ) : null}
    </>
  );
}
