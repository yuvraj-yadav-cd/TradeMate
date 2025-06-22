import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SIZES } from '../theme';
import { supabase } from '../lib/supabase';

const AddProductScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadImage(result.assets[0].uri);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (uri) => {
    try {
      setImageUploading(true);

      // Get file extension or default to jpg
      let fileExt = uri.split('.').pop();
      if (!fileExt || fileExt.length > 5) fileExt = 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      let uploadUri = uri;
      // Handle Android content URIs
      if (Platform.OS === 'android' && uri.startsWith('content://')) {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        uploadUri = fileInfo.uri;
      }

      // Fetch the image as a blob
      const response = await fetch(uploadUri);
      const blob = await response.blob();

      const contentType = blob.type || `image/${fileExt}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, blob, { contentType, upsert: true });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData, error: urlError } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      setImageUrl(publicUrlData.publicUrl);
    } catch (e) {
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
      }
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
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <MaterialIcons name="add-circle-outline" size={64} color={COLORS.primary.main} />
        <Text style={styles.title}>Add a New Product</Text>
        <Text style={styles.subtitle}>Fill in the details below to list your product.</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUploading ? (
            <ActivityIndicator color={COLORS.primary.main} />
          ) : imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Pick an Image</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Product Title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          placeholderTextColor="#aaa"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Price (₹)"
          placeholderTextColor="#aaa"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor="#aaa"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddProduct} disabled={loading || imageUploading}>
          <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Product'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.background.default,
    paddingVertical: SIZES.padding.lg,
  },
  container: {
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: COLORS.background.paper,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.padding.lg,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 3 },
    }),
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.primary.main,
    marginTop: SIZES.padding.md,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
    marginVertical: SIZES.padding.sm,
    textAlign: 'center',
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: COLORS.background.default,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.padding.md,
    overflow: 'hidden',
  },
  imagePickerText: {
    color: COLORS.text.secondary,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.sm,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.background.default,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.md,
    marginVertical: SIZES.padding.xs,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: SIZES.padding.xl,
    paddingVertical: SIZES.padding.md,
    borderRadius: SIZES.radius.lg,
    marginTop: SIZES.padding.lg,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.primary.contrast,
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
  },
});

export default AddProductScreen;