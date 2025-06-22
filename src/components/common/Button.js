import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme';

const Button = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  fullWidth = false,
  loading = false,
  style,
  textStyle 
}) => {
  const buttonStyle = [
    styles.btn,
    styles[`btn${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    fullWidth && styles.btnFullWidth,
    disabled && styles.btnDisabled,
    style,
  ];

  const buttonTextStyle = [
    styles.btnText,
    styles[`btnText${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    textStyle
  ];

  return (
    <TouchableOpacity 
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? COLORS.primary.contrast : COLORS.primary.main} 
        />
      ) : (
        <Text style={buttonTextStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: SIZES.padding.md,
    paddingHorizontal: SIZES.padding.lg,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary.main,
  },
  btnSecondary: {
    backgroundColor: COLORS.background.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary.main,
  },
  btnFullWidth: {
    width: '100%',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
  },
  btnTextPrimary: {
    color: COLORS.primary.contrast,
  },
  btnTextSecondary: {
    color: COLORS.text.primary,
  },
  btnTextOutline: {
    color: COLORS.primary.main,
  },
});

export default Button;