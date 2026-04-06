import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/components/AuthProvider';
import { 
  Settings, LogOut, ChevronRight, 
  MapPin, Calendar, Heart, Shield,
  CreditCard, Bell, HelpCircle
} from 'lucide-react-native';
import { VoyagerColors as COLORS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const menuItems = [
    { id: 'settings', label: 'Travel Preferences', icon: Settings, color: COLORS.primary },
    { id: 'saved', label: 'Saved Destinations', icon: Heart, color: '#ffb781' },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard, color: '#dec2ff' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: '#94ccff' },
    { id: 'security', label: 'Privacy & Security', icon: Shield, color: '#b1f0ce' },
    { id: 'help', label: 'Support Center', icon: HelpCircle, color: COLORS.onSurfaceVariant },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          paddingTop: insets.top + 40, 
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 120 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
           <View style={{ position: 'relative' }}>
              <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.surfaceHigh, borderWidth: 4, borderColor: COLORS.primary + '30', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                 {user?.photoURL ? (
                   <Image source={{ uri: user.photoURL }} style={{ width: '100%', height: '100%' }} />
                 ) : (
                   <Text style={{ fontSize: 48, fontWeight: 'bold', color: COLORS.primary }}>{user?.email?.charAt(0).toUpperCase() || 'V'}</Text>
                 )}
              </View>
              <View style={{ position: 'absolute', bottom: 4, right: 4, backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 16, borderSize: 3, borderColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
                 <Shield size={14} color={COLORS.onPrimary} />
              </View>
           </View>
           
           <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Voyager'}</Text>
           <Text style={styles.userEmail}>{user?.email}</Text>
           
           <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
              <View style={styles.badge}>
                 <Text style={styles.badgeText}>ELITE VOYAGER</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(148, 204, 255, 0.1)', borderColor: 'rgba(148, 204, 255, 0.2)' }]}>
                 <Text style={[styles.badgeText, { color: COLORS.primary }]}>LEVEL 14</Text>
              </View>
           </View>
        </View>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 48 }}>
           {[
             { label: 'TRIPS', val: '12', icon: MapPin },
             { label: 'MILES', val: '24K', icon: Calendar }
           ].map((stat, i) => (
             <View key={i} style={{ flex: 1, backgroundColor: COLORS.surface, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: COLORS.outlineVariant }}>
                <stat.icon size={18} color={COLORS.primary} style={{ marginBottom: 12 }} />
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.onSurface }}>{stat.val}</Text>
                <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.onSurfaceVariant, letterSpacing: 1.5, marginTop: 4 }}>{stat.label}</Text>
             </View>
           ))}
        </View>

        {/* Menu Section */}
        <View style={{ gap: 8 }}>
          {menuItems.map((item) => (
            <Pressable 
              key={item.id}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: 'rgba(255,255,255,0.05)' }
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: item.color + '15', alignItems: 'center', justifyContent: 'center' }}>
                   <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <ChevronRight size={18} color={COLORS.onSurfaceVariant} opacity={0.5} />
            </Pressable>
          ))}
        </View>

        {/* Danger Zone */}
        <View style={{ marginTop: 48 }}>
           <Pressable 
             onPress={() => signOut()}
             style={({ pressed }) => [
               styles.logoutButton,
               pressed && { opacity: 0.8 }
             ]}
           >
              <LogOut size={20} color={COLORS.error} />
              <Text style={styles.logoutText}>TERMINATE SESSION</Text>
           </Pressable>
           
           <Text style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: COLORS.onSurfaceVariant, opacity: 0.4, letterSpacing: 1 }}>VOYAGER PROTOCOL V2.4.0 (2026)</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.onSurface,
    marginTop: 20,
    letterSpacing: -1,
    textTransform: 'capitalize'
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
  },
  badge: {
    backgroundColor: 'rgba(255, 183, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 1.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 20,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 64,
    borderRadius: 24,
    backgroundColor: COLORS.error + '10',
    borderWidth: 1.5,
    borderColor: COLORS.error + '25',
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 2.5,
  }
});
