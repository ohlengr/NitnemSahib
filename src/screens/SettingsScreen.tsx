import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/colors';
import { useSettingsStore } from '../store/useSettingsStore';

export default function SettingsScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    
    // Pull the states AND the new font size functions from your store
    const {
        showEnglish,
        toggleEnglish,
        showTransliteration,
        toggleTransliteration,
        darkMode,
        toggleDarkMode,
        gurbaniFontSize,        // <-- New state
        setGurbaniFontSize      // <-- New setter
    } = useSettingsStore();

    // Dynamic Theme Colors based on darkMode state
    const themeBg = darkMode ? '#121212' : colors.background;
    const themeSurface = darkMode ? '#1E1E1E' : colors.surface;
    const themeTextMain = darkMode ? '#FFFFFF' : colors.textMain;
    const themeTextSub = darkMode ? '#A0A0A0' : colors.textSub;

    // Helper functions for font size
    const increaseFont = () => setGurbaniFontSize(Math.min(gurbaniFontSize + 2, 40)); // Max size 40
    const decreaseFont = () => setGurbaniFontSize(Math.max(gurbaniFontSize - 2, 14)); // Min size 14

    // Reusable Toggle Component with dynamic text colors
    const SettingToggle = ({ icon, title, subtitle, value, onToggle }: any) => (
        <View style={[styles.settingRow, { backgroundColor: themeSurface }]}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.settingTitle, { color: themeTextMain }]}>{title}</Text>
                <Text style={[styles.settingSubtitle, { color: themeTextSub }]}>{subtitle}</Text>
            </View>
            <Switch
                trackColor={{ false: "#D3D3D3", true: colors.primaryLight }}
                thumbColor={value ? colors.primary : "#f4f3f4"}
                onValueChange={onToggle}
                value={value}
            />
        </View>
    );

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: themeBg, // Apply dynamic background
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right
            }
        ]}>
            <StatusBar style={darkMode ? "light" : "dark"} />
            
            {/* Note: Ensure your TopBar component also accepts a darkMode prop if it uses strict colors internally */}
            <TopBar
                title="Settings"
                isBack={true}
                onLeftPress={() => navigation.goBack()}
                hideSettings={true}
            />

            <ScrollView style={styles.content}>
                <Text style={styles.sectionHeader}>Reading Preferences</Text>

                <SettingToggle
                    icon="translate"
                    title="English Translation"
                    subtitle="Show English meanings below Gurmukhi"
                    value={showEnglish}
                    onToggle={toggleEnglish}
                />

                <SettingToggle
                    icon="alphabet-latin"
                    title="English Transliteration"
                    subtitle="Show pronunciation (e.g., Ik Oankar)"
                    value={showTransliteration}
                    onToggle={toggleTransliteration}
                />

                <Text style={styles.sectionHeader}>Appearance</Text>

                <SettingToggle
                    icon="theme-light-dark"
                    title="Dark Mode"
                    subtitle="Switch to a dark reading theme"
                    value={darkMode}
                    onToggle={toggleDarkMode}
                />

                {/* --- NEW FONT SIZE CONTROLLER --- */}
                <View style={[styles.settingRow, { backgroundColor: themeSurface }]}>
                    <View style={styles.iconBox}>
                        <MaterialCommunityIcons name="format-font-size-increase" size={24} color={colors.primary} />
                    </View>
                    
                    <View style={styles.textContainer}>
                        <Text style={[styles.settingTitle, { color: themeTextMain }]}>Gurmukhi Font Size</Text>
                        <Text style={[styles.settingSubtitle, { color: themeTextSub }]}>Size: {gurbaniFontSize}px</Text>
                    </View>
                    
                    {/* Stepper Buttons */}
                    <View style={styles.stepperContainer}>
                        <TouchableOpacity style={styles.stepperBtn} onPress={decreaseFont}>
                            <MaterialCommunityIcons name="minus" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        
                        <Text style={[styles.stepperValue, { color: themeTextMain }]}>{gurbaniFontSize}</Text>
                        
                        <TouchableOpacity style={styles.stepperBtn} onPress={increaseFont}>
                            <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 }, // Color handled dynamically now
    content: { flex: 1, padding: 20 },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 15,
        marginTop: 10,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: colors.primaryLight, // Ensure this looks good in dark mode, or use a dynamic color
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: { flex: 1 },
    settingTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    settingSubtitle: { fontSize: 13 },
    
    // New Stepper Styles
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)', // subtle background for the controls
        borderRadius: 8,
        paddingHorizontal: 5,
    },
    stepperBtn: {
        padding: 8,
    },
    stepperValue: {
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 28,
        textAlign: 'center',
    }
});