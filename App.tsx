// CRITICAL: gesture-handler must be the VERY FIRST line in the app
import 'react-native-gesture-handler'; 

import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import TrackPlayer, { Capability } from 'react-native-track-player';

// Import our screens
import HomeScreen from './src/screens/HomeScreen';
import ReaderScreen from './src/screens/ReaderScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// 1. This is the Side Menu Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator 
      screenOptions={{ 
        headerShown: false, // We hide the default header because we built a custom TopBar
        drawerStyle: { backgroundColor: colors.background }, // Premium warm paper color
        drawerActiveTintColor: colors.primary, // Saffron color for active item
      }}
    >
      {/* Home is the main screen inside the drawer */}
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Nitnem' }} />
    </Drawer.Navigator>
  );
}

export default function App() {
  // Load the custom font
  const [fontsLoaded] = useFonts({
    'GurbaniLipi': require('./src/assets/fonts/Gurb_rg.ttf'),
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

      </Stack.Navigator>
    </NavigationContainer>
  );
}