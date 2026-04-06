import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { VoyagerColors as COLORS } from '@/constants/theme';
import { Globe, Calendar, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.onSurfaceVariant + '80',
          tabBarStyle: {
             borderTopWidth: 1,
             borderTopColor: 'rgba(255, 255, 255, 0.05)',
             backgroundColor: 'rgba(16, 20, 24, 0.95)', // Glass effect Voyager background
             height: 80 + insets.bottom,
             paddingTop: 12,
             paddingBottom: insets.bottom + 8,
             borderTopLeftRadius: 32,
             borderTopRightRadius: 32,
             position: 'absolute',
             bottom: 0,
             left: 0,
             right: 0,
             elevation: 10,
             shadowColor: '#000',
             shadowOffset: { width: 0, height: -8 },
             shadowOpacity: 0.3,
             shadowRadius: 24,
          },
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginTop: 4,
          },
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ 
                padding: 10, 
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(148, 204, 255, 0.12)' : 'transparent' 
              }}>
                <Globe size={20} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Plan',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ 
                padding: 10, 
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(148, 204, 255, 0.12)' : 'transparent' 
              }}>
                <Calendar size={20} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ 
                padding: 10, 
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(148, 204, 255, 0.12)' : 'transparent' 
              }}>
                <User size={20} color={color} />
              </View>
            ),
          }}
        />
    </Tabs>
  );
}
