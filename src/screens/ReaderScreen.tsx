import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePlayback } from '../hooks/usePlayback';
import { colors } from '../theme/colors';

// Import our local JSON data
import japjiData from '../data/japji.json';
import { AudioPlayer } from '../components/AudioPlayer';
//import jaapData from '../data/jaap.json';

// A dictionary to map the ID to the correct JSON data
const dataMap: any = {
    japji: japjiData,
    // jaap: jaapData, 
};

// CRITICAL: This enables LayoutAnimation on Android for smooth sliding
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ReaderScreen({ route }: any) {
    // Extract the ID sent from HomeScreen
    const { id, title } = route.params;

    const { isPlaying, playerState } = usePlayback();

    // 1. Add state to track if player is visible
    const [showPlayer, setShowPlayer] = useState(true);

    // 2. The function to toggle with a smooth sliding animation
    const togglePlayer = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowPlayer(!showPlayer);
    };

    useEffect(() => {
        let isMounted = true;

        const setupTrack = async () => {
            try {
                // 1. Check current queue
                const queue = await TrackPlayer.getQueue();

                // 2. Only add the track if the queue is empty OR it's a different song
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
            } catch (e) {
                console.error("Setup error:", e);
            }
        };

        setupTrack();
        return () => { isMounted = false; };
    }, [id]); // ONLY re-run if the ID changes (e.g. user switches from Japji to Jaap)

    // Select the correct data array based on the ID
    const currentBaniData = dataMap[id];

    // This function dictates how a single line of Gurbani looks
    const renderBaniLine = ({ item }: any) => (
        <View style={styles.lineContainer}>
            <Text style={styles.gurmukhiText}>{item.gurmukhi}</Text>
            <Text style={styles.transliterationText}>{item.transliteration}</Text>
            <Text style={styles.translationText}>{item.translation}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={currentBaniData}
                keyExtractor={(item) => item.id}
                renderItem={renderBaniLine}
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
        color: colors.text,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    translationText: {
        fontSize: 14,
        color: '#666666', // A softer gray for the English translation
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