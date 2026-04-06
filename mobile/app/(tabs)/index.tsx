import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/components/AuthProvider';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, ArrowRight, PlaneTakeoff, Plus, Globe } from 'lucide-react-native';
import { VoyagerColors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Trip {
  id: string;
  createdAt?: Timestamp;
  preferences?: {
    destination?: string;
    startDate?: string;
    duration?: number;
    source?: string;
  };
}

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function fetchTrips() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'trips'),
          where('collaborators', 'array-contains', user.uid)
        );
        const snapshot = await getDocs(q);
        const fetchedTrips = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Trip[];
        
        fetchedTrips.sort((a, b) => {
           const timeA = a.createdAt?.seconds || 0;
           const timeB = b.createdAt?.seconds || 0;
           return timeB - timeA;
        });

        setTrips(fetchedTrips);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrips();
  }, [user]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={VoyagerColors.primary} />
        <Text style={styles.loadingText}>Loading your adventures...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ 
          paddingTop: insets.top + 24, 
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20 
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.overline}>WELCOME BACK</Text>
          <Text style={styles.title}>Your Trips</Text>
        </View>
        
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <PlaneTakeoff size={48} color={VoyagerColors.onSurfaceVariant} opacity={0.3} />
            </View>
            <Text style={styles.emptyTitle}>No trips found</Text>
            <Text style={styles.emptySubtitle}>
              You haven&apos;t planned any trips yet. Start your first adventure!
            </Text>
            <Button 
              label="" 
              className="mt-8 h-14 px-8 rounded-2xl bg-primary shadow-xl shadow-primary/20" 
              onPress={() => router.push('/(tabs)/explore')} 
            >
                <View className="flex-row items-center gap-2">
                    <Plus size={18} color={VoyagerColors.onPrimary} />
                    <Text style={{ color: VoyagerColors.onPrimary, fontWeight: 'bold', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' }}>Plan a Trip</Text>
                </View>
            </Button>
          </View>
        ) : (
          <View style={styles.tripList}>
            {trips.map((trip) => (
              <Card key={trip.id} className="rounded-[2.5rem] border-border/20 bg-card/10 overflow-hidden">
                  <CardHeader className="p-6 pb-2">
                    <View className="flex-row justify-between items-center mb-4">
                      <View className="flex-row gap-2">
                        <View style={{ backgroundColor: VoyagerColors.primary + '20', borderWidth: 1, borderColor: VoyagerColors.primary + '30', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ fontSize: 9, fontWeight: '900', color: VoyagerColors.primary, textTransform: 'uppercase', letterSpacing: 2 }}>Active</Text>
                        </View>
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 }}>
                           <Globe size={12} color={VoyagerColors.onSurfaceVariant} />
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl">
                        <Calendar size={14} color={VoyagerColors.primary} />
                        <Text style={styles.dateText}>
                          {trip.preferences?.startDate || 'TBD'}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.tripTitle}>
                      {trip.preferences?.destination || 'Untitled Journey'}
                    </Text>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-4">
                    <Text style={styles.tripSubtitle}>
                      {trip.preferences?.duration || 0} DAYS • FROM {trip.preferences?.source?.toUpperCase() || 'PLANET EARTH'}
                    </Text>
                  </CardContent>
                  
                  <CardFooter className="px-6 pb-6 pt-2">
                    <Pressable 
                      style={({ pressed }) => [
                        styles.enterButton,
                        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
                      ]}
                      onPress={() => router.push(`/trip/${trip.id}`)}
                    >
                       <Text style={styles.enterButtonText}>ENTER HUB</Text>
                       <ArrowRight size={14} color={VoyagerColors.primary} />
                    </Pressable>
                  </CardFooter>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VoyagerColors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    color: VoyagerColors.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    marginBottom: 32,
  },
  overline: {
    fontSize: 11,
    fontWeight: '900',
    color: VoyagerColors.primary,
    letterSpacing: 3,
    marginBottom: 6,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: VoyagerColors.onSurface,
    letterSpacing: -1.5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 40,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyIconContainer: {
    padding: 28,
    backgroundColor: 'rgba(148, 204, 255, 0.05)',
    borderRadius: 32,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: VoyagerColors.onSurface,
    marginBottom: 10,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: VoyagerColors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 24,
  },
  tripList: {
    gap: 24,
  },
  tripTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: VoyagerColors.onSurface,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  tripSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: VoyagerColors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '800',
    color: VoyagerColors.onSurface,
    letterSpacing: 0.5,
  },
  enterButton: {
    width: '100%',
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  enterButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: VoyagerColors.primary,
    letterSpacing: 2,
  }
});
