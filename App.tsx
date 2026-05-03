import React, {useEffect} from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import TrackPlayer, { Capability } from 'react-native-track-player';


// Import our screens
import HomeScreen from './src/screens/HomeScreen';
import ReaderScreen from './src/screens/ReaderScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  //Load the custom font
  const [fontsLoaded] = useFonts({
    'GurbaniLipi': require('./src/assets/fonts/Gurb_rg.ttf'),
  });

  // Initialize the Audio Player when the app starts
  useEffect(()=>{
    async function setupPlayer(){
      try{
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
      }catch(error){
        console.log("Error initializing player:", error);
      }
    }

    setupPlayer();
  }, []);

  //Show a loading spinner until the font is ready
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Nitnem' }}
        />
        <Stack.Screen 
          name="Reader" 
          component={ReaderScreen} 
          options={({ route }: any) => ({ title: route.params.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}