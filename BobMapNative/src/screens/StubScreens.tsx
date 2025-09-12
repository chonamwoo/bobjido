import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const createStubScreen = (name: string) => {
  return () => (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
};

export const RegisterScreen = createStubScreen('Register');
export const DiscoverScreen = createStubScreen('Discover');
export const CreateScreen = createStubScreen('Create Playlist');
export const MessagesScreen = createStubScreen('Messages');
export const ProfileScreen = createStubScreen('Profile');
export const PlaylistDetailScreen = createStubScreen('Playlist Detail');
export const RestaurantDetailScreen = createStubScreen('Restaurant Detail');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});