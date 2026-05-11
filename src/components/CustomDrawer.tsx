import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// IMPORT YOUR GLOBAL STORE HERE
import { useSettingsStore } from '../store/useSettingsStore'; // Adjust path if needed

export const CustomDrawer = (props: any) => {
    // 1. Pull the global state from your specific Zustand store
    const { darkMode } = useSettingsStore();

    // 2. Dynamic background and text colors based on global theme
    const bgColor = darkMode ? '#121212' : colors.background;
    const textColor = darkMode ? '#FFFFFF' : colors.textMain;
    const subTextColor = darkMode ? '#AAAAAA' : colors.textSub;
    const borderColor = darkMode ? '#333333' : colors.border;

    // 3. Reusable component for the info links
    const CustomDrawerItem = ({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
        <TouchableOpacity style={styles.customItem} onPress={onPress}>
            <MaterialCommunityIcons name={icon} size={24} color={subTextColor} />
            <Text style={[styles.customItemText, { color: textColor }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                
                {/* TOP HEADER (App Branding) */}
                <View style={[styles.header, { borderBottomColor: borderColor }]}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="khanda" size={40} color="white" />
                    </View>
                    <Text style={[styles.appName, { color: textColor }]}>ਨਿਤਨੇਮ ਸਾਹਿਬ</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>

                {/* MAIN NAVIGATION */}
                <View style={styles.drawerListWrapper}>
                    <DrawerItemList {...props} />
                </View>

                {/* INFO PAGES */}
                <View style={[styles.divider, { backgroundColor: borderColor }]} />
                <View style={styles.infoSection}>
                    <Text style={[styles.sectionTitle, { color: subTextColor }]}>Information</Text>
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

            {/* BOTTOM FOOTER (Dark Mode Toggle + Copyright) */}
            <View style={[styles.footer, { borderTopColor: borderColor }]}>
                {/* Copyright */}
                <Text style={[styles.copyrightText, { color: subTextColor }]}>
                    © {new Date().getFullYear()} ohlengr.com
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 50, 
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: colors.primary, 
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
        fontFamily: 'GurbaniLipi', 
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
        paddingBottom: 30, 
        borderTopWidth: 1,
    },
    themeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20, // Adds breathing room above the copyright
    },
    themeText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 15,
    },
    copyrightText: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    }
});