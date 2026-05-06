import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';

const banis = [
    { id: 'japji', title: 'Japji Sahib', subtitle: 'Morning Prayer', icon: 'weather-sunset-up' },
    { id: 'jaap', title: 'Jaap Sahib', subtitle: 'Morning Prayer', icon: 'sword-cross' },
    { id: 'tavprasad', title: 'Tav-Prasad Savaiye', subtitle: 'Morning Prayer', icon: 'book-open-page-variant' },
    { id: 'rehras', title: 'Rehras Sahib', subtitle: 'Evening Prayer', icon: 'weather-sunset-down' },
    { id: 'kirtan', title: 'Kirtan Sohila', subtitle: 'Night Prayer', icon: 'weather-night' },
];

export default function HomeScreen({ navigation }: any) {
    const renderBaniCard = ({ item }: any) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ReaderScreen', { id: item.id, title: item.title })}
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
    );

    return (
        <View style={styles.container}>
            {/* Our New Top Bar */}
            <TopBar 
                title="Nitnem" 
                onMenuPress={() => navigation.openDrawer()} // We will build the drawer next
                onSettingsPress={() => console.log("Settings opened")} 
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