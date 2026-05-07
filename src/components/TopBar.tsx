import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // <-- NEW: Allows TopBar to navigate itself
import { colors } from '../theme/colors';

interface TopBarProps {
    title: string;
    onLeftPress: () => void; 
    isBack?: boolean;        
    hideSettings?: boolean;  // NEW: Lets us hide the cog on the actual Settings screen
}

export const TopBar = ({ title, onLeftPress, isBack = false, hideSettings = false }: TopBarProps) => {
    
    // Initialize the navigation hook
    const navigation = useNavigation<any>(); 

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Left Button (Menu or Back) */}
                <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
                    <MaterialCommunityIcons 
                        name={isBack ? "arrow-left" : "menu"} 
                        size={28} 
                        color={colors.textMain} 
                    />
                </TouchableOpacity>

                {/* Title */}
                <Text style={styles.title}>{title}</Text>

                {/* Right Button (Settings) */}
                {hideSettings ? (
                    // If we hide settings, render an invisible box to keep the title perfectly centered
                    <View style={{ width: 42 }} /> 
                ) : (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('SettingsScreen')} // <-- Hardcoded logic!
                        style={styles.iconButton}
                    >
                        <MaterialCommunityIcons name="cog" size={26} color={colors.textMain} />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.surface,
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
        fontSize: 22, 
        fontWeight: 'bold',
        color: colors.primary, 
        fontFamily: 'GurbaniLipi', 
        marginTop: 5, 
    }
});