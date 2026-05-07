import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    showEnglish: boolean;
    showTransliteration: boolean;
    darkMode: boolean;
    toggleEnglish: () => void;
    toggleTransliteration: () => void;
    toggleDarkMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            // Default settings
            showEnglish: true,
            showTransliteration: true,
            darkMode: false,

            // Toggle actions
            toggleEnglish: () => set((state) => ({ showEnglish: !state.showEnglish })),
            toggleTransliteration: () => set((state) => ({ showTransliteration: !state.showTransliteration })),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
        }),
        {
            name: 'nitnem-settings', // This is the key it saves under in the phone's storage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);