import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme';

const Input = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  error,
  required = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete = 'off',
  style,
  ...props 
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && (
        <Text style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.requiredAsterisk}>*</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.inputField, 
          error && styles.inputError
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        placeholderTextColor={COLORS.text.disabled}
        blurOnSubmit={false}
        returnKeyType="next"
        enablesReturnKeyAutomatically={true}
        {...props}
      />
      {error && <Text style={styles.errorMessage}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: SIZES.padding.md,
    width: '100%',
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding.xs,
  },
  requiredAsterisk: {
    color: COLORS.error.main,
    marginLeft: SIZES.padding.xs,
  },
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.sm,
    fontSize: FONTS.sizes.md,
    backgroundColor: COLORS.background.paper,
    color: COLORS.text.primary,
    fontFamily: FONTS.regular,
    ...SHADOWS.light,
  },
  inputError: {
    borderColor: COLORS.error.main,
    backgroundColor: COLORS.error.light + '10', // 10% opacity
  },
  errorMessage: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.xs,
    color: COLORS.error.main,
    marginTop: SIZES.padding.xs,
  },
});

export default Input;