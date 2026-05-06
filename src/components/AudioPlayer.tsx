import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress, RepeatMode } from 'react-native-track-player';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePlayback } from '../hooks/usePlayback';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface AudioPlayerProps {
    onHide: () => void;
}

export const AudioPlayer = ({ onHide }: AudioPlayerProps) => {
    const { position, duration } = useProgress(100);
    const { isPlaying, togglePlayback, stopPlayback } = usePlayback();
    const [isRepeating, setIsRepeating] = useState(false);

    const [isSeeking, setIsSeeking] = useState(false);
    const [slidingPosition, setSlidingPosition] = useState(0);

    useEffect(() => {
        if (!isRepeating && duration > 0 && position >= duration - 0.5) {
            if (stopPlayback) {
                stopPlayback(); // Resets to 0 and changes icon to Play
            }
        }
    }, [position, duration, isRepeating, stopPlayback]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleRepeat = async () => {
        const newMode = !isRepeating;
        setIsRepeating(newMode);
        await TrackPlayer.setRepeatMode(newMode ? RepeatMode.Track : RepeatMode.Off);
    };

    const handleHide = () => {
        if (stopPlayback) {
            stopPlayback(); // Stop the audio and reset to 0
        }
        onHide(); // Trigger the slide-down animation
    };

    return (
        <View style={styles.glassContainer}>
            {/* NEW: Sleek Drag Handle / Hide Button */}
            <TouchableOpacity style={styles.hideHandle} onPress={handleHide}>
                <View style={styles.handleBar} />
                <MaterialCommunityIcons name="chevron-down" size={24} color="#999" style={{marginTop: -5}} />
            </TouchableOpacity>
            
            {/* Smooth Progress Section */}
            <View style={styles.progressWrapper}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration > 0 ? duration : 1}

                    // 1. If dragging, use manual position. Otherwise, use real audio position.
                    value={isSeeking ? slidingPosition : position}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor="rgba(0,0,0,0.1)"
                    thumbTintColor={colors.primary}

                    // 2. THE LOCK: Fires the instant you touch the thumb
                    onSlidingStart={(value) => {
                        setIsSeeking(true);
                        setSlidingPosition(value);
                    }}

                    // 3. THE DRAG: Only updates the text numbers, preventing UI stutters
                    onValueChange={(value) => {
                        setSlidingPosition(value);
                    }}

                    // 4. THE RELEASE: Jump to new time, then wait for native side to catch up
                    onSlidingComplete={async (value) => {
                        await TrackPlayer.seekTo(value);

                        // SOLID FIX: Wait 500ms before unlocking. 
                        // This prevents the thumb from "jumping back" to the old time 
                        // while the native MP3 decoder is processing the seek request.
                        setTimeout(() => {
                            setIsSeeking(false);
                        }, 500);
                    }}
                />

                <View style={styles.timeRow}>
                    {/* Display sliding time while dragging, otherwise display actual time */}
                    <Text style={styles.timeText}>
                        {formatTime(isSeeking ? slidingPosition : position)}
                    </Text>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
            </View>

            {/* Realistic Controls Row */}
            <View style={styles.controlsRow}>
                {/* Repeat Button */}
                <TouchableOpacity
                    style={[styles.secondaryBtn, isRepeating && styles.activeBtn]}
                    onPress={toggleRepeat}
                >
                    <MaterialCommunityIcons
                        name={isRepeating ? "repeat-once" : "repeat"}
                        size={24}
                        color={isRepeating ? colors.primary : "#666"}
                    />
                </TouchableOpacity>

                {/* Play/Pause Button - Larger & Prominent */}
                <TouchableOpacity style={styles.mainCircleBtn} onPress={togglePlayback}>
                    <MaterialCommunityIcons
                        name={isPlaying ? "pause" : "play"}
                        size={40}
                        color="white"
                    />
                </TouchableOpacity>

                {/* Stop Button */}
                <TouchableOpacity style={styles.secondaryBtn} onPress={stopPlayback}>
                    <MaterialCommunityIcons name="stop" size={24} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    glassContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        margin: 15,
        borderRadius: 25,
        padding: 20,
        paddingBottom: 25,
        // Premium Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    hideHandle: {
        alignItems: 'center',
        paddingBottom: 10,
        width: '100%',
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 5,
        marginBottom: 5,
    },
    progressWrapper: {
        width: '100%',
        marginBottom: 10,
    },
    slider: {
        width: width * 0.8,
        height: 30,
        alignSelf: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
        fontVariant: ['tabular-nums'], // Prevents jumping numbers
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 5,
    },
    secondaryBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        // Inset shadow effect
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    activeBtn: {
        backgroundColor: '#fff5e6',
        borderColor: colors.primary,
    },
    mainCircleBtn: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
});