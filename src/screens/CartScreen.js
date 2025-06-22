import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SIZES, SHADOWS, LAYOUT } from '../theme';

const CartScreen = ({ navigation }) => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <MaterialIcons 
              name="remove" 
              size={20} 
              color={COLORS.primary.main} 
            />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <MaterialIcons 
              name="add" 
              size={20} 
              color={COLORS.primary.main} 
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => removeFromCart(item.id)}
        style={styles.removeButton}
      >
        <MaterialIcons 
          name="delete" 
          size={24} 
          color={COLORS.error.main} 
        />
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background.default,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SIZES.padding.md,
      backgroundColor: COLORS.background.paper,
      ...SHADOWS.light,
    },
    headerTitle: {
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.xl,
      color: COLORS.text.primary,
    },
    clearCart: {
      fontFamily: FONTS.medium,
      fontSize: FONTS.sizes.sm,
      color: COLORS.primary.main,
    },
    cartItem: {
      flexDirection: 'row',
      padding: SIZES.padding.md,
      backgroundColor: COLORS.background.paper,
      marginHorizontal: SIZES.padding.md,
      marginTop: SIZES.padding.sm,
      borderRadius: SIZES.radius.lg,
      ...SHADOWS.light,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: SIZES.radius.md,
      backgroundColor: COLORS.background.dark,
    },
    itemInfo: {
      flex: 1,
      marginLeft: SIZES.padding.md,
    },
    productTitle: {
      fontFamily: FONTS.semiBold,
      fontSize: FONTS.sizes.md,
      color: COLORS.text.primary,
      marginBottom: SIZES.padding.xs,
    },
    productPrice: {
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.lg,
      color: COLORS.primary.main,
      marginBottom: SIZES.padding.sm,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.background.dark,
      alignSelf: 'flex-start',
      borderRadius: SIZES.radius.round,
      padding: SIZES.padding.xs,
    },
    quantityButton: {
      backgroundColor: COLORS.background.paper,
      width: 32,
      height: 32,
      borderRadius: SIZES.radius.round,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.light,
    },
    quantity: {
      fontFamily: FONTS.semiBold,
      fontSize: FONTS.sizes.md,
      color: COLORS.text.primary,
      marginHorizontal: SIZES.padding.md,
    },
    removeButton: {
      padding: SIZES.padding.sm,
      alignSelf: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: SIZES.padding.xl * 2,
    },
    emptyText: {
      fontFamily: FONTS.medium,
      fontSize: FONTS.sizes.md,
      color: COLORS.text.secondary,
      marginTop: SIZES.padding.md,
    },
    footer: {
      backgroundColor: COLORS.background.paper,
      padding: SIZES.padding.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      ...SHADOWS.medium,
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SIZES.padding.md,
    },
    totalText: {
      fontFamily: FONTS.semiBold,
      fontSize: FONTS.sizes.lg,
      color: COLORS.text.primary,
    },
    totalAmount: {
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.xl,
      color: COLORS.primary.main,
    },
    checkoutButton: {
      backgroundColor: COLORS.primary.main,
      padding: SIZES.padding.md,
      borderRadius: SIZES.radius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SIZES.padding.sm,
    },
    checkoutButtonText: {
      fontFamily: FONTS.semiBold,
      fontSize: FONTS.sizes.md,
      color: COLORS.primary.contrast,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor={COLORS.background.paper}
        barStyle="dark-content"
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearCart}>Clear Cart</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons 
              name="shopping-cart" 
              size={64} 
              color={COLORS.text.light} 
            />
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        }
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <MaterialIcons 
              name="shopping-bag" 
              size={24} 
              color={COLORS.primary.contrast} 
            />
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;