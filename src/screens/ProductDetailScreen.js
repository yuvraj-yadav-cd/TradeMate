import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS, LAYOUT } from '../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../lib/supabase';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id);
    };
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background.paper} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Floating Image Card */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.categoryRow}>
            <MaterialIcons name="category" size={18} color={COLORS.primary.main} />
            <Text style={styles.category}>{product.category}</Text>
          </View>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>
            ₹{product.price.toLocaleString('en-IN')}
          </Text>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Chat with Seller Button */}
          {product.owner_id && currentUserId && product.owner_id !== currentUserId && (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() =>
                navigation.navigate('ChatRoomScreen', {
                  partnerId: product.owner_id,
                  currentUserId,
                })
              }
              activeOpacity={0.85}
            >
              <MaterialIcons name="chat" size={22} color="#fff" />
              <Text style={styles.chatButtonText}>Chat with Seller</Text>
            </TouchableOpacity>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary.main,
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
    paddingBottom: 16,
    paddingHorizontal: SIZES.padding.lg,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
    shadowColor: COLORS.primary.main,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  headerBack: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.lg,
    flex: 1,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  imageCard: {
    width: LAYOUT.window.width * 0.9,
    height: LAYOUT.window.width * 0.7,
    backgroundColor: COLORS.background.paper,
    alignSelf: 'center',
    borderRadius: SIZES.radius.xl,
    marginTop: SIZES.padding.lg,
    marginBottom: -SIZES.radius.xl / 1.5,
    ...SHADOWS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '90%',
    height: '90%',
    borderRadius: SIZES.radius.lg,
  },
  infoContainer: {
    backgroundColor: COLORS.background.paper,
    borderTopLeftRadius: SIZES.radius.xl * 1.2,
    borderTopRightRadius: SIZES.radius.xl * 1.2,
    marginTop: -SIZES.radius.xl,
    padding: SIZES.padding.lg,
    ...SHADOWS.light,
    minHeight: 350,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding.xs,
  },
  category: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary.main,
    textTransform: 'uppercase',
    marginLeft: 6,
    letterSpacing: 1,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.primary.main,
    marginBottom: SIZES.padding.sm,
    marginTop: SIZES.padding.xs,
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.secondary ? COLORS.secondary.main : COLORS.primary.main,
    marginBottom: SIZES.padding.md,
    marginTop: SIZES.padding.xs,
    letterSpacing: 0.5,
  },
  descriptionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding.sm,
    marginTop: SIZES.padding.sm,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.secondary,
    lineHeight: SIZES.padding.xl,
    marginBottom: SIZES.padding.lg,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary.main,
    borderRadius: SIZES.radius.lg,
    paddingVertical: SIZES.padding.md,
    paddingHorizontal: SIZES.padding.xl,
    alignSelf: 'center',
    marginTop: SIZES.padding.lg,
    shadowColor: COLORS.primary.main,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  chatButtonText: {
    color: '#fff',
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default ProductDetailScreen;