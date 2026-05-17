import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TrackPlayer from 'react-native-track-player';
import { colors } from '../theme/colors';

// God Components
import { ScreenContainer } from '../components/ScreenContainer';
import { GurbaniText } from '../components/GurbaniText';
import { TransliterationText } from '../components/TransliterationText';
import { TranslationText } from '../components/TranslationText';
import { AudioPlayer } from '../components/AudioPlayer';

import { useSettingsStore } from '../store/useSettingsStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Your actual live PHP API URL
const PHP_API_URL = 'https://api.ohlengr.com/';

export default function HukamnamaScreen({ navigation }: any) {
    const { showEnglish, showTransliteration, darkMode } = useSettingsStore();

    const themeTextSub = darkMode ? '#A0A0A0' : colors.textSub;
    const themeBorder = darkMode ? '#333333' : colors.border;
    const surfaceColor = darkMode ? '#1E1E1E' : colors.surface;

    const [hukamnamaData, setHukamnamaData] = useState<any[]>([]);
    const [hukamDate, setHukamDate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Audio & Sync States
    const [audioReady, setAudioReady] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [isTextLagging, setIsTextLagging] = useState(false);

    const togglePlayer = () => {
        if (!audioReady) return; 
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowPlayer(!showPlayer);
    };

    const handleBack = () => {
        if (navigation?.goBack) {
            navigation.goBack();
        } else if (navigation?.toggleDrawer) {
            navigation.toggleDrawer();
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeHukamnama = async () => {
            try {
                setIsLoading(true);

                // --- 1. FETCH TEXT DATA (GurbaniNow) ---
                const textRes = await fetch('https://api.gurbaninow.com/v2/hukamnama/today');
                const textJson = await textRes.json();
                let textGregorian = null;

                if (isMounted && textJson.hukamnama) {
                    textGregorian = textJson.date.gregorian;
                    setHukamDate(`${textGregorian.day}, ${textGregorian.date}-${textGregorian.month}-${textGregorian.year}`);

                    const formattedData = textJson.hukamnama.map((item: any, index: number) => ({
                        id: String(index),
                        gurmukhi: item.line.gurmukhi?.unicode || '',
                        transliteration: item.line.transliteration?.english?.text || '',
                        translation: item.line.translation?.english?.default || '',
                    }));
                    setHukamnamaData(formattedData);
                }

                // --- 2. FETCH AUDIO (Your API) ---
                const audioRes = await fetch(PHP_API_URL);
                const audioJson = await audioRes.json();

                if (isMounted && audioJson.success) {
                    
                    // --- 3. STRICT SERVER-TO-SERVER SYNC CHECK ---
                    if (textGregorian && audioJson.lastUpdated) {
                        const audioDateObj = new Date(audioJson.lastUpdated);
                        
                        // Extract exact day/month/year from the Audio server
                        const audioDay = audioDateObj.getDate();
                        const audioMonth = audioDateObj.getMonth() + 1; 
                        const audioYear = audioDateObj.getFullYear();

                        // Extract exact numbers from GurbaniNow API
                        // Note: We use 'monthno' instead of 'month' and wrap in Number() for safety
                        const textDay = Number(textGregorian.date);
                        const textMonth = Number(textGregorian.monthno); 
                        const textYear = Number(textGregorian.year);

                        // Compare the Numbers exactly
                        if (
                            textDay !== audioDay || 
                            textMonth !== audioMonth || 
                            textYear !== audioYear
                        ) {
                            setIsTextLagging(true); // Dates do not match, show badge
                        } else {
                            setIsTextLagging(false); // Dates match exactly, hide badge
                        }
                    }

                    await TrackPlayer.reset();
                    await TrackPlayer.add({
                        id: 'daily_hukamnama',
                        url: audioJson.links.dailyHukamnama,
                        title: "Today's Hukamnama",
                        artist: 'Sri Darbar Sahib, Amritsar',
                    });
                    setAudioReady(true);
                }

            } catch (e: any) {
                if (isMounted) setError(e.message);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        initializeHukamnama();
        return () => { isMounted = false; };
    }, []);

    const renderLine = ({ item }: { item: any }) => {
        const cleanGurmukhi = item.gurmukhi.replace(/[;.,]/g, '').replace(/<>/g, 'ੴ');
        return (
            <View style={[styles.lineContainer, { borderBottomColor: themeBorder }]}>
                <GurbaniText>{cleanGurmukhi}</GurbaniText>
                {showTransliteration && item.transliteration ? (
                    <TransliterationText>{item.transliteration}</TransliterationText>
                ) : null}
                {showEnglish && item.translation ? (
                    <TranslationText>{item.translation}</TranslationText>
                ) : null}
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Sync Alert Badge - Now controlled entirely by server differences */}
            {isTextLagging && (
                <View style={styles.syncAlert}>
                    <MaterialCommunityIcons name="cached" size={16} color="#E67E22" />
                    <Text style={styles.syncAlertText}>
                        AUDIO UPDATED • TEXT SYNCING...
                    </Text>
                </View>
            )}

            <View style={[styles.infoCard, { backgroundColor: surfaceColor, shadowColor: darkMode ? '#000' : colors.textSub }]}>
                <View style={styles.infoRow}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="calendar-today" size={24} color="white" />
                    </View>
                    <View>
                        <Text style={[styles.titleText, { color: darkMode ? '#FFF' : colors.textMain }]}>
                            Sri Darbar Sahib
                        </Text>
                        <Text style={[styles.subtitleText, { color: themeTextSub }]}>
                            {hukamDate}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <ScreenContainer title="Hukamnama Sahib" isBack={true} onLeftPress={handleBack}>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer title="Hukamnama Sahib" isBack={true} onLeftPress={handleBack}>
            <FlatList
                data={hukamnamaData}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={renderLine}
                contentContainerStyle={{ paddingBottom: showPlayer ? 240 : 100 }}
                showsVerticalScrollIndicator={false}
            />

            {audioReady && !showPlayer && (
                <TouchableOpacity style={styles.floatingMusicBtn} onPress={togglePlayer}>
                    <MaterialCommunityIcons name="music-note" size={28} color="white" />
                </TouchableOpacity>
            )}

            {audioReady && showPlayer && (
                <View style={styles.bottomPlayerContainer}>
                    <AudioPlayer onHide={togglePlayer} />
                </View>
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    lineContainer: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
    headerContainer: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
    syncAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    syncAlertText: {
        color: '#E67E22',
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 6,
        letterSpacing: 0.5,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 16,
        elevation: 4,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: colors.primary, 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    titleText: { fontSize: 16, fontWeight: 'bold' },
    subtitleText: { fontSize: 13, marginTop: 2 },
    bottomPlayerContainer: { position: 'absolute', bottom: 20, left: 0, right: 0 },
    floatingMusicBtn: {
        position: 'absolute',
        bottom: 50,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    }
});