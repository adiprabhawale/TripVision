import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, Pressable, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/lib/firebase';
import { 
  Users,
  Sparkles, 
  Lightbulb, LocateFixed, Map, Heart, Group, Baby,
  Utensils, Camera, Mountain, History, Sprout,
  Info, Send, Plus, Calendar as CalendarIcon
} from 'lucide-react-native';
import { VoyagerColors as COLORS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PlannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [preferences, setPreferences] = useState({
    source: '',
    destination: '',
    startDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    duration: '7',
    travelers: 2,
    travelStyle: 'Couple',
    interests: [] as string[],
    otherInterestText: '',
    budget: 50000,
  });

  const travelStyles = [
    { id: 'Solo', icon: Users, label: 'Solo' },
    { id: 'Couple', icon: Heart, label: 'Couple' },
    { id: 'Friends', icon: Group, label: 'Friends' },
    { id: 'Family', icon: Baby, label: 'Family' },
  ];

  const interestOptions = [
    { id: 'Culinary', icon: Utensils, label: 'Culinary', color: '#ffb781' },
    { id: 'Photo', icon: Camera, label: 'Photo', color: '#94ccff' },
    { id: 'Outdoors', icon: Mountain, label: 'Outdoors', color: '#b1f0ce' },
    { id: 'History', icon: History, label: 'History', color: '#dec2ff' },
    { id: 'Eco', icon: Sprout, label: 'Eco', color: '#a3e635' },
    { id: 'Other', icon: Plus, label: 'Other', color: '#8a919b' },
  ];

  const handleGenerate = async () => {
    if (!preferences.destination || !preferences.startDate) {
      Alert.alert('Incomplete', 'Please provide a destination and start date.');
      return;
    }
    setLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Unauthenticated user.');

      const payload = { 
        preferences: {
          ...preferences,
          interests: preferences.interests.includes('Other') && preferences.otherInterestText.trim()
            ? [...preferences.interests, preferences.otherInterestText.trim()].join(', ')
            : preferences.interests.join(', '),
          duration: parseInt(preferences.duration) || 1,
          numberOfPeople: preferences.travelers || 1,
          budgetType: 'group',
          budget: Number(preferences.budget) || 0,
          travelType: preferences.travelStyle, // Map travelStyle to travelType
          stayType: 'Hotel', // Default value consistent with API schema
        } 
      };

      const response = await fetch('https://trip-vision.vercel.app/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        const text = await response.text();
        console.error("[Explorer] Non-JSON Response:", text.substring(0, 200));
        throw new Error('Server returned an invalid response (HTML). Please ensure your Vercel API is deployed and environment variables are set.');
      }

      const body = await response.json();

      if (response.ok && body.success) {
        router.push(`/trip/${body.tripId}`);
      } else {
        throw new Error(body.error || 'Failed to generate itinerary.');
      }
    } catch (error: any) {
      console.error("[Explorer] API Call Error:", error.message);
      Alert.alert('Journey Error', error.message || 'Failed to craft your journey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (id: string) => {
    setPreferences(p => ({
      ...p,
      interests: p.interests.includes(id) 
        ? p.interests.filter(i => i !== id)
        : [...p.interests, id]
    }));
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPreferences(p => ({
        ...p,
        startDate: selectedDate.toISOString().split('T')[0]
      }));
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 24, fontSize: 18, color: COLORS.onSurface, fontWeight: 'bold' }}>Crafting your Journey...</Text>
        <Text style={{ marginTop: 8, color: COLORS.onSurfaceVariant }}>Voyager AI is designing your masterpiece</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          paddingTop: insets.top + 24, 
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100 
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <View style={{ padding: 6, backgroundColor: 'rgba(148, 204, 255, 0.1)', borderRadius: 10 }}>
              <Sparkles size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.overline}>Voyager AI</Text>
          </View>
          <Text style={styles.title}>
            Draft your next{"\n"}<Text style={{ fontStyle: 'italic', color: COLORS.primary }}>Masterpiece</Text>
          </Text>
        </View>

        {/* Voyager Insight Box */}
        <View style={{ backgroundColor: 'rgba(255, 183, 129, 0.05)', borderRadius: 24, padding: 20, borderLeftWidth: 4, borderLeftColor: COLORS.secondary, marginBottom: 32 }}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Lightbulb size={18} color={COLORS.secondary} />
              <Text style={{ color: COLORS.secondary, fontWeight: 'bold', fontSize: 14 }}>Voyager Insight</Text>
           </View>
           <Text style={{ color: COLORS.onSurfaceVariant, fontSize: 14, lineHeight: 20 }}>Kyoto travelers often pair Boutique Hotels with Culinary experiences for the best atmosphere.</Text>
        </View>

        {/* Location Form */}
        <View style={{ gap: 24 }}>
          <View>
            <Text style={styles.sectionLabel}>Origins</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Where are you starting?"
                placeholderTextColor={COLORS.onSurfaceVariant + '60'}
                value={preferences.source}
                onChangeText={(t) => setPreferences(p => ({...p, source: t}))}
              />
              <View style={styles.inputIcon}>
                <LocateFixed size={22} color={COLORS.onSurfaceVariant} opacity={0.4} />
              </View>
            </View>
          </View>

          <View>
            <Text style={styles.sectionLabel}>Destination</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Where to next?"
                placeholderTextColor={COLORS.onSurfaceVariant + '60'}
                value={preferences.destination}
                onChangeText={(t) => setPreferences(p => ({...p, destination: t}))}
              />
              <View style={styles.inputIcon}>
                <Map size={22} color={COLORS.onSurfaceVariant} opacity={0.4} />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
             <View style={{ flex: 1 }}>
                <Text style={styles.sectionLabel}>Launch Date</Text>
                <Pressable onPress={() => setShowDatePicker(true)} style={styles.inputContainer}>
                  <View style={[styles.input, { justifyContent: 'center' }]}>
                    <Text style={{ color: preferences.startDate ? COLORS.onSurface : COLORS.onSurfaceVariant + '60', fontSize: 16, fontWeight: '600' }}>
                      {formatDateDisplay(preferences.startDate)}
                    </Text>
                  </View>
                  <View style={styles.inputIcon}>
                    <CalendarIcon size={22} color={COLORS.onSurfaceVariant} opacity={0.4} />
                  </View>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(preferences.startDate)}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={onDateChange}
                  />
                )}
             </View>
             <View style={{ width: 100 }}>
                <Text style={styles.sectionLabel}>Duration</Text>
                <TextInput 
                  style={[styles.input, { textAlign: 'center' }]}
                  keyboardType="numeric"
                  value={preferences.duration}
                  onChangeText={(t) => setPreferences(p => ({...p, duration: t}))}
                />
             </View>
          </View>
        </View>

        {/* Travelers Section */}
        <View style={{ marginTop: 32 }}>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>The Cohort</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: COLORS.surfaceLow, padding: 6, borderRadius: 14, borderWidth: 1, borderColor: COLORS.outlineVariant }}>
                 <Pressable 
                  onPress={() => setPreferences(p => ({...p, travelers: Math.max(1, p.travelers - 1)}))}
                  style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}
                 >
                    <Text style={{ color: COLORS.onSurface, fontSize: 24 }}>-</Text>
                 </Pressable>
                 <Text style={{ color: COLORS.onSurface, fontWeight: 'bold', fontSize: 16, minWidth: 24, textAlign: 'center' }}>{preferences.travelers}</Text>
                 <Pressable 
                  onPress={() => setPreferences(p => ({...p, travelers: p.travelers + 1}))}
                  style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}
                 >
                    <Text style={{ color: COLORS.onSurface, fontSize: 24 }}>+</Text>
                 </Pressable>
              </View>
           </View>

           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              <View style={{ flexDirection: 'row', gap: 14, paddingBottom: 10 }}>
                {travelStyles.map(style => (
                  <Pressable 
                    key={style.id}
                    onPress={() => setPreferences(p => ({...p, travelStyle: style.id}))}
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      gap: 10, 
                      paddingVertical: 12, 
                      paddingHorizontal: 18, 
                      borderRadius: 18, 
                      backgroundColor: preferences.travelStyle === style.id ? 'rgba(148, 204, 255, 0.12)' : COLORS.surface,
                      borderWidth: 1.5,
                      borderColor: preferences.travelStyle === style.id ? COLORS.primary : COLORS.outlineVariant
                    }}
                  >
                    <style.icon size={18} color={preferences.travelStyle === style.id ? COLORS.primary : COLORS.onSurfaceVariant} />
                    <Text style={{ color: preferences.travelStyle === style.id ? COLORS.primary : COLORS.onSurfaceVariant, fontWeight: 'bold', fontSize: 14 }}>{style.label}</Text>
                  </Pressable>
                ))}
              </View>
           </ScrollView>
        </View>

        {/* Interest Section */}
        <View style={{ marginTop: 32 }}>
           <Text style={styles.sectionTitle}>Soul Interests</Text>
           <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {interestOptions.map(opt => (
                <Pressable
                  key={opt.id}
                  onPress={() => toggleInterest(opt.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 30,
                    backgroundColor: preferences.interests.includes(opt.id) ? opt.color + '15' : COLORS.surface,
                    borderWidth: 1.5,
                    borderColor: preferences.interests.includes(opt.id) ? opt.color : COLORS.outlineVariant
                  }}
                >
                   <opt.icon size={18} color={preferences.interests.includes(opt.id) ? opt.color : COLORS.onSurfaceVariant} />
                   <Text style={{ color: preferences.interests.includes(opt.id) ? opt.color : COLORS.onSurfaceVariant, fontWeight: 'bold', fontSize: 14 }}>{opt.label}</Text>
                </Pressable>
              ))}
           </View>

           {preferences.interests.includes('Other') && (
              <View style={{ marginTop: 16 }}>
                 <TextInput 
                   style={[styles.input, { height: 50, borderRadius: 12 }]}
                   placeholder="Tell us what you're looking for..."
                   placeholderTextColor={COLORS.onSurfaceVariant + '60'}
                   value={preferences.otherInterestText}
                   onChangeText={(t) => setPreferences(p => ({...p, otherInterestText: t}))}
                   autoFocus
                 />
              </View>
           )}
        </View>

        {/* Budget Section */}
        <View style={{ marginTop: 40 }}>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Visual Budget</Text>
              <TextInput 
                keyboardType="numeric"
                style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.primary, padding: 0 }}
                value={preferences.budget.toString()}
                onChangeText={(t) => {
                  const val = parseInt(t.replace(/[^0-9]/g, '')) || 0;
                  setPreferences(p => ({...p, budget: val}));
                }}
              />
           </View>
           
           <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1000}
              maximumValue={500000}
              step={1000}
              value={Math.min(preferences.budget, 500000)}
              onValueChange={(val) => setPreferences(p => ({...p, budget: val}))}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.outlineVariant}
              thumbTintColor={COLORS.primary}
           />

           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Text style={styles.budgetLabel}>ECONOMY (₹1K)</Text>
              <Text style={styles.budgetLabel}>PREMIUM (₹5L+)</Text>
           </View>
        </View>

        <View style={{ marginTop: 48, marginBottom: 40 }}>
           <Button
               label=""
               className="h-16 rounded-[2rem] bg-primary shadow-2xl shadow-primary/30"
               onPress={handleGenerate}
               disabled={loading}
           >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <Sparkles size={22} color={COLORS.onPrimary} />
                  <Text style={{ color: COLORS.onPrimary, fontSize: 16, fontWeight: '900', letterSpacing: 1.5, textTransform: 'uppercase' }}>Curate Itinerary</Text>
                  <Send size={20} color={COLORS.onPrimary} />
              </View>
           </Button>
           
           <View style={{ marginTop: 24, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.6 }}>
                 <Info size={14} color={COLORS.onSurfaceVariant} />
                 <Text style={{ fontSize: 13, color: COLORS.onSurfaceVariant, fontStyle: 'italic' }}>Generation takes about 10-15 seconds</Text>
              </View>
           </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overline: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.onSurface,
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.onSurface,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    height: 64,
    paddingHorizontal: 20,
    color: COLORS.onSurface,
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: COLORS.outlineVariant,
  },
  inputIcon: {
    position: 'absolute',
    right: 20,
    top: 21,
  },
  budgetLabel: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    fontWeight: '900',
    letterSpacing: 1.5,
  }
});
