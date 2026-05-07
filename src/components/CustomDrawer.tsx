import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Linking } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const CustomDrawer = (props: any) => {
    // Note: Later, you can hook this up to your app's global state (like Context or Redux)
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // Reusable component for the info links
    const CustomDrawerItem = ({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
        <TouchableOpacity style={styles.customItem} onPress={onPress}>
            <MaterialCommunityIcons name={icon} size={24} color={isDarkMode ? '#AAAAAA' : colors.textSub} />
            <Text style={[styles.customItemText, { color: isDarkMode ? '#FFFFFF' : colors.textMain }]}>{label}</Text>
        </TouchableOpacity>
    );

    // Dynamic background based on theme
    const bgColor = isDarkMode ? '#121212' : colors.background;
    const textColor = isDarkMode ? '#FFFFFF' : colors.textMain;

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                
                {/* 1. TOP HEADER (App Branding) */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="khanda" size={40} color="white" />
                    </View>
                    <Text style={[styles.appName, { color: textColor }]}>ਨਿਤਨੇਮ ਸਾਹਿਬ</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>

                {/* 2. MAIN NAVIGATION (The Home button from App.tsx) */}
                <View style={styles.drawerListWrapper}>
                    <DrawerItemList {...props} />
                </View>

                {/* 3. INFO PAGES */}
                <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : colors.border }]} />
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Information</Text>
                    <CustomDrawerItem 
                        icon="shield-check-outline" 
                        label="Privacy Policy" 
                        onPress={() => console.log("Navigate to Privacy")} 
                    />
                    <CustomDrawerItem 
                        icon="file-document-outline" 
                        label="Terms & Conditions" 
                        onPress={() => console.log("Navigate to Terms")} 
                    />
                    <CustomDrawerItem 
                        icon="email-outline" 
                        label="Contact Us" 
                        onPress={() => console.log("Navigate to Contact")} 
                    />
                    <CustomDrawerItem 
                        icon="information-outline" 
                        label="About" 
                        onPress={() => console.log("Navigate to About")} 
                    />
                </View>

            </DrawerContentScrollView>

            {/* 4. BOTTOM FOOTER (Dark Mode Toggle) */}
            <View style={[styles.footer, { borderTopColor: isDarkMode ? '#333' : colors.border }]}>
                <View style={styles.themeRow}>
                    <MaterialCommunityIcons 
                        name={isDarkMode ? "moon-waning-crescent" : "white-balance-sunny"} 
                        size={24} 
                        color={textColor} 
                    />
                    <Text style={[styles.themeText, { color: textColor }]}>Dark Mode</Text>
                    <Switch
                        trackColor={{ false: "#D3D3D3", true: colors.primaryLight }}
                        thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
                        onValueChange={toggleTheme}
                        value={isDarkMode}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 50, // Accounts for phone status bar
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: colors.primary, // Saffron background for the icon
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 5,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    appName: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'GurbaniLipi', // Optional: use your custom font here
    },
    version: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 5,
    },
    drawerListWrapper: {
        paddingTop: 10,
    },
    divider: {
        height: 1,
        marginHorizontal: 20,
        marginVertical: 15,
    },
    infoSection: {
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textMuted,
        marginLeft: 15,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    customItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    customItemText: {
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 15,
    },
    footer: {
        padding: 20,
        paddingBottom: 30, // Breathing room at the bottom
        borderTopWidth: 1,
    },
    themeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    themeText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 15,
    }
});