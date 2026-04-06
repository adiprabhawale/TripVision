import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // The Web Client ID from Firebase serves as the backend audience for the Auth token
  const webClientId = '622758752034-ef53lf85mv2suaqsap27h6pltted562u.apps.googleusercontent.com';

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
      offlineAccess: true, 
      forceCodeForRefreshToken: true,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prompt Native Google Play Services Modal (Android) or Safari View Controller (iOS)
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
        router.replace('/(tabs)');
      } else {
        throw new Error('No ID token from Google Sign-In.');
      }
    } catch (err: any) {
      // Identify specific Google Sign-In errors if needed, otherwise output general error
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Text className="text-2xl font-bold text-foreground text-center">
            TripVision
          </Text>
          <Text className="text-sm text-muted-foreground text-center mt-2">
            Sign in with Google to plan your next journey.
          </Text>
        </CardHeader>
        <CardContent>
          {error ? <Text className="text-destructive mb-4 text-center">{error}</Text> : null}
          
          <Button 
            className="w-full mt-4" 
            onPress={handleGoogleSignIn}
            disabled={loading}
            label={loading ? 'Please wait...' : 'Sign in with Google'}
          />
        </CardContent>
      </Card>
    </View>
  );
}
