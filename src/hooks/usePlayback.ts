import { useState, useEffect } from "react";
import TrackPlayer, { 
    State, 
    Event, 
    useTrackPlayerEvents 
} from "react-native-track-player";
import * as Haptics from 'expo-haptics';

export const usePlayback = () => {
    const [playerState, setPlayerState] = useState<State>(State.None);

    useEffect(() => {
        async function checkState() {
            const state = await TrackPlayer.getState();
            setPlayerState(state);
        }
        checkState();
    }, []);

    // If this never prints, your event bridge is broken.
    useTrackPlayerEvents([Event.PlaybackState], (event) => {
        if (event.type === Event.PlaybackState) {
            console.log(event.state);
            setPlayerState(event.state);
            if (event.state === State.Ended) {
                TrackPlayer.seekTo(0);
                // Force state to Stopped so icon flips to Play
                setPlayerState(State.Stopped); 
            }
        }
    });

    const isPlaying = playerState === State.Playing;

    const togglePlayback = async () => {
        const current = await TrackPlayer.getState();
        
        if (current === State.Playing) {
            await TrackPlayer.pause();
            setPlayerState(State.Paused); 
        } else {
            if (current === State.Ended || current === State.Stopped) {
                await TrackPlayer.seekTo(0);
            }
            await TrackPlayer.play();
            setPlayerState(State.Playing); 
        }
    };

    // ADDED THIS: A manual stop function just like your manual toggle function
    const stopPlayback = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Adds a physical 'thud' feel
        await TrackPlayer.stop();
        await TrackPlayer.seekTo(0);
        setPlayerState(State.Stopped); // This forces the icon to change to Play instantly!
    };

    // Exported stopPlayback
    return { isPlaying, togglePlayback, stopPlayback, playerState };
};