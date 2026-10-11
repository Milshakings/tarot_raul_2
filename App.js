import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.rootContainer}>
          <DashboardScreen />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    ...(Platform.OS === 'web' && {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    }),
  },
});
