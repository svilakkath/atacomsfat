/* eslint-disable react-native/no-inline-styles */
import React, { ReactNode } from 'react';
import { customText } from 'react-native-paper';

import { useAppTheme } from '@/assets/theme';
import { CustomTextType } from '@/types/common';
import { formatText } from '@/utils/helper';
import useStyles from './styles';

type ColorKey = 'primary' | 'secondary' | 'tertiary'; // Add all possible keys
type TextColorKey = `${ColorKey}Text`;
type CustomTextProps = {
  title: string;
  variant?: CustomTextType;
  link?: boolean;
  color?: string;
  alignCenter?: boolean;
  letterSpacing?: number;
  flex?: boolean;
  lineHeight?: number;
  charLimit?: number;
  children?: ReactNode;
};

const Text = customText<CustomTextType>();

export default function CustomText({
  title,
  variant,
  link,
  color,
  alignCenter,
  letterSpacing,
  flex,
  lineHeight,
  charLimit,
  children,
}: CustomTextProps) {
  const { colors } = useAppTheme();
  const styles = useStyles();
  const getTextColor = (): string => {
    if (!color) {
      return '';
    }

    const key: TextColorKey = `${color}Text` as TextColorKey;
    return colors[key] || color;
  };

  return (
    <Text
      variant={variant ?? 'regularText'}
      numberOfLines={charLimit ? 1 : undefined}
      ellipsizeMode="tail"
      style={[
        link ? styles.link : null,
        color ? { color: getTextColor() } : null,
        alignCenter ? { textAlign: 'center' } : null,
        letterSpacing ? { letterSpacing: letterSpacing } : null,
        flex ? { flex: 1 } : null,
        lineHeight ? { lineHeight: lineHeight } : null,
      ]}
    >
      {formatText(title, charLimit)}
      {children}
    </Text>
  );
}
