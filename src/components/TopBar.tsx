import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface TopBarProps {
    title: string;
    onMenuPress: () => void;
    onSettingsPress?: () => void;
}

export const TopBar = ({ title, onMenuPress, onSettingsPress }: TopBarProps) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Menu Button */}
                <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
                    <MaterialCommunityIcons name="menu" size={28} color={colors.textMain} />
                </TouchableOpacity>

                {/* Title */}
                <Text style={styles.title}>{title}</Text>

                {/* Settings / Font Size Button */}
                <TouchableOpacity onPress={onSettingsPress} style={styles.iconButton}>
                    <MaterialCommunityIcons name="format-font-size-increase" size={26} color={colors.textMain} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.surface,
        // Premium shadow for the header
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        zIndex: 10,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        paddingHorizontal: 15,
        backgroundColor: colors.surface,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        letterSpacing: 0.5,
    }
});