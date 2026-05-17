import React from 'react';
import { StyleSheet, FlatList, ToastAndroid, Platform, Alert } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo'; // <-- 1. Import NetInfo

// Import your Master Layout and your new Master Card Component
import { ScreenContainer } from '../components/ScreenContainer';
import { BaniCard } from '../components/BaniCard';

const banis = [
    // { id: 'simran', title: 'ਨਾਮ ਸਿਮਰਨ', subtitle: 'Meditation', icon: 'meditation' },
    { id: 'hukamnama', title: 'ਹੁਕਮਨਾਮਾ ਸਾਹਿਬ', subtitle: 'Daily Hukamnama', icon: 'khanda' },
    { id: 'live_kirtan', title: 'ਲਾਈਵ ਕੀਰਤਨ', subtitle: 'Live Darbar Sahib', icon: 'radio' },
    { id: 'japji', title: 'ਜਪੁਜੀ ਸਾਹਿਬ', subtitle: 'Morning Prayer', icon: 'khanda' },
    { id: 'jaap', title: 'ਜਾਪੁ ਸਾਹਿਬ', subtitle: 'Morning Prayer', icon: 'khanda' },
    { id: 'tavprasad', title: 'ਤ੍ਵਪ੍ਰਸਾਦਿ ਸਵੱਯੇ', subtitle: 'Morning Prayer', icon: 'khanda' },
    { id: 'choupai', title: 'ਚੌਪਈ ਸਾਹਿਬ', subtitle: 'Morning Prayer', icon: 'khanda' },
    { id: 'anand', title: 'ਅਨੰਦ ਸਾਹਿਬ', subtitle: 'Morning Prayer', icon: 'khanda' },
    { id: 'rehras', title: 'ਰਹਰਾਸਿ ਸਾਹਿਬ', subtitle: 'Evening Prayer', icon: 'khanda' },
    { id: 'kirtan', title: 'ਕੀਰਤਨ ਸੋਹਿਲਾ', subtitle: 'Night Prayer', icon: 'khanda' },
    { id: 'ardaas', title: 'ਅਰਦਾਸ', subtitle: 'Standing Supplication', icon: 'khanda' },
];

export default function HomeScreen({ navigation }: any) {
    // 2. Initialize the network listener
    const netInfo = useNetInfo();
    
    const renderBaniCard = ({ item }: any) => {
        const handlePress = () => {
            
            // 3. Check for internet requirements before navigating
            if (item.id === 'hukamnama' || item.id === 'live_kirtan') {
                // If isConnected is explicitly false, block the navigation
                if (netInfo.isConnected === false) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('No internet connection. Please connect to Wi-Fi or Cellular.', ToastAndroid.LONG);
                    } else {
                        Alert.alert('Offline', 'No internet connection. Please connect to Wi-Fi or Cellular.');
                    }
                    return; // EXIT the function immediately, blocking navigation
                }
            }

            // 4. Standard Navigation Logic
            if (item.id === 'hukamnama') {
                navigation.navigate('HukamnamaScreen', { title: item.title });
            } else if (item.id === 'live_kirtan') {
                navigation.navigate('LiveGurbaniScreen', { title: item.title });
            } else if (item.id === 'simran') {
                navigation.navigate('MeditationScreen', { title: item.title });
            } else {
                navigation.navigate('ReaderScreen', { id: item.id, title: item.title });
            }
        };

        return <BaniCard item={item} onPress={handlePress} />;
    };

    return (
        <ScreenContainer 
            title="ਨਿਤਨੇਮ ਸਾਹਿਬ" 
            onLeftPress={() => navigation.openDrawer()}
        >
            <FlatList
                data={banis}
                keyExtractor={(item) => item.id}
                renderItem={renderBaniCard}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    listContent: {
        padding: 20,
        paddingBottom: 40,
    }
});