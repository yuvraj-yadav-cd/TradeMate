import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { COLORS, FONTS, SIZES, SHADOWS, LAYOUT } from '../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScreenHeader from '../components/common/ScreenHeader';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background.paper} barStyle="dark-content" />
      
      <ScreenHeader
        title="Product Details"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>
            ₹{product.price.toLocaleString('en-IN')}
          </Text>
          
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>
              {product.rating?.rate || 0} ({product.rating?.count || 0} reviews)
            </Text>
          </View>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: LAYOUT.window.width,
    height: LAYOUT.window.width,
    backgroundColor: COLORS.background.paper,
    ...SHADOWS.light,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: COLORS.background.paper,
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
    marginTop: -SIZES.radius.xl,
    padding: SIZES.padding.lg,
    ...SHADOWS.medium,
  },
  category: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary.main,
    textTransform: 'uppercase',
    marginBottom: SIZES.padding.xs,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding.sm,
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary.main,
    marginBottom: SIZES.padding.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.dark,
    padding: SIZES.padding.md,
    borderRadius: SIZES.radius.md,
    marginBottom: SIZES.padding.lg,
  },
  ratingText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    marginLeft: SIZES.padding.xs,
  },
  descriptionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding.sm,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
    lineHeight: SIZES.padding.xl,
  },
});

export default ProductDetailScreen;