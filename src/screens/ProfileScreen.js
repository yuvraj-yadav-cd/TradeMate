import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Add this import
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useWishlist } from '../contexts/WishlistContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Ellipse, Circle, Rect } from 'react-native-svg';
import { supabase } from '../lib/supabase';

// Add animated avatar URLs (you can use any animated avatar provider or GIFs)
const ANIMATED_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/png?seed=avatar1',
  'https://api.dicebear.com/7.x/bottts/png?seed=avatar2',
  'https://api.dicebear.com/7.x/bottts/png?seed=avatar3',
  'https://api.dicebear.com/7.x/bottts/png?seed=avatar4',
  'https://api.dicebear.com/7.x/bottts/png?seed=avatar5',
  'https://api.dicebear.com/7.x/bottts/png?seed=avatar6',
];

const ProfileScreen = ({ navigation }) => {
  const { wishlistItems } = useWishlist();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myProducts, setMyProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [selectAvatarVisible, setSelectAvatarVisible] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(null);

  // Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Logout Error', error.message || 'Failed to logout');
    }
  };

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (!error) setProfile(data);

        // Fetch user's products
        setProductsLoading(true);
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        if (!productsError) setMyProducts(productsData || []);
        setProductsLoading(false);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Load avatar from AsyncStorage on mount
  useEffect(() => {
    const loadAvatar = async () => {
      const storedAvatar = await AsyncStorage.getItem('profile_avatar');
      if (storedAvatar) setLocalAvatar(storedAvatar);
    };
    loadAvatar();
  }, []);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </View>
    </View>
  );

  // Settings menu option component
  const MenuOption = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.menuOptionContainer} onPress={onPress} activeOpacity={0.7}>
      <MaterialIcons name={icon} size={24} color={COLORS.primary.main} style={{ marginRight: 16 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  // Function to update avatar from avatar picker and store in AsyncStorage
  const handleAvatarSelect = async (avatarUrl) => {
    setSelectAvatarVisible(false);
    setLoading(true);
    try {
      await AsyncStorage.setItem('profile_avatar', avatarUrl);
      setLocalAvatar(avatarUrl);
      Alert.alert('Success', 'Profile photo updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile photo');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary.main} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Profile not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      {/* Decorative SVG background */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
          <Defs>
            <SvgLinearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={COLORS.primary.light} stopOpacity="0.32" />
              <Stop offset="1" stopColor={COLORS.primary.main} stopOpacity="0.18" />
            </SvgLinearGradient>
          </Defs>
          <Ellipse
            cx="18%"
            cy="-6%"
            rx="48%"
            ry="22%"
            fill="url(#grad1)"
          />
          <Ellipse
            cx="92%"
            cy="104%"
            rx="42%"
            ry="18%"
            fill="url(#grad1)"
          />
          <Circle
            cx="85%"
            cy="12%"
            r="32"
            fill={COLORS.primary.light}
            opacity={0.14}
          />
          <Circle
            cx="10%"
            cy="85%"
            r="22"
            fill={COLORS.primary.main}
            opacity={0.12}
          />
          <Rect
            x="0"
            y="60%"
            width="100%"
            height="40%"
            fill={COLORS.secondary ? COLORS.secondary.main : "#FFD700"}
            opacity="0.08"
          />
        </Svg>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={() => setSelectAvatarVisible(true)}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: localAvatar || profile?.avatar
                }}
                style={styles.avatar}
              />
              <View style={styles.editIconContainer}>
                <MaterialIcons name="camera-alt" size={20} color="#ffffff" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.first_name} {profile?.last_name}</Text>
            <Text style={styles.memberSince}>{profile?.email}</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>First Name</Text>
            <Text style={styles.fieldValue}>{profile?.first_name}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Last Name</Text>
            <Text style={styles.fieldValue}>{profile?.last_name}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{profile?.email}</Text>
          </View>
        </View>

        {/* My Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Items</Text>
          {productsLoading ? (
            <ActivityIndicator color={COLORS.primary.main} />
          ) : myProducts.length === 0 ? (
            <Text style={styles.emptyText}>No products listed yet.</Text>
          ) : (
            <FlatList
              data={myProducts}
              keyExtractor={item => item.id}
              renderItem={renderProduct}
              scrollEnabled={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <MenuOption
            icon="notifications"
            title="Notifications"
            subtitle="Manage notifications"
          />
          <MenuOption
            icon="info"
            title="About Us"
            subtitle="App info and owner"
            onPress={() => setAboutVisible(true)}
          />
          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <MaterialIcons name="logout" size={24} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Animated Avatar Picker Modal */}
      {selectAvatarVisible && (
        <View style={styles.avatarOverlay}>
          <View style={styles.avatarModal}>
            <Text style={styles.avatarModalTitle}>Choose an Animated Avatar</Text>
            <View style={styles.avatarOptionsRow}>
              {ANIMATED_AVATARS.map((url, idx) => (
                <TouchableOpacity key={idx} onPress={() => handleAvatarSelect(url)}>
                  <Image source={{ uri: url }} style={styles.avatarOptionImg} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.avatarCloseBtn} onPress={() => setSelectAvatarVisible(false)}>
              <Text style={styles.avatarCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* About Us Modal */}
      {aboutVisible && (
        <View style={styles.aboutOverlay}>
          <View style={styles.aboutModal}>
            <Text style={styles.aboutTitle}>About Us</Text>
            <Text style={styles.aboutText}>
              <Text style={{ fontWeight: 'bold' }}>App Name:</Text> TradeMate{'\n'}
              <Text style={{ fontWeight: 'bold' }}>Owner:</Text> Yuvraj Yadav{'\n'}
              <Text style={{ fontWeight: 'bold' }}>Version:</Text> 1.0.0{'\n'}
              <Text style={{ fontWeight: 'bold' }}>Contact:</Text> yyuvraj9668@gmail.com{'\n'}
              {'\n'}
              © 2025 TradeMate. All rights reserved.
            </Text>
            <TouchableOpacity style={styles.aboutCloseBtn} onPress={() => setAboutVisible(false)}>
              <Text style={styles.aboutCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    backgroundColor: COLORS.background.paper,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  profileCard: {
    backgroundColor: COLORS.background.paper,
    margin: SIZES.padding.lg,
    padding: SIZES.padding.lg,
    borderRadius: SIZES.radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
    marginBottom: SIZES.padding.lg,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: SIZES.padding.lg,
    borderRadius: 50,
    backgroundColor: COLORS.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: COLORS.primary.main,
    backgroundColor: COLORS.background.default,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  memberSince: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  section: {
    backgroundColor: COLORS.background.paper,
    marginHorizontal: SIZES.padding.lg,
    marginBottom: SIZES.padding.lg,
    padding: SIZES.padding.lg,
    borderRadius: SIZES.radius.lg,
    ...SHADOWS.medium,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding.sm,
  },
  fieldContainer: {
    marginBottom: SIZES.padding.md,
  },
  fieldLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SIZES.padding.xs,
  },
  fieldValue: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.default,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.sm,
    marginBottom: SIZES.padding.sm,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.padding.md,
    backgroundColor: COLORS.primary.light,
  },
  productTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  productPrice: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary.main,
  },
  statsContainer: {
    backgroundColor: COLORS.background.paper,
    marginHorizontal: SIZES.padding.lg,
    marginBottom: SIZES.padding.lg,
    padding: SIZES.padding.md,
    borderRadius: SIZES.radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...SHADOWS.medium,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.primary.main,
    marginBottom: SIZES.padding.xs,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.padding.md / 2,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.text.secondary, fontSize: FONTS.sizes.md, marginTop: 12 },
  menuOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
  },
  menuSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  aboutOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  aboutModal: {
    width: '80%',
    backgroundColor: COLORS.background.paper,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.padding.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  aboutTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary.main,
    marginBottom: SIZES.padding.md,
  },
  aboutText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SIZES.padding.lg,
  },
  aboutCloseBtn: {
    backgroundColor: COLORS.primary.main,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.padding.lg,
    paddingVertical: SIZES.padding.sm,
  },
  aboutCloseText: {
    color: '#fff',
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error ? COLORS.error.main : '#e74c3c',
    borderRadius: SIZES.radius.md,
    paddingVertical: SIZES.padding.md,
    paddingHorizontal: SIZES.padding.lg,
    marginTop: SIZES.padding.md,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
  },
  editIconContainer: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: COLORS.primary.main,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background.paper,
    shadowColor: COLORS.primary.main,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 101,
  },
  avatarModal: {
    width: '85%',
    backgroundColor: COLORS.background.paper,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.padding.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  avatarModalTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary.main,
    marginBottom: SIZES.padding.md,
  },
  avatarOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SIZES.padding.lg,
    gap: 12,
  },
  avatarOptionImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    margin: 8,
    borderWidth: 2,
    borderColor: COLORS.primary.main,
    backgroundColor: '#fff',
  },
  avatarCloseBtn: {
    backgroundColor: COLORS.primary.main,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.padding.lg,
    paddingVertical: SIZES.padding.sm,
  },
  avatarCloseText: {
    color: '#fff',
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
  },
});

export default ProfileScreen;