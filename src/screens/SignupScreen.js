import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import SignupForm from '../components/forms/SignupForm';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        navigation.replace('TabNavigator');
      }
    };
    checkAuth();
  }, []);

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
      <View style={styles.overlay}>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Create Account</Text>
          <Text style={styles.subtitleText}>
            Join TradeMate and start your shopping journey
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
              <SignupForm
                navigation={navigation}
                loading={loading}
                setLoading={setLoading}
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
    flex:1,
    justifyContent:'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 2,
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
  },
  headerContent: {
    minHeight: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: SIZES.padding.lg,
  },
  welcomeText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxl,
    color: COLORS.background.paper,
    marginBottom: SIZES.padding.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitleText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.background.paper,
    textAlign: 'center',
    maxWidth: 300,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  formSection: {
    width: '100%',
    flex:1,
    backgroundColor: COLORS.background.paper,
    borderTopLeftRadius: SIZES.radius.xxl,
    borderTopRightRadius: SIZES.radius.xxl,
    ...SHADOWS.medium,
    overflow: Platform.OS === 'web' ? 'visible' : 'hidden',
    maxHeight: height * 0.6, // or your preferred valueflex:1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
  },
  formScroll: {
    flexGrow: 1,
    minHeight: 0,
    width: '100%',
  },
  formContainer: {
    width: '90%',
    maxWidth: 340,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding.lg,
  },
});

export default SignupScreen;