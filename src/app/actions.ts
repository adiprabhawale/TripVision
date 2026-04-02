'use server';

import { generatePersonalizedTripItinerary } from '@/ai/flows/generate-personalized-trip-itinerary';
import type { TripPreferences } from '@/types/trip';
import { format } from 'date-fns';
import { getAdminAuth, getAdminDb, getFieldValue } from '@/lib/firebase-admin';

export async function getItinerary(
  preferences: TripPreferences,
  token: string
) {
  try {
    // 1. Verify User
    const adminAuth = await getAdminAuth();
    const adminDb = await getAdminDb();
    const FieldValue = await getFieldValue();

    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const isAdmin = email === 'adiprabhawale@gmail.com';

    if (!uid) return { error: 'Unauthorized' };

    // 2. Check Usage Limits
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) return { error: 'User profile not found.' };
    
    const userData = userDoc.data();
    const isPremium = userData?.isPremium || false;
    const lastTripTimestamp = userData?.lastTripTimestamp?.toDate();
    const now = new Date();

    if (!isAdmin && !isPremium && lastTripTimestamp) {
      const hoursSinceLastTrip = (now.getTime() - lastTripTimestamp.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastTrip < 24) {
        const remainingHours = Math.ceil(24 - hoursSinceLastTrip);
        return { error: `Free limit reached. Please wait ${remainingHours} hours or upgrade to Premium.` };
      }
    }

    // 3. Validate Preferences
    const validatedPreferences = {
        ...preferences,
        duration: parseInt(preferences.duration, 10),
        numberOfPeople: parseInt(preferences.numberOfPeople, 10),
        budget: preferences.budget,
        startDate: format(preferences.startDate, 'yyyy-MM-dd')
    }

    if (isNaN(validatedPreferences.duration) || validatedPreferences.duration <= 0) {
        return { error: 'Please enter a valid trip duration.' };
    }
    if (isNaN(validatedPreferences.numberOfPeople) || validatedPreferences.numberOfPeople <= 0) {
        return { error: 'Please enter a valid number of people.' };
    }

    // 4. Generate Itinerary
    const result = await generatePersonalizedTripItinerary(validatedPreferences);

    // 5. Save Trip to Firestore
    const tripRef = await adminDb.collection('trips').add({
      ...result,
      preferences: validatedPreferences,
      userId: uid,
      createdAt: FieldValue.serverTimestamp(),
      collaborators: [uid],
    });

    // 6. Update User Usage
    await userRef.update({
      lastTripTimestamp: FieldValue.serverTimestamp(),
      tripCount: (userData?.tripCount || 0) + 1,
    });

    return { data: result, tripId: tripRef.id };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to generate itinerary. Please try again.' };
  }
}
