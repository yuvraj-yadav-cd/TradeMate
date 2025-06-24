import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import TabNavigator from './src/navigation/AppNavigator';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';
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

  useEffect(() => {
    async function prepare() {
      // Prevent auto-hide
      await SplashScreen.preventAutoHideAsync();
      // Wait at least 1 seconds
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Hide splash screen
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
        <WishlistProvider>
            <Stack.Navigator screenOptions={{ headerShown: false}}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen 
                name="ProductDetail" 
                component={ProductDetailScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="ChatRoomScreen" 
                component={ChatRoomScreen}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
        </WishlistProvider>
    </NavigationContainer>
  );
}
