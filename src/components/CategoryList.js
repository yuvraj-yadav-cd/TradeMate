import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// Real-life product images for each category
const categories = [
  {
    name: 'All',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80', // A collage or neutral product image
  },
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80', // Smartphone
  },
  {
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80', // Stack of books
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80', // Clothes on hangers
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80', // Sports shoes
  },
  {
    name: 'Furniture',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=200&q=80', // Sofa
  },
  {
    name: 'Others',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80', // Miscellaneous
  },
];

const numColumns = 3;
const itemWidth = (width - SIZES.padding.md * 2 - SIZES.padding.md * (numColumns - 1)) / numColumns;

const CategoryList = ({ selectedCategory, onSelectCategory }) => (
  <View style={styles.container}>
    <FlatList
      data={categories}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.name}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const isActive = selectedCategory === item.name;
        return (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              isActive && styles.categoryItemActive,
              { width: itemWidth }
            ]}
            onPress={() => onSelectCategory(item.name)}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.imageWrapper,
                isActive && styles.imageWrapperActive,
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.categoryImage} />
            </View>
            <Text
              style={[
                styles.categoryText,
                isActive && styles.categoryTextActive,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.padding.md,
    paddingHorizontal: SIZES.padding.md,
  },
  listContent: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingBottom: SIZES.padding.md,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.paper,
    borderRadius: SIZES.radius.xl,
    marginBottom: SIZES.padding.md,
    marginRight: SIZES.padding.md,
    paddingVertical: SIZES.padding.md,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 120,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary.main,
    borderColor: COLORS.primary.main,
    shadowColor: COLORS.primary.main,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrapper: {
    backgroundColor: COLORS.background.default,
    borderRadius: 35,
    padding: 6,
    marginBottom: SIZES.padding.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    overflow: 'hidden',
  },
  imageWrapperActive: {
    backgroundColor: '#fff',
    borderColor: COLORS.primary.main,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  categoryText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 70,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryList;