import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { AppThemeProvider } from '../components/Theme/ThemeProvider';
import { HomeStack, VolunteerStack } from './user-stacks.js';

const AppNavigation = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return (
      <AppThemeProvider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="orange" />
        </View>
      </AppThemeProvider>
    );
  }

  const Drawer = createDrawerNavigator();
  const Tab = createBottomTabNavigator();

  const DrawerContent = ({ navigation }) => (
    <DrawerContentScrollView>
      <DrawerItem
        label="Home"
        onPress={() => navigation.navigate('Home')}
      />
      <DrawerItem
        label="Volunteer"
        onPress={() => navigation.navigate('Volunteer')}
      />
    </DrawerContentScrollView>
  );

  const BottomTabNavigator = ({ navigation }) => (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitle: 'Edhi Foundation',
        
        tabBarActiveTintColor: "#ffc400",
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "gray",
        tabBarActiveBackgroundColor: "#FFFFFF",
        tabBarInactiveBackgroundColor: "#FFFFFF",
        tabBarStyle: { bottom: 1, top: 0 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Volunteer"
        component={VolunteerStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
  
  
  return (
    <BottomTabNavigator navigation={navigation} />
  );
}

export default AppNavigation;
