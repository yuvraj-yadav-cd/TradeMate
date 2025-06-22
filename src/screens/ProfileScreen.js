import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../contexts/UserContext';
import { useWishlist } from '../contexts/WishlistContext';
import { COLORS, FONTS, SIZES, SHADOWS, LAYOUT } from '../theme';

const ProfileScreen = ({ navigation }) => {
  const { userData, saveUserData } = useUser();
  const { wishlistItems } = useWishlist(); // Add this line
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const handleEdit = () => {
    setEditedData(userData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const success = await saveUserData(editedData);
    if (success) {
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access gallery is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        
        if (isEditing) {
          setEditedData({
            ...editedData,
            avatar: newImageUri
          });
        } else {
          const success = await saveUserData({
            ...userData,
            avatar: newImageUri
          });
          
          if (success) {
            Alert.alert('Success', 'Profile photo updated successfully');
          } else {
            Alert.alert('Error', 'Failed to update profile photo');
          }
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const EditableField = ({ label, value, field }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={editedData[field]}
          onChangeText={(text) => setEditedData({ ...editedData, [field]: text })}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  const MenuOption = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <MaterialIcons name={icon} size={24} color="purple" />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={handleEdit}>
            <MaterialIcons name="edit" size={24} color="purple" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ 
                  uri: isEditing ? 
                    editedData.avatar || userData?.avatar : 
                    userData?.avatar 
                }}
                style={styles.avatar}
              />
              <View style={styles.editIconContainer}>
                <MaterialIcons name="camera-alt" size={20} color="#ffffff" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.membershipBadge}>{userData?.membershipLevel} Member</Text>
            <Text style={styles.memberSince}>Since {userData?.memberSince}</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <EditableField label="Full Name" value={userData?.name} field="name" />
          <EditableField label="Email" value={userData?.email} field="email" />
          <EditableField label="Phone" value={userData?.phone} field="phone" />
          <EditableField label="Address" value={userData?.address} field="address" />
          <EditableField label="City" value={userData?.city} field="city" />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuOption 
            icon="shopping-bag" 
            title="My Orders" 
            subtitle="View order history"
          />
          <MenuOption 
            icon="favorite" 
            title="Wishlist" 
            subtitle={`${wishlistItems?.length || 0} items saved`}
            onPress={() => navigation.navigate('Wishlist')}
          />
          <MenuOption 
            icon="location-on" 
            title="Addresses" 
            subtitle="Shipping addresses"
          />
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
            icon="lock" 
            title="Privacy" 
            subtitle="Security settings"
          />
          <MenuOption 
            icon="help" 
            title="Help & Support" 
            subtitle="FAQs and support"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.paper,
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
    backgroundColor: COLORS.background.default,
  },
  profileCard: {
    backgroundColor: COLORS.background.paper,
    margin: SIZES.padding.md,
    padding: SIZES.padding.lg,
    borderRadius: SIZES.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  avatarContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    marginRight: SIZES.padding.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIconContainer: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: COLORS.primary.main,
    width: 32,
    height: 32,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background.paper,
  },
  profileInfo: {
    flex: 1,
  },
  membershipBadge: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary.main,
    marginBottom: SIZES.padding.xs,
  },
  memberSince: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.secondary,
  },
  statsContainer: {
    backgroundColor: COLORS.background.paper,
    marginHorizontal: SIZES.padding.md,
    marginBottom: SIZES.padding.md,
    padding: SIZES.padding.md,
    borderRadius: SIZES.radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...SHADOWS.medium,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.primary.main,
    marginBottom: SIZES.padding.xs,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.xs,
    color: COLORS.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  section: {
    backgroundColor: COLORS.background.paper,
    marginHorizontal: SIZES.padding.md,
    marginBottom: SIZES.padding.md,
    padding: SIZES.padding.md,
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
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.sm,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background.paper,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding.md,
  },
  menuTextContainer: {
    flex: 1,
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.sm,
    borderRadius: SIZES.radius.round,
  },
  saveButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary.contrast,
  },
});

export default ProfileScreen;