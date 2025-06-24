import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../theme';
import Input from '../common/Input';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../lib/supabase';

const SignupForm = ({ navigation, loading, setLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    } else if (!/^[a-zA-Z0-9._%+-]+@silicon\.ac\.in$/.test(formData.email)) {
      newErrors.email = 'Email must be a @silicon.ac.in address';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        // Supabase Auth signup
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;

        // Store user profile in Supabase table (e.g., "profiles")
        const { user } = data;
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              created_at: new Date(),
            },
          ]);
        if (profileError) throw profileError;

        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } catch (error) {
        Alert.alert('Signup Error', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <View style={styles.signupForm}>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="person" size={20} color={COLORS.primary.main} style={styles.inputIcon} />
        <Input
          label="First Name"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
          error={errors.firstName}
          required
          style={styles.input}
        />
      </View>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="person-outline" size={20} color={COLORS.primary.main} style={styles.inputIcon} />
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
          error={errors.lastName}
          required
          style={styles.input}
        />
      </View>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={20} color={COLORS.primary.main} style={styles.inputIcon} />
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
        <MaterialIcons name="lock" size={20} color={COLORS.primary.main} style={styles.inputIcon} />
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
      <TouchableOpacity
        style={[
          styles.signupButton,
          loading && styles.buttonDisabled
        ]}
        onPress={handleSubmit}
        activeOpacity={0.85}
        disabled={loading}
      >
        <Text style={styles.signupButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <View style={styles.formFooter}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signupForm: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    paddingVertical: SIZES.padding.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding.sm,
  },
  inputIcon: {
    marginRight: SIZES.padding.sm,
    marginTop: SIZES.padding.sm,
  },
  input: {
    flex: 1,
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.main,
    borderRadius: SIZES.radius.lg,
    height: 65,
    marginTop: SIZES.padding.sm,
    marginBottom: SIZES.padding.sm,
    shadowColor: COLORS.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  signupButtonText: {
    color: '#fff',
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
    letterSpacing: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: COLORS.action.disabled,
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding.sm,
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
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
});

export default SignupForm;