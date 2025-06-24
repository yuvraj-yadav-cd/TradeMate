import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SIZES } from '../theme';
import { supabase } from '../lib/supabase';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Ellipse, Circle, Rect, Path } from 'react-native-svg';

const AddProductScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id);
    };
    getUser();
  }, []);

  // Pick image from device
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      uploadImageToCloudinary(result.assets[0].uri);
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (uri) => {
    try {
      setImageUploading(true);

      // Read the image as base64
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      // Prepare data for Cloudinary
      const data = {
        file: `data:image/jpeg;base64,${base64}`,
        upload_preset: 'unsigned_preset',
      };

      // Upload to Cloudinary
      const response = await fetch('https://api.cloudinary.com/v1_1/djvaxbxgu/image/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.secure_url) {
        throw new Error(result.error?.message || 'Failed to upload image to Cloudinary');
      }

      setImageUrl(result.secure_url);
    } catch (e) {
      console.error('Cloudinary Upload Error:', e);
      Alert.alert('Image Upload Error', e.message || 'Could not upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!title || !category || !price || !description || !imageUrl) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('products').insert([
      {
        title,
        category,
        price: Number(price),
        description,
        image: imageUrl,
        owner_id: currentUserId,
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Product added!');
      setTitle('');
      setCategory('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background.default }}>
      {/* Decorative SVG background for aesthetics */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
          <Defs>
            <SvgLinearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={COLORS.primary.light} stopOpacity="0.38" />
              <Stop offset="1" stopColor={COLORS.primary.main} stopOpacity="0.22" />
            </SvgLinearGradient>
            <SvgLinearGradient id="grad2" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor={COLORS.primary.main} stopOpacity="0.22" />
              <Stop offset="1" stopColor={COLORS.secondary ? COLORS.secondary.main : '#FFD700'} stopOpacity="0.18" />
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
            fill="url(#grad2)"
          />
          <Circle
            cx="85%"
            cy="12%"
            r="32"
            fill={COLORS.primary.light}
            opacity={0.18}
          />
          <Circle
            cx="10%"
            cy="85%"
            r="22"
            fill={COLORS.primary.main}
            opacity={0.16}
          />
          <Rect
            x="0"
            y="60%"
            width="100%"
            height="40%"
            fill={COLORS.secondary ? COLORS.secondary.main : "#FFD700"}
            opacity="0.10"
          />
        </Svg>
      </View>
      <StatusBar backgroundColor={COLORS.surface} barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.header}>Add New Product</Text>
            <Text style={styles.subHeader}>Fill in the details below to list your product.</Text>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
              {imageUploading ? (
                <ActivityIndicator color={COLORS.primary.main} />
              ) : imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePickerInner}>
                  <MaterialIcons name="add-a-photo" size={32} color={COLORS.primary.main} />
                  <Text style={styles.imagePickerText}>Add Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <MaterialIcons name="title" size={20} color={COLORS.primary.main} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Product Title"
                placeholderTextColor="#aaa"
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.inputGroup}>
              <MaterialIcons name="category" size={20} color={COLORS.primary.main} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Category"
                placeholderTextColor="#aaa"
                value={category}
                onChangeText={setCategory}
              />
            </View>
            <View style={styles.inputGroup}>
              <MaterialIcons name="attach-money" size={20} color={COLORS.primary.main} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Price (₹)"
                placeholderTextColor="#aaa"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { alignItems: 'flex-start' }]}>
              <MaterialIcons name="description" size={20} color={COLORS.primary.main} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, (loading || imageUploading) && { opacity: 0.7 }]}
              onPress={handleAddProduct}
              disabled={loading || imageUploading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.primary.contrast} />
              ) : (
                <Text style={styles.buttonText}>Add Product</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.background.default,
    paddingVertical: SIZES.padding.lg,
  },
  card: {
    alignItems: 'center',
    width: '92%',
    alignSelf: 'center',
    backgroundColor: COLORS.background.paper,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.padding.lg,
    marginVertical: SIZES.padding.lg,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 5 },
    }),
  },
  header: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.primary.main,
    marginTop: SIZES.padding.md,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  subHeader: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
    marginVertical: SIZES.padding.sm,
    textAlign: 'center',
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: COLORS.background.default,
    borderWidth: 1.5,
    borderColor: COLORS.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.padding.md,
    overflow: 'hidden',
    shadowColor: COLORS.primary.main,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  imagePickerInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    color: COLORS.primary.main,
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.sm,
    marginTop: 4,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.background.default,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: SIZES.padding.xs,
    paddingHorizontal: SIZES.padding.sm,
    paddingVertical: Platform.OS === 'ios' ? 14 : 0,
  },
  inputIcon: {
    marginRight: 8,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  button: {
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: SIZES.padding.xl,
    paddingVertical: SIZES.padding.lg,
    borderRadius: SIZES.radius.lg,
    marginTop: SIZES.padding.lg,
    alignItems: 'center',
    width: '100%',
    shadowColor: COLORS.primary.main,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: COLORS.primary.contrast,
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.5,
  },
});

export default AddProductScreen;