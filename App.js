import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { View, Image } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import TabNavigator from './src/navigation/AppNavigator';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
//import { CartProvider } from './src/contexts/CartContext';
import { UserProvider } from './src/contexts/UserContext';
import { WishlistProvider } from './src/contexts/WishlistContext';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <UserProvider>
        <WishlistProvider>
            <Stack.Navigator screenOptions={{ headerShown: false}}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen 
                name="ProductDetail" 
                component={ProductDetailScreen}
                options={{
                  headerShown: true,
                  headerTitle: 'Product Details',
                  headerStyle: { backgroundColor: '#ffffff' },
                  headerTintColor: 'purple',
                }}
              />
              <Stack.Screen 
                name="Checkout" 
                component={CheckoutScreen}
                options={{
                  headerShown: true,
                  headerTitle: 'Checkout',
                  headerStyle: { backgroundColor: '#ffffff' },
                  headerTintColor: 'purple',
                }}
              />
            </Stack.Navigator>
        </WishlistProvider>
      </UserProvider>
    </NavigationContainer>
  );
}
