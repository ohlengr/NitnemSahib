import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { colors } from '../theme/colors';

export default function HukamnamaScreen({ route, navigation }: any) {
    const insets = useSafeAreaInsets();
    return (
        <View style={[
            styles.container, 
            { 
                paddingTop: insets.top, 
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right
            }
        ]}>
            {/* The Smart Top Bar ensures the back button works! */}
            <TopBar 
                title={route.params.title} 
                isBack={true} 
                onLeftPress={() => navigation.goBack()} 
            />
            
            <View style={styles.content}>
                <Text style={styles.text}>Hukamnama Sahib Feature Coming Soon</Text>
            </View>
        </View>
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