import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useSettingsStore } from '../store/useSettingsStore';
import { colors } from '../theme/colors';
import { TopBar } from './TopBar';

// We extend ViewProps, but add specific props for your TopBar
interface ScreenContainerProps extends ViewProps {
    title: string;
    onLeftPress?: () => void;
    isBack?: boolean;
    hideSettings?: boolean;
    children: React.ReactNode;
}

export const ScreenContainer = ({ 
    title, 
    onLeftPress, 
    isBack = false, 
    hideSettings = false, 
    children, 
    style, 
    ...props 
}: ScreenContainerProps) => {
    // 1. Pull global state
    const { darkMode } = useSettingsStore();
    
    // 2. Pull safe area insets (so you don't have to do this on every screen!)
    const insets = useSafeAreaInsets();
    
    // 3. Dynamic colors
    const themeBg = darkMode ? '#121212' : colors.background;

    return (
        <View 
            style={[
                styles.container, 
                { 
                    backgroundColor: themeBg,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }, 
                style
            ]} 
            {...props}
        >
            {/* The Bulletproof Status Bar */}
            <StatusBar 
                style={darkMode ? "light" : "dark"} 
                backgroundColor={themeBg} 
                translucent={false} 
            />

            {/* The Top Navigation Bar */}
            <TopBar
                title={title}
                isBack={isBack}
                onLeftPress={onLeftPress}
                hideSettings={hideSettings}
            />

            {/* The actual content of whatever screen you are on */}
            <View style={styles.content}>
                {children}
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1, // Ensures your scroll views and lists take up the remaining space
    }
});