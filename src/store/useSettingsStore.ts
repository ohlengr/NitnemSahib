import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    showEnglish: boolean;
    showTransliteration: boolean;
    darkMode: boolean;
    gurbaniFontSize: number; // <-- NEW: Added font size to the blueprint
    toggleEnglish: () => void;
    toggleTransliteration: () => void;
    toggleDarkMode: () => void;
    setGurbaniFontSize: (size: number) => void; // <-- NEW: Added the action
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            // Default settings
            showEnglish: true,
            showTransliteration: true,
            darkMode: false,
            gurbaniFontSize: 24, // <-- NEW: Set default font size to 24

            // Actions
            toggleEnglish: () => set((state) => ({ showEnglish: !state.showEnglish })),
            toggleTransliteration: () => set((state) => ({ showTransliteration: !state.showTransliteration })),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            setGurbaniFontSize: (size) => set({ gurbaniFontSize: size }), // <-- NEW: How to update it
        }),
        {
            name: 'nitnem-settings', // This is the key it saves under in the phone's storage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);