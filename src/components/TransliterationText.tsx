import React from 'react';
import { Text } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';
import { colors } from '../theme/colors';

export const TransliterationText = ({ children }: { children: React.ReactNode }) => {
    const { darkMode } = useSettingsStore();
    const textColor = darkMode ? '#FFFFFF' : colors.textMain;

    return (
        <Text style={{
            fontSize: 16,
            color: textColor,
            textAlign: 'center',
            fontStyle: 'italic',
            marginBottom: 4,
        }}>
            {children}
        </Text>
    );
};