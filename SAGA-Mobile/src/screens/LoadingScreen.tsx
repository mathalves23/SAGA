import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>SAGA</Text>
        <Text style={styles.subtitle}>Fitness & Wellness</Text>
        <ActivityIndicator 
          size="large" 
          color="#ffffff" 
          style={styles.loader}
        />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#e0e7ff',
  },
});

export default LoadingScreen; 