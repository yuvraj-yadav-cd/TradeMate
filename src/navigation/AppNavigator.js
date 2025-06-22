import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WishlistScreen from '../screens/WishlistScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import { COLORS, SHADOWS } from '../theme';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const getTabBarHeight = () => {
  if (Platform.OS === 'web') {
    return width < 500 ? 56 : 64;
  }
  if (width < 350) return 54;
  if (width < 400) return 58;
  return 62;
};

const getFontSize = () => {
  if (Platform.OS === 'web') {
    return width < 500 ? 12 : 14;
  }
  if (width < 350) return 11;
  if (width < 400) return 12;
  return 13;
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: COLORS.background.paper,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        height: getTabBarHeight(),
        paddingBottom: Platform.OS === 'ios' ? 12 : 7,
        ...SHADOWS.medium,
        elevation: 10,
      },
      tabBarLabelStyle: {
        fontFamily: 'Poppins_500Medium',
        fontSize: getFontSize(),
        marginBottom: 2,
        color: COLORS.text.secondary,
      },
      tabBarActiveTintColor: COLORS.primary.main,
      tabBarInactiveTintColor: COLORS.text.secondary,
      headerShown: false,
      tabBarItemStyle: {
        paddingVertical: Platform.OS === 'web' ? 4 : 2,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size, focused }) => (
          <MaterialIcons
            name="home"
            size={focused ? size + (width < 400 ? 1 : 2) : size}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Wishlist"
      component={WishlistScreen}
      options={{
        tabBarLabel: 'Wishlist',
        tabBarIcon: ({ color, size, focused }) => (
          <MaterialIcons
            name="favorite"
            size={focused ? size + (width < 400 ? 1 : 2) : size}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name="AddProduct"
      component={AddProductScreen}
      options={{
        tabBarLabel: 'Add',
        tabBarIcon: ({ color, size, focused }) => (
          <MaterialIcons
            name="add-circle"
            size={focused ? size + (width < 400 ? 1 : 2) : size}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Chats"
      component={ChatsScreen}
      options={{
        tabBarLabel: 'Chats',
        tabBarIcon: ({ color, size, focused }) => (
          <MaterialIcons
            name="chat"
            size={focused ? size + (width < 400 ? 1 : 2) : size}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size, focused }) => (
          <MaterialIcons
            name="person"
            size={focused ? size + (width < 400 ? 1 : 2) : size}
            color={color}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default TabNavigator;