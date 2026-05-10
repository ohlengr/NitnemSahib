import React from 'react';
import { Text } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';
import { colors } from '../theme/colors';

export const TranslationText = ({ children }: { children: React.ReactNode }) => {
    const { darkMode } = useSettingsStore();
    const textColor = darkMode ? '#A0A0A0' : colors.textSub;

    return (
        <Text style={{
            fontSize: 14,
            color: textColor,
            textAlign: 'center',
        }}>
            {children}
        </Text>
    );
};