import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { TopBar } from '../components/TopBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useSettingsStore } from '../store/useSettingsStore'; // <-- Import your store

export default function SettingsScreen({ navigation }: any) {
    // 1. Hook into your global state instead of useState
    const { 
        showEnglish, 
        toggleEnglish, 
        showTransliteration, 
        toggleTransliteration, 
        darkMode, 
        toggleDarkMode 
    } = useSettingsStore();

    const SettingToggle = ({ icon, title, subtitle, value, onToggle }: any) => (
        <View style={styles.settingRow}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingSubtitle}>{subtitle}</Text>
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
        <SafeAreaView style={styles.container}>
            <TopBar 
                title="Settings" 
                isBack={true} 
                onLeftPress={() => navigation.goBack()}
                hideSettings={true}
            />

            <ScrollView style={styles.content}>
                <Text style={styles.sectionHeader}>Reading Preferences</Text>
                
                {/* 2. Plug the global functions into the toggles */}
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

                <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                    <View style={styles.iconBox}>
                        <MaterialCommunityIcons name="format-font-size-increase" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.settingTitle}>Gurmukhi Font Size</Text>
                        <Text style={styles.settingSubtitle}>Adjust the size of the main text</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMuted} />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
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
        backgroundColor: colors.surface,
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
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: { flex: 1 },
    settingTitle: { fontSize: 16, fontWeight: '600', color: colors.textMain, marginBottom: 2 },
    settingSubtitle: { fontSize: 13, color: colors.textSub },
});