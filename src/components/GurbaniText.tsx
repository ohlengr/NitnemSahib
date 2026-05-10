import React from 'react';
import { Text } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';
import { colors } from '../theme/colors';

export const GurbaniText = ({ children }: { children: React.ReactNode }) => {
    // 1. It fetches BOTH the size and the dark mode state
    const { gurbaniFontSize, darkMode } = useSettingsStore();

    // 2. The Contrast Fix: Deep Blue for Light Mode, Bright Saffron/Gold for Dark Mode
    const textColor = darkMode ? '#FF9933' : colors.primary;

    return (
        <Text 
            textBreakStrategy="simple"
            style={{
                fontFamily: 'GURAKHAR',    
                color: textColor,          // Automatically handles its own contrast
                fontSize: gurbaniFontSize, 
                lineHeight: gurbaniFontSize * 1.6, 
                textAlign: 'center',
                fontWeight: '600',
                marginBottom: 8
            }}
        >
            {children}
        </Text>
    );
};