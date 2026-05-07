import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';

const banis = [
    // Daily Spiritual Features
    { id: 'simran', title: 'ਨਾਮ ਸਿਮਰਨ', subtitle: 'Meditation', icon: 'meditation' },
    { id: 'hukamnama', title: 'ਹੁਕਮਨਾਮਾ ਸਾਹਿਬ', subtitle: 'Daily Hukamnama', icon: 'khanda' },
    { id: 'live_kirtan', title: 'ਲਾਈਵ ਕੀਰਤਨ', subtitle: 'Live Darbar Sahib', icon: 'radio' },

    // Morning Panj Bania
    { id: 'japji', title: 'ਜਪੁਜੀ ਸਾਹਿਬ', subtitle: 'Morning Prayer', icon: 'khanda' },
    { id: 'jaap', title: 'ਜਾਪੁ ਸਾਹਿਬ', subtitle: 'Morning Prayer', icon: 'khanda' },
    { id: 'tavprasad', title: 'ਤ੍ਵਪ੍ਰਸਾਦਿ ਸਵੱਯੇ', subtitle: 'Morning Prayer', icon: 'khanda' },
    { id: 'choupai', title: 'ਚੌਪਈ ਸਾਹਿਬ', subtitle: 'Morning Prayer', icon: 'khanda' },
    { id: 'anand', title: 'ਅਨੰਦ ਸਾਹਿਬ', subtitle: 'Morning Prayer', icon: 'khanda' },

    // Evening & Night
    { id: 'rehras', title: 'ਰਹਰਾਸਿ ਸਾਹਿਬ', subtitle: 'Evening Prayer', icon: 'khanda' },
    { id: 'kirtan', title: 'ਕੀਰਤਨ ਸੋਹਿਲਾ', subtitle: 'Night Prayer', icon: 'khanda' },

    // Conclusion
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
                // Default: All other prayers go to the text reader
                navigation.navigate('ReaderScreen', { id: item.id, title: item.title });
            }
        };

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={handlePress}
            >
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={item.icon} size={28} color={colors.primary} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>

                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMuted} />
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            {/* Our New Top Bar */}
            <TopBar
                title="ਨਿਤਨੇਮ ਸਾਹਿਬ"
                onLeftPress={() => navigation.openDrawer()} // We will build the drawer next
            />

            <FlatList
                data={banis}
                keyExtractor={(item) => item.id}
                renderItem={renderBaniCard}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 18,
        marginBottom: 15,
        borderRadius: 16,
        // Tactile realistic shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: colors.textSub,
        fontWeight: '500',
    }
});