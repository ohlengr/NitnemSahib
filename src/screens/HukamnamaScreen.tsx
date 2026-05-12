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

// Encode the URL properly to handle the space (%20) safely
const DAILY_AUDIO_URL = 'https://sgpc.net/hukamnama/jpeg%20hukamnama/hukamnama.mp3';

export default function HukamnamaScreen({ navigation }: any) {
    const { showEnglish, showTransliteration, darkMode } = useSettingsStore();

    const themeTextSub = darkMode ? '#A0A0A0' : colors.textSub;
    const themeBorder = darkMode ? '#333333' : colors.border;
    const surfaceColor = darkMode ? '#1E1E1E' : colors.surface;

    const [hukamnamaData, setHukamnamaData] = useState<any[]>([]);
    const [hukamDate, setHukamDate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Audio Validation State
    const [audioReady, setAudioReady] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);

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

                // --- 1. FETCH TEXT DATA ---
                const response = await fetch('https://api.gurbaninow.com/v2/hukamnama/today');
                if (!response.ok) throw new Error('Could not fetch text data');
                const json = await response.json();

                if (isMounted && json.hukamnama) {
                    if (json.date && json.date.gregorian) {
                        const g = json.date.gregorian;
                        setHukamDate(`${g.day}, ${g.date}-${g.month}-${g.year}`);
                    } else {
                        setHukamDate("Today's Hukamnama");
                    }

                    const formattedData = json.hukamnama.map((item: any, index: number) => ({
                        id: String(index),
                        gurmukhi: item.line.gurmukhi?.unicode || '',
                        transliteration: item.line.transliteration?.english?.text || '',
                        translation: item.line.translation?.english?.default || '',
                    }));
                    setHukamnamaData(formattedData);
                }

                // --- 2. STRICT AUDIO VALIDATION ---
                try {
                    // Pre-flight check: Ping the server to see if the file actually exists and isn't corrupt
                    const audioCheck = await fetch(DAILY_AUDIO_URL, { method: 'HEAD' });
                    
                    // If the server returns a 200 OK, the file is safe to load
                    if (audioCheck.ok) {
                        await TrackPlayer.reset();
                        await TrackPlayer.add({
                            id: 'daily_hukamnama',
                            url: DAILY_AUDIO_URL,
                            title: "Today's Hukamnama",
                            artist: 'Sri Darbar Sahib, Amritsar',
                        });
                        if (isMounted) setAudioReady(true);
                    } else {
                        // The file is corrupted or returning a 404 Not Found
                        console.warn("SGPC Audio is corrupt or down today. Hiding player.");
                        if (isMounted) setAudioReady(false);
                    }
                } catch (audioErr) {
                    // Network failed entirely
                    console.warn("Could not reach SGPC Audio Server:", audioErr);
                    if (isMounted) setAudioReady(false);
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
                    <Text style={{ marginTop: 10, color: themeTextSub }}>Fetching Daily Hukamnama...</Text>
                </View>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer title="Hukamnama Sahib" isBack={true} onLeftPress={handleBack}>
                <View style={styles.centerContent}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={40} color={themeTextSub} />
                    <Text style={{ marginTop: 10, color: themeTextSub }}>Unable to load content.</Text>
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
                initialNumToRender={15}
                maxToRenderPerBatch={20}
                windowSize={5}
                contentContainerStyle={{ paddingBottom: showPlayer ? 240 : 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* ONLY SHOW BUTTON IF PRE-FLIGHT CHECK PASSED */}
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
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lineContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 16,
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: colors.primary, 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    titleText: { 
        fontSize: 16, 
        fontWeight: 'bold',
    },
    subtitleText: { 
        fontSize: 13, 
        marginTop: 2,
    },
    bottomPlayerContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
    },
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    }
});