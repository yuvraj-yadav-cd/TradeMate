import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  TextInput,
  Platform,
  ImageBackground
} from 'react-native';
//import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// Removed: import { fetchProducts } from '../services/productService';
import { COLORS, FONTS, SIZES, SHADOWS, LAYOUT } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryList from '../components/CategoryList';
import Svg, { Circle, Ellipse, Defs, LinearGradient as SvgLinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { supabase } from '../lib/supabase'; // <-- Add this import

const { width } = Dimensions.get('window');
const numColumns = width < 600 ? 2 : 3; // 2 columns on phones, 3 on tablets/web
const cardSpacing = 24;
const cardWidth = width / numColumns - cardSpacing;

const HomeScreen = ({ navigation }) => {
  //const { addToCart, items, updateQuantity } = useCart(); // Add items and updateQuantity
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sortBy, setSortBy] = useState('default'); // default, price_asc, price_desc, rating
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  // Replaced fetchProducts with Supabase query
  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleAddToCart = (item) => {
  //   addToCart(item);
  // };

  // const getItemQuantity = (itemId) => {
  //   const cartItem = items.find(item => item.id === itemId);
  //   return cartItem ? cartItem.quantity : 0;
  // };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const categories = ['All', ...new Set(products.map(product => product.category))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Update renderProduct to use responsive cardWidth
  const renderProduct = ({ item }) => (
    <View style={[styles.productCard, { width: cardWidth }]}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productPrice}>
            ₹{item.price.toLocaleString('en-IN')}
          </Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating?.rate || 0} ({item.rating?.count || 0})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* Wishlist button only */}
      <View style={styles.cartControls}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => toggleWishlist(item)}
        >
          <MaterialIcons
            name={isInWishlist(item.id) ? 'favorite' : 'favorite-border'}
            size={22}
            color={isInWishlist(item.id) ? COLORS.primary.main : COLORS.text.secondary}
          />
          <Text style={styles.buttonText}>
            {isInWishlist(item.id) ? 'Wishlisted' : 'Add to Wishlist'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CategoryListComponent = () => (
    <View style={styles.categoryContainer}>
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </View>
  );

  const getRecommendedProducts = () => {
    // Get 4-5 products with highest ratings
    return products
      .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
      .slice(0, 4);
  };

  const RecommendationsSection = () => (
    <View style={styles.recommendationsContainer}>
      <Text style={styles.sectionTitle}>Recommended for You</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendationsList}
      >
        {getRecommendedProducts().map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.recommendationCard}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.recommendationImage}
              resizeMode="contain"
            />
            <View style={styles.recommendationInfo}>
              <Text style={styles.recommendationTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.recommendationPrice}>
                ₹{item.price.toLocaleString('en-IN')}
              </Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {item.rating?.rate || 0}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Add this filter function
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  };

  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />
      {searchQuery ? (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => setSearchQuery('')}
        >
          <MaterialIcons name="close" size={20} color="#666" />
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const SortOptions = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.sortContainer}
    >
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === 'default' && styles.sortButtonActive
        ]}
        onPress={() => setSortBy('default')}
      >
        <Text style={[
          styles.sortButtonText,
          sortBy === 'default' && styles.sortButtonTextActive
        ]}>Default</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === 'price_asc' && styles.sortButtonActive
        ]}
        onPress={() => setSortBy('price_asc')}
      >
        <Text style={[
          styles.sortButtonText,
          sortBy === 'price_asc' && styles.sortButtonTextActive
        ]}>Price: Low to High</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === 'price_desc' && styles.sortButtonActive
        ]}
        onPress={() => setSortBy('price_desc')}
      >
        <Text style={[
          styles.sortButtonText,
          sortBy === 'price_desc' && styles.sortButtonTextActive
        ]}>Price: High to Low</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === 'rating' && styles.sortButtonActive
        ]}
        onPress={() => setSortBy('rating')}
      >
        <Text style={[
          styles.sortButtonText,
          sortBy === 'rating' && styles.sortButtonTextActive
        ]}>Top Rated</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const bannerData = [
    {
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
      title: 'Welcome to TradeMate!',
      subtitle: 'Buy. Sell. Connect.',
    },
    {
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      title: 'Declutter Your Hostel',
      subtitle: 'Turn your unused books, gadgets, and more into cash!',
    },
    {
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
      title: 'Find Great Deals',
      subtitle: 'Get quality second-hand items from fellow students.',
    },
    {
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
      title: 'Empower Your Campus',
      subtitle: 'Support sustainable living and help your community.',
    },
  ];

  // Update Banner to use responsive width/height
  const Banner = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
    const gap = 12;
    const bannerWidth = width - SIZES.padding.sm * 2 - gap * 2;
    const bannerHeight = width < 400 ? 180 : width < 700 ? 260 : 320; // Increased heights

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex(prev => {
          const nextIndex = prev === bannerData.length - 1 ? 0 : prev + 1;
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index: nextIndex,
              animated: true,
            });
          }
          return nextIndex;
        });
      }, 3500);
      return () => clearInterval(interval);
    }, []);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index);
      }
    }).current;

    return (
      <View style={styles.bannerCarouselContainer}>
        <FlatList
          ref={flatListRef}
          data={bannerData}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          pagingEnabled
          snapToInterval={bannerWidth + gap}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: gap }}
          getItemLayout={(_, index) => ({
            length: bannerWidth + gap,
            offset: (bannerWidth + gap) * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bannerContainer,
                {
                  width: bannerWidth,
                  height: bannerHeight,
                  marginRight: gap,
                },
              ]}
            >
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.bannerBgImage}
                imageStyle={{ borderRadius: SIZES.radius.xl, opacity: 0.9 }} // <-- Increased opacity for more visible image
                resizeMode="cover"
              >
                <LinearGradient
                  colors={[
                    COLORS.primary.main + '99', // <-- More transparent overlay
                    COLORS.primary.light + '11',
                  ]}
                  start={{ x: 0, y: 0.7 }}
                  end={{ x: 1, y: 0.3 }}
                  style={styles.bannerOverlay}
                >
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.bannerSubtitle} numberOfLines={3}>
                      {item.subtitle}
                    </Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>
          )}
          initialScrollIndex={activeIndex}
        />
        <View style={styles.bannerDots}>
          {bannerData.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.bannerDot,
                idx === activeIndex && styles.bannerDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background.default,
      //paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SIZES.padding.md,
      backgroundColor: COLORS.background.paper,
      ...SHADOWS.medium,
    },
    headerTitle: {
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.xxl,
      color: COLORS.primary.main,
    },
    headerActions: {
      flexDirection: 'row',
      gap: SIZES.padding.xs,
    },
    iconButton: {
      padding: SIZES.padding.sm,
      borderRadius: SIZES.radius.round,
      backgroundColor: COLORS.background.default,
    },
    sectionTitle: {
      fontFamily: FONTS.semiBold,
      fontSize: FONTS.sizes.lg,
      color: COLORS.text.primary,
      padding: SIZES.padding.md,
      paddingBottom: 0,
    },
    productList: {
      padding: SIZES.padding.sm,
    },
    productCard: {
      // width is now set dynamically in renderProduct
      backgroundColor: COLORS.background.paper,
      borderRadius: SIZES.radius.md,
      ...SHADOWS.light,
      margin: SIZES.padding.sm,
      overflow: 'hidden',
    },
    productImage: {
      width: '100%',
      height: width < 400 ? 100 : 160, // responsive image height
      borderTopLeftRadius: SIZES.radius.md,
      borderTopRightRadius: SIZES.radius.md,
      backgroundColor: COLORS.background.dark,
    },
    productInfo: {
      padding: SIZES.padding.md,
    },
    productCategory: {
      fontFamily: FONTS.medium,
      fontSize: FONTS.sizes.xs,
      color: COLORS.primary.main,
      textTransform: 'uppercase',
      marginBottom: SIZES.padding.xs,
    },
    productTitle: {
      fontFamily: FONTS.semiBold,
      fontSize: FONTS.sizes.md,
      color: COLORS.text.primary,
      marginBottom: SIZES.padding.xs,
    },
    productPrice: {
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.md,
      color: COLORS.primary.main,
      marginBottom: SIZES.padding.xs,
    },
    cartControls: {
      padding: SIZES.padding.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLORS.background.dark,
      borderRadius: SIZES.radius.round,
      padding: SIZES.padding.xs,
    },
    quantityButton: {
      backgroundColor: COLORS.primary.main,
      borderRadius: SIZES.radius.round,
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityText: {
      fontFamily: FONTS.semiBold,
      fontSize: FONTS.sizes.md,
      color: COLORS.text.primary,
    },
    addToCartButton: {
      backgroundColor: COLORS.primary.main,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SIZES.padding.sm,
      borderRadius: SIZES.radius.round,
      marginTop: SIZES.padding.sm,
      gap: SIZES.padding.sm,
    },
    buttonText: {
      fontFamily: FONTS.semiBold,
      fontSize: FONTS.sizes.xs,
      color: COLORS.primary.contrast,
    },
    wishlistButton: {
      position: 'absolute',
      right: SIZES.padding.sm,
      top: SIZES.padding.sm,
      backgroundColor: COLORS.background.paper,
      borderRadius: SIZES.radius.round,
      padding: SIZES.padding.sm,
      zIndex: 1,
      ...SHADOWS.light,
    },
    categoryContainer: {
      marginVertical: SIZES.padding.sm,
    },
    categoryList: {
      paddingHorizontal: SIZES.padding.md,
    },
    categoryItem: {
      paddingHorizontal: SIZES.padding.md,
      paddingVertical: SIZES.padding.sm,
      borderRadius: SIZES.radius.round,
      backgroundColor: COLORS.background.paper,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginRight: SIZES.padding.sm,
      ...SHADOWS.light,
    },
    categoryItemActive: {
      backgroundColor: COLORS.primary.main,
      borderColor: COLORS.primary.main,
    },
    categoryText: {
      fontFamily: FONTS.medium,
      fontSize: FONTS.sizes.sm,
      color: COLORS.text.secondary,
    },
    categoryTextActive: {
      color: COLORS.primary.contrast,
    },
    recommendationsContainer: {
      marginBottom: SIZES.padding.md,
    },
    recommendationsList: {
      paddingHorizontal: SIZES.padding.md,
    },
    recommendationCard: {
      width: width < 400 ? 110 : 160,
      backgroundColor: COLORS.background.paper,
      borderRadius: SIZES.radius.md,
      marginRight: SIZES.padding.sm,
      ...SHADOWS.light,
    },
    recommendationImage: {
      width: '100%',
      height: width < 400 ? 80 : 160,
      backgroundColor: COLORS.background.dark,
      borderTopLeftRadius: SIZES.radius.md,
      borderTopRightRadius: SIZES.radius.md,
    },
    recommendationInfo: {
      padding: SIZES.padding.md,
    },
    recommendationTitle: {
      fontFamily: FONTS.medium,
      fontSize: FONTS.sizes.sm,
      color: COLORS.text.primary,
      marginBottom: SIZES.padding.xs,
    },
    recommendationPrice: {
      fontFamily: FONTS.semiBold,
      fontSize: FONTS.sizes.md,
      color: COLORS.primary.main,
      marginBottom: SIZES.padding.xs,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      marginLeft: SIZES.padding.xs,
      fontFamily: FONTS.medium,
      fontSize: FONTS.sizes.xs,
      color: COLORS.text.secondary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.background.paper,
      borderRadius: SIZES.radius.round,
      paddingHorizontal: SIZES.padding.md,
      marginHorizontal: SIZES.padding.md,
      marginBottom: SIZES.padding.md,
      ...SHADOWS.light,
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontFamily: FONTS.regular,
      fontSize: FONTS.sizes.sm,
      color: COLORS.text.primary,
    },
    clearButton: {
      position: 'absolute',
      right: SIZES.padding.lg,
      padding: SIZES.padding.sm,
    },
    sortContainer: {
      paddingHorizontal: SIZES.padding.md,
      paddingVertical: SIZES.padding.sm,
    },
    sortButton: {
      paddingHorizontal: SIZES.padding.md,
      paddingVertical: SIZES.padding.sm,
      borderRadius: SIZES.radius.round,
      backgroundColor: COLORS.background.dark,
      marginRight: SIZES.padding.sm,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    sortButtonActive: {
      backgroundColor: COLORS.primary.main,
      borderColor: COLORS.primary.main,
    },
    sortButtonText: {
      fontFamily: FONTS.medium,
      fontSize: FONTS.sizes.sm,
      color: COLORS.text.secondary,
    },
    sortButtonTextActive: {
      color: COLORS.primary.contrast,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: SIZES.padding.xl,
    },
    emptyText: {
      fontFamily: FONTS.medium,
      fontSize: FONTS.sizes.md,
      color: COLORS.text.secondary,
      marginTop: SIZES.padding.sm,
    },
    bannerCarouselContainer: {
      margin: SIZES.padding.xs,
      marginBottom: SIZES.padding.xs,
      marginTop: SIZES.padding.sm,
    },
    bannerContainer: {
      width: '100%',
      borderRadius: SIZES.radius.xl,
      overflow: 'hidden',
      ...SHADOWS.medium,
      backgroundColor: COLORS.background.paper,
      justifyContent: 'center',
      alignItems: 'center',
      // Optionally, you can add minHeight here for extra effect:
      // minHeight: 180,
    },
    bannerBgImage: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
    },
    bannerOverlay: {
      flex: 1,
      justifyContent: 'center',
      borderRadius: SIZES.radius.xl,
      padding: SIZES.padding.lg,
      paddingBottom: SIZES.padding.xs,
    },
    bannerContent: {
      //backgroundColor: 'rgba(0,0,0,0.18)',
      borderRadius: SIZES.radius.md,
      padding: SIZES.padding.lg,
      marginBottom: SIZES.padding.lg,
    },
    bannerTitle: {
      fontFamily: FONTS.bold,
      fontSize: FONTS.sizes.sm,
      color: '#fff',
      marginBottom: 4,
      //letterSpacing: 0.5,
      textShadowColor: 'rgba(0,0,0,0.25)',
      textShadowOffset: { width: 1, height: 2 },
      textShadowRadius: 6,
    },
    bannerSubtitle: {
      fontFamily: FONTS.medium,
      fontSize: FONTS.sizes.xs,
      color: '#f0f6fa',
      opacity: 0.97,
      marginTop: 2,
      textShadowColor: 'rgba(0,0,0,0.18)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    bannerDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    bannerDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.primary.light,
      marginHorizontal: 4,
      opacity: 0.5,
    },
    bannerDotActive: {
      backgroundColor: COLORS.primary.main,
      opacity: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative SVG background with more color and design */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
          {/* Top left ellipse with gradient */}
          <Defs>
            <SvgLinearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={COLORS.primary.light} stopOpacity="0.38" />
              <Stop offset="1" stopColor={COLORS.primary.main} stopOpacity="0.22" />
            </SvgLinearGradient>
            <SvgLinearGradient id="grad2" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor={COLORS.primary.main} stopOpacity="0.22" />
              <Stop offset="1" stopColor={COLORS.secondary ? COLORS.secondary.main : '#FFD700'} stopOpacity="0.18" />
            </SvgLinearGradient>
            <SvgLinearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFB347" stopOpacity="0.18" />
              <Stop offset="1" stopColor="#FF5E62" stopOpacity="0.14" />
            </SvgLinearGradient>
          </Defs>
          {/* Top left ellipse */}
          <Ellipse
            cx="18%"
            cy="-6%"
            rx="48%"
            ry="22%"
            fill="url(#grad1)"
          />
          {/* Bottom right ellipse */}
          <Ellipse
            cx="92%"
            cy="104%"
            rx="42%"
            ry="18%"
            fill="url(#grad2)"
          />
          {/* Middle right orange-pink ellipse */}
          <Ellipse
            cx="110%"
            cy="30%"
            rx="30%"
            ry="14%"
            fill="url(#grad3)"
          />
          {/* Decorative circles */}
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
          {/* Decorative wavy path at the bottom */}
          <Path
            d={`M0,800 Q${width / 2},730 ${width},800 L${width},900 L0,900 Z`}
            fill={COLORS.primary.light}
            opacity="0.18"
          />
          {/* Subtle colored rectangle for extra depth */}
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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TradeMate</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setIsSearchVisible(!isSearchVisible)}
          >
            <MaterialIcons 
              name={isSearchVisible ? "close" : "search"} 
              size={24} 
              color={COLORS.text.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchVisible && <SearchBar />}

      <FlatList
        data={getFilteredProducts()}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.productList}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            <Banner />
            <Text style={styles.sectionTitle}>Categories</Text>
            <CategoryListComponent />
            <SortOptions />
            <RecommendationsSection />
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </Text>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={64} color="#cccccc" />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;