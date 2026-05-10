import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

interface TopBarProps {
    title: string;
    onLeftPress?: () => void; 
    isBack?: boolean;        
    hideSettings?: boolean;  
}

export const TopBar = ({ title, onLeftPress, isBack = false, hideSettings = false }: TopBarProps) => {
    const navigation = useNavigation<any>(); 

    return (
        <View style={[
            styles.headerContainer
        ]}>
            {/* Left Button (Menu or Back) */}
            <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
                <MaterialCommunityIcons 
                    name={isBack ? "arrow-left" : "menu"} 
                    size={28} 
                    color={colors.textMain} 
                />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title} numberOfLines={1}>{title}</Text>

            {/* Right Button (Settings) */}
            {hideSettings ? (
                // Invisible box MUST match the exact width of iconButton to keep the title perfectly centered
                <View style={{ width: 44 }} /> 
            ) : (
                <TouchableOpacity 
                    onPress={() => navigation.navigate('SettingsScreen')} 
                    style={styles.iconButton}
                >
                    <MaterialCommunityIcons name="cog" size={26} color={colors.textMain} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 8,
        paddingBottom: 8, // Gives space below the title
        backgroundColor: colors.surface,
        // The shadow properties are now properly applied to the main container!
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        zIndex: 10,
    },
    iconButton: {
        // Hardcoding width/height to 44px ensures the center text NEVER shifts off-balance
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        // Removed the gray background so it blends perfectly with the surface
        backgroundColor: 'transparent',
    },
    title: {
        flex: 1, // Takes up remaining space
        textAlign: 'center', // Forces center alignment
        fontSize: 22, 
        fontWeight: 'bold',
        color: colors.primary
    }
});