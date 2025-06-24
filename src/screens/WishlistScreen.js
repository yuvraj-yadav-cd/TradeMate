import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,Platform
} from 'react-native';
import { useWishlist } from '../contexts/WishlistContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import ScreenHeader from '../components/common/ScreenHeader';

const WishlistScreen = ({ navigation }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const renderItem = ({ item }) => (
    <View style={styles.wishlistItem}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromWishlist(item.id)}
          >
            <MaterialIcons name="close" size={24} color="#666666" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>
          ₹{item.price.toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background.paper} barStyle="dark-content" />

      <ScreenHeader
        title="My Wishlist"
        subtitle={`${wishlistItems.length} ${wishlistItems.length === 1 ? 'item' : 'items'}`}
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="favorite-border" size={64} color="#cccccc" />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('Home')}//
            >
              <Text style={styles.browseButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.padding.lg,
    left: SIZES.padding.md,
    zIndex: 1,
    padding: SIZES.padding.sm,
    backgroundColor: COLORS.background.paper,
    borderRadius: SIZES.radius.round,
    ...SHADOWS.light,
  },
  screenTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginTop: SIZES.padding.xl,
    marginBottom: SIZES.padding.xs,
  },
  header: {
    padding: SIZES.padding.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background.paper,
    ...SHADOWS.light,
  },
  itemCount: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
  },
  listContainer: {
    padding: SIZES.padding.md,
    paddingBottom: SIZES.padding.xl,
  },
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.paper,
    borderRadius: SIZES.radius.lg,
    marginBottom: SIZES.padding.md,
    padding: SIZES.padding.md,
    ...SHADOWS.medium,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius.md,
    backgroundColor: COLORS.background.dark,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SIZES.padding.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
    flex: 1,
    marginRight: SIZES.padding.sm,
  },
  productCategory: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary.main,
    textTransform: 'uppercase',
    marginVertical: SIZES.padding.xs,
  },
  productPrice: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text.primary,
    marginVertical: SIZES.padding.sm,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding.md,
    borderRadius: SIZES.radius.round,
    marginTop: SIZES.padding.sm,
    gap: SIZES.padding.sm,
  },
  buttonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary.contrast,
  },
  removeButton: {
    padding: SIZES.padding.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding.xl * 2,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
    marginTop: SIZES.padding.md,
    marginBottom: SIZES.padding.lg,
  },
  browseButton: {
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: SIZES.padding.lg,
    paddingVertical: SIZES.padding.md,
    borderRadius: SIZES.radius.round,
  },
  browseButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
    color: COLORS.primary.contrast,
  },
});

export default WishlistScreen;