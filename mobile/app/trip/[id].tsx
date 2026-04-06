import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { doc, getDoc, collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as WebBrowser from 'expo-web-browser';
import { 
  Calendar, Plane, BedDouble, Briefcase, MapPin, 
  Coins, Plus, Trash2, CheckCircle2,
  Wallet, TrendingUp, DollarSign, ExternalLink,
  ChevronRight, ArrowLeft
} from 'lucide-react-native';
import { VoyagerColors as COLORS, Vibe } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrencyConverter } from '@/lib/currency';

type HubView = 'timeline' | 'stays' | 'travel' | 'packing' | 'budget';

export default function TripHubScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<HubView>('timeline');
  const [packingItems, setPackingItems] = useState<any[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [vibe, setVibe] = useState<Vibe>('default');

  // 1. Fetch Trip Data & Localized Vibe
  useEffect(() => {
    async function fetchTrip() {
      if (!id) return;
      try {
        const tripRef = doc(db, 'trips', id as string);
        const tripSnap = await getDoc(tripRef);
        if (tripSnap.exists()) {
          const data = tripSnap.data();
          setTrip(data);
          
          const dest = data.preferences?.destination?.toLowerCase() || '';
          if (dest.includes('beach') || dest.includes('hawaii') || dest.includes('bali')) {
             setVibe('tropical');
          } else if (dest.includes('dubai') || dest.includes('vegas') || dest.includes('desert')) {
             setVibe('desert');
          } else {
             setVibe('city');
          }
        }
      } catch (error) {
        console.error("Trip Load Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [id]);

  // 2. Currency Converter Hook
  const currency = useCurrencyConverter(trip?.preferences?.destination || '');

  // 3. Real-time Packing List
  useEffect(() => {
    if (!id || activeView !== 'packing') return;
    const q = query(collection(db, 'trips', id as string, 'packingList'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPackingItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [id, activeView]);

  // 4. Budget Calculations
  const budgetStats = useMemo(() => {
    if (!trip) return { total: 0, activities: 0, stays: 0, travel: 0 };
    let activityTotal = 0;
    trip.itinerary?.forEach((day: any) => {
      day.activities?.forEach((act: any) => {
        activityTotal += parseFloat(act.estimated_cost?.replace(/[^0-9.]/g, '') || '0');
      });
    });

    let stayTotal = 0;
    trip.stay_options?.forEach((stay: any) => {
       stayTotal += parseFloat(stay.price_per_night?.replace(/[^0-9.]/g, '') || '0') * (trip.preferences?.duration || 1);
    });

    let travelTotal = 0;
    trip.travel_options?.forEach((opt: any) => {
       travelTotal += parseFloat((opt.fare || opt.price_range)?.replace(/[^0-9.]/g, '') || '0');
    });

    return { total: activityTotal + stayTotal + travelTotal, activities: activityTotal, stays: stayTotal, travel: travelTotal };
  }, [trip]);

  // 5. Utils
  const openBooking = async (url: string) => {
    if (url) await WebBrowser.openBrowserAsync(url);
  };

  const addPackingItem = async () => {
    if (!newItemText.trim() || !user || !id) return;
    await addDoc(collection(db, 'trips', id as string, 'packingList'), {
      text: newItemText.trim(), completed: false, createdBy: user.uid, createdAt: serverTimestamp()
    });
    setNewItemText('');
  };

  const togglePackingItem = async (itemId: string, completed: boolean) => {
    if (!id) return;
    await updateDoc(doc(db, 'trips', id as string, 'packingList', itemId), { completed: !completed });
  };

  const deletePackingItem = async (itemId: string) => {
    if (!id) return;
    await deleteDoc(doc(db, 'trips', id as string, 'packingList', itemId));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
         <ActivityIndicator size="large" color={COLORS.primary} />
         <Text style={{ marginTop: 16, color: COLORS.onSurfaceVariant, fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>CURATING HUB...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
         <Text style={{ color: COLORS.onSurface, fontWeight: 'bold' }}>Trip not found.</Text>
      </View>
    );
  }

  const navItems: {id: HubView, label: string, icon: any}[] = [
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'stays', label: 'Stays', icon: BedDouble },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'packing', label: 'Packing', icon: Briefcase },
    { id: 'budget', label: 'Budget', icon: Wallet },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Custom Minimal Header */}
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
         <Pressable 
           onPress={() => router.back()}
           style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', alignItems: 'center', justifyContent: 'center' }}
         >
            <ArrowLeft size={20} color={COLORS.onSurface} />
         </Pressable>
         <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '900', color: COLORS.primary, letterSpacing: 3, textTransform: 'uppercase' }}>Trip Hub</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.onSurface, letterSpacing: -0.5 }}>{trip.preferences?.destination || 'Journey'}</Text>
         </View>
      </View>
      
      <View style={{ flex: 1 }}>
        {/* Hub Meta Info */}
        <View style={{ paddingHorizontal: 20, paddingTop: 4 }}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <View style={{ backgroundColor: 'rgba(148, 204, 255, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(148, 204, 255, 0.15)' }}>
                 <Text style={{ fontSize: 9, fontWeight: '900', color: COLORS.primary, letterSpacing: 1.5, textTransform: 'uppercase' }}>REAL-TIME ENGINE</Text>
              </View>
              <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.onSurfaceVariant, letterSpacing: 1 }}>
                {trip.preferences?.duration} DAYS • FROM {trip.preferences?.source?.toUpperCase()}
              </Text>
           </View>
        </View>

        {/* Sub-navigation Tabs */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', backgroundColor: COLORS.surfaceLow, padding: 6, borderRadius: 24, borderWidth: 1, borderColor: COLORS.outlineVariant }}>
                  {navItems.map((item) => (
                      <Pressable
                          key={item.id}
                          onPress={() => setActiveView(item.id)}
                          style={{ 
                            flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 20,
                            backgroundColor: activeView === item.id ? COLORS.primary : 'transparent'
                          }}
                      >
                          <item.icon size={16} color={activeView === item.id ? COLORS.onPrimary : COLORS.onSurfaceVariant} />
                          <Text style={{ fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, color: activeView === item.id ? COLORS.onPrimary : COLORS.onSurfaceVariant }}>
                              {item.label}
                          </Text>
                      </Pressable>
                  ))}
              </View>
          </ScrollView>
        </View>

        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: insets.bottom + 120 }}
          showsVerticalScrollIndicator={false}
        >
          {activeView === 'timeline' && (
              <View style={{ paddingBottom: 48 }}>
                 {trip.itinerary?.map((day: any, index: number) => (
                     <View key={`day-${index}`} style={{ marginBottom: 50, position: 'relative', paddingLeft: 54 }}>
                          {/* Timeline Line */}
                          <View style={{ position: 'absolute', left: 24, top: 48, bottom: -50, width: 2, backgroundColor: 'rgba(148, 204, 255, 0.15)' }} />
                          
                          {/* Day Indicator */}
                          <View style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 }}>
                              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.onPrimary }}>{day.day_number}</Text>
                          </View>

                          <View style={{ marginBottom: 24 }}>
                              <Text style={{ fontSize: 11, fontWeight: '900', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 3 }}>PHASE {day.day_number}</Text>
                              <Text style={{ fontSize: 32, fontWeight: 'bold', color: COLORS.onSurface, letterSpacing: -1 }}>{day.theme}</Text>
                          </View>

                          <View style={{ gap: 20 }}>
                              {day.activities?.map((activity: any, actIdx: number) => {
                                  const costINR = parseFloat(activity.estimated_cost?.replace(/[^0-9.]/g, '') || '0');
                                  return (
                                  <Card key={`act-${index}-${actIdx}`} className="bg-card/5 border-border/10 rounded-[2.5rem]">
                                      {/* Connector Dot */}
                                      <View style={{ position: 'absolute', left: -50, top: 28, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.primary, borderWidth: 3, borderColor: COLORS.background }} />
                                      
                                      <CardContent className="p-7">
                                          <View className="flex-row justify-between items-start mb-4">
                                              <View style={{ backgroundColor: 'rgba(148, 204, 255, 0.1)', px: 12, py: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(148, 204, 255, 0.2)' }}>
                                                  <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 2 }}>{activity.time}</Text>
                                              </View>
                                              <View className="flex-row items-center gap-2">
                                                  <Coins size={14} color={COLORS.primary} opacity={0.6} />
                                                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.onSurfaceVariant, textTransform: 'uppercase' }}>
                                                    {currency.isInternational ? `${currency.symbol}${ (costINR * currency.rate).toFixed(0) }` : `₹${costINR.toLocaleString('en-IN')}`}
                                                  </Text>
                                              </View>
                                          </View>
                                          
                                          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.onSurface, lineHeight: 28, marginBottom: 8 }}>{activity.description}</Text>
                                          
                                          {activity.location && (
                                              <View className="flex-row items-center gap-2">
                                                  <MapPin size={14} color={COLORS.onSurfaceVariant} opacity={0.5} />
                                                  <Text style={{ fontSize: 14, color: COLORS.onSurfaceVariant, fontWeight: '500' }}>
                                                      {typeof activity.location === 'object' 
                                                        ? `${activity.location.latitude?.toFixed(2)}N, ${activity.location.longitude?.toFixed(2)}E`
                                                        : activity.location}
                                                  </Text>
                                              </View>
                                          )}
                                      </CardContent>
                                  </Card>
                              );})}
                          </View>
                     </View>
                 ))}
              </View>
          )}

          {activeView === 'stays' && (
              <View style={{ paddingBottom: 48, gap: 24 }}>
                  <Text style={styles.sectionTitle}>Accommodations</Text>
                  {trip.stay_options?.map((stay: any, idx: number) => {
                       const priceINR = parseFloat(stay.price_per_night?.replace(/[^0-9.]/g, '') || '0');
                       return (
                      <Card key={`stay-${idx}`} className="rounded-[2.5rem] border-border/10 bg-card/5 overflow-hidden">
                          <CardHeader className="p-7 pb-2">
                               <View className="flex-row justify-between items-center mb-4">
                                  <View style={{ backgroundColor: 'rgba(222, 194, 255, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(222, 194, 255, 0.2)' }}>
                                    <Text style={{ fontSize: 10, fontWeight: '900', color: '#dec2ff', textTransform: 'uppercase', letterSpacing: 2 }}>{stay.type || 'STAY'}</Text>
                                  </View>
                                  <View className="flex-row items-baseline gap-1.5">
                                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.primary }}>
                                        {currency.isInternational ? `${currency.symbol}${(priceINR * currency.rate).toFixed(0)}` : `₹${priceINR.toLocaleString('en-IN')}`}
                                      </Text>
                                      <Text style={{ fontSize: 11, fontWeight: '900', color: COLORS.onSurfaceVariant, letterSpacing: 1 }}>/NT</Text>
                                  </View>
                               </View>
                              <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.onSurface, letterSpacing: -0.5 }}>{stay.name}</Text>
                          </CardHeader>
                          <CardContent className="p-7 pt-2">
                              <Text style={{ fontSize: 15, color: COLORS.onSurfaceVariant, lineHeight: 24, marginBottom: 24 }}>{stay.details}</Text>
                              <Button 
                                className="h-16 bg-primary rounded-[2rem] shadow-2xl shadow-primary/30" 
                                label="" 
                                onPress={() => openBooking(stay.bookingLink)}
                              >
                                  <View className="flex-row items-center gap-3">
                                      <Text style={{ color: COLORS.onPrimary, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, fontSize: 13 }}>SECURE BOOKING</Text>
                                      <ExternalLink size={16} color={COLORS.onPrimary} />
                                  </View>
                              </Button>
                          </CardContent>
                      </Card>
                  );})}
              </View>
          )}

          {activeView === 'travel' && (
              <View style={{ paddingBottom: 48, gap: 24 }}>
                  <Text style={styles.sectionTitle}>Transport Routes</Text>
                  {trip.travel_options?.map((option: any, idx: number) => {
                       const fareINR = parseFloat((option.fare || option.price_range)?.replace(/[^0-9.]/g, '') || '0');
                       return (
                      <Card key={`travel-${idx}`} className="rounded-[3rem] border-border/10 bg-card/5">
                          <CardContent className="p-8">
                              <View className="flex-row items-center justify-between mb-8">
                                  <View className="flex-row items-center gap-5">
                                      <View style={{ padding: 16, backgroundColor: 'rgba(177, 240, 206, 0.1)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(177, 240, 206, 0.2)' }}><Plane size={28} color="#b1f0ce" /></View>
                                      <View>
                                          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.onSurface }}>{option.name || option.type}</Text>
                                          <Text style={{ fontSize: 13, color: COLORS.onSurfaceVariant, fontWeight: '500', marginTop: 4 }}>{option.details}</Text>
                                      </View>
                                  </View>
                                  <View style={{ alignItems: 'flex-end' }}>
                                      <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.primary }}>
                                        {currency.isInternational ? `${currency.symbol}${(fareINR * currency.rate).toFixed(0)}` : `₹${fareINR.toLocaleString('en-IN')}`}
                                      </Text>
                                  </View>
                              </View>
                              <Button 
                                className="h-14 bg-surfaceHigh border border-outlineVariant rounded-2xl" 
                                label="" 
                                onPress={() => openBooking(option.bookingLink)}
                              >
                                  <View className="flex-row items-center gap-3">
                                      <Text style={{ color: COLORS.onSurface, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 11 }}>VERIFY ROUTE</Text>
                                      <ChevronRight size={16} color={COLORS.onSurface} opacity={0.6} />
                                  </View>
                              </Button>
                          </CardContent>
                      </Card>
                  );})}
              </View>
          )}

          {activeView === 'packing' && (
               <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ paddingBottom: 120 }}>
                   <Text style={styles.sectionTitle}>Collaborative Manifest</Text>
                   <Card className="rounded-[2.5rem] border-border/10 bg-card/5 p-7">
                      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 32 }}>
                          <TextInput 
                            style={{ flex: 1, backgroundColor: COLORS.surfaceHigh, borderRadius: 20, height: 64, paddingHorizontal: 20, color: COLORS.onSurface, fontSize: 16, fontWeight: '600', borderWidth: 1.5, borderColor: COLORS.outlineVariant }}
                            placeholder="Add item..." 
                            placeholderTextColor={COLORS.onSurfaceVariant + '60'} 
                            value={newItemText} 
                            onChangeText={setNewItemText} 
                          />
                          <Pressable onPress={addPackingItem} style={{ backgroundColor: COLORS.primary, width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 20, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 }}>
                             <Plus size={28} color={COLORS.onPrimary} />
                          </Pressable>
                      </View>
                      <View style={{ gap: 14 }}>
                          {packingItems.map((item) => (
                              <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 24, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                                  <Pressable onPress={() => togglePackingItem(item.id, item.completed)} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 }}>
                                      {item.completed ? <CheckCircle2 size={24} color={COLORS.primary} /> : <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.outlineVariant }} />}
                                      <Text style={{ fontSize: 16, color: item.completed ? COLORS.onSurfaceVariant : COLORS.onSurface, textDecorationLine: item.completed ? 'line-through' : 'none', fontWeight: item.completed ? '500' : 'bold' }}>{item.text}</Text>
                                  </Pressable>
                                  <Pressable onPress={() => deletePackingItem(item.id)} style={{ padding: 10 }}><Trash2 size={20} color={COLORS.error} opacity={0.6} /></Pressable>
                              </View>
                          ))}
                      </View>
                   </Card>
               </KeyboardAvoidingView>
          )}

          {activeView === 'budget' && (
               <View style={{ paddingBottom: 48, gap: 28 }}>
                   <Text style={styles.sectionTitle}>Real-time Expenses</Text>
                   <View style={{ flexDirection: 'row', gap: 18 }}>
                      <Card className="flex-1 bg-primary rounded-[2.5rem] shadow-2xl shadow-primary/30">
                        <CardContent className="p-7">
                          <TrendingUp size={28} color={COLORS.onPrimary} />
                          <Text style={{ fontSize: 11, fontWeight: '900', color: COLORS.onPrimary, opacity: 0.6, textTransform: 'uppercase', marginTop: 20, letterSpacing: 1.5 }}>EST. TOTAL</Text>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.onPrimary, letterSpacing: -0.5 }}>
                              {currency.formatConversion(budgetStats.total)}
                          </Text>
                        </CardContent>
                      </Card>
                      <Card className="flex-1 bg-card/5 border-border/10 rounded-[2.5rem]">
                        <CardContent className="p-7">
                          <DollarSign size={28} color={COLORS.primary} />
                          <Text style={{ fontSize: 11, fontWeight: '900', color: COLORS.onSurfaceVariant, textTransform: 'uppercase', marginTop: 20, letterSpacing: 1.5 }}>CAPITAL</Text>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.onSurface, letterSpacing: -0.5 }}>
                              {currency.formatConversion(trip.preferences?.budget || 0)}
                          </Text>
                        </CardContent>
                      </Card>
                   </View>
                   
                   <Card className="rounded-[3rem] border-border/10 bg-card/5 p-8">
                      <Text style={{ fontSize: 12, fontWeight: '900', color: COLORS.primary, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 32 }}>Breakdown Analysis</Text>
                      <View style={{ gap: 32 }}>
                        {[
                          { label: 'Activities', value: budgetStats.activities, icon: MapPin, color: COLORS.primary },
                          { label: 'Stay', value: budgetStats.stays, icon: BedDouble, color: '#dec2ff' },
                          { label: 'Travel', value: budgetStats.travel, icon: Plane, color: '#b1f0ce' }
                        ].map((item, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
                              <View style={{ padding: 12, backgroundColor: item.color + '15', borderRadius: 16, borderWidth: 1, borderColor: item.color + '20' }}>
                                <item.icon size={20} color={item.color} />
                              </View>
                              <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.onSurface }}>{item.label}</Text>
                                {currency.isInternational && (
                                    <Text style={{ fontSize: 11, color: COLORS.onSurfaceVariant }}>{currency.formatLocalOnly(item.value)} local</Text>
                                )}
                              </View>
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.onSurface }}>₹{item.value.toLocaleString('en-IN')}</Text>
                          </View>
                        ))}
                      </View>
                   </Card>
               </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: 12,
  }
});
