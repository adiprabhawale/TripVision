import React from 'react';
import { View, Text, Image, StyleSheet, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Target, User } from 'lucide-react-native';
import { VoyagerColors } from '@/constants/theme';
import { useAuth } from '@/components/AuthProvider';

interface VoyagerHeaderProps {
  title?: string;
  showAvatar?: boolean;
}

export function VoyagerHeader({ title = 'Voyager', showAvatar = true }: VoyagerHeaderProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0),
        backgroundColor: 'rgba(16, 20, 24, 0.85)'
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.brand}>
          <Target size={24} color={VoyagerColors.primary} />
          <Text style={styles.brandTitle}>{title}</Text>
        </View>

        {showAvatar && (
          <Pressable style={styles.avatarContainer}>
            {user?.photoURL ? (
              <Image 
                source={{ uri: user.photoURL }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                 <User size={16} color={VoyagerColors.onPrimary} />
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0ea5e9', // Voyager specific blue
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  placeholderAvatar: {
    backgroundColor: VoyagerColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
