import { Dimensions } from 'react-native';

export const COLORS = {
  primary: {
    main: '#2C3E50',
    light: '#34495E',
    dark: '#1A252F',
    contrast: '#FFFFFF'
  },
  secondary: {
    main: '#3498DB',
    light: '#5DADE2',
    dark: '#2874A6',
    contrast: '#FFFFFF'
  },
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    dark: '#ECF0F1'
  },
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    light: '#BDC3C7',
    disabled: '#95A5A6'
  },
  action: {
    active: '#2C3E50',
    hover: '#34495E',
    selected: '#ECF0F1',
    disabled: '#BDC3C7'
  },
  error: {
    main: '#E74C3C',
    light: '#F1948A',
    dark: '#B03A2E'
  },
  success: {
    main: '#2ECC71',
    light: '#82E0AA',
    dark: '#229954'
  },
  border: '#E2E8F0'
};

export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  }
};

export const SIZES = {
  base: 8,
  small: 12,
  medium: 16,
  large: 24,
  extraLarge: 32,
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 30,
    xxl: 40,
    round: 50
  }
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  medium: {
    shadowColor: COLORS.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  dark: {
    shadowColor: COLORS.text.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6
  }
};

export const LAYOUT = {
  window: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  isSmallDevice: Dimensions.get('window').width < 375,
  card: {
    width: (Dimensions.get('window').width - (SIZES.padding.md * 3)) / 2
  }
};