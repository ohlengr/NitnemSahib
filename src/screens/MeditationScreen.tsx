import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { TopBar } from '../components/TopBar';
import { colors } from '../theme/colors';

export default function MeditationScreen({ route, navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            {/* The Smart Top Bar ensures the back button works! */}
            <TopBar 
                title={route.params.title} 
                isBack={true} 
                onLeftPress={() => navigation.goBack()} 
            />
            
            <View style={styles.content}>
                <Text style={styles.text}>Meditation Feature Coming Soon</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: colors.textMain,
    }
});