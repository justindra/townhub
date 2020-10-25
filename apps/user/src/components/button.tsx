import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, Button as RnpButton } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon';

const useButtonStyle = () => {
  const theme = useTheme();
  return StyleSheet.create({
    button: {
      maxWidth: theme.spacing(8),
      borderRadius: 50,
    },
  });
};

/**
 * Update the button component to always have fully rounded ends
 */
export const Button: React.FC<{
  mode?: 'outlined' | 'contained' | 'text';
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
  color?: string;
  icon?: IconSource;
  onPress?: () => void;
}> = ({ children, style, ...props }) => {
  let buttonStyles: ViewStyle = useButtonStyle().button;
  if (style) {
    buttonStyles = StyleSheet.compose<ViewStyle>(
      buttonStyles,
      style
    ) as ViewStyle;
  }

  return (
    <RnpButton compact uppercase={false} style={buttonStyles} {...props}>
      {children}
    </RnpButton>
  );
};
