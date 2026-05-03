import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';

// Import our local JSON data
import japjiData from '../data/japji.json';
//import jaapData from '../data/jaap.json';

// A dictionary to map the ID to the correct JSON data
const dataMap: any = {
    japji: japjiData,
    // jaap: jaapData, 
};

export default function ReaderScreen({ route }: any) {
    // Extract the ID sent from HomeScreen
    const { id } = route.params;

    // Select the correct data array based on the ID
    const currentBaniData = dataMap[id];

    // This function dictates how a single line of Gurbani looks
    const renderBaniLine = ({ item }: any) => (
        <View style={styles.lineContainer}>
            <Text style={styles.gurmukhiText}>{item.gurmukhi}</Text>
            <Text style={styles.transliterationText}>{item.transliteration}</Text>
            <Text style={styles.translationText}>{item.translation}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={currentBaniData}
                keyExtractor={(item) => item.id}
                renderItem={renderBaniLine}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        paddingBottom: 40, // Adds breathing room at the bottom of the prayer
    },
    lineContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    gurmukhiText: {
        fontFamily: 'GurbaniLipi',
        fontSize: 24,
        color: colors.primary, // Using the Saffron color for the main Gurbani
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '600',
    },
    transliterationText: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    translationText: {
        fontSize: 14,
        color: '#666666', // A softer gray for the English translation
        textAlign: 'center',
    },
});