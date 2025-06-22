import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenHeader from '../components/common/ScreenHeader';

const CheckoutScreen = ({ navigation }) => {
  const { items, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    // Validate form
    if (!Object.values(formData).every(field => field.trim())) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Place order
    Alert.alert(
      'Success',
      'Your order has been placed!',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background.paper} barStyle="dark-content" />
      
      <ScreenHeader
        title="Checkout"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            required
          />
          <Input
            label="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            required
          />
          <Input
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            required
          />
          <Input
            label="City"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            required
          />
          <Input
            label="Postal Code"
            value={formData.postalCode}
            onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
            required
          />
          <Input
            label="Phone"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            required
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemTitle}>{item.title}</Text>
              <Text style={styles.orderItemPrice}>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')} ({item.quantity} items)
              </Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        <Button
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}
        >
          Place Order
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.background.paper,
    margin: SIZES.padding.md,
    padding: SIZES.padding.lg,
    borderRadius: SIZES.radius.lg,
    ...SHADOWS.medium,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding.sm,
  },
  orderItemTitle: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
  },
  orderItemPrice: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding.md,
    paddingTop: SIZES.padding.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text.primary,
  },
  totalAmount: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary.main,
  },
  placeOrderButton: {
    margin: SIZES.padding.md,
    marginBottom: SIZES.padding.xl,
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
    marginBottom: SIZES.padding.lg,
  },
});

export default CheckoutScreen;