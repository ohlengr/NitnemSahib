import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AudioPlayer } from '../components/AudioPlayer';

// 1. Import all of your self-governing God Components!
import { ScreenContainer } from '../components/ScreenContainer';
import { GurbaniText } from '../components/GurbaniText';
import { TransliterationText } from '../components/TransliterationText';
import { TranslationText } from '../components/TranslationText';

import { useSettingsStore } from '../store/useSettingsStore';
import { useSQLiteContext } from 'expo-sqlite';

const dbBaniIds: any = {
    'japji': 1, 'jaap': 2, 'tavprasad': 3, 'choupai': 4,
    'anand': 5, 'rehras': 7, 'kirtan': 11, 'ardaas': 14,
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ReaderScreen({ route, navigation }: any) {
    const { id, title } = route.params;

    // 2. Only pull what this specific screen needs to function
    const { showEnglish, showTransliteration, darkMode } = useSettingsStore();
    const db = useSQLiteContext();

    // Dynamic colors kept only for the Loading/Error text and the line separators
    const themeTextSub = darkMode ? '#A0A0A0' : colors.textSub;
    const themeBorder = darkMode ? '#333333' : colors.border;

    const [showPlayer, setShowPlayer] = useState(false);
    const [baniData, setBaniData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const togglePlayer = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowPlayer(!showPlayer);
    };

    useEffect(() => {
        let isMounted = true;

        const initializeScreen = async () => {
            try {
                setIsLoading(true);
                const numericBaniId = dbBaniIds[id];

                if (!numericBaniId) throw new Error(`No DB ID mapped for route id: ${id}`);

                const result = await db.getAllAsync(`
                            SELECT 
                                gurmukhi_unicode AS gurmukhi,
                                tl_english_text AS transliteration,
                                trans_english AS translation,
                                trans_punjabi_unicode AS punjabiTeeka,
                                tl_devanagari_text AS devanagari
                            FROM lines 
                            WHERE bani_id = ? 
                            ORDER BY line_order ASC
                        `, [numericBaniId]);

                if (isMounted) {
                    const formattedData = result.map((item: any, index: any) => ({
                        id: item.id ? item.id.toString() : index.toString(),
                        gurmukhi: item.gurmukhi || '',
                        transliteration: item.transliteration || '',
                        translation: item.translation || '',
                    }));
                    setBaniData(formattedData);
                }

                const queue = await TrackPlayer.getQueue();
                if (queue.length === 0 || queue[0].id !== id) {
                    await TrackPlayer.reset();
                    await TrackPlayer.add({
                        id: id,
                        url: require('../assets/audio/japji_sahib.mp3'),
                        title: title,
                        artist: 'Nitnem Sahib',
                    });
                }
            } catch (e: any) {
                if (isMounted) setError(e.message);
                console.error("Setup/Fetch error:", e);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        initializeScreen();
        return () => { isMounted = false; };
    }, [id]);

    const renderBaniLine = ({ item }: any) => {
        const cleanGurmukhi = item.gurmukhi.replace(/[;.,]/g, '').replace(/<>/g, 'ੴ');
        return (
            <View style={[styles.lineContainer, { borderBottomColor: themeBorder }]}>
                
                {/* 3. Pure, clean component renders without any messy inline props! */}
                <GurbaniText>
                    {cleanGurmukhi}
                </GurbaniText>

                {showTransliteration && item.transliteration ? (
                    <TransliterationText>
                        {item.transliteration}
                    </TransliterationText>
                ) : null}

                {showEnglish && item.translation ? (
                    <TranslationText>
                        {item.translation}
                    </TranslationText>
                ) : null}
                
            </View>
        );
    };

    if (isLoading) {
        return (
            <ScreenContainer title={title} isBack={true} onLeftPress={() => navigation.goBack()}>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 10, color: themeTextSub }}>Loading {title}...</Text>
                </View>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer title={title} isBack={true} onLeftPress={() => navigation.goBack()}>
                <View style={styles.centerContent}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={40} color={themeTextSub} />
                    <Text style={{ marginTop: 10, color: themeTextSub }}>Unable to load Gurbani.</Text>
                    <Text style={{ fontSize: 12, color: 'red', marginTop: 5 }}>{error}</Text>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer title={title} isBack={true} onLeftPress={() => navigation.goBack()}>
            <FlatList
                data={baniData}
                keyExtractor={(item) => item.id}
                renderItem={renderBaniLine}
                initialNumToRender={15}
                maxToRenderPerBatch={20}
                windowSize={5}
                contentContainerStyle={{ paddingBottom: showPlayer ? 240 : 100 }}
            />

            {!showPlayer && (
                <TouchableOpacity style={styles.floatingMusicBtn} onPress={togglePlayer}>
                    <MaterialCommunityIcons name="music-note" size={28} color="white" />
                </TouchableOpacity>
            )}

            {showPlayer && (
                <View style={styles.bottomPlayerContainer}>
                    <AudioPlayer onHide={togglePlayer} />
                </View>
            )}
        </ScreenContainer>
    );
}

// 4. Styles are now incredibly small. The text styling debt is gone!
const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lineContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
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