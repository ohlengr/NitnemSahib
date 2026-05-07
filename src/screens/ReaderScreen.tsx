import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native';
import { TopBar } from '../components/TopBar';
import TrackPlayer from 'react-native-track-player';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePlayback } from '../hooks/usePlayback';
import { colors } from '../theme/colors';
import { AudioPlayer } from '../components/AudioPlayer';

import { useSettingsStore } from '../store/useSettingsStore';

// A dictionary to map your route IDs to the official GurbaniNow API IDs
const apiBaniIds: any = {
    'japji': 1,
    'jaap': 2,
    'tavprasad': 3,
    'choupai': 4,
    'anand': 5,
    'rehras': 8,
    'kirtan': 9,
    'ardaas': 10, 
};

// CRITICAL: This enables LayoutAnimation on Android for smooth sliding
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ReaderScreen({ route, navigation }: any) {
    // Extract the ID sent from HomeScreen
    const { id, title } = route.params;

    // Pulling global settings from Zustand store
    const { showEnglish, showTransliteration } = useSettingsStore();

    const { isPlaying, playerState } = usePlayback();

    // 1. Existing state for player visibility
    const [showPlayer, setShowPlayer] = useState(true);

    // 2. New states for handling API data
    const [baniData, setBaniData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // The function to toggle with a smooth sliding animation
    const togglePlayer = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowPlayer(!showPlayer);
    };

    useEffect(() => {
        let isMounted = true;

        const initializeScreen = async () => {
            try {
                // START: API FETCH LOGIC
                setIsLoading(true);
                const apiId = apiBaniIds[id];
                const response = await fetch(`https://api.gurbaninow.com/v2/banis/${apiId}`);
                
                if (!response.ok) throw new Error("Failed to fetch Bani data");
                
                const json = await response.json();
                
                // Map the API's nested structure to our simple array structure
                if (isMounted && json.bani) {
                    const formattedData = json.bani.map((item: any, index: number) => ({
                        id: String(index),
                        // Using optional chaining (?.) to prevent crashes if a line is missing data
                        gurmukhi: item.line.gurmukhi?.unicode || item.line.gurmukhi?.akhar || '',
                        transliteration: item.line.transliteration?.english?.text || '',
                        translation: item.line.translation?.english?.default || '',
                    }));
                    setBaniData(formattedData);
                }
                // END: API FETCH LOGIC

                // START: YOUR EXISTING AUDIO SETUP LOGIC
                const queue = await TrackPlayer.getQueue();

                if (queue.length === 0 || queue[0].id !== id) {
                    console.log("Setting up new track...");
                    await TrackPlayer.reset();
                    await TrackPlayer.add({
                        id: id,
                        url: require('../assets/audio/japji_sahib.mp3'),
                        title: title,
                        artist: 'Nitnem Sahib',
                    });
                }
                // END: YOUR EXISTING AUDIO SETUP LOGIC

            } catch (e: any) {
                if (isMounted) setError(e.message);
                console.error("Setup/Fetch error:", e);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        initializeScreen();
        return () => { isMounted = false; };
    }, [id]); // ONLY re-run if the ID changes

    // This function dictates how a single line of Gurbani looks
    const renderBaniLine = ({ item }: any) => (
        <View style={styles.lineContainer}>
            <Text style={styles.gurmukhiText}>{item.gurmukhi}</Text>
            
            {/* UPDATED: Only render if both the text exists AND the user's setting is toggled to true */}
            {showTransliteration && item.transliteration ? (
                <Text style={styles.transliterationText}>{item.transliteration}</Text>
            ) : null}
            
            {showEnglish && item.translation ? (
                <Text style={styles.translationText}>{item.translation}</Text>
            ) : null}
        </View>
    );

    // Show Loading Spinner while fetching data
    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10, color: colors.textMuted }}>Loading {title}...</Text>
            </SafeAreaView>
        );
    }

    // Show Error message if offline or API fails
    if (error) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="wifi-off" size={40} color={colors.textMuted} />
                <Text style={{ marginTop: 10, color: colors.textMuted }}>Unable to load Gurbani.</Text>
                <Text style={{ fontSize: 12, color: 'red', marginTop: 5 }}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TopBar 
                title={title} 
                isBack={true} 
                onLeftPress={() => navigation.goBack()} 
            />
            
            <FlatList
                // Pass the fetched state data here
                data={baniData}
                keyExtractor={(item) => item.id}
                renderItem={renderBaniLine}
                // Performance boosts for rendering large lists of text
                initialNumToRender={15}
                maxToRenderPerBatch={20}
                windowSize={5}
                // Dynamically adjust bottom padding so text doesn't hide behind the player
                contentContainerStyle={[styles.listContent, { paddingBottom: showPlayer ? 240 : 100 }]}
            />

            <Text style={{ fontSize: 10, color: 'red' }}>
                Raw State: {playerState} | isPlaying: {JSON.stringify(isPlaying)}
            </Text>

            {/* THE SEEK BUTTON: Shows only when player is hidden */}
            {!showPlayer && (
                <TouchableOpacity style={styles.floatingMusicBtn} onPress={togglePlayer}>
                    <MaterialCommunityIcons name="music-note" size={28} color="white" />
                </TouchableOpacity>
            )}

            {/* Floating Player at the bottom */}
            {showPlayer && (
                <View style={styles.bottomPlayerContainer}>
                    <AudioPlayer onHide={togglePlayer} />
                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        // Removed fixed paddingBottom from here since it's handled dynamically above
    },
    lineContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    gurmukhiText: {
        fontFamily: 'GurbaniLipi',
        fontSize: 24,
        color: colors.primary, // Using the Saffron color for the main Gurbani
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '600',
    },
    transliterationText: {
        fontSize: 16,
        color: colors.textMain,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    translationText: {
        fontSize: 14,
        color: colors.textSub, // A softer gray for the English translation
        textAlign: 'center',
    },
    bottomPlayerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    floatingMusicBtn: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary, // Uses your theme's primary color
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    }
});