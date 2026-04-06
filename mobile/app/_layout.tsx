import { Stack, useRouter, useSegments } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import '../global.css';

import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { ThemeProvider as AppThemeProvider } from '@/components/ThemeContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const firstSegment = segments[0];

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = firstSegment === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, firstSegment, router]);

  return (
    <View className="dark flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trip/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
          <RootLayoutNav />
          <StatusBar style="light" />
      </AuthProvider>
    </AppThemeProvider>
  );
}
