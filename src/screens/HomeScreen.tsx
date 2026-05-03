import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Button, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// A structured list of your 5 apps/banis
const BANI_LIST = [
    { id: 'japji', title: 'Japji Sahib' },
    { id: 'jaap', title: 'Jaap Sahib' },
    { id: 'tav_prasad', title: 'Tav-Prasad Savaiye' },
    { id: 'chaupai', title: 'Chaupai Sahib' },
    { id: 'anand', title: 'Anand sahib' },
    { id: 'ardaas', title: 'Ardaas' }
];

export default function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Nitnem Sahib</Text>

            <FlatList
                data={BANI_LIST}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('Reader', { id: item.id, title: item.title })}
                    >
                        <Text style={styles.cardText}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20, textAlign: 'center' },
    card: {
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardText: { fontSize: 18, color: colors.text, fontWeight: '500' }
});