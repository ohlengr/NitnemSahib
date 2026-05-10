// CRITICAL: gesture-handler must be the VERY FIRST line in the app
import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import our screens
import HomeScreen from './src/screens/HomeScreen';
import ReaderScreen from './src/screens/ReaderScreen';
import HukamnamaScreen from './src/screens/HukamnamaScreen';
import LiveGurbaniScreen from './src/screens/LiveGurbaniScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MeditationScreen from './src/screens/MeditationScreen';
import { CustomDrawer } from './src/components/CustomDrawer';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// 1. This is the Side Menu Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      // THIS IS THE MAGIC LINE: 
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerActiveBackgroundColor: colors.primaryLight, // Highlights the 'Home' button nicely
        drawerLabelStyle: { fontSize: 16, fontWeight: 'bold' }
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" size={24} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  // Load the custom font
  const [fontsLoaded] = useFonts({
    'GURAKHAR': require('./src/assets/fonts/GURAKHAR.ttf'),
  });

  // Initialize the Audio Player when the app starts
  useEffect(() => {
    let isMounted = true;
    async function setupPlayer() {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          // These are the buttons that will show on the lock screen
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
          ],
        });
        console.log("Audio Player Initialized");
      } catch (error) {
        console.log("Player might already be initialized:", error);
      }
    }

    setupPlayer();
    return () => { isMounted = false; };
  }, []);

  // Show a loading spinner until the font is ready
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 2. The Main App Navigator
  return (
    <SQLiteProvider
      databaseName="nitnem.db"
      assetSource={{ assetId: require('./src/assets/nitnem_complete.sqlite') }}
    >
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          {/* Layer 1: The Drawer (which holds the HomeScreen) */}
          <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />

          {/* Layer 2: The ReaderScreen (Slides over the HomeScreen) */}
          <Stack.Screen
            name="ReaderScreen"
            component={ReaderScreen}
            options={{ animation: 'slide_from_right' }} // Smooth premium transition
          />

          {/* NEW: Feature Screens */}
          <Stack.Screen
            name="HukamnamaScreen"
            component={HukamnamaScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="LiveGurbaniScreen"
            component={LiveGurbaniScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="MeditationScreen"
            component={MeditationScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ animation: 'slide_from_right' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}