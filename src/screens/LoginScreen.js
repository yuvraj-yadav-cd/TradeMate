import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import LoginForm from '../components/forms/LoginForm';
import { supabase } from '../lib/supabase'; // adjust path if needed
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      // Supabase Auth login
      const { error, data } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      // Optionally, fetch user profile
      // const { data: profile, error: profileError } = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', data.user.id)
      //   .single();
      // if (profileError) throw profileError;

      navigation.replace('TabNavigator');
    } catch (error) {
      Alert.alert(
        'Login Error',
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/login.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          'rgba(44,62,80,0.85)',
          'rgba(52,152,219,0.4)',
          'rgba(0,0,0,0.1)'
        ]}
        style={styles.gradientOverlay}
      />
      <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.headerContent}>
          <Text style={styles.appName}>TradeMate.</Text>
          <Text style={styles.welcomeText}>Welcome Back !</Text>
          <Text style={styles.subtitleText}>
            Your marketplace awaits you
          </Text>
        </View>
        <KeyboardAvoidingView
          style={styles.formSection}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.formScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ width: '100%', flexGrow: 1 }}
          >
            <View style={styles.formContainer}>
              <LoginForm
                onSubmit={handleLogin}
                navigation={navigation}
                loading={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    flex: 1,
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: Platform.OS === 'web' ? '50vh' : height * 0.5,
    zIndex: 1,
    borderBottomLeftRadius: SIZES.radius.xxl,
    borderBottomRightRadius: SIZES.radius.xxl,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 2,
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
    justifyContent: 'flex-end',
  },
  headerContent: {
    minHeight: height * 0.28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxxl,
    color: COLORS.background.paper,
    marginBottom: SIZES.padding.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  welcomeText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxl,
    color: COLORS.background.paper,
    marginBottom: SIZES.padding.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  subtitleText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.background.paper,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  formSection: {
    width: '100%',
    backgroundColor: COLORS.background.paper,
    borderTopLeftRadius: SIZES.radius.xxl,
    borderTopRightRadius: SIZES.radius.xxl,
    ...SHADOWS.medium,
    // Responsive: only hide overflow on native, not web
    overflow: Platform.OS === 'web' ? 'visible' : 'hidden',
    minHeight: height*0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
    //flexGrow: 1,
  },
  formScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 0, // important for web
    width: '100%',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding.lg,
  },
});

export default LoginScreen;