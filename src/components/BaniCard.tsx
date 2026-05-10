import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useSettingsStore } from '../store/useSettingsStore';

interface BaniCardProps {
    item: any;
    onPress: () => void;
}

export const BaniCard = ({ item, onPress }: BaniCardProps) => {
    // 1. The card independently fetches its own settings
    const { darkMode, gurbaniFontSize } = useSettingsStore();

    // 2. The card calculates its own dark mode contrast
    const themeSurface = darkMode ? '#1E1E1E' : colors.surface;
    const themeTextMain = darkMode ? '#FFFFFF' : colors.textMain;
    const themeTextSub = darkMode ? '#A0A0A0' : colors.textSub;
    const themeBorder = darkMode ? '#333333' : colors.border;
    const iconBgColor = darkMode ? '#2A2A2A' : colors.primaryLight;

    // 3. The card gracefully scales its own title size
    const uiFontSize = Math.max(16, gurbaniFontSize * 0.75);

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: themeSurface, borderColor: themeBorder }]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                <MaterialCommunityIcons name={item.icon} size={28} color={colors.primary} />
            </View>

            <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: themeTextMain, fontSize: uiFontSize }]}>
                    {item.title}
                </Text>
                <Text style={[styles.cardSubtitle, { color: themeTextSub }]}>
                    {item.subtitle}
                </Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={24} color={themeTextSub} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        marginBottom: 15,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'GurbaniLipi', // Ensure your custom font is applied here
    },
    cardSubtitle: {
        fontSize: 13,
        fontWeight: '500',
    }
});