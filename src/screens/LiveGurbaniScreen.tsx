import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import { BlurView } from 'expo-blur'; // We will use Expo's native blur
import { colors } from '../theme/colors';

// Master Component
import { ScreenContainer } from '../components/ScreenContainer';
import { useSettingsStore } from '../store/useSettingsStore';

// Your API
const SGPC_API_URL = 'https://api.ohlengr.com/';

export default function LiveGurbaniScreen({ navigation }: any) {
    const { darkMode } = useSettingsStore();
    
    // Safely track the player state
    const playerState = usePlaybackState();
    const isPlaying = playerState?.state === State.Playing;
    const isBuffering = playerState?.state === State.Buffering;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleBack = () => {
        if (navigation?.goBack) {
            navigation.goBack();
        } else if (navigation?.toggleDrawer) {
            navigation.toggleDrawer();
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeLiveStream = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(SGPC_API_URL);
                if (!response.ok) throw new Error('Could not reach SGPC API');
                
                const data = await response.json();

                if (isMounted && data.success && data.links.liveKirtan) {
                    await TrackPlayer.reset();
                    await TrackPlayer.add({
                        id: 'live_kirtan_stream',
                        url: data.links.liveKirtan,
                        title: 'Live Gurbani Kirtan',
                        artist: 'Sri Darbar Sahib',
                        // Optional artwork for the lock screen
                        artwork: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Golden_Temple_India.jpg/800px-Golden_Temple_India.jpg',
                        isLiveStream: true,
                    });
                    
                    // Auto-play the radio when they enter the screen
                    await TrackPlayer.play();
                } else {
                    throw new Error('Live stream URL not found');
                }

            } catch (e: any) {
                console.error("Live Stream Error:", e);
                if (isMounted) setError(e.message);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        initializeLiveStream();
        
        // Cleanup: Stop the radio when they leave this specific screen
        return () => { 
            isMounted = false; 
            TrackPlayer.stop();
        };
    }, []);

    const togglePlayback = async () => {
        try {
            if (isPlaying) {
                await TrackPlayer.pause();
            } else {
                await TrackPlayer.play();
            }
        } catch (error) {
            console.error("Failed to toggle playback:", error);
        }
    };

    if (isLoading) {
        return (
            <ScreenContainer title="Live Kirtan" isBack={true} onLeftPress={handleBack}>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 15, color: darkMode ? '#FFF' : colors.textSub, fontSize: 16 }}>
                        Connecting to Amritsar...
                    </Text>
                </View>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer title="Live Kirtan" isBack={true} onLeftPress={handleBack}>
                <View style={styles.centerContent}>
                    <MaterialCommunityIcons name="radio-off" size={60} color={colors.textSub} />
                    <Text style={{ marginTop: 15, color: colors.textSub, fontSize: 16 }}>
                        Broadcast currently unavailable.
                    </Text>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer title="Live Kirtan" isBack={true} onLeftPress={handleBack}>
            
            {/* Full Screen Background Image */}
            <ImageBackground 
                source={require('../assets/images/darbar_sahib.jpeg')} 
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Dark overlay so the text remains readable */}
                <View style={styles.overlay} />

                {/* Main Content Area */}
                <View style={styles.contentContainer}>
                    
                    {/* Glassmorphism Player Card */}
                    <BlurView intensity={80} tint="dark" style={styles.glassCard}>
                        
                        {/* Status Badge */}
                        <View style={styles.liveBadge}>
                            <View style={[styles.pulseDot, isPlaying && styles.pulseDotActive]} />
                            <Text style={styles.liveBadgeText}>
                                {isBuffering ? 'BUFFERING...' : 'LIVE BROADCAST'}
                            </Text>
                        </View>

                        <Text style={styles.title}>Sri Darbar Sahib</Text>
                        <Text style={styles.subtitle}>Amritsar, Punjab</Text>

                        {/* Audio Visualizer Placeholder / Graphic */}
                        <View style={styles.visualizerArea}>
                            <MaterialCommunityIcons 
                                name={isPlaying ? "waveform" : "waveform"} 
                                size={60} 
                                color={isPlaying ? colors.primary : '#666'} 
                            />
                        </View>

                        {/* Custom Radio Controls */}
                        <View style={styles.controlsRow}>
                            
                            {/* Stop/Pause Button */}
                            <TouchableOpacity style={styles.controlBtn} onPress={togglePlayback}>
                                {isBuffering ? (
                                    <ActivityIndicator size="large" color="white" />
                                ) : (
                                    <MaterialCommunityIcons 
                                        name={isPlaying ? "pause" : "play"} 
                                        size={46} 
                                        color="white" 
                                    />
                                )}
                            </TouchableOpacity>

                        </View>
                    </BlurView>

                </View>
            </ImageBackground>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    glassCard: {
        width: '100%',
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(231, 76, 60, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(231, 76, 60, 0.3)',
    },
    pulseDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#666',
        marginRight: 8,
    },
    pulseDotActive: {
        backgroundColor: '#E74C3C',
        shadowColor: '#E74C3C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    liveBadgeText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        color: '#CCCCCC',
        fontSize: 18,
        marginBottom: 40,
    },
    visualizerArea: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    controlBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
});