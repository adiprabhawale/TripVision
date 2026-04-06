import { getAdminAuth, getAdminDb, getFieldValue } from '@/lib/firebase-admin';
import { generatePersonalizedTripItinerary } from '@/ai/flows/generate-personalized-trip-itinerary';

export type ItineraryServiceResult = {
  success: boolean;
  data?: any;
  tripId?: string;
  error?: string;
  status: number;
};

/**
 * Shared Core Logic for Generating Trip Itineraries
 * This can be called from Next.js API Routes (Mobile) 
 * or Next.js Server Actions (Web).
 */
export async function handleGenerateItinerary(
  idToken: string,
  preferences: any
): Promise<ItineraryServiceResult> {
  try {
    // 1. Verify User Identity
    const adminAuth = await getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const isAdmin = email === 'adiprabhawale@gmail.com';

    if (!uid) {
      return { success: false, error: 'Unauthorized: Invalid token payload', status: 401 };
    }

    // 2. Initialize DB and Check Usage
    const adminDb = await getAdminDb();
    const FieldValue = await getFieldValue();
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return { success: false, error: 'User profile not found.', status: 404 };
    }

    const userData = userDoc.data();
    const isPremium = userData?.isPremium || false;
    const lastTripTimestamp = userData?.lastTripTimestamp?.toDate();
    const now = new Date();

    if (!isAdmin && !isPremium && lastTripTimestamp) {
      const hoursSinceLastTrip = (now.getTime() - lastTripTimestamp.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastTrip < 24) {
        const remainingHours = Math.ceil(24 - hoursSinceLastTrip);
        return { 
          success: false, 
          error: `Free limit reached. Please wait ${remainingHours} hours or upgrade to Premium.`, 
          status: 429 
        };
      }
    }

    // 3. Generate Itinerary Using Genkit Flow
    const result = await generatePersonalizedTripItinerary(preferences);

    // 4. Save Trip to Firestore
    const tripRef = await adminDb.collection('trips').add({
      ...result,
      preferences,
      userId: uid,
      createdAt: FieldValue.serverTimestamp(),
      collaborators: [uid],
    });

    // 5. Update User Usage
    await userRef.update({
      lastTripTimestamp: FieldValue.serverTimestamp(),
      tripCount: (userData?.tripCount || 0) + 1,
    });

    return { 
      success: true, 
      data: result, 
      tripId: tripRef.id,
      status: 200
    };

  } catch (error: any) {
    console.error('[ItineraryService] Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to generate itinerary. Please try again.', 
      status: 500 
    };
  }
}
