// screens/HomeScreen.tsx
import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

// 1. Import your Master Layout and your new Master Card Component
import { ScreenContainer } from '../components/ScreenContainer';
import { BaniCard } from '../components/BaniCard';

const banis = [
    { id: 'simran', title: 'ਨਾਮ ਸਿਮਰਨ', subtitle: 'Meditation', icon: 'meditation' },
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
    
    const renderBaniCard = ({ item }: any) => {
        const handlePress = () => {
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

        // 2. Simply pass the item and the navigation logic to the smart component
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

// 3. Styles are reduced to a single property!
const styles = StyleSheet.create({
    listContent: {
        padding: 20,
        paddingBottom: 40,
    }
});