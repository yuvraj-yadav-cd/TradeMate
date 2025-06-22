import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../theme';
import Input from '../common/Input';
import Button from '../common/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const LoginForm = ({ onSubmit, navigation, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <View style={styles.loginForm}>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={22} color={COLORS.primary.main} style={styles.inputIcon} />
        <Input
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          error={errors.email}
          required
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          style={styles.input}
        />
      </View>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock" size={22} color={COLORS.primary.main} style={styles.inputIcon} />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          error={errors.password}
          required
          secureTextEntry
          autoComplete="password"
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <Button onPress={handleSubmit} fullWidth disabled={loading}
        style={loading ? styles.buttonDisabled : null}>
        Log In
      </Button>
      <View style={styles.formFooter}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginForm: {
    width: '100%',
    maxWidth: 400,
    minWidth: 260,
    alignSelf: 'center',
    paddingHorizontal: width < 350 ? 0 : SIZES.padding.sm,
    paddingVertical: Platform.OS === 'web' ? SIZES.padding.lg : 0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding.md,
  },
  inputIcon: {
    marginRight: SIZES.padding.sm,
    marginTop: SIZES.padding.md,
  },
  input: {
    flex: 1,
    minWidth: 0,
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: COLORS.action.disabled,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.padding.md,
    marginTop: -SIZES.padding.sm,
  },
  forgotPasswordText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary.main,
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding.lg,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  footerLink: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary.main,
  },
});

export default LoginForm;