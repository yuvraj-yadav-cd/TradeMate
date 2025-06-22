import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme';

const ScreenHeader = ({ title, onBack, subtitle }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <MaterialIcons name="arrow-back" size={24} color={COLORS.primary.main} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.lg,
    backgroundColor: COLORS.background.paper,
    ...SHADOWS.light,
  },
  backButton: {
    padding: SIZES.padding.sm,
    borderRadius: SIZES.radius.round,
    backgroundColor: COLORS.background.default,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SIZES.padding.md,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text.primary,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    marginTop: SIZES.padding.xs,
  },
  placeholder: {
    width: 40, // Same width as back button for alignment
  },
});

export default ScreenHeader;