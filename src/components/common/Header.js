import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme';

const Header = ({ title, subtitle, showLogo = true }) => {
  return (
    <View style={styles.headerContainer}>
      {showLogo && (
        <Text style={styles.logo}>TradeMate</Text>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding.xl,
  },
  logo: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxxl,
    color: COLORS.primary.main,
    marginBottom: SIZES.padding.sm,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.xxl,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: FONTS.sizes.lg * 1.5,
    paddingHorizontal: SIZES.padding.lg,
    maxWidth: 300,
  },
});

export default Header;